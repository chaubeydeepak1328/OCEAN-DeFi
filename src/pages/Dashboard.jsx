import { TrendingUp, Wallet, Users, Award, DollarSign, Clock, Zap, Gift, Trophy, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMockPortfolioDetails, getMockUserStatus, formatUSD, formatRAMA } from '../utils/contractData';
import NumberPopup from '../components/NumberPopup';
import LivePriceFeed from '../components/LivePriceFeed';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const quickEarningsData = [
  { day: 'Mon', amount: 18 },
  { day: 'Tue', amount: 22 },
  { day: 'Wed', amount: 28 },
  { day: 'Thu', amount: 25 },
  { day: 'Fri', amount: 30 },
  { day: 'Sat', amount: 32 },
  { day: 'Sun', amount: 28 },
];

export default function Dashboard() {
  const portfolio = getMockPortfolioDetails();
  const userStatus = getMockUserStatus();

  const portfolioCapProgress = (parseFloat(portfolio.totalEarnedUSD) / parseFloat(portfolio.maxCapUSD)) * 100;
  const dailyRate = portfolio.isBooster
    ? (parseFloat(portfolio.stakedUSD) >= 5010e8 ? 0.80 : 0.66)
    : (parseFloat(portfolio.stakedUSD) >= 5010e8 ? 0.40 : 0.33);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-neon-green bg-clip-text text-transparent relative inline-block">
            Dashboard
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-neon-green/20 blur-xl -z-10" />
          </h1>
          <p className="text-sm sm:text-base text-cyan-300/70 mt-1">Welcome back! Here's your complete overview</p>
        </div>
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 cyber-glass border border-neon-green/30 rounded-lg flex-shrink-0 w-fit">
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
          <span className="text-xs sm:text-sm font-medium text-neon-green uppercase tracking-wide">{portfolio.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Link to="/dashboard" className="cyber-glass border border-cyan-500/30 hover:border-cyan-500/80 rounded-xl p-4 sm:p-5 text-white transition-all group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="p-2 bg-cyan-500/20 rounded-lg flex-shrink-0 border border-cyan-500/30">
              <Wallet size={20} className="text-cyan-400" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-cyan-300 uppercase tracking-wide">Staked Amount</p>
          </div>
          <NumberPopup
            value={formatUSD(portfolio.stakedUSD)}
            label="Staked Amount"
            className="text-xl sm:text-2xl font-bold mb-2 text-cyan-400 relative z-10"
          />
          <div className="flex items-center gap-1 text-xs text-cyan-300/90 relative z-10">
            <span>View Portfolio</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </Link>

        <Link to="/dashboard/earnings" className="cyber-glass border border-neon-green/30 hover:border-neon-green/80 rounded-xl p-4 sm:p-5 text-white transition-all group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="p-2 bg-neon-green/20 rounded-lg flex-shrink-0 border border-neon-green/30">
              <TrendingUp size={20} className="text-neon-green" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-neon-green uppercase tracking-wide">Total Earned</p>
          </div>
          <NumberPopup
            value={formatUSD(portfolio.totalEarnedUSD)}
            label="Total Earned"
            className="text-xl sm:text-2xl font-bold mb-2 text-neon-green relative z-10"
          />
          <div className="flex items-center gap-1 text-xs text-neon-green/70 relative z-10">
            <span>Claim Earnings</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </Link>

        <Link to="/dashboard/team" className="cyber-glass border border-neon-orange/30 hover:border-neon-orange/80 rounded-xl p-4 sm:p-5 text-white transition-all group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="p-2 bg-neon-orange/20 rounded-lg flex-shrink-0 border border-neon-orange/30">
              <Users size={20} className="text-neon-orange" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-neon-orange uppercase tracking-wide">Team Network</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold mb-2 text-neon-orange relative z-10">{userStatus.directChildrenCount} Direct</p>
          <div className="flex items-center gap-1 text-xs text-neon-orange/70 relative z-10">
            <span>View Team</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </Link>

        <Link to="/dashboard/safe-wallet" className="cyber-glass border border-cyan-400/30 hover:border-cyan-400/80 rounded-xl p-4 sm:p-5 text-white transition-all group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="p-2 bg-cyan-400/20 rounded-lg flex-shrink-0 border border-cyan-400/30">
              <Wallet size={20} className="text-cyan-400" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-cyan-400 uppercase tracking-wide">Safe Wallet</p>
          </div>
          <NumberPopup
            value={formatRAMA(portfolio.safeWalletRAMA)}
            label="Safe Wallet"
            className="text-xl sm:text-2xl font-bold mb-2 text-cyan-400 relative z-10"
          />
          <div className="flex items-center gap-1 text-xs text-cyan-300/90 relative z-10">
            <span>Manage Wallet</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="cyber-glass rounded-2xl p-4 sm:p-6 border border-cyan-500/30 hover:border-cyan-500/80 relative overflow-hidden transition-all">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-cyan-300 uppercase tracking-wide">Active Portfolio Status</h2>
              {portfolio.isBooster && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-neon-orange to-neon-pink text-white rounded-lg text-xs sm:text-sm font-bold flex-shrink-0 w-fit shadow-lg animate-glow-pulse border border-neon-orange/50">
                  <Zap size={14} className="animate-pulse" />
                  <span className="uppercase">Booster Active</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2 gap-2">
                  <span className="text-xs sm:text-sm font-medium text-cyan-400 uppercase tracking-wider">Portfolio Cap Progress</span>
                  <span className="text-xs sm:text-sm font-bold text-neon-green">{portfolioCapProgress.toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-dark-900 rounded-full overflow-hidden border border-cyan-500/30 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-neon-green/20 animate-pulse" />
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-neon-green rounded-full transition-all relative z-10"
                    style={{ width: `${Math.min(portfolioCapProgress, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-cyan-300/90 mt-1">
                  {formatUSD(portfolio.totalEarnedUSD)} / {formatUSD(portfolio.maxCapUSD)}
                  <span className="ml-1 text-neon-green">{portfolio.isBooster ? '(250% Cap)' : '(200% Cap)'}</span>
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="p-3 sm:p-4 cyber-glass rounded-xl border border-cyan-500/30 hover:border-cyan-500/80 transition-all group">
                  <p className="text-xs text-cyan-400 font-medium mb-1 uppercase tracking-wider">Daily Rate</p>
                  <p className="text-lg sm:text-xl font-bold text-cyan-300 group-hover:text-neon-glow transition-all">{dailyRate}%</p>
                </div>
                <div className="p-3 sm:p-4 cyber-glass rounded-xl border border-neon-green/30 hover:border-neon-green/80 transition-all group">
                  <p className="text-xs text-neon-green font-medium mb-1 uppercase tracking-wider">Direct Refs</p>
                  <p className="text-lg sm:text-xl font-bold text-neon-green group-hover:text-neon-glow transition-all">{userStatus.directChildrenCount}</p>
                </div>
                <div className="p-3 sm:p-4 cyber-glass rounded-xl border border-neon-orange/30 hover:border-neon-orange/80 transition-all group">
                  <p className="text-xs text-neon-orange font-medium mb-1 uppercase tracking-wider">Slab Tier</p>
                  <p className="text-lg sm:text-xl font-bold text-neon-orange group-hover:text-neon-glow transition-all">
                    {['Coral Reef', 'Shallow Waters', 'Tide Pool', 'Wave Crest', 'Open Sea', 'Deep Current', 'Ocean Floor', 'Abyssal Zone', 'Mariana Trench', 'Pacific Master', 'Ocean Sovereign'][parseInt(userStatus.currentSlabIndex) - 1] || 'None'}
                  </p>
                  <p className="text-xs text-neon-orange/70 mt-0.5">Level {userStatus.currentSlabIndex}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="cyber-glass rounded-2xl p-4 sm:p-6 border border-cyan-500/30 hover:border-cyan-500/80 relative overflow-hidden transition-all">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <h2 className="text-base sm:text-lg font-semibold text-cyan-300 mb-4 uppercase tracking-wide">7-Day Earnings Trend</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={quickEarningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,240,255,0.1)" />
                <XAxis dataKey="day" stroke="#22d3ee" fontSize={12} />
                <YAxis stroke="#22d3ee" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(0,240,255,0.3)',
                    borderRadius: '8px',
                    color: '#22d3ee',
                    backdropFilter: 'blur(10px)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="url(#dashGradient)"
                  strokeWidth={3}
                  dot={{ fill: '#00f0ff', r: 5, strokeWidth: 2, stroke: '#39ff14' }}
                />
                <defs>
                  <linearGradient id="dashGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00f0ff" />
                    <stop offset="100%" stopColor="#39ff14" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>

          <LivePriceFeed />
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="cyber-glass border border-neon-green/50 hover:border-neon-green rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden group transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-green/10 to-cyan-500/10 opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-green/70 to-transparent" />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2 bg-neon-green/20 rounded-lg flex-shrink-0 border border-neon-green/40">
                <TrendingUp size={20} className="text-neon-green" />
              </div>
              <div>
                <p className="text-sm text-neon-green font-medium uppercase tracking-wide">Accrued Growth</p>
                <p className="text-xs text-cyan-300/90">Available to claim</p>
              </div>
            </div>
            <NumberPopup
              value={formatUSD(portfolio.accruedGrowthUSD)}
              label="Accrued Growth"
              className="text-2xl sm:text-3xl font-bold mb-4 text-neon-green relative z-10"
            />
            <Link
              to="/dashboard/earnings"
              className="block w-full py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500 to-neon-green hover:from-cyan-400 hover:to-neon-green/90 rounded-lg text-sm sm:text-base font-bold transition-all text-dark-950 text-center relative z-10 group-hover:shadow-neon-green"
            >
              Claim Now
            </Link>
          </div>

          <div className="cyber-glass rounded-2xl p-4 sm:p-6 border border-cyan-500/30 hover:border-cyan-500/80 relative overflow-hidden transition-all">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <h3 className="text-base font-semibold text-cyan-300 mb-4 uppercase tracking-wide">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to="/dashboard/stake"
                className="flex items-center gap-3 p-3 cyber-glass hover:bg-cyan-500/10 rounded-lg transition-all group border border-transparent hover:border-cyan-500/30"
              >
                <div className="p-2 bg-cyan-500/20 rounded-lg flex-shrink-0 border border-cyan-500/30">
                  <Wallet className="text-cyan-400" size={16} />
                </div>
                <span className="text-sm font-medium text-cyan-300 flex-1">Stake & Invest</span>
                <ArrowUpRight size={16} className="text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <Link
                to="/dashboard/slab"
                className="flex items-center gap-3 p-3 cyber-glass hover:bg-neon-green/10 rounded-lg transition-all group border border-transparent hover:border-neon-green/30"
              >
                <div className="p-2 bg-neon-green/20 rounded-lg flex-shrink-0 border border-neon-green/30">
                  <Award className="text-neon-green" size={16} />
                </div>
                <span className="text-sm font-medium text-neon-green flex-1">Slab Income</span>
                <ArrowUpRight size={16} className="text-neon-green group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <Link
                to="/dashboard/royalty"
                className="flex items-center gap-3 p-3 cyber-glass hover:bg-neon-orange/10 rounded-lg transition-all group border border-transparent hover:border-neon-orange/30"
              >
                <div className="p-2 bg-neon-orange/20 rounded-lg flex-shrink-0 border border-neon-orange/30">
                  <Trophy className="text-neon-orange" size={16} />
                </div>
                <span className="text-sm font-medium text-neon-orange flex-1">Royalty Program</span>
                <ArrowUpRight size={16} className="text-neon-orange group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <Link
                to="/dashboard/rewards"
                className="flex items-center gap-3 p-3 cyber-glass hover:bg-cyan-400/10 rounded-lg transition-all group border border-transparent hover:border-cyan-400/30"
              >
                <div className="p-2 bg-cyan-400/20 rounded-lg flex-shrink-0 border border-cyan-400/30">
                  <Gift className="text-cyan-400" size={16} />
                </div>
                <span className="text-sm font-medium text-cyan-400 flex-1">Rewards</span>
                <ArrowUpRight size={16} className="text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="cyber-glass rounded-2xl p-4 sm:p-6 border border-cyan-500/30 hover:border-cyan-500/80 relative overflow-hidden transition-all">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <h3 className="text-base font-semibold text-cyan-300 mb-4 uppercase tracking-wide">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-cyan-500/5 transition-colors">
                <div className="p-1.5 bg-neon-green/20 rounded-lg flex-shrink-0 border border-neon-green/30">
                  <DollarSign className="text-neon-green" size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-cyan-300">Daily Growth</p>
                  <p className="text-xs text-neon-green">+$28.50 earned</p>
                  <p className="text-xs text-cyan-400/50">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-cyan-500/5 transition-colors">
                <div className="p-1.5 bg-cyan-500/20 rounded-lg flex-shrink-0 border border-cyan-500/30">
                  <Users className="text-cyan-400" size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-cyan-300">New Team Member</p>
                  <p className="text-xs text-cyan-300">Direct referral joined</p>
                  <p className="text-xs text-cyan-400/50">5 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-cyan-500/5 transition-colors">
                <div className="p-1.5 bg-neon-orange/20 rounded-lg flex-shrink-0 border border-neon-orange/30">
                  <Clock className="text-neon-orange" size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-cyan-300">Slab Claimed</p>
                  <p className="text-xs text-neon-orange">Level 3 rewards</p>
                  <p className="text-xs text-cyan-400/50">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/dashboard/analytics" className="cyber-glass rounded-xl p-5 border border-cyan-500/30 hover:border-cyan-500/80 transition-all group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="p-2 bg-cyan-500/20 rounded-lg flex-shrink-0 border border-cyan-500/30">
              <TrendingUp className="text-cyan-400" size={20} />
            </div>
            <p className="text-sm font-medium text-cyan-400 uppercase tracking-wide">Performance</p>
            <ArrowUpRight size={16} className="ml-auto text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-neon-green relative z-10">30% Progress</p>
          <p className="text-xs text-cyan-300/90 mt-1 relative z-10">79 days active</p>
        </Link>

        <div className="cyber-glass rounded-xl p-5 border border-cyan-500/30 hover:border-cyan-500/80 relative overflow-hidden transition-all">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-neon-green/20 rounded-lg flex-shrink-0 border border-neon-green/30">
              <Award className="text-neon-green" size={20} />
            </div>
            <p className="text-sm font-medium text-neon-green uppercase tracking-wide">Qualified Volume</p>
          </div>
          <NumberPopup
            value={formatUSD(userStatus.qualifiedVolumeUSD)}
            label="Qualified Volume"
            className="text-2xl font-bold text-cyan-300"
          />
          <p className="text-xs text-cyan-300/90 mt-1">40:30:30 Calculation</p>
        </div>

        <div className="cyber-glass rounded-xl p-5 border border-cyan-500/30 hover:border-cyan-500/80 relative overflow-hidden transition-all">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-neon-orange/20 rounded-lg flex-shrink-0 border border-neon-orange/30">
              <Trophy className="text-neon-orange" size={20} />
            </div>
            <p className="text-sm font-medium text-neon-orange uppercase tracking-wide">Royalty Status</p>
          </div>
          <p className="text-2xl font-bold text-cyan-300">Level {userStatus.currentRoyaltyLevelIndex}</p>
          <p className="text-xs text-cyan-300/90 mt-1">{userStatus.royaltyPayoutsReceived} / LifeTime</p>
        </div>
      </div>
    </div>
  );
}
