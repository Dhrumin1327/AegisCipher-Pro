export interface LogItem {
  id: string;
  timestamp: string; // "YYYY-MM-DD HH:mm:ss"
  algorithm: string; // "AES-256-CBC" | "DES-CBC" | "RSA-2048" | "MD5" | "SHA-1" | "SHA-256" | "SHA-512"
  operation: string; // "Encryption" | "Decryption" | "Key Generation" | "Hashing"
  status: 'Success' | 'Error';
  detail: string;
  executionTime?: string; // e.g. "0.45 ms"
}

export interface AppStats {
  totalEncryptions: number;
  totalDecryptions: number;
  totalHashes: number;
  totalKeyGens: number;
  lastActivity: string;
}

export type ActiveView = 'welcome' | 'dashboard' | 'aes' | 'des' | 'rsa' | 'hash' | 'history' | 'about' | 'settings';
