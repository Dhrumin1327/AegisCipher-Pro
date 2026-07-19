import base64
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP

def generate_rsa_keypair() -> tuple[str, str]:
    """
    Generates a secure RSA-2048 Public/Private Keypair in standard PEM format.
    """
    key = RSA.generate(2048)
    private_key_pem = key.export_key().decode('utf-8')
    public_key_pem = key.publickey().export_key().decode('utf-8')
    return public_key_pem, private_key_pem

def encrypt_rsa(plaintext: str, public_key_pem: str) -> str:
    """
    Encrypts plaintext using RSA-OAEP with public key.
    """
    if not plaintext:
        raise ValueError("Plaintext cannot be empty.")
    if not public_key_pem:
        raise ValueError("Public key is required.")

    key = RSA.import_key(public_key_pem)
    cipher = PKCS1_OAEP.new(key)
    encrypted_bytes = cipher.encrypt(plaintext.encode('utf-8'))
    return base64.b64encode(encrypted_bytes).decode('utf-8')

def decrypt_rsa(ciphertext_base64: str, private_key_pem: str) -> str:
    """
    Decrypts ciphertext (Base64) using RSA-OAEP with private key.
    """
    if not ciphertext_base64:
        raise ValueError("Ciphertext cannot be empty.")
    if not private_key_pem:
        raise ValueError("Private key is required.")

    key = RSA.import_key(private_key_pem)
    cipher = PKCS1_OAEP.new(key)
    encrypted_bytes = base64.b64decode(ciphertext_base64)
    decrypted_bytes = cipher.decrypt(encrypted_bytes)
    return decrypted_bytes.decode('utf-8')
