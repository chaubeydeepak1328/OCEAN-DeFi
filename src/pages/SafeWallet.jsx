import { useState } from 'react';
import { Vault, TrendingUp, ArrowUpRight, History, Search, Eye, AlertCircle, Wallet } from 'lucide-react';
import { getMockPortfolioDetails, formatRAMA, formatUSD } from '../utils/contractData';

const mockTransactions = [
  { type: 'Slab Income', amount: 125.5, date: '2024-10-12 14:23', source: 'Team Rewards' },
  { type: 'Growth Claim', amount: 200, date: '2024-10-11 09:15', source: 'Portfolio Earnings' },
  { type: 'Royalty Payout', amount: 80, date: '2024-10-10 00:01', source: 'Lifetime Royalty Program' },
  { type: 'One-Time Reward', amount: 500, date: '2024-10-08 16:45', source: 'Milestone Achievement' },
  { type: 'Override Income', amount: 45.25, date: '2024-10-07 11:30', source: 'Same-Slab Bonus' },
];

export default function SafeWallet() {
  const [showPortfolioViewer, setShowPortfolioViewer] = useState(false);
  const [lookupAddress, setLookupAddress] = useState('');
  const [lookupError, setLookupError] = useState('');
  const [viewedPortfolio, setViewedPortfolio] = useState(null);

  const portfolio = getMockPortfolioDetails();
  const ramaBalance = parseFloat(portfolio.safeWalletRAMA) / 1e18;
  const ramaPrice = 0.0245;
  const usdValue = ramaBalance * ramaPrice;

  const totalInflows = mockTransactions.reduce((sum, tx) => sum + tx.amount, 0);

  const handleLookupPortfolio = () => {
    if (!lookupAddress.trim()) {
      setLookupError('Please enter a wallet address or user ID');
      return;
    }

    if (lookupAddress.length < 10) {
      setLookupError('Invalid address or user ID format');
      return;
    }

    setLookupError('');
    setViewedPortfolio({
      address: lookupAddress,
      stakedUSD: '15000.00',
      totalGrowth: '18750.00',
      growthPercentage: 25,
      maturityPercent: 65,
      dailyGrowth: '41.10',
      claimedGrowthUSD: '5000.00',
      safeWalletRAMA: '450.75',
      directMembers: 8,
      teamVolume: '85000.00'
    });
  };

  const handleTransferOut = () => {
    alert('Transfer Out: Opens wallet connection to transfer funds to external wallet.');
  };

  const handleStakeFromWallet = () => {
    alert('Stake from Wallet: Opens staking interface using Safe Wallet balance.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-neon-green relative inline-block">
          Safe Wallet
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-neon-green/20 blur-xl -z-10" />
        </h1>
        <p className="text-cyan-300/90 mt-1">Your fee-free internal balance</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 cyber-glass border border-neon-green/50 rounded-2xl p-8 text-white relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-green/10 to-cyan-500/10 opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-green/70 to-transparent" />
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-3 cyber-glass border border-neon-green/30 rounded-xl backdrop-blur-sm">
              <Vault size={32} />
            </div>
            <div>
              <p className="text-sm opacity-90">Safe Wallet Balance</p>
              <p className="text-xs opacity-75">Fee-free internal funds</p>
            </div>
          </div>

          <div className="mb-6 relative z-10">
            <p className="text-5xl font-bold mb-2">{ramaBalance.toFixed(2)} RAMA</p>
            <p className="text-2xl opacity-90">≈ {formatUSD(usdValue * 1e8)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10">
            <button
              onClick={handleStakeFromWallet}
              className="py-3 cyber-glass hover:bg-white/10 backdrop-blur-sm rounded-lg font-medium transition-colors border border-cyan-500/30 hover:border-cyan-500/50"
            >
              Stake from Wallet
            </button>
            <button
              disabled
              className="py-3 cyber-glass rounded-lg font-medium border border-cyan-500/20 text-cyan-400/40 cursor-not-allowed relative group"
              title="Safe Wallet funds cannot be withdrawn"
            >
              <span className="group-hover:hidden">Transfer Out</span>
              <span className="hidden group-hover:inline text-xs">Cannot Withdraw</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="cyber-glass rounded-xl p-5 border border-cyan-500/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 cyber-glass border border-neon-green/30 rounded-lg">
                <TrendingUp className="text-neon-green" size={20} />
              </div>
              <p className="text-sm font-medium text-cyan-300">Total Inflows</p>
            </div>
            <p className="text-2xl font-bold text-neon-green">{totalInflows.toFixed(2)} RAMA</p>
            <p className="text-xs text-cyan-300/90 mt-1">Lifetime accumulated</p>
          </div>

          <div className="cyber-glass border border-neon-green/30 rounded-xl p-4">
            <p className="text-sm font-medium text-neon-green mb-2 uppercase tracking-wide">Key Features</p>
            <ul className="space-y-1 text-xs text-cyan-300/90">
              <li>• 0% fees for staking</li>
              <li>• No commission on stakes</li>
              <li>• Cannot be withdrawn</li>
              <li>• Only for portfolio creation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Portfolio Viewer Section */}
      <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Eye size={20} className="text-cyan-400" />
            <h2 className="text-lg font-semibold text-cyan-300 uppercase tracking-wide">Portfolio Viewer</h2>
          </div>
          <button
            onClick={() => setShowPortfolioViewer(!showPortfolioViewer)}
            className="px-4 py-2 cyber-glass border border-cyan-500/30 hover:border-cyan-500/50 rounded-lg text-sm font-medium text-cyan-300 transition-colors"
          >
            {showPortfolioViewer ? 'Hide' : 'Show'} Viewer
          </button>
        </div>

        {showPortfolioViewer && (
          <div className="space-y-4">
            <div className="p-4 cyber-glass border border-cyan-500/20 rounded-lg">
              <p className="text-sm text-cyan-300 mb-3">Enter wallet address or user ID to view portfolio</p>
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={lookupAddress}
                    onChange={(e) => {
                      setLookupAddress(e.target.value);
                      setLookupError('');
                    }}
                    placeholder="0x1234...5678 or User ID"
                    className="w-full px-4 py-2 cyber-glass border border-cyan-500/30 rounded-lg text-cyan-300 placeholder-cyan-400/50 focus:outline-none focus:border-cyan-500/50"
                  />
                  {lookupError && (
                    <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {lookupError}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleLookupPortfolio}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-neon-green text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Search size={18} />
                  View
                </button>
              </div>
            </div>

            {viewedPortfolio && (
              <div className="p-5 cyber-glass border border-neon-green/30 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Wallet size={18} className="text-neon-green" />
                  <code className="text-sm font-mono text-cyan-300">{viewedPortfolio.address}</code>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-3 cyber-glass border border-cyan-500/20 rounded-lg">
                    <p className="text-xs text-cyan-300/90 mb-1">Staked</p>
                    <p className="text-lg font-bold text-cyan-300">${viewedPortfolio.stakedUSD}</p>
                  </div>
                  <div className="p-3 cyber-glass border border-neon-green/20 rounded-lg">
                    <p className="text-xs text-cyan-300/90 mb-1">Total Growth</p>
                    <p className="text-lg font-bold text-neon-green">${viewedPortfolio.totalGrowth}</p>
                  </div>
                  <div className="p-3 cyber-glass border border-cyan-500/20 rounded-lg">
                    <p className="text-xs text-cyan-300/90 mb-1">Safe Wallet</p>
                    <p className="text-lg font-bold text-cyan-300">{viewedPortfolio.safeWalletRAMA} RAMA</p>
                  </div>
                  <div className="p-3 cyber-glass border border-neon-orange/20 rounded-lg">
                    <p className="text-xs text-cyan-300/90 mb-1">Team Volume</p>
                    <p className="text-lg font-bold text-neon-orange">${viewedPortfolio.teamVolume}</p>
                  </div>
                </div>

                <div className="mt-4 p-3 cyber-glass border border-cyan-500/20 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-cyan-300/90">Maturity: {viewedPortfolio.maturityPercent}%</span>
                    <span className="text-cyan-300/90">Direct Members: {viewedPortfolio.directMembers}</span>
                    <span className="text-neon-green">Daily: ${viewedPortfolio.dailyGrowth}</span>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-cyan-300/90">
                      <strong>Note:</strong> You can view any user's portfolio but cannot transfer funds from other users' wallets. Only the wallet owner can perform transactions.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <div className="flex items-center gap-3 mb-6">
              <History size={20} className="text-cyan-400" />
              <h2 className="text-lg font-semibold text-cyan-300 uppercase tracking-wide">Transaction History</h2>
            </div>

            <div className="space-y-3">
              {mockTransactions.map((tx, idx) => (
                <div key={idx} className="p-4 cyber-glass border border-cyan-500/20 rounded-lg hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 cyber-glass border border-neon-green/30 rounded-lg">
                        <ArrowUpRight className="text-neon-green" size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-cyan-300">{tx.type}</p>
                        <p className="text-xs text-cyan-300/90">{tx.source}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-neon-green">+{tx.amount} RAMA</p>
                      <p className="text-xs text-cyan-300/90">{tx.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <h3 className="font-semibold text-cyan-300 mb-4 uppercase tracking-wide">Income Sources</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 cyber-glass border border-cyan-500/30 rounded-lg">
                <span className="text-sm font-medium text-cyan-300">Slab Income</span>
                <span className="text-sm font-bold text-cyan-300">125.5 RAMA</span>
              </div>
              <div className="flex items-center justify-between p-3 cyber-glass border border-neon-green/30 rounded-lg">
                <span className="text-sm font-medium text-neon-green">Growth Claims</span>
                <span className="text-sm font-bold text-neon-green">200 RAMA</span>
              </div>
              <div className="flex items-center justify-between p-3 cyber-glass border border-neon-orange/30 rounded-lg">
                <span className="text-sm font-medium text-neon-orange">Royalties</span>
                <span className="text-sm font-bold text-neon-orange">80 RAMA</span>
              </div>
              <div className="flex items-center justify-between p-3 cyber-glass border border-neon-purple/30 rounded-lg">
                <span className="text-sm font-medium text-neon-purple">Rewards</span>
                <span className="text-sm font-bold text-neon-purple">500 RAMA</span>
              </div>
            </div>
          </div>

          <div className="cyber-glass border border-cyan-500/30 rounded-xl p-4">
            <p className="text-sm font-medium text-cyan-300 mb-2 uppercase tracking-wide">Smart Strategy</p>
            <p className="text-xs text-cyan-300/90">
              Use Safe Wallet funds to restake and compound your earnings without paying withdrawal fees or commissions.
            </p>
          </div>
        </div>
      </div>

      <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <h2 className="text-lg font-semibold text-cyan-300 mb-4 uppercase tracking-wide">How Safe Wallet Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-5 cyber-glass border border-cyan-500/30 rounded-xl hover:border-cyan-500/50 transition-all group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-neon-green rounded-lg flex items-center justify-center mb-3 relative z-10">
              <span className="text-dark-950 font-bold">1</span>
            </div>
            <h4 className="font-semibold text-cyan-300 mb-2 relative z-10">Passive Income Hub</h4>
            <p className="text-sm text-cyan-300/90 relative z-10">
              All passive income (slab, royalty, override) automatically flows to your Safe Wallet
            </p>
          </div>

          <div className="p-5 cyber-glass border border-neon-green/30 rounded-xl hover:border-neon-green/50 transition-all group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-10 h-10 bg-gradient-to-br from-neon-green to-cyan-500 rounded-lg flex items-center justify-center mb-3 relative z-10">
              <span className="text-dark-950 font-bold">2</span>
            </div>
            <h4 className="font-semibold text-neon-green mb-2 relative z-10">Fee-Free Claims</h4>
            <p className="text-sm text-cyan-300/90 relative z-10">
              Claim your growth earnings directly to Safe Wallet without paying 5% withdrawal fees
            </p>
          </div>

          <div className="p-5 cyber-glass border border-neon-orange/30 rounded-xl hover:border-neon-orange/50 transition-all group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-10 h-10 bg-gradient-to-br from-neon-orange to-neon-pink rounded-lg flex items-center justify-center mb-3 relative z-10">
              <span className="text-dark-950 font-bold">3</span>
            </div>
            <h4 className="font-semibold text-neon-orange mb-2 relative z-10">No-Commission Staking</h4>
            <p className="text-sm text-cyan-300/90 relative z-10">
              Stake from Safe Wallet without paying 5% commission to upline for maximum compounding
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
