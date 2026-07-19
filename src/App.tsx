/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import AesView from './components/AesView';
import DesView from './components/DesView';
import RsaView from './components/RsaView';
import HashView from './components/HashView';
import AboutView from './components/AboutView';
import SettingsView from './components/SettingsView';
import StatusBar from './components/StatusBar';
import RightPanel from './components/RightPanel';
import WelcomeView from './components/WelcomeView';
import { LogItem, AppStats, ActiveView } from './types';
import { ShieldCheck, ChevronDown, Check, Palette, Linkedin, Github, Mail, Activity, Clock as ClockIcon, Calendar as CalendarIcon, Lock } from 'lucide-react';

function formatCurrentTimestamp(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveViewFromPath = (path: string): ActiveView => {
    const segment = path.replace(/^\//, ''); // strip leading slash
    if (!segment || segment === 'welcome') return 'welcome';
    if (['dashboard', 'aes', 'des', 'rsa', 'hash', 'about', 'settings'].includes(segment)) {
      return segment as ActiveView;
    }
    return 'dashboard';
  };

  const activeView = getActiveViewFromPath(location.pathname);
  const setActiveView = (view: ActiveView) => {
    navigate(`/${view}`);
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<string>('cyber-blue');
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  // Live Clock States
  const [liveTime, setLiveTime] = useState('');
  const [liveDate, setLiveDate] = useState('');

  // Status Bar States
  const [statusText, setStatusText] = useState('Console Ready');
  const [statusType, setStatusType] = useState<'info' | 'success' | 'error' | 'warning'>('info');

  // Logs and Stats loaded from LocalStorage
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [stats, setStats] = useState<AppStats>({
    totalEncryptions: 0,
    totalDecryptions: 0,
    totalHashes: 0,
    totalKeyGens: 0,
    lastActivity: 'N/A'
  });

  const themes = [
    { id: 'cyber-blue', label: 'Cyber Blue', description: 'Enterprise SOC Theme', color: 'bg-blue-500' },
    { id: 'cyber-dark', label: 'Cyber Dark', description: 'Obsidian Mode', color: 'bg-emerald-500' },
    { id: 'white-professional', label: 'White Professional', description: 'Office Light Theme', color: 'bg-indigo-600' },
    { id: 'terminal', label: 'Terminal', description: 'Retro Green Monospace', color: 'bg-green-500' },
    { id: 'glass-neon', label: 'Glass Neon', description: 'Futuristic Glow Mode', color: 'bg-purple-500' },
  ];

  // Live clock interval
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString('en-US', { hour12: false }));
      setLiveDate(now.toLocaleDateString('en-US', { 
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

  // Load initial data from localStorage
  useEffect(() => {
    try {
      const storedLogs = localStorage.getItem('sec_suite_logs');
      if (storedLogs) setLogs(JSON.parse(storedLogs));

      const storedStats = localStorage.getItem('sec_suite_stats');
      if (storedStats) {
        setStats(JSON.parse(storedStats));
      }

      const storedThemeId = localStorage.getItem('sec_suite_theme_id');
      if (storedThemeId) {
        setTheme(storedThemeId);
      }
    } catch (e) {
      console.error('Failed to load storage state', e);
    }
  }, []);

  // Save changes helper
  const saveLogs = (updatedLogs: LogItem[]) => {
    setLogs(updatedLogs);
    localStorage.setItem('sec_suite_logs', JSON.stringify(updatedLogs));
  };

  const saveStats = (updatedStats: AppStats) => {
    setStats(updatedStats);
    localStorage.setItem('sec_suite_stats', JSON.stringify(updatedStats));
  };

  const handleAddLog = (logData: Omit<LogItem, 'id' | 'timestamp'>) => {
    const newLog: LogItem = {
      ...logData,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: formatCurrentTimestamp()
    };
    const updated = [newLog, ...logs];
    saveLogs(updated);
  };

  const handleUpdateStats = (type: 'encrypt' | 'decrypt' | 'hash' | 'keygen') => {
    const timestamp = formatCurrentTimestamp();
    const updated: AppStats = { ...stats };
    
    if (type === 'encrypt') {
      updated.totalEncryptions += 1;
      updated.lastActivity = `Encrypted via ${activeView.toUpperCase()} at ${timestamp.split(' ')[1]}`;
    } else if (type === 'decrypt') {
      updated.totalDecryptions += 1;
      updated.lastActivity = `Decrypted via ${activeView.toUpperCase()} at ${timestamp.split(' ')[1]}`;
    } else if (type === 'hash') {
      updated.totalHashes += 1;
      updated.lastActivity = `Calculated Hash Digest at ${timestamp.split(' ')[1]}`;
    } else if (type === 'keygen') {
      updated.totalKeyGens += 1;
      updated.lastActivity = `Generated Keys via ${activeView.toUpperCase()} at ${timestamp.split(' ')[1]}`;
    }
    saveStats(updated);
  };

  const handleClearLogs = () => {
    saveLogs([]);
    setStatusText('Cleared audit log history');
    setStatusType('warning');
  };

  const handleResetApp = () => {
    localStorage.clear();
    setLogs([]);
    setStats({
      totalEncryptions: 0,
      totalDecryptions: 0,
      totalHashes: 0,
      totalKeyGens: 0,
      lastActivity: 'N/A'
    });
    setTheme('cyber-blue');
    setActiveView('dashboard');
    setStatusText('Application settings reset to defaults');
    setStatusType('info');
  };

  const handleChangeTheme = (themeId: string) => {
    setTheme(themeId);
    localStorage.setItem('sec_suite_theme_id', themeId);
    setStatusText(`Console theme switched to ${themeId.replace('-', ' ').toUpperCase()}`);
    setStatusType('success');
    setIsThemeDropdownOpen(false);
  };

  const setStatus = (text: string, type: 'info' | 'success' | 'error' | 'warning') => {
    setStatusText(text);
    setStatusType(type);
  };

  // Render correct view based on state
  const renderMainContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView
            stats={stats}
            recentLogs={logs}
            onNavigate={(view) => {
              setActiveView(view);
              setStatus(`Opened ${view.toUpperCase()} cryptographic module`, 'info');
            }}
          />
        );
      case 'aes':
        return (
          <AesView
            onAddLog={handleAddLog}
            onUpdateStats={handleUpdateStats}
            onSetStatus={setStatus}
          />
        );
      case 'des':
        return (
          <DesView
            onAddLog={handleAddLog}
            onUpdateStats={handleUpdateStats}
            onSetStatus={setStatus}
          />
        );
      case 'rsa':
        return (
          <RsaView
            onAddLog={handleAddLog}
            onUpdateStats={handleUpdateStats}
            onSetStatus={setStatus}
          />
        );
      case 'hash':
        return (
          <HashView
            onAddLog={handleAddLog}
            onUpdateStats={handleUpdateStats}
            onSetStatus={setStatus}
          />
        );
      case 'about':
        return <AboutView />;
      case 'settings':
        return (
          <SettingsView
            darkMode={theme !== 'white-professional'}
            onToggleTheme={() => handleChangeTheme(theme === 'white-professional' ? 'cyber-blue' : 'white-professional')}
            onClearLogs={handleClearLogs}
            onResetApp={handleResetApp}
            onSetStatus={setStatus}
          />
        );
      default:
        return <DashboardView stats={stats} recentLogs={logs} onNavigate={setActiveView} />;
    }
  };

  const currentThemeLabel = themes.find(t => t.id === theme)?.label || 'Cyber Blue';

  if (activeView === 'welcome') {
    return (
      <WelcomeView
        onEnter={() => {
          setActiveView('dashboard');
          setStatus('AegisCipher Console Unlocked', 'success');
        }}
        systemTime={liveTime}
      />
    );
  }

  return (
    <div className={`theme-${theme} font-app-custom bg-app-custom text-primary-custom min-h-screen transition-all duration-300 relative overflow-x-hidden pb-12`}>
      
      {/* Dynamic Backdrops */}
      {theme !== 'white-professional' && (
        <>
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 pointer-events-none z-0" />
          <div className="fixed top-1/4 right-1/4 w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none z-0" />
          <div 
            className="fixed inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0"
          />
        </>
      )}

      {/* 1. PREMIUM FIXED HEADER */}
      <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-sidebar-custom border-b border-slate-900/60 flex items-center justify-between pl-14 lg:pl-6 pr-6 backdrop-blur-md z-30 shadow-md">
        
        {/* Left Side: Current Page */}
        <div className="flex items-center gap-2">
          <div>
            <span className="text-[9px] text-slate-500 font-mono tracking-wider uppercase block">CONSOLE MODULE</span>
            <span className="text-xs font-bold text-blue-400 tracking-wider font-mono uppercase">
              {activeView === 'dashboard' ? 'SYSTEM CONSOLE OVERVIEW' : `${activeView.toUpperCase()} ENCRYPTION ENGINE`}
            </span>
          </div>
        </div>

        {/* Center: Realtime Systems Pulse (Active Status & Clock) */}
        <div className="hidden md:flex items-center gap-5 bg-slate-950/40 border border-slate-900 px-4 py-1.5 rounded-xl text-xs">
          {/* Active system pulse */}
          <div className="flex items-center gap-2 border-r border-slate-900 pr-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-bold tracking-wider font-mono">ACTIVE</span>
          </div>

          {/* Calendar Indicator */}
          <div className="flex items-center gap-1.5 text-slate-400 font-mono">
            <CalendarIcon className="w-3.5 h-3.5 text-blue-400/80" />
            <span>{liveDate}</span>
          </div>

          {/* Clock Indicator */}
          <div className="flex items-center gap-1.5 text-teal-400 font-bold font-mono">
            <ClockIcon className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span>{liveTime}</span>
          </div>
        </div>

        {/* Right Side: Theme switcher & Developer badge */}
        <div className="flex items-center gap-4">
          
          {/* Dynamic Theme drop-down button */}
          <div className="relative">
            <button
              onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
              className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-slate-950 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/50 text-xs font-mono text-slate-300 transition-colors cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline uppercase">{currentThemeLabel}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {/* Float Dropdown overlay */}
            {isThemeDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsThemeDropdownOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-50 p-1.5 animate-in fade-in duration-100">
                  <div className="px-2.5 py-1.5 text-[9px] font-mono text-slate-500 uppercase border-b border-slate-900 mb-1">
                    Select Console Theme
                  </div>
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleChangeTheme(t.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs text-left font-mono transition-colors cursor-pointer ${
                        theme === t.id 
                          ? 'bg-blue-950/40 text-blue-400 font-bold border-l-2 border-blue-500' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${t.color}`} />
                        <div>
                          <div>{t.label}</div>
                          <div className="text-[8px] text-slate-500 font-sans font-normal">{t.description}</div>
                        </div>
                      </div>
                      {theme === t.id && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Professional Lock Icon with subtle glow */}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-900">
            <button
              onClick={() => {
                setActiveView('welcome');
                setStatus('Console locked: entry screen active', 'info');
              }}
              className="relative shrink-0 flex items-center justify-center group cursor-pointer"
              title="Lock Console / Home"
            >
              <div className="absolute inset-0 rounded-lg bg-blue-500/15 blur-md group-hover:bg-blue-500/30 pointer-events-none transition-all" />
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-slate-950 border border-blue-500/30 group-hover:border-blue-500/60 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.25)] group-hover:text-blue-300 transition-all">
                <Lock className="w-4 h-4" />
              </div>
            </button>
          </div>

        </div>
      </header>

      {/* 2. NAVIGATION SIDEBAR */}
      <Sidebar
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          setStatus(`Navigation: opened ${view.toUpperCase()}`, 'info');
        }}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* 3. MULTI-COLUMN WORKSPACE AREA */}
      <main className="lg:pl-64 pt-16 min-h-screen flex flex-col relative z-10 pb-16">
        
        {/* Main Grid Wrapper */}
        <div className="flex-1 p-5 md:p-6 lg:p-8 max-w-[1400px] w-full mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* CENTER: Encryption Workspace (8 columns on wide screen) */}
          <div className="xl:col-span-8 space-y-6">
            {renderMainContent()}
          </div>

          {/* RIGHT PANEL: Parameters & Live logs (4 columns on wide screen) */}
          <div className="xl:col-span-4 h-full">
            <RightPanel 
              activeView={activeView}
              logs={logs}
              onClearLogs={handleClearLogs}
              currentThemeLabel={themes.find(t => t.id === theme)?.label || 'Cyber Blue'}
            />
          </div>

        </div>

        {/* 4. PREMIUM STICKY FOOTER */}
        <footer className="py-6 px-8 border-t border-slate-900/40 bg-slate-950/20 text-center space-y-3 mt-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-slate-500 font-sans">
            <span className="font-extrabold text-blue-400">AegisCipher Pro</span>
            <span className="text-slate-800">•</span>
            <span>Developed by</span>
            <span className="font-bold text-slate-300">Dhrumin Patel</span>
            <span className="text-slate-800">|</span>
            <span className="text-slate-400">Cyber Security & Forensic Science</span>
            <span className="text-slate-800">|</span>
            <span className="font-mono text-slate-400">Version 1.0</span>
          </div>

          <div className="flex justify-center items-center gap-5 text-xs font-mono text-blue-400">
            <a 
              href="https://www.linkedin.com/in/dhrumin-patel-0412792a5/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-blue-300 hover:underline transition-all flex items-center gap-1.5"
            >
              <Linkedin className="w-3.5 h-3.5" /> LinkedIn
            </a>
            <span className="text-slate-800">|</span>
            <a 
              href="https://github.com/Dhrumin1327" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-blue-300 hover:underline transition-all flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5" /> GitHub
            </a>
            <span className="text-slate-800">|</span>
            <a 
              href="mailto:pdhrumin695@gmail.com?subject=AegisCipher%20Pro%20Support%20Request&body=Hello%20Dhrumin%2C%0A%0AI%20need%20assistance%20regarding%20AegisCipher%20Pro.%0A%0AThank%20you." 
              className="hover:text-blue-300 hover:underline transition-all flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" /> Email
            </a>
          </div>

          <div className="text-[10px] text-slate-600 font-mono tracking-wider">
            © 2026 AegisCipher Pro. All Rights Reserved.
          </div>
        </footer>

      </main>

      {/* 5. Persistent Bottom Status Bar */}
      <StatusBar statusText={statusText} statusType={statusType} />
    </div>
  );
}
