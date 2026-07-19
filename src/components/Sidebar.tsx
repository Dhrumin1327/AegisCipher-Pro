import { ShieldCheck, LayoutDashboard, KeyRound, ShieldAlert, Binary, Fingerprint, Info, Settings, Menu, X, Linkedin, Github, Mail } from 'lucide-react';
import { ActiveView } from '../types';

interface SidebarProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ activeView, onViewChange, isOpen, setIsOpen }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as ActiveView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'aes' as ActiveView, label: 'AES Encryption', icon: KeyRound },
    { id: 'des' as ActiveView, label: 'DES Legacy', icon: ShieldAlert },
    { id: 'rsa' as ActiveView, label: 'RSA Asymmetric', icon: Binary },
    { id: 'hash' as ActiveView, label: 'Hash Generator', icon: Fingerprint },
    { id: 'about' as ActiveView, label: 'About System', icon: Info },
    { id: 'settings' as ActiveView, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-100 hover:bg-slate-800/80 transition-colors backdrop-blur-md"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-all duration-350 ease-in-out flex flex-col justify-between bg-sidebar-custom border-r border-slate-900/60 backdrop-blur-xl h-full`}
      >
        {/* Sidebar Header Branding */}
        <div className="p-5 border-b border-slate-900/60 bg-slate-950/30 backdrop-blur-md relative overflow-hidden shrink-0">
          {/* Subtle blue glow */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 opacity-25 blur-sm" />
              <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-slate-950 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                <ShieldCheck className="w-5.5 h-5.5 text-blue-400 stroke-[1.5]" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-black tracking-wider text-slate-100 font-sans">AegisCipher Pro</h2>
                <span className="text-[8px] px-1 rounded bg-blue-950/40 text-blue-400 border border-blue-900/40 font-mono font-bold">V1.0</span>
              </div>
              <p className="text-[9px] text-slate-500 font-mono tracking-tight uppercase">
                Enterprise Cryptography Platform
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-900/25 border-l-2 border-blue-500 text-blue-400 shadow-[inset_0_0_12px_rgba(59,130,246,0.08)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border-l-2 border-transparent'
                }`}
              >
                <IconComponent className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                }`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Developer Profile Card */}
        <div className="px-4 py-4 border-t border-slate-900/60 bg-slate-950/20">
          <div className="p-3.5 bg-slate-900/40 border border-slate-800/80 rounded-xl backdrop-blur-md shadow-glow-custom space-y-3">
            {/* Avatar & Info Row */}
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-teal-500 p-0.5 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-mono text-xs font-bold text-blue-400">
                    DP
                  </div>
                </div>
                {/* Glowing green online indicator */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-100 truncate">Dhrumin Patel</h4>
                <p className="text-[9px] font-mono text-slate-400 truncate tracking-tight uppercase">Cyber Security & Forensic</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  <span className="text-[9px] font-mono text-emerald-400 font-semibold uppercase tracking-wider">Available</span>
                </div>
              </div>
            </div>

            {/* Clickable Social Buttons */}
            <div className="flex items-center justify-around pt-2 border-t border-slate-800/40">
              {/* LinkedIn */}
              <div className="relative group">
                <a
                  href="https://www.linkedin.com/in/dhrumin-patel-0412792a5/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-950 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/50 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300 cursor-pointer"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-950 border border-slate-800 text-[9px] font-mono text-slate-200 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                  LinkedIn Profile
                </span>
              </div>

              {/* GitHub */}
              <div className="relative group">
                <a
                  href="https://github.com/Dhrumin1327"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-950 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/50 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300 cursor-pointer"
                >
                  <Github className="w-3.5 h-3.5" />
                </a>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-950 border border-slate-800 text-[9px] font-mono text-slate-200 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                  GitHub Repository
                </span>
              </div>

              {/* Email */}
              <div className="relative group">
                <a
                  href="mailto:pdhrumin695@gmail.com?subject=AegisCipher%20Pro%20Support%20Request&body=Hello%20Dhrumin%2C%0A%0AI%20need%20assistance%20regarding%20AegisCipher%20Pro.%0A%0AThank%20you."
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-950 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/50 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-950 border border-slate-800 text-[9px] font-mono text-slate-200 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                  Send Email
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
