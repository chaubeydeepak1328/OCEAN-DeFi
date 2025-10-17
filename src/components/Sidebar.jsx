import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Wallet, TrendingUp, Users, Award, Trophy, Gift, Vault, History, Info, Settings, FileDown, LogOut, Presentation, BookOpen, Waves } from 'lucide-react';
import { generateOceanDefiPDF } from '../utils/generatePDF';

const mainNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard/portfolio', label: 'Portfolio', icon: Wallet },
  { path: '/dashboard/stake', label: 'Stake & Invest', icon: Wallet },
  { path: '/dashboard/earnings', label: 'Claim Earnings', icon: TrendingUp },
];

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

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname === path;
  };

  const handleDisconnect = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const handlePDFDownload = () => {
    generateOceanDefiPDF();
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-full cyber-glass border-r border-cyan-500/30 overflow-hidden">
      <div className="p-6 border-b border-cyan-500/30">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Waves className="text-cyan-400" size={28} />
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-neon-green">
            OCEAN DeFi
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar p-4">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-cyan-400/70 uppercase tracking-wider px-3 mb-2">
            Main Menu
          </h3>
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative
                    ${active
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-neon-cyan'
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20'
                    }
                  `}
                >
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-500 to-neon-green rounded-r-full" />
                  )}
                  <Icon size={20} className="flex-shrink-0" />
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {menuSections.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="text-xs font-semibold text-cyan-400/70 uppercase tracking-wider px-3 mb-2">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative
                      ${active
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                        : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20'
                      }
                    `}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-500 to-neon-green rounded-r-full" />
                    )}
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
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative
                ${isActive('/dashboard/settings')
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20'
                }
              `}
            >
              {isActive('/dashboard/settings') && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-500 to-neon-green rounded-r-full" />
              )}
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
    </aside>
  );
}
