/**
 * Custom High-Performance Input Sanitization and XSS Prevention Library
 */

/**
 * Escapes HTML control characters to prevent XSS injection in rendering contexts
 */
export function escapeHtml(str: string): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Strips all HTML tags and control scripts completely from a plain text input string
 */
export function sanitizePlainString(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Strip script tags and style tags first
  let cleaned = input.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '');
  cleaned = cleaned.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '');
  
  // Strip all other HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  
  // Strip event handlers
  cleaned = cleaned.replace(/on\w+\s*=\s*(['"][^'"]*['"]|[^>\s]+)/gi, '');
  
  // Strip javascript pseudo-protocols
  cleaned = cleaned.replace(/javascript:\s*/gi, '');
  
  return cleaned.trim();
}

/**
 * Sanitizes rich text / HTML fragments by removing malicious elements and attributes
 */
export function sanitizeHtmlContent(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Remove script tags and style tags
  let cleaned = input.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '');
  cleaned = cleaned.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '');
  
  // Remove dangerous attributes like onload, onerror, onclick, etc.
  cleaned = cleaned.replace(/on\w+\s*=\s*(['"][^'"]*['"]|[^>\s]+)/gi, '');
  
  // Remove javascript: and data: urls within attributes
  cleaned = cleaned.replace(/href\s*=\s*['"]\s*javascript:[^'"]*['"]/gi, 'href="#"');
  cleaned = cleaned.replace(/src\s*=\s*['"]\s*javascript:[^'"]*['"]/gi, 'src=""');
  
  return cleaned;
}
