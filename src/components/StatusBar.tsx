import { Info, CheckCircle2, AlertTriangle, Play } from 'lucide-react';

interface StatusBarProps {
  statusText: string;
  statusType: 'info' | 'success' | 'error' | 'warning';
}

export default function StatusBar({ statusText, statusType }: StatusBarProps) {
  const getStatusStyles = () => {
    switch (statusType) {
      case 'success':
        return {
          bg: 'bg-emerald-950/40 border-emerald-900/60 text-emerald-400',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        };
      case 'error':
        return {
          bg: 'bg-rose-950/40 border-rose-900/60 text-rose-400',
          icon: <AlertTriangle className="w-4 h-4 text-rose-400" />
        };
      case 'warning':
        return {
          bg: 'bg-amber-950/40 border-amber-900/60 text-amber-400',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />
        };
      case 'info':
      default:
        return {
          bg: 'bg-slate-900/50 border-slate-800 text-slate-400',
          icon: <Info className="w-4 h-4 text-blue-400 animate-pulse" />
        };
    }
  };

  const { bg, icon } = getStatusStyles();

  return (
    <div className={`fixed bottom-0 left-0 lg:left-64 right-0 h-10 px-6 border-t ${bg} flex items-center justify-between text-xs font-mono backdrop-blur-md z-30 transition-all duration-300`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-semibold tracking-wide uppercase">SYSTEM STATUS:</span>
        <span className="text-slate-200">{statusText}</span>
      </div>
      <div className="hidden sm:flex items-center gap-4 text-slate-500">
        <div className="flex items-center gap-1.5">
          <Play className="w-3.5 h-3.5 fill-teal-400 text-teal-400" />
          <span>CRYPT-ENGINE: ONLINE</span>
        </div>
        <div className="h-3 w-px bg-slate-800" />
        <span>V4.2.0-PRO</span>
      </div>
    </div>
  );
}
