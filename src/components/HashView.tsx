import { useState } from 'react';
import { Fingerprint, ShieldCheck, Copy, Download, Trash2, AlertCircle, RefreshCw, Check } from 'lucide-react';
import { generateHash } from '../utils/cryptoHelpers';
import { LogItem } from '../types';

interface HashViewProps {
  onAddLog: (log: Omit<LogItem, 'id' | 'timestamp'>) => void;
  onUpdateStats: (type: 'encrypt' | 'decrypt' | 'hash' | 'keygen') => void;
  onSetStatus: (text: string, type: 'info' | 'success' | 'error' | 'warning') => void;
}

type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512';

export default function HashView({ onAddLog, onUpdateStats, onSetStatus }: HashViewProps) {
  const [inputText, setInputText] = useState('');
  const [selectedAlgo, setSelectedAlgo] = useState<HashAlgorithm>('SHA-256');
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);

  const algos: { id: HashAlgorithm; label: string; bits: number; strength: 'Low' | 'Moderate' | 'High' | 'Extremely High'; color: string }[] = [
    { id: 'SHA-256', label: 'SHA-256', bits: 256, strength: 'High', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40' },
    { id: 'SHA-512', label: 'SHA-512', bits: 512, strength: 'Extremely High', color: 'text-blue-400 bg-blue-950/40 border-blue-800/40' },
    { id: 'SHA-1', label: 'SHA-1', bits: 160, strength: 'Moderate', color: 'text-amber-400 bg-amber-950/40 border-amber-800/40' },
    { id: 'MD5', label: 'MD5', bits: 128, strength: 'Low', color: 'text-rose-400 bg-rose-950/40 border-rose-800/40' }
  ];

  const handleGenerateHash = () => {
    setError('');
    if (!inputText) {
      setError('Please input text to calculate hash.');
      onSetStatus('Hash generation error: empty input', 'error');
      return;
    }

    setIsProcessing(true);
    const t0 = performance.now();

    setTimeout(() => {
      try {
        onSetStatus(`Generating standard cryptographic ${selectedAlgo} hash...`, 'info');
        const hash = generateHash(inputText, selectedAlgo);
        setOutputText(hash);

        const t1 = performance.now();
        const duration = `${(t1 - t0).toFixed(2)} ms`;

        onAddLog({
          algorithm: selectedAlgo,
          operation: 'Hashing',
          status: 'Success',
          detail: `Calculated hash of input string (${inputText.length} chars)`,
          executionTime: duration
        });
        onUpdateStats('hash');
        onSetStatus(`${selectedAlgo} hash calculated successfully`, 'success');
      } catch (err: any) {
        setError(err.message || 'Hash generation failed');
        onAddLog({
          algorithm: selectedAlgo,
          operation: 'Hashing',
          status: 'Error',
          detail: err.message || 'Hash failed'
        });
        onSetStatus('Hash calculation failed', 'error');
      } finally {
        setIsProcessing(false);
      }
    }, 600);
  };

  const handleCopyToClipboard = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 2000);
    onSetStatus('Hash checksum copied to clipboard', 'success');
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
        algorithm: selectedAlgo,
        inputLength: inputText.length,
        outputText: outputText,
        timestamp: new Date().toISOString()
      }, null, 2);
      mimeType = 'application/json';
      ext = 'json';
    } else if (format === 'csv') {
      const headers = ['Algorithm', 'Input Length', 'Hash Digest', 'Timestamp'];
      const row = [
        selectedAlgo,
        inputText.length.toString(),
        outputText,
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
    link.download = `${selectedAlgo.toLowerCase()}-hash-${Date.now()}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
    onSetStatus(`Saved as ${ext.toUpperCase()}`, 'success');
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError('');
    onSetStatus('Cleared hashing workspace', 'info');
  };

  const currentAlgoDetails = algos.find(a => a.id === selectedAlgo);

  return (
    <div className="space-y-6 font-sans text-slate-100 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Fingerprint className="w-6 h-6 text-amber-400" />
          Cryptographic Hash Generator
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Calculate one-way cryptographic checksum digests to guarantee source document integrity and detect tampering.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Parameters Selection */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-5 space-y-4 backdrop-blur-md shadow-md">
            <h3 className="text-sm font-bold tracking-wide uppercase font-mono text-slate-400 border-b border-slate-800 pb-2">
              Select Hash Digest
            </h3>

            {/* Selector Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {algos.map((algo) => (
                <button
                  key={algo.id}
                  onClick={() => {
                    setSelectedAlgo(algo.id);
                    if (inputText) {
                      // Automatically recalculate if there's already input
                      try {
                        const hash = generateHash(inputText, algo.id);
                        setOutputText(hash);
                        onSetStatus(`${algo.id} hash calculated successfully`, 'success');
                      } catch (e) {}
                    }
                  }}
                  className={`py-3 px-3 rounded-xl border font-bold text-xs font-mono transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    selectedAlgo === algo.id
                      ? 'bg-amber-950/30 border-amber-500/50 text-amber-400 shadow-[inset_0_0_12px_rgba(245,158,11,0.15)]'
                      : 'bg-slate-950/40 border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-800'
                  }`}
                >
                  <span>{algo.id}</span>
                  <span className="text-[9px] font-normal text-slate-500">{algo.bits} bits</span>
                </button>
              ))}
            </div>

            {/* Selected Spec Info */}
            {currentAlgoDetails && (
              <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-4 space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">DIGEST LENGTH:</span>
                  <span className="text-slate-300">{currentAlgoDetails.bits} BITS</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">SECURITY RATING:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${currentAlgoDetails.color} border`}>
                    {currentAlgoDetails.strength}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Hashing Details */}
          <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-4 text-xs space-y-2 text-slate-400">
            <div className="flex items-center gap-1.5 font-bold font-mono text-amber-400 text-[10px] tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5" /> Hash Security Advisory
            </div>
            <p className="font-sans leading-relaxed">
              Hash functions are strictly one-way algorithms mapping arbitrary input payloads to fixed-length strings. SHA-256 and SHA-512 remain highly secure and collision-resistant. MD5 and SHA-1 are cryptographically cracked but are still commonly used for rapid checksum checks.
            </p>
          </div>
        </div>

        {/* Right Operations Workspace Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Hashing Workspace Card */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-md shadow-md space-y-4 relative overflow-hidden">
            
            {/* Processing Loader overlay */}
            {isProcessing && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
                <span className="font-mono text-xs text-amber-300 uppercase tracking-widest animate-pulse">
                  Calculating cryptographic {selectedAlgo} digest...
                </span>
                <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full animate-[progress_1s_ease-in-out_infinite]" style={{ width: '60%' }}></div>
                </div>
              </div>
            )}

            {/* Input Data Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">PLAIN VALUE REGION</span>
                <span className="text-[10px] text-slate-500 font-mono">{inputText.length} characters</span>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter document, token, passphrase, or plain text to calculate cryptographic digest..."
                rows={5}
                className="w-full bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 text-xs font-mono focus:outline-none focus:border-amber-500/50 text-slate-100 placeholder-slate-700 transition-all resize-y"
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
                onClick={handleGenerateHash}
                disabled={isProcessing}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-md hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer disabled:opacity-50"
              >
                GENERATE CRYPTOGRAPHIC HASH
              </button>
              <button
                onClick={handleClear}
                disabled={isProcessing}
                className="py-3 px-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-mono font-bold uppercase transition-colors cursor-pointer disabled:opacity-50"
                title="Clear input"
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
                    DIGEST CHECKSUM GENERATED SUCCESSFULLY
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{outputText.length} hex characters</span>
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
