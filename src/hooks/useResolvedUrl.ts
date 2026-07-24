import { useState, useEffect } from 'react';

const blobCache = new Map<string, string>();

export function useResolvedUrl(url: string | undefined) {
  const [resolvedUrl, setResolvedUrl] = useState<string>('');

  useEffect(() => {
    if (!url) {
      setResolvedUrl('');
      return;
    }

    // If it's not a data URL, return it directly
    if (!url.startsWith('data:')) {
      setResolvedUrl(url);
      return;
    }

    // For images, return the raw data URL directly because modern browsers handle them perfectly
    // and this avoids any Blob URL revocation/lifecycle issues!
    if (url.startsWith('data:image/')) {
      setResolvedUrl(url);
      return;
    }

    // If it is cached, use the cached blob URL
    if (blobCache.has(url)) {
      setResolvedUrl(blobCache.get(url)!);
      return;
    }

    // Otherwise, convert it to a Blob URL (e.g. for PDFs)
    try {
      const parts = url.split(',');
      const meta = parts[0];
      const base64Data = parts[1];
      const mimeMatch = meta.match(/data:([^;]+)/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
      
      const isBase64 = meta.indexOf('base64') >= 0;
      let blob: Blob;
      
      if (isBase64) {
        // Fix: Replace potential whitespace/newlines or sanitization artifacts in base64
        const cleanedBase64 = base64Data.replace(/\s/g, '').replace(/&#x2F;/g, '/').replace(/&#x27;/g, "'");
        const byteCharacters = atob(cleanedBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], { type: mimeType });
      } else {
        const decodedData = decodeURIComponent(base64Data);
        blob = new Blob([decodedData], { type: mimeType });
      }
      
      const blobUrl = URL.createObjectURL(blob);
      blobCache.set(url, blobUrl);
      setResolvedUrl(blobUrl);
    } catch (e) {
      console.error('Error resolving data URI to Blob URL:', e);
      setResolvedUrl(url); // Fallback to raw data URI
    }
  }, [url]);

  return resolvedUrl;
}
