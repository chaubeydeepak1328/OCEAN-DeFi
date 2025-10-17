import { useState } from 'react';
import { TrendingUp, Wallet, AlertCircle, Clock, CheckCircle, Award, Layers, Gift, ChevronDown } from 'lucide-react';
import { getMockPortfolioDetails, getMockIncomeStreams, formatUSD } from '../utils/contractData';
import NumberPopup from '../components/NumberPopup';

export default function ClaimEarnings() {
  const [selectedIncomeType, setSelectedIncomeType] = useState('');
  const [destination, setDestination] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const portfolio = getMockPortfolioDetails();
  const incomeStreams = getMockIncomeStreams();

  const totalAvailableUSD =
    parseFloat(incomeStreams.portfolioGrowth.availableUSD) +
    parseFloat(incomeStreams.slabIncome.availableUSD) +
    parseFloat(incomeStreams.royaltyIncome.availableUSD) +
    parseFloat(incomeStreams.sameSlabOverride.availableUSD) +
    parseFloat(incomeStreams.oneTimeReward.availableUSD);

  const accruedUSD = totalAvailableUSD / 1e8;
  const ramaPrice = 0.0245;
  const totalRamaAmount = accruedUSD / ramaPrice;

  const incomeOptions = [
    {
      id: 'portfolioGrowth',
      name: 'Portfolio Growth',
      description: 'From staking rewards',
      amount: incomeStreams.portfolioGrowth.availableUSD,
      icon: TrendingUp,
      color: 'neon-green',
      status: incomeStreams.portfolioGrowth.status,
      lastClaim: incomeStreams.portfolioGrowth.lastClaimDate,
    },
    {
      id: 'slabIncome',
      name: 'Slab Income',
      description: 'Team difference income',
      amount: incomeStreams.slabIncome.availableUSD,
      icon: Award,
      color: 'neon-purple',
      status: incomeStreams.slabIncome.status,
      lastClaim: incomeStreams.slabIncome.lastClaimDate,
      cooldownEnds: incomeStreams.slabIncome.cooldownEndsAt,
    },
    {
      id: 'royaltyIncome',
      name: 'Royalty Income',
      description: 'Monthly leadership rewards',
      amount: incomeStreams.royaltyIncome.availableUSD,
      icon: Award,
      color: 'neon-orange',
      status: incomeStreams.royaltyIncome.status,
      lastClaim: incomeStreams.royaltyIncome.lastClaimDate,
      nextEligible: incomeStreams.royaltyIncome.nextEligibleDate,
    },
    {
      id: 'sameSlabOverride',
      name: 'Same-Slab Override',
      description: 'Override bonuses',
      amount: incomeStreams.sameSlabOverride.availableUSD,
      icon: Layers,
      color: 'cyan-400',
      status: incomeStreams.sameSlabOverride.status,
      lastClaim: incomeStreams.sameSlabOverride.lastClaimDate,
    },
    {
      id: 'oneTimeReward',
      name: 'One-Time Reward',
      description: 'Achievement bonus',
      amount: incomeStreams.oneTimeReward.availableUSD,
      icon: Gift,
      color: 'blue-400',
      status: incomeStreams.oneTimeReward.status,
      lastClaim: incomeStreams.oneTimeReward.lastClaimDate,
      rewardLevel: incomeStreams.oneTimeReward.rewardLevel,
    },
  ];

  const selectedIncome = incomeOptions.find(opt => opt.id === selectedIncomeType);

  const calculateDetails = () => {
    if (!selectedIncome) return { usd: 0, rama: 0, fee: 0, net: 0 };
    const usd = parseFloat(selectedIncome.amount) / 1e8;
    const rama = usd / ramaPrice;
    const fee = destination === 'external' ? rama * 0.05 : 0;
    const net = rama - fee;
    return { usd, rama, fee, net };
  };

  const details = calculateDetails();
  const canClaim = selectedIncomeType && destination && details.usd >= 1;

  const handleClaim = () => {
    if (!canClaim) return;
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedIncomeType('');
      setDestination('');
    }, 3000);
  };

  const portfolioCapRemaining = (parseFloat(portfolio.maxCapUSD) - parseFloat(portfolio.totalEarnedUSD)) / 1e8;
  const globalCapRemaining = (parseFloat(portfolio.maxLifetimeEarnableUSD) - parseFloat(portfolio.totalLifetimeEarnedUSD)) / 1e8;

  const getColorClasses = (color) => {
    const colors = {
      'neon-green': 'text-neon-green border-neon-green/50 bg-neon-green/5',
      'neon-purple': 'text-neon-purple border-neon-purple/50 bg-neon-purple/5',
      'neon-orange': 'text-neon-orange border-neon-orange/50 bg-neon-orange/5',
      'cyan-400': 'text-cyan-400 border-cyan-400/50 bg-cyan-400/5',
      'blue-400': 'text-blue-400 border-blue-400/50 bg-blue-400/5',
    };
    return colors[color] || colors['cyan-400'];
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-neon-green relative inline-block">
          Claim Earnings
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-neon-green/20 blur-xl -z-10" />
        </h1>
        <p className="text-sm sm:text-base text-cyan-300/90 mt-1">Withdraw your accumulated rewards</p>
      </div>

      {showSuccess && (
        <div className="cyber-glass border-2 border-neon-green rounded-xl p-4 sm:p-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neon-green/20 rounded-full">
              <CheckCircle size={24} className="text-neon-green" />
            </div>
            <div>
              <p className="font-bold text-neon-green text-sm sm:text-base">Claim Successful!</p>
              <p className="text-xs sm:text-sm text-cyan-300">
                {details.net.toFixed(2)} RAMA from {selectedIncome?.name} claimed to{' '}
                {destination === 'safe' ? 'Safe Wallet' : 'External Wallet'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="cyber-glass border border-neon-green/50 hover:border-neon-green rounded-2xl p-4 sm:p-6 lg:p-8 text-white relative overflow-hidden group transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-green/10 to-cyan-500/10 opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-green/70 to-transparent" />
            <div className="flex items-center gap-3 mb-4 sm:mb-6 relative z-10">
              <div className="p-2 sm:p-3 bg-neon-green/20 rounded-xl backdrop-blur-sm flex-shrink-0 border border-neon-green/30">
                <TrendingUp size={20} className="sm:w-6 sm:h-6 text-neon-green" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-neon-green font-medium truncate uppercase tracking-wide">Total Available to Claim</p>
                <p className="text-xs text-cyan-300/90 truncate">From all income streams</p>
              </div>
            </div>
            <NumberPopup
              value={`$${accruedUSD.toFixed(2)}`}
              label="Total Available"
              className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-2 text-neon-green relative z-10"
            />
            <NumberPopup
              value={`≈ ${totalRamaAmount.toFixed(2)} RAMA`}
              label="RAMA Equivalent"
              className="text-sm sm:text-base lg:text-lg text-cyan-300 relative z-10"
            />
          </div>

          <div className="cyber-glass rounded-2xl p-4 sm:p-6 border border-cyan-500/30 hover:border-cyan-500/80 relative overflow-hidden transition-all">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <h2 className="text-base sm:text-lg font-semibold text-cyan-300 mb-3 sm:mb-4 uppercase tracking-wide">How to Claim</h2>

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-cyan-500/20 to-neon-green/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs sm:text-sm font-bold text-cyan-300">1</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-cyan-300">Select Income Stream</p>
                  <p className="text-xs text-cyan-300/90">Choose which income type you want to claim</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-cyan-500/20 to-neon-green/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs sm:text-sm font-bold text-cyan-300">2</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-cyan-300">Choose Destination</p>
                  <p className="text-xs text-cyan-300/90">Safe Wallet (0% fee) or External Wallet (5% fee)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-cyan-500/20 to-neon-green/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs sm:text-sm font-bold text-cyan-300">3</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-cyan-300">Confirm & Claim</p>
                  <p className="text-xs text-cyan-300/90">Review details and complete your claim</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-cyan-300 mb-2 uppercase tracking-wide">
                  Step 1: Select Income Stream
                </label>
                <div className="relative">
                  <select
                    value={selectedIncomeType}
                    onChange={(e) => setSelectedIncomeType(e.target.value)}
                    className="w-full bg-dark-900 border-2 border-cyan-500/30 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-cyan-300 text-sm sm:text-base appearance-none cursor-pointer hover:border-cyan-500/50 focus:border-cyan-500 focus:outline-none transition-colors"
                  >
                    <option value="">Choose income type...</option>
                    {incomeOptions.map((option) => {
                      const amount = parseFloat(option.amount) / 1e8;
                      const isDisabled = option.status === 'cooldown';
                      return (
                        <option key={option.id} value={option.id} disabled={isDisabled}>
                          {option.name} - ${amount.toFixed(2)} {isDisabled ? '(Cooldown)' : ''}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none" size={20} />
                </div>

                {selectedIncome && (
                  <div className={`mt-3 p-3 sm:p-4 rounded-lg border-2 ${getColorClasses(selectedIncome.color)}`}>
                    <div className="flex items-start gap-3">
                      <selectedIncome.icon size={20} className={`flex-shrink-0 text-${selectedIncome.color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm sm:text-base text-cyan-300">{selectedIncome.name}</p>
                        <p className="text-xs text-cyan-300/80 mb-2">{selectedIncome.description}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                          <span className="text-cyan-300">
                            <span className="text-cyan-300/70">Amount:</span>{' '}
                            <span className="font-bold">${details.usd.toFixed(2)}</span>
                          </span>
                          <span className="text-cyan-300">
                            <span className="text-cyan-300/70">RAMA:</span>{' '}
                            <span className="font-bold">{details.rama.toFixed(2)}</span>
                          </span>
                        </div>
                        {selectedIncome.lastClaim && (
                          <p className="text-xs text-cyan-300/60 mt-2">Last claimed: {selectedIncome.lastClaim}</p>
                        )}
                        {selectedIncome.cooldownEnds && selectedIncome.status === 'cooldown' && (
                          <p className="text-xs text-neon-orange mt-2">Available after: {selectedIncome.cooldownEnds}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {selectedIncomeType && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-cyan-300 mb-2 uppercase tracking-wide">
                    Step 2: Choose Destination
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    <button
                      onClick={() => setDestination('safe')}
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden group ${
                        destination === 'safe'
                          ? 'border-neon-green bg-neon-green/10 shadow-lg/20'
                          : 'border-cyan-500/20 hover:border-cyan-500/40 bg-dark-900/30'
                      }`}
                    >
                      {destination === 'safe' && (
                        <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent" />
                      )}
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 relative z-10">
                        <Wallet className={destination === 'safe' ? 'text-neon-green' : 'text-cyan-400/50'} size={20} />
                        <span className={`font-semibold text-sm sm:text-base ${destination === 'safe' ? 'text-neon-green' : 'text-cyan-400'}`}>
                          Safe Wallet
                        </span>
                      </div>
                      <div className="space-y-1 relative z-10">
                        <div className="flex items-center gap-2 text-xs">
                          <CheckCircle size={14} className="text-neon-green flex-shrink-0" />
                          <span className="text-cyan-300">0% Deduction</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <CheckCircle size={14} className="text-neon-green flex-shrink-0" />
                          <span className="text-cyan-300">Instant Transfer</span>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setDestination('external')}
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden group ${
                        destination === 'external'
                          ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                          : 'border-cyan-500/20 hover:border-cyan-500/40 bg-dark-900/30'
                      }`}
                    >
                      {destination === 'external' && (
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent" />
                      )}
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 relative z-10">
                        <Wallet className={destination === 'external' ? 'text-cyan-400' : 'text-cyan-400/50'} size={20} />
                        <span className={`font-semibold text-sm sm:text-base ${destination === 'external' ? 'text-cyan-400' : 'text-cyan-400'}`}>
                          External Wallet
                        </span>
                      </div>
                      <div className="space-y-1 relative z-10">
                        <div className="flex items-center gap-2 text-xs">
                          <AlertCircle size={14} className="text-neon-orange flex-shrink-0" />
                          <span className="text-cyan-300">5% Deduction</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <CheckCircle size={14} className="text-cyan-400 flex-shrink-0" />
                          <span className="text-cyan-300">Triggers Team Rewards</span>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {selectedIncomeType && destination && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-cyan-300 mb-2 uppercase tracking-wide">
                    Step 3: Review & Claim
                  </label>
                  <div className="cyber-glass border border-cyan-500/30 rounded-lg p-3 sm:p-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-cyan-300">Income Type</span>
                        <span className="font-medium text-cyan-300">{selectedIncome?.name}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-cyan-300">Gross Amount</span>
                        <span className="font-medium text-cyan-300">{details.rama.toFixed(2)} RAMA</span>
                      </div>
                      {destination === 'external' && (
                        <div className="flex justify-between items-center text-xs sm:text-sm text-neon-orange">
                          <span>Deduction (5%)</span>
                          <span className="font-medium">-{details.fee.toFixed(2)} RAMA</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-2 border-t border-cyan-500/30">
                        <span className="text-xs sm:text-sm font-semibold text-cyan-300 uppercase tracking-wide">Net Amount</span>
                        <span className="font-bold text-sm sm:text-base text-neon-green">{details.net.toFixed(2)} RAMA</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleClaim}
                    disabled={!canClaim}
                    className={`w-full py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base transition-all uppercase tracking-wide relative overflow-hidden group ${
                      canClaim
                        ? 'bg-gradient-to-r from-cyan-500 to-neon-green text-dark-950 hover:shadow-lg hover:shadow-neon-cyan/50 hover:scale-[1.02]'
                        : 'bg-dark-850 text-cyan-400/30 cursor-not-allowed border border-cyan-500/20'
                    }`}
                  >
                    {canClaim && (
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                    <span className="relative z-10">
                      {canClaim
                        ? `Claim ${selectedIncome?.name} to ${destination === 'safe' ? 'Safe Wallet' : 'External Wallet'}`
                        : 'Select Income & Destination'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="cyber-glass rounded-2xl p-4 sm:p-6 border border-cyan-500/30 hover:border-cyan-500/80 relative overflow-hidden transition-all">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <h2 className="text-base sm:text-lg font-semibold text-cyan-300 mb-3 sm:mb-4 uppercase tracking-wide">Claiming Rules</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-neon-green/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-cyan-300">1</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-cyan-300">Minimum Claim</p>
                  <p className="text-xs text-cyan-300/90">Each income stream requires at least $1 USD to claim</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-neon-green/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-cyan-300">2</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-cyan-300">External Wallet Claims</p>
                  <p className="text-xs text-cyan-300/90">Triggers slab income distribution to your upline team</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-neon-green/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-cyan-300">3</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-cyan-300">Safe Wallet Claims</p>
                  <p className="text-xs text-cyan-300/90">No deduction, instant transfer, funds only for portfolio creation</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="cyber-glass rounded-2xl p-4 sm:p-6 border border-cyan-500/30 hover:border-cyan-500/80 relative overflow-hidden transition-all">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <h3 className="font-semibold text-sm sm:text-base text-cyan-300 mb-4 uppercase tracking-wide">Cap Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-cyan-400 uppercase tracking-wider">Portfolio Cap</span>
                  <span className="text-xs font-bold text-cyan-300">
                    {((parseFloat(portfolio.totalEarnedUSD) / parseFloat(portfolio.maxCapUSD)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-dark-900 rounded-full overflow-hidden border border-cyan-500/30">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-neon-green rounded-full transition-all"
                    style={{ width: `${Math.min((parseFloat(portfolio.totalEarnedUSD) / parseFloat(portfolio.maxCapUSD)) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-cyan-300/90 mt-1">
                  {formatUSD(portfolioCapRemaining * 1e8)} remaining
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-cyan-400 uppercase tracking-wider">Global 4x Cap</span>
                  <span className="text-xs font-bold text-neon-green">
                    {((parseFloat(portfolio.totalLifetimeEarnedUSD) / parseFloat(portfolio.maxLifetimeEarnableUSD)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-dark-900 rounded-full overflow-hidden border border-cyan-500/30">
                  <div
                    className="h-full bg-gradient-to-r from-neon-green to-cyan-500 rounded-full transition-all"
                    style={{ width: `${Math.min((parseFloat(portfolio.totalLifetimeEarnedUSD) / parseFloat(portfolio.maxLifetimeEarnableUSD)) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-cyan-300/90 mt-1">
                  {formatUSD(globalCapRemaining * 1e8)} remaining
                </p>
              </div>
            </div>
          </div>

          <div className="cyber-glass border border-cyan-500/30 rounded-xl p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <Clock className="text-cyan-400 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-xs sm:text-sm font-medium text-cyan-300 mb-1 uppercase tracking-wide">Cooldown Period</p>
                <p className="text-xs text-cyan-300/90">
                  24-hour cooldown applies to slab income claims after external wallet withdrawals
                </p>
              </div>
            </div>
          </div>

          <div className="cyber-glass border border-neon-orange/30 rounded-xl p-3 sm:p-4 ">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className="text-neon-orange flex-shrink-0 mt-0.5 animate-pulse" size={18} />
              <div>
                <p className="text-xs sm:text-sm font-medium text-neon-orange mb-1 uppercase tracking-wide">Team Rewards</p>
                <p className="text-xs text-cyan-300/90">
                  When claiming to external wallet, 60% of growth is distributed to your upline team as slab income
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
