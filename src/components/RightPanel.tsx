import { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Search, Download, Trash2, Gauge, AlertCircle, Info, ChevronDown } from 'lucide-react';
import { LogItem, ActiveView } from '../types';

interface RightPanelProps {
  activeView: ActiveView;
  logs: LogItem[];
  onClearLogs: () => void;
  currentThemeLabel: string;
}

export default function RightPanel({ activeView, logs, onClearLogs, currentThemeLabel }: RightPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top/newest of logs container on new logs without window scrolling
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = 0;
    }
  }, [logs.length]);

  // Derive dynamic security parameters based on activeView
  const getSecurityParams = () => {
    switch (activeView) {
      case 'aes':
        return {
          title: 'Advanced Encryption Standard',
          abbrev: 'AES-256-CBC',
          keyLength: '256 BITS',
          securityLevel: 'Enterprise Grade',
          levelColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',
          strengthValue: '100%',
          description: 'FIPS-approved symmetric key block cipher widely used for protecting classified information.',
        };
      case 'des':
        return {
          title: 'Data Encryption Standard',
          abbrev: 'DES-Legacy',
          keyLength: '64 BITS (56-bit effective)',
          securityLevel: 'Outdated / Legacy',
          levelColor: 'text-rose-400 bg-rose-950/40 border-rose-900/40',
          strengthValue: '25%',
          description: 'Symmetric standard now considered insecure due to small key size. Retained for forensic and backward compatibility audits.',
        };
      case 'rsa':
        return {
          title: 'Rivest-Shamir-Adleman',
          abbrev: 'RSA-2048-Asymmetric',
          keyLength: '2048 BITS',
          securityLevel: 'High Security',
          levelColor: 'text-blue-400 bg-blue-950/40 border-blue-800/40',
          strengthValue: '90%',
          description: 'FIPS-compliant public-key asymmetric algorithm used for secure key exchanges and digital signatures.',
        };
      case 'hash':
        return {
          title: 'Secure Hashing Engines',
          abbrev: 'SHA-256 / SHA-512',
          keyLength: 'Varies (128 - 512 bits)',
          securityLevel: 'Collision Resistant',
          levelColor: 'text-amber-400 bg-amber-950/40 border-amber-900/40',
          strengthValue: '95%',
          description: 'One-way mathematical digests designed to verify integrity and detect source document modification.',
        };
      case 'settings':
        return {
          title: 'Console Configurations',
          abbrev: 'SYS-CONFIG',
          keyLength: 'N/A',
          securityLevel: 'Authorized Access Only',
          levelColor: 'text-teal-400 bg-teal-950/40 border-teal-900/40',
          strengthValue: '100%',
          description: 'Manage cryptographic keys, local storage variables, theme presets, and security clear states.',
        };
      case 'about':
        return {
          title: 'About Forensic Suite',
          abbrev: 'V1.0-ENTERPRISE',
          keyLength: 'Client Sandboxed',
          securityLevel: 'FIPS Standard compliant',
          levelColor: 'text-indigo-400 bg-indigo-950/40 border-indigo-900/40',
          strengthValue: '100%',
          description: 'High performance web console designed for cryptosystem evaluations, credential hashes, and cryptographic training.',
        };
      case 'dashboard':
      default:
        return {
          title: 'Secure Multi-Cipher Core',
          abbrev: 'SYS-MONITOR',
          keyLength: 'Multiple standards active',
          securityLevel: 'Fully Shielded',
          levelColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-900/40',
          strengthValue: '100%',
          description: 'Enterprise console active. System listening on all symmetric and asymmetric modules.',
        };
    }
  };

  const params = getSecurityParams();

  // Filter logs by search query
  const filteredLogs = logs.filter((log) => {
    const query = searchQuery.toLowerCase();
    return (
      log.algorithm.toLowerCase().includes(query) ||
      log.operation.toLowerCase().includes(query) ||
      log.detail.toLowerCase().includes(query) ||
      log.status.toLowerCase().includes(query)
    );
  });

  // Export functions
  const handleExportLogs = (format: 'csv' | 'json') => {
    if (logs.length === 0) return;
    let dataStr = '';
    let mimeType = 'text/plain';
    let ext = 'txt';

    if (format === 'json') {
      dataStr = JSON.stringify(logs, null, 2);
      mimeType = 'application/json';
      ext = 'json';
    } else {
      // CSV
      const headers = ['ID', 'Timestamp', 'Algorithm', 'Operation', 'Status', 'Details', 'Execution Time'];
      const rows = logs.map(log => [
        log.id,
        log.timestamp,
        log.algorithm,
        log.operation,
        log.status,
        log.detail.replace(/"/g, '""'),
        log.executionTime || 'N/A'
      ]);
      dataStr = `${headers.join(',')}\n${rows.map(r => `"${r.join('","')}"`).join('\n')}`;
      mimeType = 'text/csv';
      ext = 'csv';
    }

    const blob = new Blob([dataStr], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `encryption-suite-audit-logs-${Date.now()}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 w-full h-full flex flex-col">
      {/* 1. Security Parameters Card */}
      <div className="bg-card-custom border border-card-custom rounded-2xl p-5 shadow-glow-custom relative overflow-hidden backdrop-blur-md transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3 mb-4">
          <Gauge className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold tracking-wider uppercase font-mono text-primary-custom">Security Parameters</h3>
        </div>

        <div className="space-y-4 font-mono text-xs">
          <div>
            <span className="text-slate-500 text-[10px] block uppercase">Active System Standard</span>
            <span className="font-bold text-white text-sm tracking-tight font-sans mt-0.5 block">{params.title}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-500 text-[9px] block uppercase">Cipher / Spec</span>
              <span className="font-semibold text-slate-300 mt-0.5 block">{params.abbrev}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[9px] block uppercase">Key Bit-Length</span>
              <span className="font-semibold text-slate-300 mt-0.5 block">{params.keyLength}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <span className="text-slate-500 text-[9px] block uppercase">Security Level</span>
              <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold mt-1 border uppercase ${params.levelColor}`}>
                {params.securityLevel}
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[9px] block uppercase">Active Console Theme</span>
              <span className="font-semibold text-teal-400 mt-1 block text-[11px] uppercase tracking-wide">{currentThemeLabel}</span>
            </div>
          </div>

          {/* Key Strength Meter */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-500 uppercase">Entropy / Strength index</span>
              <span className="text-blue-400 font-bold">{params.strengthValue}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 border border-slate-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-teal-400 rounded-full transition-all duration-500" 
                style={{ width: params.strengthValue }}
              />
            </div>
          </div>

          <p className="text-[10px] leading-relaxed text-slate-400 font-sans pt-1 border-t border-slate-900/40">
            {params.description}
          </p>
        </div>
      </div>

      {/* 2. Live Activity Logs Card */}
      <div className="flex-1 bg-card-custom border border-card-custom rounded-2xl p-5 shadow-glow-custom backdrop-blur-md flex flex-col justify-between overflow-hidden transition-all duration-300 min-h-[360px]">
        
        {/* Header & Controls Row */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <h3 className="text-xs font-bold tracking-wider uppercase font-mono text-primary-custom">Live Security Logs</h3>
            </div>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{filteredLogs.length} LOGS</span>
          </div>

          {/* Search bar inside right panel */}
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-600" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-900 rounded-lg pl-8 pr-3 py-1.5 text-[10px] font-mono text-slate-300 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>

        {/* Dynamic List Stream */}
        <div 
          ref={logsContainerRef}
          className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[400px] xl:max-h-[300px] lg:max-h-[350px] scrollbar-thin scrollbar-thumb-slate-800"
        >
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShieldCheck className="w-8 h-8 text-slate-800 stroke-[1.25] mb-2" />
              <p className="text-[10px] font-mono text-slate-600">No active audit logs match filter.</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-900 text-[10px] font-mono space-y-1 hover:bg-slate-950 transition-colors animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1 rounded-[3px] text-[8px] font-bold tracking-wide uppercase ${
                      log.status === 'Success' 
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' 
                        : 'bg-rose-950/40 text-rose-400 border border-rose-900/30'
                    }`}>
                      {log.algorithm}
                    </span>
                    <span className="text-slate-200 font-semibold uppercase">{log.operation}</span>
                  </div>
                  <span className="text-[8px] text-slate-600">{log.timestamp.split(' ')[1]}</span>
                </div>
                <p className="text-slate-400 font-sans text-[10px] leading-tight break-all">
                  {log.detail}
                </p>
                {log.executionTime && (
                  <div className="text-[8px] text-teal-400 font-bold tracking-wide text-right">
                    LATENCY: {log.executionTime}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer controls inside panel */}
        <div className="pt-3 border-t border-slate-900/60 flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleExportLogs('csv')}
              disabled={logs.length === 0}
              className="px-2 py-1 rounded bg-slate-950 border border-slate-900 hover:border-slate-800 text-[9px] font-mono text-slate-400 hover:text-white transition-all cursor-pointer disabled:opacity-40"
              title="Export CSV"
            >
              CSV
            </button>
            <button
              onClick={() => handleExportLogs('json')}
              disabled={logs.length === 0}
              className="px-2 py-1 rounded bg-slate-950 border border-slate-900 hover:border-slate-800 text-[9px] font-mono text-slate-400 hover:text-white transition-all cursor-pointer disabled:opacity-40"
              title="Export JSON"
            >
              JSON
            </button>
          </div>
          
          <button
            onClick={onClearLogs}
            disabled={logs.length === 0}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-950 border border-rose-950/50 hover:bg-rose-950/10 text-rose-400 hover:text-rose-300 text-[9px] font-mono transition-all cursor-pointer disabled:opacity-40"
          >
            <Trash2 className="w-3 h-3" />
            CLEAR
          </button>
        </div>

      </div>
    </div>
  );
}
