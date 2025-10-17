import { useState } from 'react';
import { History, Filter, Download, Search, TrendingUp, Award, Trophy, Gift, Layers, Wallet, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { formatUSD, formatRAMA } from '../utils/contractData';

const TRANSACTION_TYPES = {
  PORTFOLIO_GROWTH: 'Portfolio Growth',
  SLAB_INCOME: 'Slab Income',
  ROYALTY_INCOME: 'Royalty Income',
  SAME_SLAB_OVERRIDE: 'Same-Slab Override',
  ONE_TIME_REWARD: 'One-Time Reward',
  PORTFOLIO_CREATED: 'Portfolio Created',
  CLAIM_TO_WALLET: 'Claim to External Wallet',
  CLAIM_TO_SAFE: 'Claim to Safe Wallet',
  TRANSFER_TO_SAFE: 'Transfer to Safe Wallet',
};

const mockTransactions = [
  {
    id: 'tx001',
    type: TRANSACTION_TYPES.PORTFOLIO_GROWTH,
    amount_usd: 2850,
    amount_rama: 116.33,
    source: 'Daily Growth Accrual',
    destination: 'Safe Wallet',
    timestamp: '2024-10-17 14:23:45',
    status: 'completed',
    fee: 0,
    txHash: '0x7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x',
  },
  {
    id: 'tx002',
    type: TRANSACTION_TYPES.SLAB_INCOME,
    amount_usd: 1250,
    amount_rama: 51.02,
    source: 'Team Member: 0x1234...5678',
    destination: 'Safe Wallet',
    timestamp: '2024-10-17 11:15:30',
    status: 'completed',
    fee: 0,
    txHash: '0x8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y',
    incomeDetails: {
      slabLevel: 3,
      percentage: 12,
      teamMember: '0x1234...5678',
    },
  },
  {
    id: 'tx003',
    type: TRANSACTION_TYPES.CLAIM_TO_WALLET,
    amount_usd: 5000,
    amount_rama: 204.08,
    source: 'Portfolio Growth',
    destination: 'External Wallet',
    timestamp: '2024-10-16 16:42:18',
    status: 'completed',
    fee: 5,
    feeAmount: 10.20,
    netAmount: 193.88,
    txHash: '0x9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z',
  },
  {
    id: 'tx004',
    type: TRANSACTION_TYPES.PORTFOLIO_CREATED,
    amount_usd: 15000,
    amount_rama: 612.24,
    source: 'Safe Wallet',
    destination: 'Portfolio #2',
    timestamp: '2024-10-16 09:30:12',
    status: 'completed',
    fee: 0,
    portfolioDetails: {
      isBooster: true,
      commission: 0,
      walletType: 'Safe Wallet',
    },
  },
  {
    id: 'tx005',
    type: TRANSACTION_TYPES.ROYALTY_INCOME,
    amount_usd: 8000,
    amount_rama: 326.53,
    source: 'Monthly Royalty - Level 7',
    destination: 'Safe Wallet',
    timestamp: '2024-10-15 00:01:05',
    status: 'completed',
    fee: 0,
    txHash: '0xa0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3',
    royaltyDetails: {
      level: 7,
      monthlyPayout: 8000,
    },
  },
  {
    id: 'tx006',
    type: TRANSACTION_TYPES.SAME_SLAB_OVERRIDE,
    amount_usd: 450,
    amount_rama: 18.37,
    source: 'Override from 0x2345...6789',
    destination: 'Safe Wallet',
    timestamp: '2024-10-14 18:22:45',
    status: 'completed',
    fee: 0,
    txHash: '0xb1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4',
    overrideDetails: {
      wave: 'First Wave',
      percentage: 10,
      sourceMember: '0x2345...6789',
    },
  },
  {
    id: 'tx007',
    type: TRANSACTION_TYPES.ONE_TIME_REWARD,
    amount_usd: 10000,
    amount_rama: 408.16,
    source: 'Milestone Achievement #3',
    destination: 'Safe Wallet',
    timestamp: '2024-10-13 12:45:30',
    status: 'completed',
    fee: 0,
    txHash: '0xc2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5',
    rewardDetails: {
      milestone: 3,
      rewardName: 'Shell Harvest',
    },
  },
  {
    id: 'tx008',
    type: TRANSACTION_TYPES.PORTFOLIO_CREATED,
    amount_usd: 5000,
    amount_rama: 204.08,
    source: 'External Wallet',
    destination: 'Portfolio #1',
    timestamp: '2024-10-12 10:15:00',
    status: 'completed',
    fee: 5,
    feeAmount: 10.20,
    txHash: '0xd3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6',
    portfolioDetails: {
      isBooster: false,
      commission: 5,
      walletType: 'External Wallet',
      upline: '0xabcd...ef01',
    },
  },
  {
    id: 'tx009',
    type: TRANSACTION_TYPES.TRANSFER_TO_SAFE,
    amount_usd: 3200,
    amount_rama: 130.61,
    source: 'Portfolio Growth Claim',
    destination: 'Safe Wallet',
    timestamp: '2024-10-11 15:30:22',
    status: 'completed',
    fee: 0,
    txHash: '0xe4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7',
  },
  {
    id: 'tx010',
    type: TRANSACTION_TYPES.CLAIM_TO_SAFE,
    amount_usd: 4500,
    amount_rama: 183.67,
    source: 'Slab Income',
    destination: 'Safe Wallet',
    timestamp: '2024-10-10 08:45:15',
    status: 'completed',
    fee: 0,
    txHash: '0xf5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8',
  },
  {
    id: 'tx011',
    type: TRANSACTION_TYPES.SLAB_INCOME,
    amount_usd: 875,
    amount_rama: 35.71,
    source: 'Team Member: 0x3456...7890',
    destination: 'Safe Wallet',
    timestamp: '2024-10-09 14:20:40',
    status: 'completed',
    fee: 0,
    txHash: '0x06j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9',
    incomeDetails: {
      slabLevel: 3,
      percentage: 12,
      teamMember: '0x3456...7890',
    },
  },
  {
    id: 'tx012',
    type: TRANSACTION_TYPES.PORTFOLIO_GROWTH,
    amount_usd: 1950,
    amount_rama: 79.59,
    source: 'Daily Growth Accrual',
    destination: 'Safe Wallet',
    timestamp: '2024-10-08 10:12:35',
    status: 'completed',
    fee: 0,
    txHash: '0x17k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0',
  },
];

const getTransactionIcon = (type) => {
  const iconMap = {
    [TRANSACTION_TYPES.PORTFOLIO_GROWTH]: TrendingUp,
    [TRANSACTION_TYPES.SLAB_INCOME]: Award,
    [TRANSACTION_TYPES.ROYALTY_INCOME]: Trophy,
    [TRANSACTION_TYPES.SAME_SLAB_OVERRIDE]: Layers,
    [TRANSACTION_TYPES.ONE_TIME_REWARD]: Gift,
    [TRANSACTION_TYPES.PORTFOLIO_CREATED]: Wallet,
    [TRANSACTION_TYPES.CLAIM_TO_WALLET]: ArrowUpRight,
    [TRANSACTION_TYPES.CLAIM_TO_SAFE]: ArrowDownRight,
    [TRANSACTION_TYPES.TRANSFER_TO_SAFE]: ArrowDownRight,
  };
  return iconMap[type] || History;
};

const getTransactionColor = (type) => {
  const colorMap = {
    [TRANSACTION_TYPES.PORTFOLIO_GROWTH]: 'neon-green',
    [TRANSACTION_TYPES.SLAB_INCOME]: 'neon-purple',
    [TRANSACTION_TYPES.ROYALTY_INCOME]: 'neon-orange',
    [TRANSACTION_TYPES.SAME_SLAB_OVERRIDE]: 'cyan-400',
    [TRANSACTION_TYPES.ONE_TIME_REWARD]: 'blue-400',
    [TRANSACTION_TYPES.PORTFOLIO_CREATED]: 'cyan-500',
    [TRANSACTION_TYPES.CLAIM_TO_WALLET]: 'neon-pink',
    [TRANSACTION_TYPES.CLAIM_TO_SAFE]: 'neon-green',
    [TRANSACTION_TYPES.TRANSFER_TO_SAFE]: 'cyan-400',
  };
  return colorMap[type] || 'cyan-400';
};

export default function TransactionHistory() {
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTx, setExpandedTx] = useState(null);

  const filteredTransactions = mockTransactions.filter(tx => {
    const matchesType = selectedType === 'all' || tx.type === selectedType;
    const matchesSearch =
      tx.txHash?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalEarnings = mockTransactions.reduce((sum, tx) => sum + tx.amount_usd, 0);
  const totalTransactions = mockTransactions.length;
  const completedTransactions = mockTransactions.filter(tx => tx.status === 'completed').length;

  const incomeStreamTotals = {
    portfolioGrowth: mockTransactions.filter(tx => tx.type === TRANSACTION_TYPES.PORTFOLIO_GROWTH).reduce((sum, tx) => sum + tx.amount_usd, 0),
    slabIncome: mockTransactions.filter(tx => tx.type === TRANSACTION_TYPES.SLAB_INCOME).reduce((sum, tx) => sum + tx.amount_usd, 0),
    royaltyIncome: mockTransactions.filter(tx => tx.type === TRANSACTION_TYPES.ROYALTY_INCOME).reduce((sum, tx) => sum + tx.amount_usd, 0),
    sameSlabOverride: mockTransactions.filter(tx => tx.type === TRANSACTION_TYPES.SAME_SLAB_OVERRIDE).reduce((sum, tx) => sum + tx.amount_usd, 0),
    oneTimeReward: mockTransactions.filter(tx => tx.type === TRANSACTION_TYPES.ONE_TIME_REWARD).reduce((sum, tx) => sum + tx.amount_usd, 0),
  };

  const portfolioCreations = mockTransactions.filter(tx => tx.type === TRANSACTION_TYPES.PORTFOLIO_CREATED);
  const safeWalletCreations = portfolioCreations.filter(tx => tx.portfolioDetails?.walletType === 'Safe Wallet');
  const externalWalletCreations = portfolioCreations.filter(tx => tx.portfolioDetails?.walletType === 'External Wallet');

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-neon-green relative inline-block">
          Transaction History
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-neon-green/20 blur-xl -z-10" />
        </h1>
        <p className="text-sm sm:text-base text-cyan-300/90 mt-1">Complete record of all your earnings and transactions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="cyber-glass rounded-xl p-4 border border-cyan-500/30 hover:border-cyan-500/80 relative overflow-hidden group transition-all">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-cyan-500/20 rounded-lg flex-shrink-0 border border-cyan-500/30">
              <History size={20} className="text-cyan-400" />
            </div>
            <p className="text-xs text-cyan-400 uppercase tracking-wide">Total Transactions</p>
          </div>
          <p className="text-2xl font-bold text-cyan-300">{totalTransactions}</p>
          <p className="text-xs text-neon-green mt-1">{completedTransactions} completed</p>
        </div>

        <div className="cyber-glass rounded-xl p-4 border border-neon-green/30 hover:border-neon-green/80 relative overflow-hidden group transition-all">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-green/50 to-transparent" />
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-neon-green/20 rounded-lg flex-shrink-0 border border-neon-green/30">
              <TrendingUp size={20} className="text-neon-green" />
            </div>
            <p className="text-xs text-neon-green uppercase tracking-wide">Total Volume</p>
          </div>
          <p className="text-2xl font-bold text-neon-green">${totalEarnings.toLocaleString()}</p>
          <p className="text-xs text-cyan-300/90 mt-1">All time earnings</p>
        </div>

        <div className="cyber-glass rounded-xl p-4 border border-neon-orange/30 hover:border-neon-orange/80 relative overflow-hidden group transition-all">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-orange/50 to-transparent" />
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-neon-orange/20 rounded-lg flex-shrink-0 border border-neon-orange/30">
              <Wallet size={20} className="text-neon-orange" />
            </div>
            <p className="text-xs text-neon-orange uppercase tracking-wide">Portfolios Created</p>
          </div>
          <p className="text-2xl font-bold text-neon-orange">{portfolioCreations.length}</p>
          <p className="text-xs text-cyan-300/90 mt-1">{safeWalletCreations.length} from Safe Wallet</p>
        </div>

        <div className="cyber-glass rounded-xl p-4 border border-cyan-400/30 hover:border-cyan-400/80 relative overflow-hidden group transition-all">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-cyan-400/20 rounded-lg flex-shrink-0 border border-cyan-400/30">
              <Clock size={20} className="text-cyan-400" />
            </div>
            <p className="text-xs text-cyan-400 uppercase tracking-wide">Latest Activity</p>
          </div>
          <p className="text-sm font-bold text-cyan-300">{mockTransactions[0]?.timestamp.split(' ')[0]}</p>
          <p className="text-xs text-cyan-300/90 mt-1">{mockTransactions[0]?.type}</p>
        </div>
      </div>

      <div className="cyber-glass rounded-2xl p-4 sm:p-6 border border-cyan-500/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <h2 className="text-base sm:text-lg font-semibold text-cyan-300 mb-4 uppercase tracking-wide">Income Stream Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="p-3 cyber-glass border border-neon-green/30 rounded-lg">
            <p className="text-xs text-neon-green/90 mb-1">Portfolio Growth</p>
            <p className="text-lg font-bold text-neon-green">${incomeStreamTotals.portfolioGrowth.toLocaleString()}</p>
          </div>
          <div className="p-3 cyber-glass border border-neon-purple/30 rounded-lg">
            <p className="text-xs text-neon-purple/90 mb-1">Slab Income</p>
            <p className="text-lg font-bold text-neon-purple">${incomeStreamTotals.slabIncome.toLocaleString()}</p>
          </div>
          <div className="p-3 cyber-glass border border-neon-orange/30 rounded-lg">
            <p className="text-xs text-neon-orange/90 mb-1">Royalty Income</p>
            <p className="text-lg font-bold text-neon-orange">${incomeStreamTotals.royaltyIncome.toLocaleString()}</p>
          </div>
          <div className="p-3 cyber-glass border border-cyan-400/30 rounded-lg">
            <p className="text-xs text-cyan-400/90 mb-1">Same-Slab Override</p>
            <p className="text-lg font-bold text-cyan-400">${incomeStreamTotals.sameSlabOverride.toLocaleString()}</p>
          </div>
          <div className="p-3 cyber-glass border border-blue-400/30 rounded-lg">
            <p className="text-xs text-blue-400/90 mb-1">One-Time Rewards</p>
            <p className="text-lg font-bold text-blue-400">${incomeStreamTotals.oneTimeReward.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="cyber-glass rounded-2xl p-4 sm:p-6 border border-cyan-500/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-xs text-cyan-400 mb-2 uppercase tracking-wide">Filter by Type</label>
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-dark-900 border border-cyan-500/30 rounded-lg px-4 py-2.5 text-cyan-300 text-sm appearance-none cursor-pointer hover:border-cyan-500/50 focus:border-cyan-500 focus:outline-none transition-colors"
              >
                <option value="all">All Transactions</option>
                <option value={TRANSACTION_TYPES.PORTFOLIO_GROWTH}>Portfolio Growth</option>
                <option value={TRANSACTION_TYPES.SLAB_INCOME}>Slab Income</option>
                <option value={TRANSACTION_TYPES.ROYALTY_INCOME}>Royalty Income</option>
                <option value={TRANSACTION_TYPES.SAME_SLAB_OVERRIDE}>Same-Slab Override</option>
                <option value={TRANSACTION_TYPES.ONE_TIME_REWARD}>One-Time Rewards</option>
                <option value={TRANSACTION_TYPES.PORTFOLIO_CREATED}>Portfolio Created</option>
                <option value={TRANSACTION_TYPES.CLAIM_TO_WALLET}>Claims to External Wallet</option>
                <option value={TRANSACTION_TYPES.CLAIM_TO_SAFE}>Claims to Safe Wallet</option>
                <option value={TRANSACTION_TYPES.TRANSFER_TO_SAFE}>Transfers to Safe Wallet</option>
              </select>
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-xs text-cyan-400 mb-2 uppercase tracking-wide">Search</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by hash or address..."
                className="w-full bg-dark-900 border border-cyan-500/30 rounded-lg px-4 py-2.5 text-cyan-300 text-sm placeholder-cyan-400/50 hover:border-cyan-500/50 focus:border-cyan-500 focus:outline-none transition-colors"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="flex items-end">
            <button className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-neon-green text-dark-950 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2 text-sm">
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredTransactions.map((tx) => {
            const Icon = getTransactionIcon(tx.type);
            const color = getTransactionColor(tx.type);
            const isExpanded = expandedTx === tx.id;

            return (
              <div
                key={tx.id}
                className="cyber-glass border border-cyan-500/20 rounded-lg hover:border-cyan-500/40 transition-all overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedTx(isExpanded ? null : tx.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`p-2 bg-${color}/20 rounded-lg flex-shrink-0 border border-${color}/30`}>
                        <Icon size={18} className={`text-${color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-cyan-300 text-sm sm:text-base truncate">{tx.type}</p>
                          {tx.status === 'completed' && (
                            <CheckCircle size={14} className="text-neon-green flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-cyan-300/90 truncate">{tx.source}</p>
                        <p className="text-xs text-cyan-400/70 mt-1">{tx.timestamp}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-lg font-bold text-${color}`}>${tx.amount_usd.toLocaleString()}</p>
                      <p className="text-xs text-cyan-300/90">{tx.amount_rama.toFixed(2)} RAMA</p>
                      {tx.fee > 0 && (
                        <p className="text-xs text-neon-orange mt-1">-{tx.fee}% fee</p>
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-cyan-500/20 p-4 bg-dark-900/30">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-cyan-400 mb-2 uppercase tracking-wide">Transaction Details</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-cyan-300/70">Destination:</span>
                            <span className="text-cyan-300 font-medium">{tx.destination}</span>
                          </div>
                          {tx.fee > 0 && (
                            <>
                              <div className="flex justify-between text-sm">
                                <span className="text-cyan-300/70">Fee ({tx.fee}%):</span>
                                <span className="text-neon-orange font-medium">{tx.feeAmount?.toFixed(2)} RAMA</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-cyan-300/70">Net Amount:</span>
                                <span className="text-neon-green font-medium">{tx.netAmount?.toFixed(2)} RAMA</span>
                              </div>
                            </>
                          )}
                          <div className="flex justify-between text-sm">
                            <span className="text-cyan-300/70">Status:</span>
                            <span className="text-neon-green font-medium capitalize">{tx.status}</span>
                          </div>
                        </div>
                      </div>

                      {tx.txHash && (
                        <div>
                          <p className="text-xs text-cyan-400 mb-2 uppercase tracking-wide">Transaction Hash</p>
                          <div className="p-3 cyber-glass border border-cyan-500/20 rounded-lg">
                            <p className="text-xs font-mono text-cyan-300 break-all">{tx.txHash}</p>
                          </div>
                        </div>
                      )}

                      {tx.incomeDetails && (
                        <div className="md:col-span-2">
                          <p className="text-xs text-cyan-400 mb-2 uppercase tracking-wide">Income Details</p>
                          <div className="p-3 cyber-glass border border-neon-purple/20 rounded-lg">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-cyan-300/70">Slab Level:</span>
                                <span className="text-neon-purple font-medium ml-2">{tx.incomeDetails.slabLevel}</span>
                              </div>
                              <div>
                                <span className="text-cyan-300/70">Percentage:</span>
                                <span className="text-neon-purple font-medium ml-2">{tx.incomeDetails.percentage}%</span>
                              </div>
                              <div>
                                <span className="text-cyan-300/70">From:</span>
                                <span className="text-cyan-300 font-medium ml-2 font-mono text-xs">{tx.incomeDetails.teamMember}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {tx.portfolioDetails && (
                        <div className="md:col-span-2">
                          <p className="text-xs text-cyan-400 mb-2 uppercase tracking-wide">Portfolio Details</p>
                          <div className="p-3 cyber-glass border border-cyan-500/20 rounded-lg">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-cyan-300/70">Type:</span>
                                <span className={`ml-2 font-medium ${tx.portfolioDetails.isBooster ? 'text-neon-orange' : 'text-cyan-300'}`}>
                                  {tx.portfolioDetails.isBooster ? 'Booster' : 'Regular'}
                                </span>
                              </div>
                              <div>
                                <span className="text-cyan-300/70">Source:</span>
                                <span className="text-cyan-300 font-medium ml-2">{tx.portfolioDetails.walletType}</span>
                              </div>
                              <div>
                                <span className="text-cyan-300/70">Commission:</span>
                                <span className={`font-medium ml-2 ${tx.portfolioDetails.commission === 0 ? 'text-neon-green' : 'text-neon-orange'}`}>
                                  {tx.portfolioDetails.commission}%
                                </span>
                              </div>
                              {tx.portfolioDetails.upline && (
                                <div>
                                  <span className="text-cyan-300/70">Upline:</span>
                                  <span className="text-cyan-300 font-medium ml-2 font-mono text-xs">{tx.portfolioDetails.upline}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {tx.royaltyDetails && (
                        <div className="md:col-span-2">
                          <p className="text-xs text-cyan-400 mb-2 uppercase tracking-wide">Royalty Details</p>
                          <div className="p-3 cyber-glass border border-neon-orange/20 rounded-lg">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-cyan-300/70">Royalty Level:</span>
                                <span className="text-neon-orange font-medium ml-2">{tx.royaltyDetails.level}</span>
                              </div>
                              <div>
                                <span className="text-cyan-300/70">Monthly Payout:</span>
                                <span className="text-neon-orange font-medium ml-2">${tx.royaltyDetails.monthlyPayout.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {tx.overrideDetails && (
                        <div className="md:col-span-2">
                          <p className="text-xs text-cyan-400 mb-2 uppercase tracking-wide">Override Details</p>
                          <div className="p-3 cyber-glass border border-cyan-400/20 rounded-lg">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-cyan-300/70">Wave:</span>
                                <span className="text-cyan-400 font-medium ml-2">{tx.overrideDetails.wave}</span>
                              </div>
                              <div>
                                <span className="text-cyan-300/70">Percentage:</span>
                                <span className="text-cyan-400 font-medium ml-2">{tx.overrideDetails.percentage}%</span>
                              </div>
                              <div>
                                <span className="text-cyan-300/70">From:</span>
                                <span className="text-cyan-300 font-medium ml-2 font-mono text-xs">{tx.overrideDetails.sourceMember}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {tx.rewardDetails && (
                        <div className="md:col-span-2">
                          <p className="text-xs text-cyan-400 mb-2 uppercase tracking-wide">Reward Details</p>
                          <div className="p-3 cyber-glass border border-blue-400/20 rounded-lg">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-cyan-300/70">Milestone:</span>
                                <span className="text-blue-400 font-medium ml-2">#{tx.rewardDetails.milestone}</span>
                              </div>
                              <div>
                                <span className="text-cyan-300/70">Reward Name:</span>
                                <span className="text-blue-400 font-medium ml-2">{tx.rewardDetails.rewardName}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle size={48} className="text-cyan-400/50 mx-auto mb-4" />
            <p className="text-cyan-300/70 text-lg">No transactions found</p>
            <p className="text-cyan-400/50 text-sm mt-2">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
