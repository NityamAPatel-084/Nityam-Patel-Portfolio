import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, setLogLevel, doc, setDoc, onSnapshot, getDoc, Firestore } from 'firebase/firestore';

const metaEnv = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY,
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID,
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: metaEnv.VITE_FIREBASE_APP_ID,
};

// Check if all essential keys are provided
export const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

let app;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    
    // Suppress WebChannel stream disconnect warnings from printing in console logs
    setLogLevel('error');
    
    // Force long-polling to prevent WebChannel listen stream disconnects/timeouts in proxy-based environments
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    });
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export { db };

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Saves a document to the 'portfolio_data' collection
 */
const CHUNK_SIZE = 600000; // ~600 KB chunk size (well under 1 MB limit)

/**
 * Computes a secure SHA-256 hex signature of (password + "_" + documentId)
 */
export async function computeSignature(password: string, documentId: string): Promise<string> {
  const secret = `${password}_${documentId}`;
  const msgBuffer = new TextEncoder().encode(secret);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Dynamic Challenge-Response protocol to safely verify an admin passcode
 */
export async function verifyPasswordChallenge(password: string): Promise<boolean> {
  if (!db) return true; // Allows bypass for purely offline local-first mode
  try {
    const docId = 'auth_challenge';
    const signature = await computeSignature(password, docId);
    const challengeRef = doc(db, 'portfolio_data', docId);
    
    // Attempt a challenge write to test permissions
    await setDoc(challengeRef, { 
      challenge: 'verify_auth', 
      timestamp: Date.now(), 
      adminSignature: signature 
    });
    return true;
  } catch (error) {
    console.warn('Admin passcode challenge verification rejected:', error);
    return false;
  }
}

async function reassembleChunkedPayload(docId: string, chunkCount: number): Promise<any> {
  if (!db) return null;
  const chunkPromises = [];
  for (let i = 0; i < chunkCount; i++) {
    const chunkDocId = `${docId}_json_chunk_${i}`;
    const chunkDocRef = doc(db, 'portfolio_data', chunkDocId);
    chunkPromises.push(getDoc(chunkDocRef));
  }
  
  const snapshots = await Promise.all(chunkPromises);
  let completeJson = '';
  for (const snap of snapshots) {
    if (snap.exists()) {
      completeJson += snap.data().chunk || '';
    }
  }
  
  try {
    return JSON.parse(completeJson);
  } catch (err) {
    console.error('Failed to parse reassembled JSON for document:', docId, err);
    return null;
  }
}

export async function saveToFirestore(docId: string, data: any) {
  if (!db) return false;
  const path = `portfolio_data/${docId}`;
  try {
    const jsonStr = JSON.stringify(data);
    const password = localStorage.getItem('port_pass') || 'al';
    const adminSignature = await computeSignature(password, docId);
    
    if (jsonStr.length >= CHUNK_SIZE) {
      // Chunk the entire payload
      const chunkCount = Math.ceil(jsonStr.length / CHUNK_SIZE);
      const chunkWritePromises = [];
      
      for (let i = 0; i < chunkCount; i++) {
        const slice = jsonStr.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        const chunkDocId = `${docId}_json_chunk_${i}`;
        const chunkDocRef = doc(db, 'portfolio_data', chunkDocId);
        const chunkSignature = await computeSignature(password, chunkDocId);
        
        chunkWritePromises.push(setDoc(chunkDocRef, { 
          chunk: slice, 
          adminSignature: chunkSignature 
        }, { merge: true }));
      }
      
      await Promise.all(chunkWritePromises);
      
      // Save metadata in the main document with merge: false to wipe old inline fields
      const mainDocRef = doc(db, 'portfolio_data', docId);
      await setDoc(mainDocRef, {
        _isChunkedPayload: true,
        chunkCount,
        adminSignature
      }, { merge: false });
      
      return true;
    } else {
      // Save normally with active dynamic signature
      const docRef = doc(db, 'portfolio_data', docId);
      await setDoc(docRef, { 
        ...data, 
        _isChunkedPayload: false, 
        chunkCount: null,
        adminSignature 
      }, { merge: true });
      return true;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

/**
 * Subscribes to a document in the 'portfolio_data' collection
 */
export function subscribeToFirestore(docId: string, onUpdate: (data: any) => void, onError?: (error: any) => void) {
  if (!db) return () => {};
  const path = `portfolio_data/${docId}`;
  const docRef = doc(db, 'portfolio_data', docId);
  return onSnapshot(
    docRef,
    async (snapshot) => {
      try {
        if (snapshot.exists()) {
          const mainData = snapshot.data();
          if (mainData._isChunkedPayload && typeof mainData.chunkCount === 'number') {
            const reassembled = await reassembleChunkedPayload(docId, mainData.chunkCount);
            onUpdate(reassembled);
          } else {
            onUpdate(mainData);
          }
        } else {
          onUpdate(null);
        }
      } catch (err) {
        console.error(`Error processing snapshot for [${docId}]:`, err);
        if (onError) onError(err);
      }
    },
    (error) => {
      console.warn(`Error listening to Firestore [${docId}]:`, error);
      if (onError) {
        onError(error);
      }
    }
  );
}

/**
 * Gets a single document from 'portfolio_data' snapshot
 */
export async function getFromFirestore(docId: string) {
  if (!db) return null;
  const path = `portfolio_data/${docId}`;
  try {
    const docRef = doc(db, 'portfolio_data', docId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const mainData = snapshot.data();
      if (mainData._isChunkedPayload && typeof mainData.chunkCount === 'number') {
        return await reassembleChunkedPayload(docId, mainData.chunkCount);
      }
      return mainData;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

/**
 * Saves a large resume Base64 string in a separate, isolated, chunked manner
 */
export async function saveResumeToFirestore(base64Data: string): Promise<boolean> {
  if (!db) return false;
  try {
    const password = localStorage.getItem('port_pass') || 'al';
    const chunkCount = Math.ceil(base64Data.length / CHUNK_SIZE);
    const chunkWritePromises = [];
    
    for (let i = 0; i < chunkCount; i++) {
      const slice = base64Data.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      const chunkDocId = `chunk_${i}`;
      const chunkDocRef = doc(db, 'resume_chunks', chunkDocId);
      const chunkSignature = await computeSignature(password, chunkDocId);
      
      chunkWritePromises.push(setDoc(chunkDocRef, { 
        chunk: slice, 
        adminSignature: chunkSignature 
      }, { merge: true }));
    }
    
    await Promise.all(chunkWritePromises);
    
    const metaDocId = 'meta';
    const metaDocRef = doc(db, 'resume_chunks', metaDocId);
    const metaSignature = await computeSignature(password, metaDocId);
    await setDoc(metaDocRef, { 
      chunkCount, 
      adminSignature: metaSignature 
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving chunked resume:', error);
    return false;
  }
}

/**
 * Retrieves a large chunked resume from Firestore on demand
 */
export async function getResumeFromFirestore(): Promise<string | null> {
  if (!db) return null;
  try {
    const metaDocRef = doc(db, 'resume_chunks', 'meta');
    const metaSnap = await getDoc(metaDocRef);
    if (!metaSnap.exists()) return null;
    
    const chunkCount = metaSnap.data().chunkCount;
    if (typeof chunkCount !== 'number' || chunkCount <= 0) return null;
    
    const chunkPromises = [];
    for (let i = 0; i < chunkCount; i++) {
      const chunkDocRef = doc(db, 'resume_chunks', `chunk_${i}`);
      chunkPromises.push(getDoc(chunkDocRef));
    }
    
    const snapshots = await Promise.all(chunkPromises);
    let completeBase64 = '';
    for (const snap of snapshots) {
      if (snap.exists()) {
        completeBase64 += snap.data().chunk || '';
      }
    }
    return completeBase64;
  } catch (error) {
    console.error('Error retrieving chunked resume:', error);
    return null;
  }
}
