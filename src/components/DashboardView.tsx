import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Cpu, Key, Activity, Clock, Calendar, ArrowRight, Zap, RefreshCw, KeyRound, ShieldAlert, Binary, Fingerprint } from 'lucide-react';
import { LogItem, AppStats, ActiveView } from '../types';

interface DashboardViewProps {
  stats: AppStats;
  recentLogs: LogItem[];
  onNavigate: (view: ActiveView) => void;
}

export default function DashboardView({ stats, recentLogs, onNavigate }: DashboardViewProps) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }));
      setDateStr(now.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalOps = stats.totalEncryptions + stats.totalDecryptions + stats.totalHashes + stats.totalKeyGens;

  return (
    <div className="space-y-8 pb-12 font-sans text-slate-100">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            System Console Overview
          </h1>
          <p className="text-sm text-slate-400">
            Real-time status, cryptographic counters, and recent system operations.
          </p>
        </div>
        
        {/* Live Clock Card */}
        <div className="flex items-center gap-4 bg-slate-900/60 border border-slate-800/80 px-4 py-2.5 rounded-xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-slate-400 border-r border-slate-800 pr-3.5">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="font-mono">{dateStr}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Clock className="w-4 h-4 text-teal-400" />
            <span className="font-mono text-teal-400 tracking-wider">{timeStr}</span>
          </div>
        </div>
      </div>

      {/* Security Operations & Status Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Encryptions */}
        <div className="relative overflow-hidden bg-slate-900/40 border border-slate-900 rounded-2xl p-5 hover:border-blue-500/30 transition-all duration-300 group shadow-md backdrop-blur-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-mono tracking-wider uppercase block">Encryptions</span>
              <span className="text-3xl font-extrabold text-white mt-1.5 block font-sans">{stats.totalEncryptions}</span>
            </div>
            <div className="p-3 bg-blue-950/40 border border-blue-500/20 rounded-xl text-blue-400 group-hover:bg-blue-900/20 transition-all">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Symmetric & Asymmetric</span>
          </div>
        </div>

        {/* Total Decryptions */}
        <div className="relative overflow-hidden bg-slate-900/40 border border-slate-900 rounded-2xl p-5 hover:border-teal-500/30 transition-all duration-300 group shadow-md backdrop-blur-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-mono tracking-wider uppercase block">Decryptions</span>
              <span className="text-3xl font-extrabold text-white mt-1.5 block font-sans">{stats.totalDecryptions}</span>
            </div>
            <div className="p-3 bg-teal-950/40 border border-teal-500/20 rounded-xl text-teal-400 group-hover:bg-teal-900/20 transition-all">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            <span>Successfully Verified</span>
          </div>
        </div>

        {/* Total Hashes */}
        <div className="relative overflow-hidden bg-slate-900/40 border border-slate-900 rounded-2xl p-5 hover:border-indigo-500/30 transition-all duration-300 group shadow-md backdrop-blur-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-mono tracking-wider uppercase block">Hashes Generated</span>
              <span className="text-3xl font-extrabold text-white mt-1.5 block font-sans">{stats.totalHashes}</span>
            </div>
            <div className="p-3 bg-indigo-950/40 border border-indigo-500/20 rounded-xl text-indigo-400 group-hover:bg-indigo-900/20 transition-all">
              <Fingerprint className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span>MD5, SHA1 & SHA2</span>
          </div>
        </div>

        {/* Keys Generated */}
        <div className="relative overflow-hidden bg-slate-900/40 border border-slate-900 rounded-2xl p-5 hover:border-amber-500/30 transition-all duration-300 group shadow-md backdrop-blur-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-mono tracking-wider uppercase block">Secure Keys</span>
              <span className="text-3xl font-extrabold text-white mt-1.5 block font-sans">{stats.totalKeyGens}</span>
            </div>
            <div className="p-3 bg-amber-950/40 border border-amber-500/20 rounded-xl text-amber-400 group-hover:bg-amber-900/20 transition-all">
              <Key className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>AES, DES, RSA Cryptokeys</span>
          </div>
        </div>

      </div>

      {/* Main Panel layout: Cryptographic Engine Performance & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Cryptographic Engine Health & Status */}
        <div className="lg:col-span-7 bg-slate-900/25 border border-slate-900/60 rounded-2xl p-6 shadow-lg backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-teal-400" />
                <h3 className="font-semibold text-white">Security Intelligence Status</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-950/50 text-teal-400 border border-teal-500/20 flex items-center gap-1 animate-pulse">
                <span className="w-1 h-1 bg-teal-400 rounded-full" /> SECURE
              </span>
            </div>

            {/* Diagnostic Fields */}
            <div className="grid grid-cols-2 gap-4 my-4 font-mono">
              <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-3">
                <span className="text-[10px] text-slate-500 uppercase tracking-wide block">Application Environment</span>
                <span className="text-sm font-semibold text-slate-300 mt-1 block">Live Sandbox Container</span>
              </div>
              <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-3">
                <span className="text-[10px] text-slate-500 uppercase tracking-wide block">Engine Encryption Standard</span>
                <span className="text-sm font-semibold text-blue-400 mt-1 block">FIPS-Compliant Cryptography</span>
              </div>
              <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-3">
                <span className="text-[10px] text-slate-500 uppercase tracking-wide block">Symmetric Core Modulus</span>
                <span className="text-sm font-semibold text-indigo-400 mt-1 block">AES-256-CBC Enabled</span>
              </div>
              <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-3">
                <span className="text-[10px] text-slate-500 uppercase tracking-wide block">Last Logged Action</span>
                <span className="text-xs text-slate-300 truncate mt-1 block max-w-[200px]" title={stats.lastActivity}>
                  {stats.lastActivity}
                </span>
              </div>
            </div>

            {/* Simulated Live Load Graph (High Quality SVG) */}
            <div className="mt-4 p-4 rounded-xl border border-slate-900 bg-slate-950/30">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-3">
                <span>LOCAL ENCRYPTION THROUGHPUT</span>
                <span className="flex items-center gap-1 text-teal-400 text-[10px]">
                  <Zap className="w-3.5 h-3.5 text-teal-400 animate-pulse" /> 100% SECURE CLIENT-SIDE
                </span>
              </div>
              <div className="relative h-20 w-full">
                <svg className="w-full h-full text-blue-500" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 15 Q 10 5, 20 12 T 40 8 T 60 14 T 80 6 T 100 10 L 100 20 L 0 20 Z"
                    fill="url(#gradient)"
                  />
                  <path
                    d="M0 15 Q 10 5, 20 12 T 40 8 T 60 14 T 80 6 T 100 10"
                    fill="none"
                    stroke="#14b8a6"
                    strokeWidth="0.8"
                    strokeDasharray="100"
                    strokeDashoffset="0"
                    className="animate-[dash_5s_linear_infinite]"
                  />
                </svg>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-600 mt-2">
                <span>0 SEC AGO</span>
                <span>30 SEC AGO</span>
                <span>60 SEC AGO</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-900/60 flex items-center justify-between">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Session Log operations: <b>{totalOps} transactions</b></span>
            </div>
            <div className="text-xs text-blue-400 font-medium flex items-center gap-1.5 font-mono uppercase tracking-wider">
              <span>Logs Active in Side Panel</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Audit log */}
        <div className="lg:col-span-5 bg-slate-900/25 border border-slate-900/60 rounded-2xl p-6 shadow-lg backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-4">
              <h3 className="font-semibold text-white">Recent Security Audit Logs</h3>
              <span className="text-[10px] font-mono text-slate-500">LAST 5 OPERATIONS</span>
            </div>

            {recentLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center font-sans">
                <ShieldCheck className="w-10 h-10 text-slate-700 stroke-[1.25] mb-2" />
                <p className="text-xs text-slate-500">No operations logged in current session.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentLogs.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-900 text-xs font-mono"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                          log.status === 'Success' 
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40' 
                            : 'bg-rose-950/40 text-rose-400 border border-rose-800/40'
                        }`}>
                          {log.algorithm}
                        </span>
                        <span className="text-slate-300 font-semibold">{log.operation}</span>
                      </div>
                      <p className="text-slate-400 font-sans text-xs truncate max-w-[200px]" title={log.detail}>
                        {log.detail}
                      </p>
                    </div>
                    <div className="text-right text-[10px] text-slate-500">
                      <span>{log.timestamp.split(' ')[1]}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {recentLogs.length > 5 && (
            <div className="mt-4 text-center">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                Console buffer streaming <span className="text-teal-400 font-bold">{recentLogs.length} active logs</span> to sidebar
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Cryptographic Module Navigation Grid */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 font-mono">
          Cryptographic Modules
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* AES Card */}
          <button
            onClick={() => onNavigate('aes')}
            className="flex flex-col text-left p-5 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-blue-500/30 hover:bg-slate-900/60 transition-all duration-300 group cursor-pointer backdrop-blur-md"
          >
            <div className="p-3 bg-blue-950/40 border border-blue-500/20 rounded-xl text-blue-400 group-hover:bg-blue-950/60 transition-colors mb-4">
              <KeyRound className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">AES Encryption</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">
              Advanced standard block cipher. Supports 256-bit secure key generation and CBC verification.
            </p>
          </button>

          {/* DES Card */}
          <button
            onClick={() => onNavigate('des')}
            className="flex flex-col text-left p-5 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-teal-500/30 hover:bg-slate-900/60 transition-all duration-300 group cursor-pointer backdrop-blur-md"
          >
            <div className="p-3 bg-teal-950/40 border border-teal-500/20 rounded-xl text-teal-400 group-hover:bg-teal-950/60 transition-colors mb-4">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-white group-hover:text-teal-400 transition-colors">DES Legacy Mode</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">
              Legacy symmetric standard. Ideal for educational analysis and testing outdated cryptosystems.
            </p>
          </button>

          {/* RSA Card */}
          <button
            onClick={() => onNavigate('rsa')}
            className="flex flex-col text-left p-5 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-indigo-500/30 hover:bg-slate-900/60 transition-all duration-300 group cursor-pointer backdrop-blur-md"
          >
            <div className="p-3 bg-indigo-950/40 border border-indigo-500/20 rounded-xl text-indigo-400 group-hover:bg-indigo-950/60 transition-colors mb-4">
              <Binary className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">RSA Asymmetric</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">
              Public/Private key pair system. Generates FIPS compliant 2048-bit keypairs natively.
            </p>
          </button>

          {/* Hash Card */}
          <button
            onClick={() => onNavigate('hash')}
            className="flex flex-col text-left p-5 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-amber-500/30 hover:bg-slate-900/60 transition-all duration-300 group cursor-pointer backdrop-blur-md"
          >
            <div className="p-3 bg-amber-950/40 border border-amber-500/20 rounded-xl text-amber-400 group-hover:bg-amber-950/60 transition-colors mb-4">
              <Fingerprint className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-white group-hover:text-amber-400 transition-colors">Hash Generator</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">
              Cryptographic integrity tool. Secure generation of MD5, SHA-1, SHA-256 and SHA-512 hashes.
            </p>
          </button>

        </div>
      </div>
    </div>
  );
}
