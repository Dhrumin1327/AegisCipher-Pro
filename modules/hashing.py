import hashlib

def calculate_hash(text: str, algorithm: str) -> str:
    """
    Computes secure cryptographic digest using MD5, SHA-1, SHA-256, or SHA-512.
    """
    if not text:
        raise ValueError("Input text cannot be empty.")
        
    encoded_text = text.encode('utf-8')
    
    if algorithm == 'MD5':
        return hashlib.md5(encoded_text).hexdigest()
    elif algorithm == 'SHA-1':
        return hashlib.sha1(encoded_text).hexdigest()
    elif algorithm == 'SHA-256':
        return hashlib.sha256(encoded_text).hexdigest()
    elif algorithm == 'SHA-512':
        return hashlib.sha512(encoded_text).hexdigest()
    else:
        raise ValueError(f"Unsupported hashing algorithm: {algorithm}")
