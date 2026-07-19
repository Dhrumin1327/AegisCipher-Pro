import { useState } from 'react';
import { Settings, ShieldCheck, Sun, Moon, Trash2, RotateCcw, AlertTriangle } from 'lucide-react';

interface SettingsViewProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onClearLogs: () => void;
  onResetApp: () => void;
  onSetStatus: (text: string, type: 'info' | 'success' | 'error' | 'warning') => void;
}

export default function SettingsView({ darkMode, onToggleTheme, onClearLogs, onResetApp, onSetStatus }: SettingsViewProps) {
  const handleClear = () => {
    if (window.confirm("Purge all transaction history logs? This action is irreversible.")) {
      onClearLogs();
      onSetStatus('Purged all transaction log streams successfully', 'success');
    }
  };

  const handleReset = () => {
    if (window.confirm("RESET APPLICATION ENGINE?\n\nThis will purge all transaction history logs, reset all cryptographic operation counters, and restore default system preferences. This action is irreversible.")) {
      onResetApp();
      onSetStatus('Cryptographic engine reset to factory defaults', 'warning');
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-100 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-400" />
          Engine Configuration
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Adjust console preferences, toggle high-contrast display themes, and manage local storage persistence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Theme / Display Settings */}
        <div className="md:col-span-6 bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-md shadow-md space-y-5">
          <h3 className="text-sm font-bold tracking-wide uppercase font-mono text-slate-400 border-b border-slate-800 pb-2">
            Console Preferences
          </h3>

          {/* Theme Selector */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-900">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-200 block">Visual Interface Theme</span>
              <span className="text-[10px] text-slate-500 font-mono">TOGGLE LIGHT OR DARK INTERFACE</span>
            </div>
            <button
              onClick={() => {
                onToggleTheme();
                onSetStatus(`Toggled system theme to ${!darkMode ? 'Dark' : 'Light'} Mode`, 'info');
              }}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/30 text-blue-400 hover:text-blue-300 transition-all cursor-pointer"
              title="Toggle system theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Core Telemetry Info */}
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/30 text-xs text-blue-400/90 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold font-mono text-[10px] uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Client Sandbox Isolated
            </div>
            This application maintains all logs, states, and generated cryptographic keys exclusively inside the browser's sandbox local state. None of your data is ever uploaded to external cloud endpoints.
          </div>
        </div>

        {/* Right Column: Destructive Actions */}
        <div className="md:col-span-6 bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-md shadow-md space-y-5">
          <h3 className="text-sm font-bold tracking-wide uppercase font-mono text-slate-400 border-b border-slate-800 pb-2">
            System Maintenance
          </h3>

          <div className="space-y-4">
            
            {/* Clear Logs */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-900">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-200 block">Purge Logs Only</span>
                <span className="text-[10px] text-slate-500 font-mono">CLEARS TRANSACTION HISTORIES</span>
              </div>
              <button
                onClick={handleClear}
                className="py-1.5 px-3 rounded-xl bg-rose-950/20 border border-rose-900/30 text-rose-400 hover:bg-rose-950/40 text-xs font-semibold font-mono transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                PURGE LOGS
              </button>
            </div>

            {/* Reset App */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-900">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-200 block">Factory System Reset</span>
                <span className="text-[10px] text-slate-500 font-mono">RESETS COUNTERS & PREFERENCES</span>
              </div>
              <button
                onClick={handleReset}
                className="py-1.5 px-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-400 hover:bg-rose-950/60 text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                RESET SYSTEM
              </button>
            </div>

            {/* Warning advisory */}
            <div className="p-3 rounded-xl bg-rose-950/10 border border-rose-900/20 text-[11px] text-rose-400/80 leading-relaxed flex gap-2 font-sans">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span><b>CRITICAL SECURITY NOTICE:</b> Factory resetting the system immediately expunges all RSA keypairs, symmetric logs, and derived session identifiers. Download important keypairs first.</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
