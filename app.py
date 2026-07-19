import os
import json
import base64
import datetime
from flask import Flask, render_template, request, jsonify, redirect, url_for

from modules.aes import encrypt_aes, decrypt_aes
from modules.des import encrypt_des, decrypt_des
from modules.rsa import generate_rsa_keypair, encrypt_rsa, decrypt_rsa
from modules.hashing import calculate_hash

app = Flask(__name__)
app.secret_key = os.urandom(24)

HISTORY_FILE = os.path.join('logs', 'history.json')

def load_history():
    if not os.path.exists('logs'):
        os.makedirs('logs')
    if not os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, 'w') as f:
            json.dump([], f)
        return []
    try:
        with open(HISTORY_FILE, 'r') as f:
            return json.load(f)
    except Exception:
        return []

def save_history(history):
    if not os.path.exists('logs'):
        os.makedirs('logs')
    with open(HISTORY_FILE, 'w') as f:
        json.dump(history, f, indent=4)

def add_log_item(algorithm, operation, status, detail):
    history = load_history()
    now = datetime.datetime.now()
    log_item = {
        "id": base64.b64encode(os.urandom(6)).decode('utf-8').replace('+', '').replace('/', '')[:8],
        "timestamp": now.strftime("%Y-%m-%d %H:%M:%S"),
        "algorithm": algorithm,
        "operation": operation,
        "status": status,
        "detail": detail
    }
    history.insert(0, log_item)
    save_history(history)
    return log_item

@app.route('/')
def welcome():
    return render_template('welcome.html')

@app.route('/dashboard')
def dashboard():
    history = load_history()
    stats = {
        "totalEncryptions": sum(1 for item in history if item['operation'] == 'Encryption' and item['status'] == 'Success'),
        "totalDecryptions": sum(1 for item in history if item['operation'] == 'Decryption' and item['status'] == 'Success'),
        "totalHashes": sum(1 for item in history if item['operation'] == 'Hashing' and item['status'] == 'Success'),
        "totalKeyGens": sum(1 for item in history if item['operation'] == 'Key Generation' and item['status'] == 'Success'),
        "lastActivity": history[0]['detail'] if history else "N/A"
    }
    recent_logs = history[:5]
    return render_template('dashboard.html', stats=stats, recent_logs=recent_logs)

@app.route('/aes', methods=['GET', 'POST'])
def aes_view():
    result = ""
    error = ""
    key = ""
    input_text = ""
    
    if request.method == 'POST':
        action = request.form.get('action')
        key = request.form.get('key', '')
        input_text = request.form.get('input_text', '')
        
        try:
            if action == 'generate_key':
                key = base64.b64encode(os.urandom(24)).decode('utf-8')[:32]
                add_log_item("AES-256-CBC", "Key Generation", "Success", "Generated random 256-bit AES key")
                return jsonify({"key": key})
            elif action == 'encrypt':
                result = encrypt_aes(input_text, key)
                add_log_item("AES-256-CBC", "Encryption", "Success", f"Encrypted plain text ({len(input_text)} chars)")
            elif action == 'decrypt':
                result = decrypt_aes(input_text, key)
                add_log_item("AES-256-CBC", "Decryption", "Success", f"Decrypted cipher text ({len(input_text)} chars)")
        except Exception as e:
            error = str(e)
            add_log_item("AES-256-CBC", "Operation Failed", "Error", f"Failed action {action}: {error}")
            
    return render_template('aes.html', result=result, error=error, key=key, input_text=input_text)

@app.route('/des', methods=['GET', 'POST'])
def des_view():
    result = ""
    error = ""
    key = ""
    input_text = ""
    
    if request.method == 'POST':
        action = request.form.get('action')
        key = request.form.get('key', '')
        input_text = request.form.get('input_text', '')
        
        try:
            if action == 'generate_key':
                key = base64.b64encode(os.urandom(6)).decode('utf-8')[:8]
                add_log_item("DES-CBC", "Key Generation", "Success", "Generated random 64-bit DES key")
                return jsonify({"key": key})
            elif action == 'encrypt':
                result = encrypt_des(input_text, key)
                add_log_item("DES-CBC", "Encryption", "Success", f"Encrypted plain text ({len(input_text)} chars)")
            elif action == 'decrypt':
                result = decrypt_des(input_text, key)
                add_log_item("DES-CBC", "Decryption", "Success", f"Decrypted cipher text ({len(input_text)} chars)")
        except Exception as e:
            error = str(e)
            add_log_item("DES-CBC", "Operation Failed", "Error", f"Failed action {action}: {error}")
            
    return render_template('des.html', result=result, error=error, key=key, input_text=input_text)

@app.route('/rsa', methods=['GET', 'POST'])
def rsa_view():
    result = ""
    error = ""
    public_key = ""
    private_key = ""
    input_text = ""
    
    if request.method == 'POST':
        action = request.form.get('action')
        public_key = request.form.get('public_key', '')
        private_key = request.form.get('private_key', '')
        input_text = request.form.get('input_text', '')
        
        try:
            if action == 'generate_keypair':
                pub, priv = generate_rsa_keypair()
                add_log_item("RSA-2048", "Key Generation", "Success", "Generated FIPS-compliant RSA-2048 keypair")
                return jsonify({"public_key": pub, "private_key": priv})
            elif action == 'encrypt':
                result = encrypt_rsa(input_text, public_key)
                add_log_item("RSA-2048", "Encryption", "Success", f"Asymmetrically encrypted payload ({len(input_text)} chars)")
            elif action == 'decrypt':
                result = decrypt_rsa(input_text, private_key)
                add_log_item("RSA-2048", "Decryption", "Success", f"Asymmetrically decrypted payload ({len(input_text)} chars)")
        except Exception as e:
            error = str(e)
            add_log_item("RSA-2048", "Operation Failed", "Error", f"Failed asymmetric action {action}: {error}")
            
    return render_template('rsa.html', result=result, error=error, public_key=public_key, private_key=private_key, input_text=input_text)

@app.route('/hash', methods=['GET', 'POST'])
def hash_view():
    result = ""
    error = ""
    algo = "SHA-256"
    input_text = ""
    
    if request.method == 'POST':
        algo = request.form.get('algo', 'SHA-256')
        input_text = request.form.get('input_text', '')
        
        try:
            result = calculate_hash(input_text, algo)
            add_log_item(algo, "Hashing", "Success", f"Calculated digest of payload ({len(input_text)} chars)")
        except Exception as e:
            error = str(e)
            add_log_item(algo, "Hashing Failed", "Error", f"Failed hashing: {error}")
            
    return render_template('hash.html', result=result, error=error, algo=algo, input_text=input_text)

@app.route('/history')
def history_view():
    history = load_history()
    return render_template('history.html', history=history)

@app.route('/api/history/delete/<log_id>', methods=['POST'])
def delete_log(log_id):
    history = load_history()
    updated = [item for item in history if item['id'] != log_id]
    save_history(updated)
    return jsonify({"status": "success"})

@app.route('/api/history/clear', methods=['POST'])
def clear_history():
    save_history([])
    return jsonify({"status": "success"})

@app.route('/about')
def about_view():
    return render_template('about.html')

@app.route('/settings')
def settings_view():
    return render_template('settings.html')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
