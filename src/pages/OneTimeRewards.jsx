import { Gift, CheckCircle, Lock } from 'lucide-react';
import { ONE_TIME_REWARDS, formatUSD, getMockUserStatus } from '../utils/contractData';

// Ocean-themed one-time reward names with symbolic meanings
const REWARD_NAMES = [
  'Coral Spark',        // 1 - $6,000 - First coral forms – the starting treasure
  'Pearl Bloom',        // 2 - $15,000 - Discovery of the first pearl
  'Shell Harvest',      // 3 - $40,000 - Collecting valuable shells
  'Wave Bounty',        // 4 - $120,000 - Riding steady profit waves
  'Tide Treasure',      // 5 - $300,000 - Strong current brings rewards
  'Blue Depth Bonus',   // 6 - $600,000 - Diving into deeper value
  'Guardian\'s Gift',   // 7 - $1.5M - Acknowledgement of leadership
  'Captain\'s Chest',   // 8 - $3M - Commanding a thriving fleet
  'Trident Gem',        // 9 - $6M - Mastery of the currents
  'Sea Legend Award',   // 10 - $15M - Legendary impact
  'Abyss Crown',        // 11 - $30M - Dominion of the deep
  'Poseidon\'s Favor',  // 12 - $60M - Blessed by the ocean god
  'Neptune Scepter',    // 13 - $200M - Rule over vast seas
  'Ocean Infinity',     // 14 - $500M - Ultimate endless horizon
];

