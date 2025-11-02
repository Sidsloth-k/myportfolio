/**
 * Simple encryption/decryption for project IDs in URLs
 * Uses base64 encoding with a simple XOR cipher for obfuscation
 * This is not secure encryption - just URL obfuscation
 */

const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  const errorMessage = `
REACT_APP_ENCRYPTION_KEY environment variable is not set.

Troubleshooting steps:
1. Create/update .env file in the root of bsd-portfolio directory (same level as package.json)
2. Add: REACT_APP_ENCRYPTION_KEY=your-key-here
3. Make sure there are NO spaces around the = sign
4. RESTART your development server (npm start) - env vars are only loaded on startup
5. Make sure the .env file is in bsd-portfolio/.env (not in the root of the workspace)
  `;
  console.error(errorMessage);
  throw new Error(errorMessage.trim());
}

/**
 * Encrypts a numeric ID to a URL-safe string
 */
export function encryptId(id: number): string {
  const key = ENCRYPTION_KEY!; // Non-null assertion - validated at module load
  const idStr = id.toString();
  let encrypted = '';
  
  for (let i = 0; i < idStr.length; i++) {
    const charCode = idStr.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    const encryptedChar = charCode ^ keyChar;
    encrypted += String.fromCharCode(encryptedChar);
  }
  
  // Convert to base64 and make URL-safe
  const base64 = btoa(encrypted);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Decrypts a URL-safe string back to a numeric ID
 */
export function decryptId(encrypted: string): number | null {
  try {
    // Make URL-safe base64 back to regular base64
    const base64 = encrypted.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    
    const encryptedStr = atob(padded);
    const key = ENCRYPTION_KEY!; // Non-null assertion - validated at module load
    let decrypted = '';
    
    for (let i = 0; i < encryptedStr.length; i++) {
      const encryptedChar = encryptedStr.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      const decryptedChar = encryptedChar ^ keyChar;
      decrypted += String.fromCharCode(decryptedChar);
    }
    
    const id = parseInt(decrypted, 10);
    return isNaN(id) ? null : id;
  } catch (error) {
    console.error('Failed to decrypt ID:', error);
    return null;
  }
}

/**
 * Validates if a string could be an encrypted ID
 */
export function isValidEncryptedId(str: string): boolean {
  // Check if it's a valid base64-like string
  return /^[A-Za-z0-9_-]+$/.test(str) && str.length > 0;
}

