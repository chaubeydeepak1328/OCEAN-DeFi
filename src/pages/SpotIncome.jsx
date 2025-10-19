import { Coins, TrendingUp, Award, Clock, AlertCircle, Zap, Target } from 'lucide-react';

const mockSpotData = {
  totalEarnings: '2,458.75',
  activeSpots: 12,
  pendingClaims: '345.20',
  spotRate: '3.5',
  last24hEarnings: '125.40',
  averageSpotValue: '204.89',
};

const mockSpotTransactions = [
  { id: 1, type: 'Level 1 Spot', amount: '45.50', timestamp: '2025-10-17 14:23', status: 'Claimed' },
  { id: 2, type: 'Level 2 Spot', amount: '78.25', timestamp: '2025-10-17 10:15', status: 'Claimed' },
  { id: 3, type: 'Level 3 Spot', amount: '120.00', timestamp: '2025-10-16 18:42', status: 'Claimed' },
  { id: 4, type: 'Level 1 Spot', amount: '42.80', timestamp: '2025-10-16 12:30', status: 'Claimed' },
  { id: 5, type: 'Level 2 Spot', amount: '85.50', timestamp: '2025-10-15 09:18', status: 'Pending' },
];

const spotLevels = [
  { level: 1, minInvestment: '$100', earning: '5%', status: 'Active' },
  { level: 2, minInvestment: '$500', earning: '7%', status: 'Active' },
  { level: 3, minInvestment: '$1,000', earning: '10%', status: 'Locked' },
  { level: 4, minInvestment: '$5,000', earning: '15%', status: 'Locked' },
];

export default function SpotIncome() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-neon-green relative inline-block">
          Spot Income
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-neon-green/20 blur-xl -z-10" />
        </h1>
        <p className="text-cyan-300/90 mt-1">Track your spot earnings and claim rewards</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="cyber-glass border border-cyan-500/50 rounded-2xl p-6 text-white relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-neon-green/10 opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/70 to-transparent" />
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2 bg-cyan-500/20 rounded-lg backdrop-blur-sm border border-cyan-500/30">
              <Coins size={24} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-cyan-300 font-medium uppercase tracking-wide">Total Spot Earnings</p>
              <p className="text-xs text-cyan-300/90">All-time accumulated</p>
            </div>
          </div>
          <p className="text-4xl font-bold mb-2 text-cyan-400 relative z-10">{mockSpotData.totalEarnings} RAMA</p>
          <p className="text-sm text-neon-green relative z-10">+{mockSpotData.last24hEarnings} RAMA (24h)</p>
        </div>

        <div className="cyber-glass rounded-xl p-6 border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 cyber-glass border border-neon-green/20 rounded-lg">
              <Target className="text-neon-green" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-cyan-300">Active Spots</p>
              <p className="text-xs text-cyan-300/90">Currently earning</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-neon-green">{mockSpotData.activeSpots}</p>
          <p className="text-sm text-cyan-300/90 mt-1">Avg. {mockSpotData.averageSpotValue} RAMA/spot</p>
        </div>

        <div className="cyber-glass rounded-xl p-6 border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 cyber-glass border border-neon-orange/20 rounded-lg">
              <Clock className="text-neon-orange" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-cyan-300">Pending Claims</p>
              <p className="text-xs text-cyan-300/90">Ready to withdraw</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-neon-orange">{mockSpotData.pendingClaims} RAMA</p>
        </div>
      </div>

      <div className="cyber-glass rounded-2xl p-6 border-2 border-neon-green relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-green/50 to-transparent" />
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-neon-green uppercase tracking-wide">Spot Income Levels</h2>
              <p className="text-sm text-cyan-300/90 mt-1">Unlock higher earnings with increased investment</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-cyan-300/90">Current Rate</p>
              <p className="text-2xl font-bold text-neon-green">{mockSpotData.spotRate}%</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {spotLevels.map((spot) => (
            <div
              key={spot.level}
              className={`cyber-glass rounded-xl p-4 border-2 transition-all ${
                spot.status === 'Active'
                  ? 'border-neon-green hover:border-neon-green/70 hover:shadow-neon-green'
                  : 'border-cyan-500/20 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded ${
                    spot.status === 'Active'
                      ? 'bg-neon-green/20 text-neon-green'
                      : 'bg-cyan-500/10 text-cyan-300/50'
                  }`}
                >
                  Level {spot.level}
                </span>
                {spot.status === 'Active' && (
                  <Zap size={16} className="text-neon-green animate-pulse" />
                )}
              </div>
              <p className="text-sm text-cyan-300 mb-1">Min Investment</p>
              <p className="text-xl font-bold text-cyan-400 mb-3">{spot.minInvestment}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-cyan-300/90">Earning Rate</span>
                <span className="text-lg font-bold text-neon-green">{spot.earning}</span>
              </div>
              <div className="mt-3">
                {spot.status === 'Active' ? (
                  <span className="text-xs bg-neon-green/20 text-neon-green px-2 py-1 rounded-full font-medium">
                    Active
                  </span>
                ) : (
                  <span className="text-xs bg-cyan-500/10 text-cyan-300/50 px-2 py-1 rounded-full font-medium">
                    Locked
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-cyan-400" size={24} />
            <h3 className="text-lg font-semibold text-cyan-300">Recent Spot Transactions</h3>
          </div>

          <div className="space-y-3">
            {mockSpotTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="cyber-glass border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-500/40 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <Award size={20} className="text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-cyan-300">{transaction.type}</p>
                      <p className="text-xs text-cyan-300/70">{transaction.timestamp}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-neon-green">+{transaction.amount} RAMA</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === 'Claimed'
                          ? 'bg-neon-green/20 text-neon-green'
                          : 'bg-neon-orange/20 text-neon-orange'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30">
          <h3 className="font-semibold text-cyan-300 mb-4">How Spot Income Works</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-cyan-300">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-cyan-300">Investment-Based Earnings</p>
                <p className="text-xs text-cyan-300/90">
                  Earn passive income based on your investment level and spot tier
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-cyan-300">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-cyan-300">Multiple Spot Levels</p>
                <p className="text-xs text-cyan-300/90">
                  Unlock higher earning rates by qualifying for advanced spot levels
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-cyan-300">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-cyan-300">Real-Time Accrual</p>
                <p className="text-xs text-cyan-300/90">
                  Earnings accumulate continuously and can be claimed when ready
                </p>
              </div>
            </div>

            <div className="p-4 cyber-glass border border-neon-orange/20 rounded-lg mt-4">
              <p className="text-sm font-medium text-neon-orange mb-2">Claim Requirements</p>
              <p className="text-xs text-cyan-300/90">
                Minimum claim amount: 50 RAMA
              </p>
              <p className="text-xs text-cyan-300/90 mt-1">
                24-hour cooldown between claims
              </p>
            </div>

            <button
              onClick={() =>
                alert(
                  'Claim Spot Income: Initiating claim transaction to transfer accumulated spot income to your wallet. [Contract Integration Pending]'
                )
              }
              className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-500 to-neon-green text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={parseFloat(mockSpotData.pendingClaims) < 50}
            >
              Claim Spot Income
            </button>
          </div>
        </div>
      </div>

      <div className="cyber-glass border border-cyan-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-cyan-400 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-medium text-cyan-300 mb-1">Static Demo Data</p>
            <p className="text-xs text-cyan-300/90">
              This page currently displays placeholder data. Spot income functionality will be
              integrated with smart contracts in future updates. All displayed values, transactions,
              and statistics are for demonstration purposes only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