export default function OneTimeRewards() {
  const userStatus = getMockUserStatus();
  const qualifiedVolume = parseFloat(userStatus.qualifiedVolumeUSD);

  const claimedRewards = [0, 1, 2];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-neon-green relative inline-block">
          One-Time Rewards
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-neon-green/20 blur-xl -z-10" />
        </h1>
        <p className="text-cyan-300/90 mt-1">Achievement milestones with bonus rewards</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="cyber-glass border border-neon-green/50 rounded-2xl p-6 text-white relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-green/10 to-cyan-500/10 opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-green/70 to-transparent" />
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2 cyber-glass border border-neon-green/30 rounded-lg backdrop-blur-sm">
              <Gift size={24} />
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-wide">Rewards Claimed</p>
              <p className="text-xs opacity-75">Out of 14 milestones</p>
            </div>
          </div>
          <p className="text-5xl font-bold mb-2 relative z-10">{claimedRewards.length}</p>
          <p className="text-sm opacity-90 relative z-10">/ 14 Total</p>
        </div>

        <div className="cyber-glass rounded-xl p-6 border border-cyan-500/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 cyber-glass border border-cyan-500/30 rounded-lg">
              <CheckCircle className="text-cyan-400" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-cyan-400 uppercase tracking-wide">Total Earned</p>
              <p className="text-xs text-cyan-300/90">From claimed rewards</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-neon-green">{formatUSD(8500000000000n)}</p>
        </div>

        <div className="cyber-glass rounded-xl p-6 border border-cyan-500/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 cyber-glass border border-neon-purple/30 rounded-lg">
              <Lock className="text-neon-purple" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-cyan-400 uppercase tracking-wide">Remaining Potential</p>
              <p className="text-xs text-cyan-300/90">Unclaimed rewards</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-neon-purple">{formatUSD(234350000n)}</p>
        </div>
      </div>

      <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <h2 className="text-lg font-semibold text-cyan-300 mb-6 uppercase tracking-wide">Milestone Progress</h2>

        <div className="space-y-4">
          {ONE_TIME_REWARDS.map((reward, idx) => {
            const requiredVolume = parseFloat(reward.requiredVolumeUSD);
            const isClaimed = claimedRewards.includes(idx);
            const isLocked = qualifiedVolume < requiredVolume;

            return (
              <div
                key={idx}
                className={`p-5 rounded-xl border-2 transition-all relative overflow-hidden group ${
                  isClaimed
                    ? 'cyber-glass border-neon-green hover:border-neon-green/80'
                    : isLocked
                    ? 'cyber-glass border-cyan-500/30 opacity-60'
                    : 'cyber-glass border-cyan-500 hover:border-cyan-600'
                }`}
              >
                {isClaimed && (
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-green/5 to-cyan-500/5" />
                )}
                {!isClaimed && !isLocked && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-neon-green/5" />
                )}
                <div className="flex items-center justify-between gap-4 relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        isClaimed
                          ? 'bg-gradient-to-br from-neon-green to-cyan-500 text-dark-950'
                          : isLocked
                          ? 'cyber-glass border border-cyan-500/30 text-cyan-400/50'
                          : 'bg-gradient-to-br from-cyan-500 to-neon-green text-dark-950'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <p className={`font-semibold ${
                          isClaimed ? 'text-neon-green' : isLocked ? 'text-cyan-400/50' : 'text-cyan-300'
                        }`}>
                          {REWARD_NAMES[idx]}
                        </p>
                        <p className="text-xs text-cyan-300/60">Reward #{idx + 1}</p>
                        <p className="text-sm text-cyan-300/90">
                          Required Volume: {formatUSD(reward.requiredVolumeUSD)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-2xl font-bold mb-1 ${
                      isClaimed ? 'text-neon-green' : isLocked ? 'text-cyan-400/50' : 'text-cyan-300'
                    }`}>
                      {formatUSD(reward.rewardUSD)}
                    </p>
                    <div>
                      {isClaimed ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-neon-green/20 text-neon-green rounded-full text-xs font-medium border border-neon-green/30">
                          <CheckCircle size={14} />
                          Claimed
                        </span>
                      ) : isLocked ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 cyber-glass border border-cyan-500/20 text-cyan-400/50 rounded-full text-xs font-medium">
                          <Lock size={14} />
                          Locked
                        </span>
                      ) : (
                        <button className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-neon-green text-dark-950 rounded-full text-xs font-bold hover:shadow-neon-cyan transition-all">
                          Claim Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <h3 className="font-semibold text-cyan-300 mb-4 uppercase tracking-wide">How It Works</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-neon-green/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-cyan-300">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-cyan-300">Build Qualified Volume</p>
                <p className="text-xs text-cyan-300/90">Grow your team using 40:30:30 calculation</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-neon-green/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-cyan-300">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-cyan-300">Reach Milestones</p>
                <p className="text-xs text-cyan-300/90">Unlock rewards at $6,000 intervals</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-neon-green/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-cyan-300">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-cyan-300">Claim Rewards</p>
                <p className="text-xs text-cyan-300/90">One-time bonus claimed to your wallet</p>
              </div>
            </div>
          </div>
        </div>

        <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <h3 className="font-semibold text-cyan-300 mb-4 uppercase tracking-wide">Reward Structure</h3>
          <div className="space-y-2">
            <div className="p-3 cyber-glass border border-cyan-500/20 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-cyan-300">Milestones 1-3</span>
                <span className="text-sm font-bold text-cyan-300">$100 each</span>
              </div>
            </div>
            <div className="p-3 cyber-glass border border-neon-green/20 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neon-green/80">Milestones 4-6</span>
                <span className="text-sm font-bold text-neon-green">$250 each</span>
              </div>
            </div>
            <div className="p-3 cyber-glass border border-neon-orange/20 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neon-orange/80">Milestones 7-9</span>
                <span className="text-sm font-bold text-neon-orange">$500 each</span>
              </div>
            </div>
            <div className="p-3 cyber-glass border border-neon-purple/20 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neon-purple/80">Milestones 10-14</span>
                <span className="text-sm font-bold text-neon-purple">$1,000 each</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cyber-glass border border-cyan-500/30 rounded-xl p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-neon-green/5 opacity-50" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <div className="flex items-start gap-3 relative z-10">
          <Gift className="text-cyan-400 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-medium text-cyan-300 mb-1 uppercase tracking-wide">Achievement Rewards</p>
            <p className="text-xs text-cyan-400/80">
              One-time achievement rewards can be claimed to your Main Wallet (5% fee) or Safe Wallet (0% fee) when you reach volume milestones. These bonuses complement your recurring income streams and help you compound your earnings faster.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
