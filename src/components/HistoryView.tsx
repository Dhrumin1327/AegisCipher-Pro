import { useState } from 'react';
import { History, Search, Filter, Trash2, Download, ShieldCheck, AlertCircle } from 'lucide-react';
import { LogItem } from '../types';

interface HistoryViewProps {
  logs: LogItem[];
  onDeleteLog: (id: string) => void;
  onClearLogs: () => void;
  onSetStatus: (text: string, type: 'info' | 'success' | 'error' | 'warning') => void;
}

export default function HistoryView({ logs, onDeleteLog, onClearLogs, onSetStatus }: HistoryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAlgo, setFilterAlgo] = useState<string>('ALL');

  // Find unique algorithms for filter dropdown
  const uniqueAlgos = ['ALL', ...Array.from(new Set(logs.map(log => log.algorithm)))];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.operation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.algorithm.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAlgo = filterAlgo === 'ALL' || log.algorithm === filterAlgo;

    return matchesSearch && matchesAlgo;
  });

  const handleExportJSON = () => {
    if (logs.length === 0) return;
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `security-audit-history-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    onSetStatus('Security audit logs exported successfully', 'success');
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to delete all security transaction history? This action is irreversible.")) {
      onClearLogs();
      onSetStatus('Cleared all security transaction logs', 'warning');
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-400" />
            Security Audit Trail
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Tamper-evident real-time record of cryptographic keys, symmetric ciphers, and verification digests.
          </p>
        </div>

        {/* Action Buttons */}
        {logs.length > 0 && (
          <div className="flex gap-3">
            <button
              onClick={handleExportJSON}
              className="py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> EXPORT AUDIT LOG
            </button>
            <button
              onClick={handleClearAll}
              className="py-2.5 px-4 rounded-xl bg-rose-950/30 border border-rose-900/40 hover:bg-rose-950/50 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> PURGE AUDIT
            </button>
          </div>
        )}
      </div>

      {/* Main Container */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-md shadow-md space-y-4">
        
        {/* Search and Filters bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by operation or details..."
              className="w-full bg-slate-950/70 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500/50 text-slate-200 placeholder-slate-600 transition-colors"
            />
          </div>

          {/* Algorithm Filter */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-400 font-mono">FILTER BY ENGINE:</span>
            <select
              value={filterAlgo}
              onChange={(e) => setFilterAlgo(e.target.value)}
              className="bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-indigo-500/50 text-slate-300 transition-colors cursor-pointer"
            >
              {uniqueAlgos.map(algo => (
                <option key={algo} value={algo}>{algo}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Audit Table */}
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShieldCheck className="w-12 h-12 text-slate-700 stroke-[1.2] mb-3" />
            <p className="text-sm font-semibold text-slate-400">No Operations Recorded</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Perform an AES/DES encryption, RSA key generation, or Hash calculations to populate the audit record.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-950 bg-slate-950/20">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-900 text-slate-500 font-mono uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">TIMESTAMP</th>
                  <th className="py-3 px-4">ALGORITHM</th>
                  <th className="py-3 px-4">OPERATION</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">USER ACTION AUDIT</th>
                  <th className="py-3 px-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 font-mono text-slate-300">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/20 transition-colors">
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-200">
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-900 border border-slate-800">
                        {log.algorithm}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-100">{log.operation}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {log.status === 'Success' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 px-2 py-0.5 rounded-full font-bold uppercase">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 bg-rose-950/30 border border-rose-900/40 px-2 py-0.5 rounded-full font-bold uppercase">
                          <span className="w-1.5 h-1.5 bg-rose-400 rounded-full" /> Error
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-sans max-w-xs truncate" title={log.detail}>
                      {log.detail}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onDeleteLog(log.id)}
                        className="p-1.5 rounded-lg bg-slate-950 border border-slate-900 hover:border-rose-900/60 hover:text-rose-400 transition-all text-slate-500 cursor-pointer"
                        title="Delete log item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
