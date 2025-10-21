import { useEffect, useMemo, useState } from 'react';
import { Gift, CheckCircle, Lock, AlertCircle } from 'lucide-react';
import { useStore } from '../../store/useUserInfoStore';
import { ONE_TIME_REWARDS, formatUSD, formatRAMA } from '../utils/contractData';

const REWARD_NAMES = [
  'Coral Spark',
  'Pearl Bloom',
  'Shell Harvest',
  'Monsoon Lift',
  'Wave Bounty',
  'Tide Treasure',
  'Blue Depth Bonus',
  "Guardian's Gift",
  "Captain's Chest",
  'Trident Gem',
  'Sea Legend Award',
  'Abyss Crown',
  "Poseidon's Favor",
  'Neptune Scepter',
  'Ocean Infinity',
];

export default function OneTimeRewards() {
  const userAddress = localStorage.getItem('userAddress') || null;
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getOneTimeRewardsOverview = useStore(
    (s) => s.getOneTimeRewardsOverview
  );

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!userAddress) {
        setOverview(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await getOneTimeRewardsOverview(userAddress);
        if (!cancelled) setOverview(res);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError(err?.message || 'Unable to load one-time reward data.');
          setOverview(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [userAddress, getOneTimeRewardsOverview]);

  const fallbackMilestones = useMemo(
    () =>
      ONE_TIME_REWARDS.map((reward, idx) => ({
        idx,
        thresholdUsd: parseFloat(reward.requiredVolumeUSD) / 1e8,
        rewardUsd: parseFloat(reward.rewardUSD) / 1e8,
        claimed: false,
        unlocked: false,
        claimable: false,
      })),
    []
  );

  const milestonesCore = overview?.milestones?.length
    ? overview.milestones
    : fallbackMilestones;

  const milestones = useMemo(
    () =>
      milestonesCore.map((milestone, idx) => ({
        ...milestone,
        name: REWARD_NAMES[idx] ?? `Milestone ${idx + 1}`,
      })),
    [milestonesCore]
  );

  const totalMilestones = milestones.length;
  const claimedCount =
    overview?.claimedCount ?? milestones.filter((m) => m.claimed).length;
  const claimableMilestones = milestones.filter((m) => m.claimable);

  const totalEarnedUsd = overview?.totalEarnedUsd ?? 0;
  const totalEarnedRama = overview?.totalEarnedRama ?? 0;
  const pendingRewardUsd = overview?.pendingRewardUsd ?? 0;
  const pendingRewardRama = overview?.pendingRewardRama ?? 0;
  const qualifiedVolume = overview?.qualifiedVolumeUsd ?? 0;

  const remainingUsd = overview?.remainingUsd ?? milestones
    .filter((m) => !m.claimed)
    .reduce((sum, m) => sum + (m.rewardUsd ?? 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-neon-green relative inline-block">
          One-Time Rewards
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-neon-green/20 blur-xl -z-10" />
        </h1>
        <p className="text-cyan-300/90 mt-1">
          Achievement milestones with bonus rewards
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-200 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {loading && (
        <div className="text-sm text-cyan-200 flex items-center gap-2">
          <AlertCircle size={16} /> Syncing one-time rewards…
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="cyber-glass border border-neon-green/50 rounded-2xl p-6 text-white relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-green/10 to-cyan-500/10 opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-green/70 to-transparent" />
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2 cyber-glass border border-neon-green/30 rounded-lg backdrop-blur-sm">
              <Gift size={24} />
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-wide">
                Rewards Claimed
              </p>
              <p className="text-xs opacity-75">Out of {totalMilestones} milestones</p>
            </div>
          </div>
          <p className="text-5xl font-bold mb-2 relative z-10">
            {claimedCount}
          </p>
          <p className="text-sm opacity-90 relative z-10">
            {claimableMilestones.length} claimable right now
          </p>
        </div>

        <div className="cyber-glass rounded-xl p-6 border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 cyber-glass border border-cyan-500/30 rounded-lg">
              <CheckCircle className="text-cyan-400" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-cyan-400 uppercase tracking-wide">
                Total Earned
              </p>
              <p className="text-xs text-cyan-300/90">Claimed rewards</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-neon-green">
            {formatUSD(totalEarnedUsd)}
          </p>
          <p className="text-xs text-cyan-300/80 mt-1">
            ≈ {formatRAMA(totalEarnedRama)} RAMA
          </p>
        </div>

        <div className="cyber-glass rounded-xl p-6 border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 cyber-glass border border-neon-purple/30 rounded-lg">
              <Lock className="text-neon-purple" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-cyan-400 uppercase tracking-wide">
                Remaining Potential
              </p>
              <p className="text-xs text-cyan-300/90">Unclaimed rewards</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-neon-purple">
            {formatUSD(remainingUsd)}
          </p>
          <p className="text-xs text-cyan-300/80 mt-1">
            Pending reward: {formatUSD(pendingRewardUsd)} • {formatRAMA(pendingRewardRama)} RAMA
          </p>
        </div>
      </div>

      <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <h2 className="text-lg font-semibold text-cyan-300 mb-6 uppercase tracking-wide">
          Milestone Progress
        </h2>

        <p className="text-sm text-cyan-300/80 mb-4">
          Qualified volume: {formatUSD(qualifiedVolume)}
        </p>

        <div className="space-y-4">
          {milestones.map((reward, idx) => {
            const isClaimed = reward.claimed;
            const isUnlocked = reward.unlocked;
            const isClaimable = reward.claimable;
            const isLocked = !isUnlocked;

            return (
              <div
                key={reward.idx}
                className={`cyber-glass border border-cyan-500/20 rounded-xl p-4 transition-all ${
                  isClaimed
                    ? 'border-neon-green/40 bg-neon-green/5'
                    : isClaimable
                    ? 'border-cyan-500/40 bg-cyan-500/5'
                    : 'bg-dark-950/40'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                      <span className="text-lg font-semibold text-cyan-300">
                        {idx + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-cyan-200 uppercase tracking-wide">
                        {reward.name ?? `Milestone ${idx + 1}`}
                      </p>
                      <p className="text-xs text-cyan-300/70">
                        Required Volume: {formatUSD(reward.thresholdUsd)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-2xl font-bold mb-1 ${
                        isClaimed
                          ? 'text-neon-green'
                          : isLocked
                          ? 'text-cyan-400/50'
                          : 'text-cyan-300'
                      }`}
                    >
                      {formatUSD(reward.rewardUsd)}
                    </p>
                    <div>
                      {isClaimed ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-neon-green/20 text-neon-green rounded-full text-xs font-medium border border-neon-green/30">
                          <CheckCircle size={14} />
                          Claimed
                        </span>
                      ) : isClaimable ? (
                        <button className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-neon-green text-dark-950 rounded-full text-xs font-bold hover:shadow-neon-cyan transition-all">
                          Claim Now
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 cyber-glass border border-cyan-500/20 text-cyan-400/50 rounded-full text-xs font-medium">
                          <Lock size={14} />
                          Locked
                        </span>
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
          <h3 className="font-semibold text-cyan-300 mb-4 uppercase tracking-wide">
            How It Works
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-neon-green/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-cyan-300">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-cyan-300">
                  Build Qualified Volume
                </p>
                <p className="text-xs text-cyan-300/90">
                  Grow your team using the 40:30:30 calculation for business volume.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-neon-green/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-cyan-300">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-cyan-300">
                  Reach Milestones
                </p>
                <p className="text-xs text-cyan-300/90">
                  Unlock rewards as your qualified volume crosses each milestone threshold.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-neon-green/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-cyan-300">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-cyan-300">Claim Rewards</p>
                <p className="text-xs text-cyan-300/90">
                  Claim one-time bonuses directly to your wallet once each milestone unlocks.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <h3 className="font-semibold text-cyan-300 mb-4 uppercase tracking-wide">
            Tips for Faster Progress
          </h3>
          <ul className="space-y-3 text-xs text-cyan-300/90">
            <li>• Maintain consistent team volume in all legs to meet 40:30:30 requirements.</li>
            <li>• Track qualified volume in the dashboard to see which milestones are approaching.</li>
            <li>• Encourage your directs to reach slab levels faster to unlock higher milestones.</li>
            <li>• Reinvest pending rewards or claim to Safe Wallet for 0% fee restaking.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
