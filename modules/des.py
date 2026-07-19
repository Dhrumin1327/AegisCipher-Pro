import base64
import os
from Crypto.Cipher import DES
from Crypto.Util.Padding import pad, unpad

def encrypt_des(plaintext: str, key_str: str) -> str:
    """
    Encrypts plaintext using DES-CBC with PKCS7 padding.
    Derives key to exactly 8 bytes.
    Generates a secure random 8-byte IV and prepends it to the ciphertext.
    """
    if not plaintext:
        raise ValueError("Plaintext cannot be empty.")
    if not key_str:
        raise ValueError("Key is required.")

    # DES key (64-bit = 8 bytes)
    key = key_str.encode('utf-8').ljust(8, b'\x00')[:8]
    iv = os.urandom(8)

    cipher = DES.new(key, DES.MODE_CBC, iv)
    padded_data = pad(plaintext.encode('utf-8'), DES.block_size)
    encrypted_bytes = cipher.encrypt(padded_data)
    
    # Prepend IV to ciphertext before encoding
    combined = iv + encrypted_bytes
    return base64.b64encode(combined).decode('utf-8')

def decrypt_des(ciphertext_base64: str, key_str: str) -> str:
    """
    Decrypts ciphertext (Base64) using DES-CBC with PKCS7 padding.
    Extracts the 8-byte IV from the front of the decoded data.
    """
    if not ciphertext_base64:
        raise ValueError("Ciphertext cannot be empty.")
    if not key_str:
        raise ValueError("Key is required.")

    key = key_str.encode('utf-8').ljust(8, b'\x00')[:8]

    try:
        combined = base64.b64decode(ciphertext_base64)
    except Exception:
        raise ValueError("Ciphertext must be valid Base64 encoded string.")

    if len(combined) < 8:
        raise ValueError("Ciphertext is too short (missing IV).")

    iv = combined[:8]
    encrypted_bytes = combined[8:]

    cipher = DES.new(key, DES.MODE_CBC, iv)
    decrypted_padded = cipher.decrypt(encrypted_bytes)
    decrypted_bytes = unpad(decrypted_padded, DES.block_size)
    return decrypted_bytes.decode('utf-8')
