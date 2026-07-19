import { Info, ShieldCheck, Terminal, Heart, Code, Cpu, Linkedin, Github, Mail } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="space-y-6 font-sans text-slate-100 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Info className="w-6 h-6 text-blue-400" />
          About Cryptographic Console
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Technical specifications, environmental telemetry, and compliance metrics of AegisCipher Pro.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Mission Description */}
        <div className="md:col-span-7 bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-md shadow-md space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold font-mono text-blue-400 tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4 text-blue-400" /> FIPS-COMPLIANT DESIGN
          </div>
          <h2 className="text-lg font-bold text-white">AegisCipher Pro</h2>
          
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            AegisCipher Pro is a state-of-the-art enterprise-grade cryptographic console tailored for digital compliance, security audits, and secure text protection. This application is designed to function entirely offline, ensuring that highly sensitive plaintexts and master passphrases are never broadcasted to outer telemetry networks.
          </p>
          
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            By leveraging strict client-side sandboxing, the platform handles block division, PKCS7 padding alignment, and RSA modular exponentiations locally inside the local execution context. No central database is utilized, making AegisCipher Pro completely immune to server-side breaches or data leaks.
          </p>

          <div className="border-t border-slate-900 pt-4 space-y-2 text-xs">
            <span className="font-bold text-slate-300 font-mono text-[10px] uppercase tracking-wider block">Core Cryptographic Features</span>
            <div className="grid grid-cols-2 gap-3 text-slate-400 font-sans text-xs">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>AES-256 CBC Mode</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <span>RSA-2048 OAEP Keypairs</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>DES CBC Legacy Mode</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>MD5, SHA-1, SHA-2 Hash Digests</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Specifications list */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Developer Credentials Card */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.15)] relative overflow-hidden space-y-4">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-full blur-xl pointer-events-none" />
            
            <h3 className="text-xs font-bold tracking-wider uppercase font-mono text-blue-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Developer Credentials
            </h3>

            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 p-0.5 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-mono text-base font-bold text-blue-400">
                    DP
                  </div>
                </div>
                <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse" />
              </div>
              <div className="min-w-0">
                <h4 className="text-base font-bold text-white tracking-tight truncate">Dhrumin Patel</h4>
                <p className="text-xs font-mono text-slate-400 mt-0.5 font-medium truncate">Cyber Security & Forensic Science</p>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-[10px] font-mono text-emerald-400 font-bold mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ACTIVE CONSOLE
                </span>
              </div>
            </div>

            <div className="h-px bg-slate-800/60 my-2" />

            <div className="space-y-2">
              {/* LinkedIn Button */}
              <a 
                href="https://www.linkedin.com/in/dhrumin-patel-0412792a5/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-blue-500/50 hover:bg-slate-900/40 text-slate-300 hover:text-white transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(59,130,246,0.15)]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-950/40 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-900/30 transition-all">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">LinkedIn</div>
                    <div className="text-xs font-sans font-medium">Dhrumin Patel</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-blue-400 group-hover:translate-x-0.5 transition-transform">PROFILE ↗</span>
              </a>

              {/* GitHub Button */}
              <a 
                href="https://github.com/Dhrumin1327" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-blue-500/50 hover:bg-slate-900/40 text-slate-300 hover:text-white transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(59,130,246,0.15)]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:border-slate-700 transition-all">
                    <Github className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">GitHub</div>
                    <div className="text-xs font-sans font-medium">Dhrumin1327</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-blue-400 group-hover:translate-x-0.5 transition-transform">REPOSITORY ↗</span>
              </a>

              {/* Email Button */}
              <a 
                href="mailto:pdhrumin695@gmail.com?subject=AegisCipher%20Pro%20Support%20Request&body=Hello%20Dhrumin%2C%0A%0AI%20need%20assistance%20regarding%20AegisCipher%20Pro.%0A%0AThank%20you."
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-blue-500/50 hover:bg-slate-900/40 text-slate-300 hover:text-white transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(59,130,246,0.15)]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-950/40 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:bg-teal-900/30 transition-all">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Email</div>
                    <div className="text-xs font-sans font-medium">pdhrumin695@gmail.com</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-teal-400 group-hover:translate-x-0.5 transition-transform">SEND EMAIL ↗</span>
              </a>
            </div>
          </div>

          {/* Tech Specs */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-5 backdrop-blur-md shadow-md space-y-3.5 font-mono text-xs">
            <h3 className="text-sm font-bold tracking-wide uppercase text-slate-400 border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-teal-400" />
              Technical Telemetry
            </h3>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">APPLICATION STATUS</span>
              <span className="text-teal-400 font-bold">OPTIMAL</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">VERSION</span>
              <span className="text-slate-300">v1.0-Enterprise</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">CLIENT RUNTIME</span>
              <span className="text-slate-300">Vite / React 19</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">PYTHON REQ ENVIRONMENT</span>
              <span className="text-slate-300">Python 3.12 / Flask</span>
            </div>
            <div className="flex items-center justify-between font-sans">
              <span className="font-mono text-slate-500 text-xs">DEPENDENCY LIBRARIES</span>
              <span className="text-[10px] text-slate-400 text-right font-mono">Crypto-JS, Web Crypto API</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">DEVELOPER</span>
              <span className="text-slate-300 font-sans">Dhrumin Patel</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">ROLE</span>
              <span className="text-slate-300 font-sans text-right text-[11px]">Cyber Security & Forensic Science</span>
            </div>
          </div>

          {/* Credits Box */}
          <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-4 text-xs flex items-center gap-3 text-slate-400">
            <div className="p-2.5 bg-blue-950/40 border border-blue-500/20 rounded-xl text-blue-400">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <p className="font-sans leading-relaxed">
                Authored under secure architectural standards. Built with <Heart className="w-3 h-3 text-rose-500 inline fill-rose-500" /> for elite cyber defense analysts worldwide.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
