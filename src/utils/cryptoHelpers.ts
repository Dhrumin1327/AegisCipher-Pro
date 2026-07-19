import CryptoJS from 'crypto-js';

// Secure random hex generator
export function generateSecureRandomHex(bytes: number): string {
  const array = new Uint8Array(bytes);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// AES-256-CBC Encryption
export function encryptAES(plaintext: string, keyStr: string): string {
  if (!plaintext) throw new Error("Plaintext cannot be empty.");
  if (!keyStr) throw new Error("Encryption key cannot be empty.");
  
  // Format key to standard 256-bit (32 bytes)
  const key = CryptoJS.enc.Utf8.parse(keyStr.padEnd(32, '\0').slice(0, 32));
  
  // Generate secure random 128-bit (16 bytes) IV
  const ivBytes = new Uint8Array(16);
  window.crypto.getRandomValues(ivBytes);
  const iv = CryptoJS.lib.WordArray.create(ivBytes as any);
  
  const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  // Combine IV and raw ciphertext bytes
  const combined = CryptoJS.lib.WordArray.create(ivBytes as any);
  combined.concat(encrypted.ciphertext);
  
  return CryptoJS.enc.Base64.stringify(combined);
}

// AES-256-CBC Decryption
export function decryptAES(ciphertextBase64: string, keyStr: string): string {
  if (!ciphertextBase64) throw new Error("Ciphertext cannot be empty.");
  if (!keyStr) throw new Error("Decryption key cannot be empty.");

  const key = CryptoJS.enc.Utf8.parse(keyStr.padEnd(32, '\0').slice(0, 32));
  
  let combined;
  try {
    combined = CryptoJS.enc.Base64.parse(ciphertextBase64.trim());
  } catch (err) {
    throw new Error("Ciphertext must be a valid Base64 encoded string.");
  }
  
  if (combined.sigBytes < 16) {
    throw new Error("Ciphertext is too short (missing IV).");
  }
  
  // Extract IV (first 16 bytes = 4 words)
  const ivWords = combined.words.slice(0, 4);
  const iv = CryptoJS.lib.WordArray.create(ivWords, 16);
  
  // Extract ciphertext (everything from word 4 onwards)
  const ciphertextWords = combined.words.slice(4);
  const cipherSigBytes = combined.sigBytes - 16;
  const ciphertext = CryptoJS.lib.WordArray.create(ciphertextWords, cipherSigBytes);
  
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: ciphertext
  });
  
  const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  const result = decrypted.toString(CryptoJS.enc.Utf8);
  if (!result) throw new Error("Decryption failed. Please verify the secret key.");
  return result;
}

// DES-CBC Encryption (64-bit key = 8 bytes)
export function encryptDES(plaintext: string, keyStr: string): string {
  if (!plaintext) throw new Error("Plaintext cannot be empty.");
  if (!keyStr) throw new Error("Encryption key cannot be empty.");

  const key = CryptoJS.enc.Utf8.parse(keyStr.padEnd(8, '\0').slice(0, 8));
  
  // Generate secure random 64-bit (8 bytes) IV
  const ivBytes = new Uint8Array(8);
  window.crypto.getRandomValues(ivBytes);
  const iv = CryptoJS.lib.WordArray.create(ivBytes as any);
  
  const encrypted = CryptoJS.DES.encrypt(plaintext, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  // Combine IV and raw ciphertext bytes
  const combined = CryptoJS.lib.WordArray.create(ivBytes as any);
  combined.concat(encrypted.ciphertext);
  
  return CryptoJS.enc.Base64.stringify(combined);
}

// DES-CBC Decryption
export function decryptDES(ciphertextBase64: string, keyStr: string): string {
  if (!ciphertextBase64) throw new Error("Ciphertext cannot be empty.");
  if (!keyStr) throw new Error("Decryption key cannot be empty.");

  const key = CryptoJS.enc.Utf8.parse(keyStr.padEnd(8, '\0').slice(0, 8));
  
  let combined;
  try {
    combined = CryptoJS.enc.Base64.parse(ciphertextBase64.trim());
  } catch (err) {
    throw new Error("Ciphertext must be a valid Base64 encoded string.");
  }
  
  if (combined.sigBytes < 8) {
    throw new Error("Ciphertext is too short (missing IV).");
  }
  
  // Extract IV (first 8 bytes = 2 words)
  const ivWords = combined.words.slice(0, 2);
  const iv = CryptoJS.lib.WordArray.create(ivWords, 8);
  
  // Extract ciphertext (everything from word 2 onwards)
  const ciphertextWords = combined.words.slice(2);
  const cipherSigBytes = combined.sigBytes - 8;
  const ciphertext = CryptoJS.lib.WordArray.create(ciphertextWords, cipherSigBytes);
  
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: ciphertext
  });
  
  const decrypted = CryptoJS.DES.decrypt(cipherParams, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  const result = decrypted.toString(CryptoJS.enc.Utf8);
  if (!result) throw new Error("Decryption failed. Please verify the secret key.");
  return result;
}

