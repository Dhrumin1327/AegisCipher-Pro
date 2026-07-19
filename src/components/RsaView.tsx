import { useState } from 'react';
import { Binary, ShieldCheck, Copy, Download, Trash2, RefreshCw, AlertCircle, Check } from 'lucide-react';
import { generateRSAKeyPair, encryptRSA, decryptRSA } from '../utils/cryptoHelpers';
import { LogItem } from '../types';

interface RsaViewProps {
  onAddLog: (log: Omit<LogItem, 'id' | 'timestamp'>) => void;
  onUpdateStats: (type: 'encrypt' | 'decrypt' | 'hash' | 'keygen') => void;
  onSetStatus: (text: string, type: 'info' | 'success' | 'error' | 'warning') => void;
}

export default function RsaView({ onAddLog, onUpdateStats, onSetStatus }: RsaViewProps) {
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState('');
  
  // Copied indicator feedback states
  const [copiedPub, setCopiedPub] = useState(false);
  const [copiedPriv, setCopiedPriv] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);

  const handleGenerateKeyPair = async () => {
    setError('');
    onSetStatus('Generating cryptographically secure RSA-2048 keypair...', 'info');
    const t0 = performance.now();
    try {
      const keypair = await generateRSAKeyPair();
      setPublicKey(keypair.publicKey);
      setPrivateKey(keypair.privateKey);
      
      const t1 = performance.now();
      const duration = `${(t1 - t0).toFixed(2)} ms`;

      onAddLog({
        algorithm: 'RSA-2048',
        operation: 'Key Generation',
        status: 'Success',
        detail: 'Generated secure 2048-bit RSA-OAEP Keypair',
        executionTime: duration
      });
      onUpdateStats('keygen');
      onSetStatus('Generated FIPS-compliant RSA-2048 keypair successfully', 'success');
    } catch (err: any) {
      setError(err.message || 'Key generation failed');
      onSetStatus('RSA Keypair generation failed', 'error');
    }
  };

  const handleEncrypt = async () => {
    setError('');
    if (!inputText) {
      setError('Please input plaintext to encrypt.');
      onSetStatus('RSA Encryption error: empty input', 'error');
      return;
    }
    if (!publicKey) {
      setError('Public Key is required for encryption.');
      onSetStatus('RSA Encryption error: missing public key', 'error');
      return;
    }

    const t0 = performance.now();
    try {
      onSetStatus('Encrypting using RSA-OAEP SHA-256 standard...', 'info');
      const cipher = await encryptRSA(inputText, publicKey);
      setOutputText(cipher);
      
      const t1 = performance.now();
      const duration = `${(t1 - t0).toFixed(2)} ms`;

      onAddLog({
        algorithm: 'RSA-2048',
        operation: 'Encryption',
        status: 'Success',
        detail: `Encrypted text (${inputText.length} chars) using RSA Public Key`,
        executionTime: duration
      });
      onUpdateStats('encrypt');
      onSetStatus('Plain text asymmetric encryption completed', 'success');
    } catch (err: any) {
      setError(err.message || 'Encryption failed. Check Public Key format.');
      onAddLog({
        algorithm: 'RSA-2048',
        operation: 'Encryption',
        status: 'Error',
        detail: err.message || 'RSA Encryption failed'
      });
      onSetStatus('RSA Encryption failed', 'error');
    }
  };

  const handleDecrypt = async () => {
    setError('');
    if (!inputText) {
      setError('Please input ciphertext (Base64) to decrypt.');
      onSetStatus('RSA Decryption error: empty input', 'error');
      return;
    }
    if (!privateKey) {
      setError('Private Key is required for decryption.');
      onSetStatus('RSA Decryption error: missing private key', 'error');
      return;
    }

    const t0 = performance.now();
    try {
      onSetStatus('Decrypting using RSA-OAEP SHA-256 standard...', 'info');
      const decrypted = await decryptRSA(inputText, privateKey);
      setOutputText(decrypted);

      const t1 = performance.now();
      const duration = `${(t1 - t0).toFixed(2)} ms`;

      onAddLog({
        algorithm: 'RSA-2048',
        operation: 'Decryption',
        status: 'Success',
        detail: `Decrypted cipher text (${inputText.length} chars) using RSA Private Key`,
        executionTime: duration
      });
      onUpdateStats('decrypt');
      onSetStatus('Cipher text asymmetric decryption completed successfully', 'success');
    } catch (err: any) {
      setError(err.message || 'Decryption failed. Check Private Key authenticity.');
      onAddLog({
        algorithm: 'RSA-2048',
        operation: 'Decryption',
        status: 'Error',
        detail: err.message || 'RSA Decryption failed'
      });
      onSetStatus('RSA Decryption failed: invalid private parameters', 'error');
    }
  };

  const handleCopyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    onSetStatus(`${label} copied to clipboard`, 'success');
    
    if (label === 'Public Key') {
      setCopiedPub(true);
      setTimeout(() => setCopiedPub(false), 2000);
    } else if (label === 'Private Key') {
      setCopiedPriv(true);
      setTimeout(() => setCopiedPriv(false), 2000);
    } else if (label === 'Result') {
      setCopiedResult(true);
      setTimeout(() => setCopiedResult(false), 2000);
    }
  };

  const handleSaveToFile = (text: string, filename: string) => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    onSetStatus(`Saved ${filename} to local disk`, 'success');
  };

  const handleExportResult = (format: 'txt' | 'json' | 'csv') => {
    if (!outputText) return;
    let dataStr = '';
    let mimeType = 'text/plain';
    let ext = 'txt';

    if (format === 'txt') {
      dataStr = outputText;
    } else if (format === 'json') {
      dataStr = JSON.stringify({
        algorithm: 'RSA-OAEP-2048',
        inputText: inputText,
        outputText: outputText,
        publicKey: publicKey,
        timestamp: new Date().toISOString()
      }, null, 2);
      mimeType = 'application/json';
      ext = 'json';
    } else if (format === 'csv') {
      const headers = ['Algorithm', 'Operation', 'Input', 'Output', 'Timestamp'];
      const row = [
        'RSA-OAEP-2048',
        outputText.length > 100 ? 'Encryption' : 'Decryption',
        inputText.replace(/"/g, '""'),
        outputText.replace(/"/g, '""'),
        new Date().toISOString()
      ];
      dataStr = `${headers.join(',')}\n"${row.join('","')}"`;
      mimeType = 'text/csv';
      ext = 'csv';
    }

    const blob = new Blob([dataStr], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rsa-output-${Date.now()}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
    onSetStatus(`Saved as ${ext.toUpperCase()}`, 'success');
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError('');
    onSetStatus('Cleared workspace inputs and outputs', 'info');
  };

  return (
    <div className="space-y-6 font-sans text-slate-100 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Binary className="w-6 h-6 text-indigo-400" />
          RSA Asymmetric Cryptosystem
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Keys Generation and Configurations Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-5 space-y-4 backdrop-blur-md shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold tracking-wide uppercase font-mono text-slate-400">
                Keypair Management
              </h3>
              <button
                onClick={handleGenerateKeyPair}
                className="py-1.5 px-3 rounded-lg bg-indigo-900/30 border border-indigo-500/30 hover:bg-indigo-900/50 text-indigo-300 font-medium text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer animate-pulse-once"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                GENERATE KEYS
              </button>
            </div>

            {/* Public Key Display/Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">PUBLIC KEY (SPKI PEM)</span>
                {publicKey && (
                  <div className="flex gap-2">
                    <button onClick={() => handleCopyToClipboard(publicKey, 'Public Key')} className="text-slate-500 hover:text-indigo-400 transition-colors" title="Copy public key">
                      {copiedPub ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => handleSaveToFile(publicKey, 'id_rsa_pub.pem')} className="text-slate-500 hover:text-indigo-400 transition-colors" title="Save file">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <textarea
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                placeholder="-----BEGIN PUBLIC KEY-----"
                rows={4}
                className="w-full bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-[10px] font-mono focus:outline-none focus:border-indigo-500/50 text-slate-300 placeholder-slate-700 transition-colors resize-none"
              />
            </div>

            {/* Private Key Display/Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">PRIVATE KEY (PKCS8 PEM)</span>
                {privateKey && (
                  <div className="flex gap-2">
                    <button onClick={() => handleCopyToClipboard(privateKey, 'Private Key')} className="text-slate-500 hover:text-indigo-400 transition-colors" title="Copy private key">
                      {copiedPriv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => handleSaveToFile(privateKey, 'id_rsa.pem')} className="text-slate-500 hover:text-indigo-400 transition-colors" title="Save file">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <textarea
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="-----BEGIN PRIVATE KEY-----"
                rows={4}
                className="w-full bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-[10px] font-mono focus:outline-none focus:border-indigo-500/50 text-slate-300 placeholder-slate-700 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right Operations Workspace Column */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Encryption Workspace Card */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-md shadow-md space-y-4 relative overflow-hidden">
            
            {/* Input Data Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">RSA WORKSPACE</span>
                <span className="text-[10px] text-slate-500 font-mono">{inputText.length} characters</span>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to encrypt using public key, or base64 ciphertext to decrypt using private key..."
                rows={5}
                className="w-full bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 text-xs font-mono focus:outline-none focus:border-indigo-500/50 text-slate-100 placeholder-slate-700 transition-all resize-y"
              />
            </div>

            {/* Error Message banner */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-400 flex items-start gap-2 text-xs font-sans">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Cryptographic Execution Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleEncrypt}
                className="flex-1 min-w-[140px] py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-indigo-500 text-white font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-md hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] cursor-pointer"
              >
                PUBLIC ENCRYPT
              </button>
              <button
                onClick={handleDecrypt}
                className="flex-1 min-w-[140px] py-3 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-md hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] cursor-pointer"
              >
                PRIVATE DECRYPT
              </button>
              <button
                onClick={handleClear}
                className="py-3 px-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
                title="Clear all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Output Data Box */}
            {outputText && (
              <div className="space-y-2 pt-4 border-t border-slate-900/60 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                    CRYPTOGRAPHIC PROCESS COMPLETED
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{outputText.length} characters</span>
                </div>
                <div className="relative">
                  <pre className="w-full bg-slate-950 border border-teal-950/60 rounded-xl p-4 text-xs font-mono text-teal-300 overflow-x-auto overflow-y-auto whitespace-pre-wrap select-all max-h-48">
                    {outputText}
                  </pre>
                </div>
                <div className="flex flex-wrap gap-2.5 justify-end">
                  <button
                    onClick={() => handleCopyToClipboard(outputText, 'Result')}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-100 text-xs font-mono transition-colors cursor-pointer"
                  >
                    {copiedResult ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedResult ? 'COPIED!' : 'COPY RESULT'}
                  </button>

                  <div className="inline-flex rounded-lg bg-slate-950 border border-slate-800 p-0.5">
                    <span className="flex items-center gap-1 px-2 text-[10px] font-mono text-slate-500">EXPORT:</span>
                    <button
                      onClick={() => handleExportResult('txt')}
                      className="py-1 px-2.5 rounded text-slate-400 hover:text-white text-[10px] font-mono hover:bg-slate-900 cursor-pointer"
                    >
                      TXT
                    </button>
                    <button
                      onClick={() => handleExportResult('json')}
                      className="py-1 px-2.5 rounded text-slate-400 hover:text-white text-[10px] font-mono hover:bg-slate-900 cursor-pointer"
                    >
                      JSON
                    </button>
                    <button
                      onClick={() => handleExportResult('csv')}
                      className="py-1 px-2.5 rounded text-slate-400 hover:text-white text-[10px] font-mono hover:bg-slate-900 cursor-pointer"
                    >
                      CSV
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
