import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Terminal, Radio } from 'lucide-react';

interface WelcomeViewProps {
  onEnter: () => void;
  systemTime: string;
}

export default function WelcomeView({ onEnter, systemTime }: WelcomeViewProps) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }));
      setDateStr(now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="min-h-screen flex flex-col justify-between p-8 bg-slate-950 text-slate-100 relative overflow-hidden select-none"
    >
      {/* Embedded High-Performance CSS Animations */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes slow-pan {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 15px rgba(59,130,246,0.25)); }
          50% { filter: drop-shadow(0 0 30px rgba(59,130,246,0.5)); }
        }
        @keyframes particle-drift-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
          50% { transform: translate(30px, -40px) scale(1.15); opacity: 0.35; }
        }
        @keyframes particle-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.12; }
          50% { transform: translate(-45px, 35px) scale(0.9); opacity: 0.28; }
        }
        @keyframes wave-flow {
          0% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
          50% { transform: translate(-47%, -48%) rotate(180deg) scale(1.08); }
          100% { transform: translate(-50%, -50%) rotate(360deg) scale(1); }
        }
      `}</style>

      {/* Dynamic Background Grid and Ambient Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/15 via-slate-950 to-slate-950 z-0" />
      <div 
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" 
        style={{ transformOrigin: 'center', animation: 'wave-flow 25s linear infinite' }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-500/8 rounded-full blur-[100px] pointer-events-none" 
        style={{ transformOrigin: 'center', animation: 'wave-flow 20s linear infinite', animationDirection: 'reverse' }}
      />
      
      {/* Animated Grid Overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 z-0 pointer-events-none"
        style={{ animation: 'slow-pan 45s linear infinite' }}
      />

      {/* Subtle Cyber Scan Lines */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(59,130,246,0.01),rgba(20,184,166,0.005),rgba(59,130,246,0.01))] bg-[size:100%_4px,3px_100%] opacity-15 z-0" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-10">
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" style={{ animation: 'scanline 8s linear infinite' }} />
      </div>

      {/* Slow-moving Glowing Particles */}
      <div className="absolute top-1/4 left-1/3 w-2.5 h-2.5 rounded-full bg-blue-500/20 blur-[1px] pointer-events-none" style={{ animation: 'particle-drift-1 14s ease-in-out infinite' }} />
      <div className="absolute top-2/3 right-1/4 w-3.5 h-3.5 rounded-full bg-teal-500/15 blur-[2px] pointer-events-none" style={{ animation: 'particle-drift-2 18s ease-in-out infinite' }} />
      <div className="absolute bottom-1/3 left-1/4 w-2 h-2 rounded-full bg-indigo-500/30 blur-[1px] pointer-events-none" style={{ animation: 'particle-drift-1 16s ease-in-out infinite', animationDelay: '2s' }} />

      {/* Top Bar Status */}
      <div className="w-full flex justify-between items-center text-xs text-slate-500 font-mono z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
          <span>SECURE PROTOCOL ACTIVE</span>
        </div>
        <div className="flex items-center gap-4">
          <span>HOST: 127.0.0.1:3000</span>
          <span>SSL: AES-256-GCM</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center text-center z-10 max-w-4xl mx-auto my-auto py-12">
        {/* Animated Cyber Shield & Lock Icon */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative mb-8"
        >
          {/* Cybernetic outer rings */}
          <div className="absolute -inset-6 rounded-full border border-blue-500/20 animate-spin" style={{ animationDuration: '25s' }} />
          <div className="absolute -inset-12 rounded-full border border-dashed border-teal-500/15 animate-spin" style={{ animationDuration: '45s', animationDirection: 'reverse' }} />
          
          {/* Inner Glowing Core with Float & Pulse animations */}
          <div 
            className="relative flex items-center justify-center w-36 h-36 rounded-full bg-gradient-to-br from-slate-900 to-slate-950 border border-blue-500/40"
            style={{ animation: 'float 6s ease-in-out infinite, pulse-glow 4s ease-in-out infinite' }}
          >
            <Shield className="w-16 h-16 text-blue-400 stroke-[1.5]" />
            <Lock className="w-6 h-6 text-teal-400 absolute stroke-[2]" />
          </div>
        </motion.div>

        {/* Suite Typography */}
        <div className="space-y-4">
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-xs text-blue-400 font-mono tracking-widest uppercase mb-2"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-teal-400" /> Enterprise Cryptography System
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent font-sans drop-shadow-[0_0_12px_rgba(59,130,246,0.25)]"
          >
            AegisCipher Pro
          </motion.h1>
          
          <motion.p 
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed font-sans"
          >
            A premium cyber-defense solution supporting advanced multi-tier military symmetric AES-256, legacy DES, asymmetric RSA-2048, and cryptographic hash verification.
          </motion.p>
        </div>

        {/* Enter Suite Button */}
        <div className="mt-10">
          <motion.button
            onClick={onEnter}
            id="welcome-enter-btn"
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(20,184,166,0.6)", borderColor: "rgba(20,184,166,0.5)" }}
            whileTap={{ scale: 0.98 }}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              y: { delay: 0.7, duration: 0.8 },
              opacity: { delay: 0.7, duration: 0.8 },
              scale: { duration: 0.2 },
              boxShadow: { duration: 0.2 }
            }}
            className="group relative inline-flex items-center justify-center px-10 py-4 font-semibold text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-blue-500/20 cursor-pointer"
          >
            <span className="flex items-center gap-3 font-mono tracking-wider">
              ENTER APPLICATION
              <Terminal className="w-5 h-5 text-teal-200 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
        </div>
      </div>

      {/* Bottom Information Bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="w-full flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500 pt-6 border-t border-slate-900 z-10"
      >
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-center md:text-left">
          <div>
            <span className="text-slate-600 block uppercase tracking-wider text-[10px]">Current System Date</span>
            <span className="text-slate-300">{dateStr || 'Loading...'}</span>
          </div>
          <div>
            <span className="text-slate-600 block uppercase tracking-wider text-[10px]">Real-time Cryptoclock</span>
            <span className="text-teal-400 text-sm font-semibold">{timeStr || 'Loading...'}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-center md:text-right">
          <div>
            <span className="text-slate-600 block uppercase tracking-wider text-[10px]">System Version</span>
            <span className="text-slate-300">v1.0-Enterprise</span>
          </div>
          <div>
            <span className="text-slate-600 block uppercase tracking-wider text-[10px]">Senior Lead Architect</span>
            <span className="text-slate-300 font-sans">Senior Cybersecurity Software Engineer</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
