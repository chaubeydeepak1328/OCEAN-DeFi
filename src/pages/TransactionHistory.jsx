import { useEffect, useState } from 'react';
import { History, Filter, Download, Search, TrendingUp, Award, Trophy, Gift, Layers, Wallet, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { formatUSD, formatRAMA } from '../utils/contractData';
import Web3 from 'web3';
import OceanViewV2ABI from '../../store/Contract_ABI/OceanView2.json';
import OceanQueryUpgradeableABI from '../../store/Contract_ABI/OceanQueryUpgradeable.json';

const TRANSACTION_TYPES = {
  PORTFOLIO_GROWTH: 'Portfolio Growth',
  SLAB_INCOME: 'Slab Income',
  ROYALTY_INCOME: 'Royalty Income',
  SAME_SLAB_OVERRIDE: 'Same-Slab Override',
  ONE_TIME_REWARD: 'One-Time Reward',
  SPOT_INCOME: 'Spot Income',
  PORTFOLIO_CREATED: 'Portfolio Created',
  CLAIM_TO_WALLET: 'Claim to External Wallet',
  CLAIM_TO_SAFE: 'Claim to Safe Wallet',
  TRANSFER_TO_SAFE: 'Transfer to Safe Wallet',
};

// transactions will be loaded from chain
const OCEAN_QUERY_ADDRESS = '0x6bF2Fdcd0D0A79Ba65289d8d5EE17d4a6C2EC3e5';
const OCEAN_VIEW_V2_ADDRESS = '0x8f93fdf9A72574F9bbD40437EA1a88559082CaDD';
const RPC_URL = 'https://blockchain.ramestta.com';

const getTransactionIcon = (type) => {
  const iconMap = {
    [TRANSACTION_TYPES.PORTFOLIO_GROWTH]: TrendingUp,
    [TRANSACTION_TYPES.SLAB_INCOME]: Award,
    [TRANSACTION_TYPES.ROYALTY_INCOME]: Trophy,
    [TRANSACTION_TYPES.SAME_SLAB_OVERRIDE]: Layers,
    [TRANSACTION_TYPES.ONE_TIME_REWARD]: Gift,
    [TRANSACTION_TYPES.SPOT_INCOME]: Award,
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
    [TRANSACTION_TYPES.SPOT_INCOME]: 'cyan-400',
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
  const [transactions, setTransactions] = useState([]);
  const [recentCount, setRecentCount] = useState(0);
  const [incomeTotals, setIncomeTotals] = useState({ growth: 0, slab: 0, royalty: 0, overrideB: 0, rewards: 0 });

  useEffect(() => {
    const user = localStorage.getItem('userAddress');
    if (!user) return;
    const web3 = new Web3(RPC_URL);
    const view = new web3.eth.Contract(OceanViewV2ABI, OCEAN_VIEW_V2_ADDRESS);
    const query = new web3.eth.Contract(OceanQueryUpgradeableABI, OCEAN_QUERY_ADDRESS);

    (async () => {
      try {
        const [growth, slab, royalty, overrideB, rewards] = await query.methods.getIncomeStreamTotals(user).call();
        setIncomeTotals({
          growth: Number(growth) / 1e8,
          slab: Number(slab) / 1e8,
          royalty: Number(royalty) / 1e8,
          overrideB: Number(overrideB) / 1e8,
          rewards: Number(rewards) / 1e8,
        });

        const entries = await view.methods.getRecentTransactions(user, 50).call();
        setRecentCount(entries?.length || 0);
        // NOTE: entries are opaque bytes; decoder method not present yet
      } catch (e) {
        console.error('TransactionHistory load error:', e);
      }
    })();
  }, []);

  const filteredTransactions = transactions.filter(tx => {
    const matchesType = selectedType === 'all' || tx.type === selectedType;
    const matchesSearch =
      tx.txHash?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalEarnings = incomeTotals.growth + incomeTotals.slab + incomeTotals.royalty + incomeTotals.overrideB + incomeTotals.rewards;
  const totalTransactions = recentCount;
  const completedTransactions = recentCount;

  const incomeStreamTotals = {
    portfolioGrowth: incomeTotals.growth,
    slabIncome: incomeTotals.slab,
    royaltyIncome: incomeTotals.royalty,
    sameSlabOverride: incomeTotals.overrideB,
    oneTimeReward: incomeTotals.rewards,
  };

  const portfolioCreations = transactions.filter(tx => tx.type === TRANSACTION_TYPES.PORTFOLIO_CREATED);
  const safeWalletCreations = portfolioCreations.filter(tx => tx.portfolioDetails?.walletType === 'Safe Wallet');
  const externalWalletCreations = portfolioCreations.filter(tx => tx.portfolioDetails?.walletType === 'External Wallet');

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-neon-green relative inline-block">
          Income/Trx History
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-neon-green/20 blur-xl -z-10" />
        </h1>
        <p className="text-sm sm:text-base text-cyan-300/90 mt-1">Complete record of all your income streams and transactions</p>
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
          <p className="text-sm font-bold text-cyan-300">{transactions[0]?.timestamp?.split(' ')[0] || '-'}</p>
          <p className="text-xs text-cyan-300/90 mt-1">{transactions[0]?.type || '-'}</p>
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
                <option value={TRANSACTION_TYPES.SPOT_INCOME}>Spot Income</option>
                <option value={TRANSACTION_TYPES.PORTFOLIO_CREATED}>Portfolio Creation History</option>
                <option value={TRANSACTION_TYPES.CLAIM_TO_WALLET}>Transfer to External Wallet</option>
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

        {selectedType === TRANSACTION_TYPES.PORTFOLIO_CREATED ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyan-500/30">
                  <th className="text-left py-3 px-4 text-xs text-cyan-400 uppercase tracking-wide">Sr. No.</th>
                  <th className="text-left py-3 px-4 text-xs text-cyan-400 uppercase tracking-wide">Portfolio ID</th>
                  <th className="text-left py-3 px-4 text-xs text-cyan-400 uppercase tracking-wide">Amount (USD)</th>
                  <th className="text-left py-3 px-4 text-xs text-cyan-400 uppercase tracking-wide">Amount (RAMA)</th>
                  <th className="text-left py-3 px-4 text-xs text-cyan-400 uppercase tracking-wide">Created Date</th>
                  <th className="text-left py-3 px-4 text-xs text-cyan-400 uppercase tracking-wide">Growth Rate</th>
                  <th className="text-left py-3 px-4 text-xs text-cyan-400 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx, index) => (
                  <tr key={tx.id} className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors">
                    <td className="py-3 px-4 text-sm text-cyan-300">{index + 1}</td>
                    <td className="py-3 px-4 text-sm text-cyan-300 font-mono">{tx.portfolioDetails?.portfolioId || tx.destination}</td>
                    <td className="py-3 px-4 text-sm text-neon-green font-semibold">${tx.amount_usd.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-cyan-300">{tx.amount_rama.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm text-cyan-300">{tx.timestamp}</td>
                    <td className="py-3 px-4 text-sm text-neon-orange font-semibold">{tx.portfolioDetails?.growthRate || '0.5% Daily'}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        tx.status === 'completed' ? 'bg-neon-green/20 text-neon-green border border-neon-green/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {tx.status === 'completed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {tx.status === 'completed' ? 'Active' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyan-500/30">
                  <th className="text-left py-3 px-4 text-xs text-cyan-400 uppercase tracking-wide">Sr. No.</th>
                  <th className="text-left py-3 px-4 text-xs text-cyan-400 uppercase tracking-wide">Type</th>
                  <th className="text-left py-3 px-4 text-xs text-cyan-400 uppercase tracking-wide">Amount (USD)</th>
                  <th className="text-left py-3 px-4 text-xs text-cyan-400 uppercase tracking-wide">Amount (RAMA)</th>
                  <th className="text-left py-3 px-4 text-xs text-cyan-400 uppercase tracking-wide">Date</th>
                  <th className="text-left py-3 px-4 text-xs text-cyan-400 uppercase tracking-wide">From</th>
                  <th className="text-left py-3 px-4 text-xs text-cyan-400 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx, index) => {
                  const Icon = getTransactionIcon(tx.type);
                  const color = getTransactionColor(tx.type);
                  const isExpanded = expandedTx === tx.id;

                  return (
                    <>
                      <tr
                        key={tx.id}
                        className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors cursor-pointer"
                        onClick={() => setExpandedTx(isExpanded ? null : tx.id)}
                      >
                        <td className="py-3 px-4 text-sm text-cyan-300">{index + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 bg-${color}/20 rounded border border-${color}/30`}>
                              <Icon size={14} className={`text-${color}`} />
                            </div>
                            <span className="text-sm text-cyan-300 font-medium">{tx.type}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-neon-green font-semibold">${tx.amount_usd.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-cyan-300">{tx.amount_rama.toFixed(2)}</td>
                        <td className="py-3 px-4 text-sm text-cyan-300">{tx.timestamp}</td>
                        <td className="py-3 px-4 text-sm text-cyan-300/90 font-mono text-xs">{tx.source}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            tx.status === 'completed' ? 'bg-neon-green/20 text-neon-green border border-neon-green/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}>
                            {tx.status === 'completed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                            {tx.status === 'completed' ? 'Claimed' : 'Pending'}
                          </span>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr>
                          <td colSpan="7" className="p-0">
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

                                {tx.spotIncomeDetails && (
                                  <div className="md:col-span-2">
                                    <p className="text-xs text-cyan-400 mb-2 uppercase tracking-wide">Spot Income Details</p>
                                    <div className="p-3 cyber-glass border border-cyan-400/20 rounded-lg">
                                      <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                          <span className="text-cyan-300/70">Referral Level:</span>
                                          <span className="text-cyan-400 font-medium ml-2">{tx.spotIncomeDetails.referralLevel}</span>
                                        </div>
                                        <div>
                                          <span className="text-cyan-300/70">Percentage:</span>
                                          <span className="text-cyan-400 font-medium ml-2">{tx.spotIncomeDetails.percentage}%</span>
                                        </div>
                                        <div>
                                          <span className="text-cyan-300/70">From User:</span>
                                          <span className="text-cyan-300 font-medium ml-2 font-mono text-xs">{tx.spotIncomeDetails.fromUser}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

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


