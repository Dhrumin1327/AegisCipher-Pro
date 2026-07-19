import { useState } from 'react';
import { KeyRound, ShieldCheck, Copy, Trash2, RefreshCw, AlertCircle, Check } from 'lucide-react';
import { encryptAES, decryptAES, generateSecureRandomHex } from '../utils/cryptoHelpers';
import { LogItem } from '../types';

interface AesViewProps {
  onAddLog: (log: Omit<LogItem, 'id' | 'timestamp'>) => void;
  onUpdateStats: (type: 'encrypt' | 'decrypt' | 'hash' | 'keygen') => void;
  onSetStatus: (text: string, type: 'info' | 'success' | 'error' | 'warning') => void;
}

export default function AesView({ onAddLog, onUpdateStats, onSetStatus }: AesViewProps) {
  const [key, setKey] = useState('');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);

  const handleGenerateKey = () => {
    setError('');
    try {
      const t0 = performance.now();
      const secureKey = generateSecureRandomHex(32); // 256 bits
      setKey(secureKey);
      
      const t1 = performance.now();
      const duration = `${(t1 - t0).toFixed(2)} ms`;
      
      onAddLog({
        algorithm: 'AES-256-CBC',
        operation: 'Key Generation',
        status: 'Success',
        detail: 'Generated random 256-bit AES key',
        executionTime: duration
      });
      onUpdateStats('keygen');
      onSetStatus('Generated secure AES-256 key successfully', 'success');
    } catch (err: any) {
      setError(err.message);
      onSetStatus('Key generation failed', 'error');
    }
  };

  const handleEncrypt = () => {
    setError('');
    if (!inputText) {
      setError('Please input text to encrypt.');
      onSetStatus('AES Encryption error: empty input', 'error');
      return;
    }
    if (!key) {
      setError('Key is required for encryption.');
      onSetStatus('AES Encryption error: missing key', 'error');
      return;
    }

    const t0 = performance.now();
    try {
      onSetStatus('Encrypting plain text using AES-256-CBC...', 'info');
      const cipher = encryptAES(inputText, key);
      setOutputText(cipher);
      
      const t1 = performance.now();
      const duration = `${(t1 - t0).toFixed(2)} ms`;

      onAddLog({
        algorithm: 'AES-256-CBC',
        operation: 'Encryption',
        status: 'Success',
        detail: `Encrypted plain text (${inputText.length} chars)`,
        executionTime: duration
      });
      onUpdateStats('encrypt');
      onSetStatus('Plain text encrypted successfully', 'success');
    } catch (err: any) {
      setError(err.message || 'Encryption failed. Check parameters.');
      onAddLog({
        algorithm: 'AES-256-CBC',
        operation: 'Encryption',
        status: 'Error',
        detail: err.message || 'Encryption failed'
      });
      onSetStatus('AES Encryption failed', 'error');
    }
  };

  const handleDecrypt = () => {
    setError('');
    if (!inputText) {
      setError('Please input ciphertext to decrypt.');
      onSetStatus('AES Decryption error: empty input', 'error');
      return;
    }
    if (!key) {
      setError('Key is required for decryption.');
      onSetStatus('AES Decryption error: missing key', 'error');
      return;
    }

    const t0 = performance.now();
    try {
      onSetStatus('Decrypting cipher text using AES-256-CBC...', 'info');
      const decrypted = decryptAES(inputText, key);
      setOutputText(decrypted);

      const t1 = performance.now();
      const duration = `${(t1 - t0).toFixed(2)} ms`;

      onAddLog({
        algorithm: 'AES-256-CBC',
        operation: 'Decryption',
        status: 'Success',
        detail: `Decrypted cipher text (${inputText.length} chars)`,
        executionTime: duration
      });
      onUpdateStats('decrypt');
      onSetStatus('Cipher text decrypted successfully', 'success');
    } catch (err: any) {
      setError(err.message || 'Decryption failed. Please check key integrity.');
      onAddLog({
        algorithm: 'AES-256-CBC',
        operation: 'Decryption',
        status: 'Error',
        detail: err.message || 'Decryption failed'
      });
      onSetStatus('AES Decryption failed: corrupted parameters', 'error');
    }
  };

  const handleCopyToClipboard = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 2000);
    onSetStatus('Result copied to clipboard', 'success');
  };

  const handleCopyKey = () => {
    if (!key) return;
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
    onSetStatus('Secret key copied to clipboard', 'success');
  };

  const handleExport = (format: 'txt' | 'json' | 'csv') => {
    if (!outputText) return;
    let dataStr = '';
    let mimeType = 'text/plain';
    let ext = 'txt';

    if (format === 'txt') {
      dataStr = outputText;
    } else if (format === 'json') {
      dataStr = JSON.stringify({
        algorithm: 'AES-256-CBC',
        inputText: inputText,
        outputText: outputText,
        key: key,
        timestamp: new Date().toISOString()
      }, null, 2);
      mimeType = 'application/json';
      ext = 'json';
    } else if (format === 'csv') {
      const headers = ['Algorithm', 'Operation', 'Key', 'Input', 'Output', 'Timestamp'];
      const row = [
        'AES-256-CBC',
        outputText.startsWith('U2FsdGVk') ? 'Encryption' : 'Decryption',
        key,
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
    link.download = `aes-output-${Date.now()}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
    onSetStatus(`Output saved as ${ext.toUpperCase()} to local disk`, 'success');
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError('');
    onSetStatus('Cleared all input fields and results', 'info');
  };

  return (
    <div className="space-y-6 font-sans text-slate-100 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <KeyRound className="w-6 h-6 text-blue-400" />
          AES-256-CBC Cryptosystem
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Input Configuration Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-5 space-y-4 backdrop-blur-md shadow-md relative overflow-hidden">
            <h3 className="text-sm font-bold tracking-wide uppercase font-mono text-slate-400 border-b border-slate-800 pb-2">
              Cryptokeys
            </h3>

            {/* Secret Key Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>SECRET KEY (256-BIT)</span>
                <span className="text-[10px] text-slate-500">32-CHARS OR HEX</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Enter or generate secret key"
                  className="w-full bg-slate-950/70 border border-slate-800/80 rounded-xl pl-3 pr-10 py-2.5 text-xs font-mono focus:outline-none focus:border-blue-500/50 text-slate-200 placeholder-slate-600 transition-colors"
                />
                {key && (
                  <button
                    onClick={handleCopyKey}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                    title="Copy secret key"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>

            {/* Key Gen Button */}
            <button
              onClick={handleGenerateKey}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-950/80 border border-blue-500/30 text-blue-400 hover:bg-blue-950/30 font-medium text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              GENERATE SECRET KEY
            </button>
          </div>
        </div>

        {/* Right Operations Workspace Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Encryption Workspace Card */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-md shadow-md space-y-4 relative overflow-hidden">
            
            {/* Input Data Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">INPUT DATA WORKSPACE</span>
                <span className="text-[10px] text-slate-500 font-mono">{inputText.length} characters</span>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter plaintext to encrypt, or ciphertext/base64 to decrypt..."
                rows={5}
                className="w-full bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 text-xs font-mono focus:outline-none focus:border-blue-500/50 text-slate-100 placeholder-slate-700 transition-all resize-y"
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
                className="flex-1 min-w-[140px] py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-md hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] cursor-pointer"
              >
                ENCRYPT AES-256
              </button>
              <button
                onClick={handleDecrypt}
                className="flex-1 min-w-[140px] py-3 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-md hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] cursor-pointer"
              >
                DECRYPT AES-256
              </button>
              <button
                onClick={handleClear}
                className="py-3 px-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
                title="Clear inputs"
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
                    onClick={handleCopyToClipboard}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-100 text-xs font-mono transition-colors cursor-pointer"
                  >
                    {copiedResult ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedResult ? 'COPIED!' : 'COPY RESULT'}
                  </button>

                  <div className="inline-flex rounded-lg bg-slate-950 border border-slate-800 p-0.5">
                    <span className="flex items-center gap-1 px-2 text-[10px] font-mono text-slate-500">EXPORT:</span>
                    <button
                      onClick={() => handleExport('txt')}
                      className="py-1 px-2.5 rounded text-slate-400 hover:text-white text-[10px] font-mono hover:bg-slate-900 cursor-pointer"
                    >
                      TXT
                    </button>
                    <button
                      onClick={() => handleExport('json')}
                      className="py-1 px-2.5 rounded text-slate-400 hover:text-white text-[10px] font-mono hover:bg-slate-900 cursor-pointer"
                    >
                      JSON
                    </button>
                    <button
                      onClick={() => handleExport('csv')}
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
