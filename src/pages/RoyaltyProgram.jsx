import { Trophy, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { ROYALTY_LEVELS, formatUSD, getMockUserStatus } from '../utils/contractData';

// Ocean-themed royalty tier names with symbolic meanings
const ROYALTY_TIER_NAMES = [
  'Coral Starter',      // Level 1 - $5,000 - First growth of coral in shallow waters
  'Pearl Diver',        // Level 2 - $10,000 - Diver discovering value beneath the surface
  'Sea Explorer',       // Level 3 - $20,000 - Expanding reach across the reef
  'Wave Rider',         // Level 4 - $60,000 - Riding steady momentum of the market waves
  'Tide Surge',         // Level 5 - $120,000 - Building consistent tidal strength
  'Deep Blue',          // Level 6 - $300,000 - Operating confidently in deeper currents
  'Ocean Guardian',     // Level 7 - $600,000 - Protecting and guiding the ecosystem
  'Marine Commander',   // Level 8 - $1.5M - Leading fleets of contributors
  'Aqua Captain',       // Level 9 - $3M - Commanding large territories of business
  'Current Master',     // Level 10 - $5M - Mastery of consistent flow
  'Sea Legend',         // Level 11 - $10M - Legendary influence over the network ocean
  'Trident Icon',       // Level 12 - $30M - Wields the power of Poseidon's trident
  'Poseidon Crown',     // Level 13 - $50M - Crowned ruler of the DeFi seas
  'Ocean Supreme',      // Level 14 - $100M - Ultimate sovereign of the entire ocean realm
];

export default function RoyaltyProgram() {
  const userStatus = getMockUserStatus();
  const currentLevel = parseInt(userStatus.currentRoyaltyLevelIndex);
  const payoutsReceived = parseInt(userStatus.royaltyPayoutsReceived);
  const maxPayouts = "∞";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-neon-green relative inline-block">
          Royalty Program
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-neon-green/20 blur-xl -z-10" />
        </h1>
        <p className="text-cyan-300/90 mt-1">Monthly recurring rewards for top performers</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="cyber-glass border border-neon-orange/50 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-sm opacity-90">Current Level</p>
              <p className="text-xs opacity-75">Your royalty tier</p>
            </div>
          </div>
          <p className="text-5xl font-bold mb-2">{currentLevel}</p>
          {currentLevel > 0 && (
            <p className="text-lg opacity-90">
              {formatUSD(ROYALTY_LEVELS[currentLevel - 1].monthlyRoyaltyUSD)} / month
            </p>
          )}
        </div>

        <div className="cyber-glass rounded-xl p-6 border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 cyber-glass border border-neon-green/20 rounded-lg">
              <CheckCircle className="text-neon-green" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-cyan-300">Payouts Received</p>
              <p className="text-xs text-cyan-300/90">LifeTime</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-cyan-300">{payoutsReceived} /∞ </p>
          <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-teal-600"
              style={{ width: `${(payoutsReceived / maxPayouts) * 100}%` }}
            />
          </div>
        </div>

        <div className="cyber-glass rounded-xl p-6 border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 cyber-glass border border-cyan-500/20 rounded-lg">
              <Clock className="text-cyan-400" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-cyan-300">Next Claim</p>
              <p className="text-xs text-cyan-300/90">Monthly eligibility</p>
            </div>
          </div>
          <p className="text-lg font-bold text-cyan-300">
            {userStatus.canClaimRoyalty ? 'Ready Now' : 'Not Ready'}
          </p>
          {userStatus.canClaimRoyalty && (
            <button className="mt-3 w-full py-2 bg-gradient-to-r from-cyan-500 to-neon-green text-white rounded-lg text-sm font-medium">
              Claim Royalty
            </button>
          )}
        </div>
      </div>

      <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30">
        <h2 className="text-lg font-semibold text-cyan-300 mb-4">Royalty Tiers</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROYALTY_LEVELS.map((level, idx) => {
            const levelNum = idx + 1;
            const isAchieved = levelNum <= currentLevel;
            const isCurrent = levelNum === currentLevel;

            return (
              <div
                key={idx}
                className={`p-5 rounded-xl border-2 transition-all ${
                  isCurrent
                    ? 'border-neon-orange cyber-glass shadow-neon-green'
                    : isAchieved
                    ? 'border-neon-green cyber-glass '
                    : 'border-cyan-500 cyber-glass'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-col">
                    <span className={`text-lg font-bold ${isCurrent ? 'text-neon-orange' : isAchieved ? 'text-neon-green' : 'text-cyan-300/90'}`}>
                      {ROYALTY_TIER_NAMES[idx]}
                    </span>
                    <span className="text-xs text-cyan-300/60">Tier #{levelNum}</span>
                  </div>
                  {isAchieved && (
                    <Trophy className={isCurrent ? 'text-amber-500' : 'text-emerald-500'} size={20} />
                  )}
                </div>
                <p className="text-sm text-cyan-300/90 mb-2">Required Volume</p>
                <p className="text-lg font-semibold text-cyan-300 mb-3">
                  {formatUSD(level.requiredVolumeUSD)}
                </p>
                <div className={`p-3 rounded-lg ${isCurrent ? 'bg-amber-500/20' : isAchieved ? 'bg-emerald-500/20' : 'bg-slate-700'}`}>
                  <p className="text-xs text-cyan-300/90 mb-1">Monthly Payout</p>
                  <p className={`text-xl font-bold ${isCurrent ? 'text-neon-orange/80' : isAchieved ? 'text-neon-green/80' : 'text-cyan-400'}`}>
                    {formatUSD(level.monthlyRoyaltyUSD)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30">
          <h3 className="font-semibold text-cyan-300 mb-4">Program Rules</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-cyan-300">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-cyan-300">Monthly Payments</p>
                <p className="text-xs text-cyan-300/90">Receive royalty payments once per month for up to LifeTime</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-cyan-300">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-cyan-300">10% Growth Renewal</p>
                <p className="text-xs text-cyan-300/90">Every 2 months, team volume must show 10% growth to continue</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-cyan-300">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-cyan-300">Claim to Wallet</p>
                <p className="text-xs text-cyan-300/90">Transfer royalty payments to Safe Wallet (0% fee) or Main Wallet (5% fee)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30">
          <h3 className="font-semibold text-cyan-300 mb-4">Renewal Status</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-cyan-300/90 mb-2">Current Qualified Volume</p>
              <p className="text-2xl font-bold text-cyan-300">{formatUSD(userStatus.qualifiedVolumeUSD)}</p>
            </div>
            {parseFloat(userStatus.royaltyRenewalVolumeRequiredUSD) > 0 && (
              <>
                <div>
                  <p className="text-sm text-cyan-300/90 mb-2">Required for Renewal</p>
                  <p className="text-2xl font-bold text-neon-orange">
                    {formatUSD(userStatus.royaltyRenewalVolumeRequiredUSD)}
                  </p>
                </div>
                <div className="p-4 cyber-glass border border-neon-orange/20 rounded-lg">
                  <p className="text-xs text-neon-orange/80">
                    Next renewal check on payout #{payoutsReceived + 1}. Your team volume must show 10% growth from the snapshot.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="cyber-glass border border-neon-orange/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <TrendingUp className="text-neon-green flex-shrink-0 mt-1" size={24} />
          <div>
            <h4 className="font-semibold text-neon-green mb-2">Maximize Your Royalties - Lifetime Earnings!</h4>
            <p className="text-sm text-neon-green/80 mb-3">
              Build your team consistently to maintain the 10% growth requirement and unlock higher tiers for increased monthly payouts that continue FOR LIFE!
            </p>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="p-3 border border-neon-green rounded-lg">
                <p className="text-xs text-neon-green/80 mb-1">Duration</p>
                <p className="text-lg font-bold text-neon-orange flex items-center gap-1">LIFETIME <span className="text-2xl">∞</span></p>
              </div>
              <div className="p-3 border border-neon-green rounded-lg">
                <p className="text-xs text-neon-green/80 mb-1">Top Tier Monthly</p>
                <p className="text-lg font-bold text-neon-orange">$100,000</p>
              </div>
              <div className="p-3 border border-neon-green rounded-lg">
                <p className="text-xs text-neon-green/80 mb-1">Total Potential</p>
                <p className="text-lg font-bold text-neon-orange flex items-center gap-1">UNLIMITED <span className="text-2xl">∞</span></p>
              </div>
            </div>
            <p className="text-xs text-center text-neon-green/90 mt-3 font-semibold">
              No 24-month cap! Earn monthly royalties for life with 10% growth every 2 months 🌊
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
