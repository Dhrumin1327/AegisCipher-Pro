import base64
import os
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

def encrypt_aes(plaintext: str, key_str: str) -> str:
    """
    Encrypts plaintext using AES-256-CBC with PKCS7 padding.
    Derives key to exactly 32 bytes.
    Generates a secure random 16-byte IV and prepends it to the ciphertext.
    """
    if not plaintext:
        raise ValueError("Plaintext cannot be empty.")
    if not key_str:
        raise ValueError("Key is required.")

    # Standardize key (256-bit = 32 bytes)
    key = key_str.encode('utf-8').ljust(32, b'\x00')[:32]
    iv = os.urandom(16)

    cipher = AES.new(key, AES.MODE_CBC, iv)
    padded_data = pad(plaintext.encode('utf-8'), AES.block_size)
    encrypted_bytes = cipher.encrypt(padded_data)
    
    # Prepend IV to ciphertext before encoding
    combined = iv + encrypted_bytes
    return base64.b64encode(combined).decode('utf-8')

def decrypt_aes(ciphertext_base64: str, key_str: str) -> str:
    """
    Decrypts ciphertext (Base64) using AES-256-CBC with PKCS7 padding.
    Extracts the 16-byte IV from the front of the decoded data.
    """
    if not ciphertext_base64:
        raise ValueError("Ciphertext cannot be empty.")
    if not key_str:
        raise ValueError("Key is required.")

    key = key_str.encode('utf-8').ljust(32, b'\x00')[:32]

    try:
        combined = base64.b64decode(ciphertext_base64)
    except Exception:
        raise ValueError("Ciphertext must be valid Base64 encoded string.")

    if len(combined) < 16:
        raise ValueError("Ciphertext is too short (missing IV).")

    iv = combined[:16]
    encrypted_bytes = combined[16:]

    cipher = AES.new(key, AES.MODE_CBC, iv)
    decrypted_padded = cipher.decrypt(encrypted_bytes)
    decrypted_bytes = unpad(decrypted_padded, AES.block_size)
    return decrypted_bytes.decode('utf-8')
