import { X, Users, Award, Trophy, Gift, Vault, History, TrendingUp, Info, Settings, FileDown, LogOut, Presentation, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { generateOceanDefiPDF } from '../utils/generatePDF';

const menuSections = [
  {
    title: 'Income & Rewards',
    items: [
      { path: '/dashboard/slab', label: 'Slab Income', icon: Award },
      { path: '/dashboard/royalty', label: 'Royalty Program', icon: Trophy },
      { path: '/dashboard/rewards', label: 'One-Time Rewards', icon: Gift },
    ]
  },
  {
    title: 'Network & Assets',
    items: [
      { path: '/dashboard/team', label: 'Team Network', icon: Users },
      { path: '/dashboard/safe-wallet', label: 'Safe Wallet', icon: Vault },
      { path: '/dashboard/transaction-history', label: 'Transaction History', icon: History },
    ]
  },
  {
    title: 'Analytics & Info',
    items: [
      { path: '/dashboard/analytics', label: 'Analytics', icon: TrendingUp },
      { path: '/dashboard/presentation', label: 'Presentation', icon: Presentation },
      { path: '/dashboard/ocean-defi-guide', label: 'About Ocean DeFi', icon: BookOpen },
      { path: '/dashboard/about', label: 'About & Vision', icon: Info },
    ]
  }
];

export default function MoreMenu({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleDisconnect = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
    onClose();
  };

  const handlePDFDownload = () => {
    generateOceanDefiPDF();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden max-h-[85vh] animate-slide-up">
        <div className="cyber-glass border-t border-cyan-500/30 rounded-t-3xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

          <div className="sticky top-0 cyber-glass border-b border-cyan-500/30 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-neon-green">
              More Options
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-cyan-500/10 rounded-lg transition-all border border-cyan-500/20 hover:border-cyan-500/40 text-cyan-400"
            >
              <X size={20} />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(85vh-5rem)] px-4 pb-6 hide-scrollbar">
            {menuSections.map((section, idx) => (
              <div key={idx} className="mb-6">
                <h3 className="text-xs font-semibold text-cyan-400/70 uppercase tracking-wider px-3 mb-2 mt-4">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-300 border border-transparent hover:border-cyan-500/20 group"
                      >
                        <Icon size={20} className="flex-shrink-0" />
                        <span className="text-sm font-medium flex-1">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="mt-6 pt-6 border-t border-cyan-500/30">
              <h3 className="text-xs font-semibold text-cyan-400/70 uppercase tracking-wider px-3 mb-2">
                Settings & Actions
              </h3>
              <div className="space-y-1">
                <Link
                  to="/dashboard/settings"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-300 border border-transparent hover:border-cyan-500/20"
                >
                  <Settings size={20} />
                  <span className="text-sm font-medium flex-1">Settings & Rules</span>
                </Link>

                <button
                  onClick={handlePDFDownload}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-cyan-500/10 text-cyan-400 border border-transparent hover:border-cyan-500/30 group"
                >
                  <FileDown size={20} className="group-hover:animate-pulse" />
                  <span className="text-sm font-medium flex-1 text-left">Download PDF</span>
                </button>

                <button
                  onClick={handleDisconnect}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-red-500/10 text-red-400 border border-transparent hover:border-red-500/30 group"
                >
                  <LogOut size={20} className="group-hover:animate-pulse" />
                  <span className="text-sm font-medium flex-1 text-left">Disconnect</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
