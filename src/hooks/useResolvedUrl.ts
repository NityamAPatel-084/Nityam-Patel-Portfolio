import { useState, useEffect } from 'react';

export function useResolvedUrl(url: string | undefined) {
  const [resolvedUrl, setResolvedUrl] = useState<string>('');

  useEffect(() => {
    if (!url) {
      setResolvedUrl('');
      return;
    }

    if (url.startsWith('data:')) {
      try {
        const parts = url.split(',');
        const meta = parts[0];
        const base64Data = parts[1];
        const mimeMatch = meta.match(/data:([^;]+)/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
        
        const isBase64 = meta.indexOf('base64') >= 0;
        let blob: Blob;
        
        if (isBase64) {
          const byteCharacters = atob(base64Data);
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
        setResolvedUrl(blobUrl);
        
        return () => {
          URL.revokeObjectURL(blobUrl);
        };
      } catch (e) {
        console.error('Error resolving data URI to Blob URL:', e);
        setResolvedUrl(url); // Fallback to raw data URI if parsing fails
      }
    } else {
      setResolvedUrl(url);
    }
  }, [url]);

  return resolvedUrl;
}