// RSA-2048 Key Pair Generation, Export, Import, Encryption, Decryption using native Web Crypto API
function convertBinaryToPem(binary: ArrayBuffer, label: string): string {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(binary)));
  const matches = base64.match(/.{1,64}/g);
  const formatted = matches ? matches.join("\n") : base64;
  return `-----BEGIN ${label}-----\n${formatted}\n-----END ${label}-----`;
}

export async function generateRSAKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  const exportedPublic = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
  const exportedPrivate = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

  return {
    publicKey: convertBinaryToPem(exportedPublic, "PUBLIC KEY"),
    privateKey: convertBinaryToPem(exportedPrivate, "PRIVATE KEY")
  };
}

async function importPublicKey(pem: string): Promise<CryptoKey> {
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const cleanPem = pem
    .replace(pemHeader, "")
    .replace(pemFooter, "")
    .replace(/\s+/g, "");
  
  const binaryDerString = atob(cleanPem);
  const binaryLen = binaryDerString.length;
  const bytes = new Uint8Array(binaryLen);
  for (let i = 0; i < binaryLen; i++) {
    bytes[i] = binaryDerString.charCodeAt(i);
  }

  return await window.crypto.subtle.importKey(
    "spki",
    bytes.buffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );
}

async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const cleanPem = pem
    .replace(pemHeader, "")
    .replace(pemFooter, "")
    .replace(/\s+/g, "");
  
  const binaryDerString = atob(cleanPem);
  const binaryLen = binaryDerString.length;
  const bytes = new Uint8Array(binaryLen);
  for (let i = 0; i < binaryLen; i++) {
    bytes[i] = binaryDerString.charCodeAt(i);
  }

  return await window.crypto.subtle.importKey(
    "pkcs8",
    bytes.buffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"]
  );
}

export async function encryptRSA(plaintext: string, publicKeyPem: string): Promise<string> {
  if (!plaintext) throw new Error("Plaintext cannot be empty.");
  if (!publicKeyPem) throw new Error("RSA Public Key is required.");
  try {
    const publicKey = await importPublicKey(publicKeyPem);
    const enc = new TextEncoder();
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
      enc.encode(plaintext)
    );
    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  } catch (err: any) {
    throw new Error("RSA Encryption failed. Verify public key format is standard PEM (RSA-OAEP, 2048-bit, SHA-256).");
  }
}

export async function decryptRSA(ciphertextBase64: string, privateKeyPem: string): Promise<string> {
  if (!ciphertextBase64) throw new Error("Ciphertext cannot be empty.");
  if (!privateKeyPem) throw new Error("RSA Private Key is required.");
  try {
    const privateKey = await importPrivateKey(privateKeyPem);
    const binaryCipher = atob(ciphertextBase64.trim());
    const bytes = new Uint8Array(binaryCipher.length);
    for (let i = 0; i < binaryCipher.length; i++) {
      bytes[i] = binaryCipher.charCodeAt(i);
    }
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKey,
      bytes.buffer
    );
    const dec = new TextDecoder();
    return dec.decode(decrypted);
  } catch (err: any) {
    throw new Error("RSA Decryption failed. Verify private key is valid and matches the public key.");
  }
}

// Cryptographic Hashing (MD5, SHA1, SHA256, SHA512)
export function generateHash(text: string, algorithm: 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512'): string {
  if (!text) throw new Error("Input text cannot be empty.");
  if (algorithm === 'MD5') {
    return CryptoJS.MD5(text).toString();
  } else if (algorithm === 'SHA-1') {
    return CryptoJS.SHA1(text).toString();
  } else if (algorithm === 'SHA-256') {
    return CryptoJS.SHA256(text).toString();
  } else if (algorithm === 'SHA-512') {
    return CryptoJS.SHA512(text).toString();
  }
  return '';
}
