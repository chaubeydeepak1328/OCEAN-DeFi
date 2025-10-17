import { Award, TrendingUp, Users, AlertCircle, Layers, ArrowDown } from 'lucide-react';
import { SLAB_LEVELS, formatUSD, formatPercentage, getMockUserStatus } from '../utils/contractData';

// Ocean-themed slab tier names
const SLAB_TIER_NAMES = [
  'Coral Reef',      // Level 1 - $500
  'Shallow Waters',  // Level 2 - $2,500
  'Tide Pool',       // Level 3 - $10,000
  'Wave Crest',      // Level 4 - $25,000
  'Open Sea',        // Level 5 - $50,000
  'Deep Current',    // Level 6 - $100,000
  'Ocean Floor',     // Level 7 - $500,000
  'Abyssal Zone',    // Level 8 - $1M
  'Mariana Trench',  // Level 9 - $2.5M
  'Pacific Master',  // Level 10 - $5M
  'Ocean Sovereign', // Level 11 - $20M
];

// Mock data for Same Slab Override earnings from downline
const mockSameSlabEarnings = {
  L1: [
    { address: '0x1234...5678', slab: 3, earned: '45.50', percentage: '10%', status: 'Active' },
    { address: '0x2345...6789', slab: 3, earned: '32.75', percentage: '10%', status: 'Active' },
  ],
  L2: [
    { address: '0x3456...7890', slab: 3, earned: '18.25', percentage: '5%', status: 'Active' },
  ],
  L3: [
    { address: '0x4567...8901', slab: 3, earned: '12.50', percentage: '5%', status: 'Active' },
  ]
};

export default function SlabIncome() {
  const userStatus = getMockUserStatus();
  const currentSlabIndex = parseInt(userStatus.currentSlabIndex);

  // Calculate total Same Slab Override earnings
  const totalL1Earnings = mockSameSlabEarnings.L1.reduce((sum, item) => sum + parseFloat(item.earned), 0);
  const totalL2Earnings = mockSameSlabEarnings.L2.reduce((sum, item) => sum + parseFloat(item.earned), 0);
  const totalL3Earnings = mockSameSlabEarnings.L3.reduce((sum, item) => sum + parseFloat(item.earned), 0);
  const totalOverrideEarnings = totalL1Earnings + totalL2Earnings + totalL3Earnings;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-neon-green relative inline-block">
          Slab Income System
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-neon-green/20 blur-xl -z-10" />
        </h1>
        <p className="text-cyan-300/90 mt-1">Earn difference income from your team's growth</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="cyber-glass border border-neon-green/50 rounded-2xl p-6 text-white relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-green/10 to-cyan-500/10 opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-green/70 to-transparent" />
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2 bg-neon-green/20 rounded-lg backdrop-blur-sm border border-neon-green/30">
              <Award size={24} className="text-neon-green" />
            </div>
            <div>
              <p className="text-sm text-neon-green font-medium uppercase tracking-wide">Current Slab Level</p>
              <p className="text-xs text-cyan-300/90">Your qualification tier</p>
            </div>
          </div>
          <p className="text-5xl font-bold mb-2 text-neon-green relative z-10">{currentSlabIndex}</p>
          <p className="text-lg text-cyan-300 relative z-10">
            {currentSlabIndex > 0 && formatPercentage(SLAB_LEVELS[currentSlabIndex - 1].percentageBPS)} Income Share
          </p>
        </div>

        <div className="cyber-glass rounded-xl p-6 border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 cyber-glass border border-neon-green/20 rounded-lg">
              <TrendingUp className="text-neon-green" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-cyan-300">Qualified Volume</p>
              <p className="text-xs text-cyan-300/90">40:30:30 calculated</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-cyan-300">{formatUSD(userStatus.qualifiedVolumeUSD)}</p>
        </div>

        <div className="cyber-glass rounded-xl p-6 border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 cyber-glass border border-cyan-500/20 rounded-lg">
              <Users className="text-cyan-400" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-cyan-300">Direct Members</p>
              <p className="text-xs text-cyan-300/90">Active referrals</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-cyan-300">{userStatus.directChildrenCount}</p>
        </div>
      </div>

      {/* Same Slab Override Earnings Section */}
      <div className="cyber-glass rounded-2xl p-6 border-2 border-neon-purple relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent" />
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Layers size={24} className="text-neon-purple" />
            <div>
              <h2 className="text-lg font-semibold text-neon-purple uppercase tracking-wide">Same Slab Override Earnings</h2>
              <p className="text-xs text-cyan-300/90 mt-1">Earn from your downline members in the same slab (20% of 60% pool)</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-cyan-300/90">Total Earned</p>
            <p className="text-2xl font-bold text-neon-purple">{totalOverrideEarnings.toFixed(2)} RAMA</p>
          </div>
        </div>

        {/* L1, L2, L3 Breakdown */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="cyber-glass border-2 border-neon-purple rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ArrowDown size={16} className="text-neon-purple" />
                <span className="text-sm font-semibold text-neon-purple">First Wave (10%)</span>
              </div>
              <span className="text-xs bg-neon-purple/20 text-neon-purple px-2 py-1 rounded">
                {mockSameSlabEarnings.L1.length} Members
              </span>
            </div>
            <p className="text-2xl font-bold text-cyan-300">{totalL1Earnings.toFixed(2)} RAMA</p>
            <p className="text-xs text-cyan-300/90 mt-1">Primary same-slab partners</p>
          </div>

          <div className="cyber-glass border-2 border-cyan-500 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ArrowDown size={16} className="text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-400">Second Wave (5%)</span>
              </div>
              <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">
                {mockSameSlabEarnings.L2.length} Members
              </span>
            </div>
            <p className="text-2xl font-bold text-cyan-300">{totalL2Earnings.toFixed(2)} RAMA</p>
            <p className="text-xs text-cyan-300/90 mt-1">Extended same-slab partners</p>
          </div>

          <div className="cyber-glass border-2 border-neon-green rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ArrowDown size={16} className="text-neon-green" />
                <span className="text-sm font-semibold text-neon-green">Third Wave (5%)</span>
              </div>
              <span className="text-xs bg-neon-green/20 text-neon-green px-2 py-1 rounded">
                {mockSameSlabEarnings.L3.length} Members
              </span>
            </div>
            <p className="text-2xl font-bold text-cyan-300">{totalL3Earnings.toFixed(2)} RAMA</p>
            <p className="text-xs text-cyan-300/90 mt-1">Deep same-slab partners</p>
          </div>
        </div>

        {/* Detailed Breakdown Table */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wide">Earnings Breakdown</h3>

          {/* L1 Downline */}
          {mockSameSlabEarnings.L1.length > 0 && (
            <div className="cyber-glass border border-neon-purple/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-neon-purple">W1</span>
                </div>
                <span className="text-sm font-medium text-neon-purple">First Wave Partners (You earn 10%)</span>
              </div>
              <div className="space-y-2">
                {mockSameSlabEarnings.L1.map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 cyber-glass border border-neon-purple/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <code className="text-xs font-mono text-cyan-300">{member.address}</code>
                      <span className="text-xs bg-neon-purple/20 text-neon-purple px-2 py-1 rounded">Slab {member.slab}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-neon-purple">+{member.earned} RAMA</p>
                      <p className="text-xs text-cyan-300/90">{member.percentage} override</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* L2 Downline */}
          {mockSameSlabEarnings.L2.length > 0 && (
            <div className="cyber-glass border border-cyan-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-cyan-300">W2</span>
                </div>
                <span className="text-sm font-medium text-cyan-400">Second Wave Partners (You earn 5%)</span>
              </div>
              <div className="space-y-2">
                {mockSameSlabEarnings.L2.map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 cyber-glass border border-cyan-500/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <code className="text-xs font-mono text-cyan-300">{member.address}</code>
                      <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">Slab {member.slab}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-cyan-400">+{member.earned} RAMA</p>
                      <p className="text-xs text-cyan-300/90">{member.percentage} override</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* L3 Downline */}
          {mockSameSlabEarnings.L3.length > 0 && (
            <div className="cyber-glass border border-neon-green/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-neon-green">W3</span>
                </div>
                <span className="text-sm font-medium text-neon-green">Third Wave Partners (You earn 5%)</span>
              </div>
              <div className="space-y-2">
                {mockSameSlabEarnings.L3.map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 cyber-glass border border-neon-green/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <code className="text-xs font-mono text-cyan-300">{member.address}</code>
                      <span className="text-xs bg-neon-green/20 text-neon-green px-2 py-1 rounded">Slab {member.slab}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-neon-green">+{member.earned} RAMA</p>
                      <p className="text-xs text-cyan-300/90">{member.percentage} override</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* How Same Slab Override Works */}
        <div className="mt-6 p-4 bg-neon-purple/5 border border-neon-purple/20 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-neon-purple flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-neon-purple mb-2">How Same Slab Override Works</p>
              <ul className="text-xs text-cyan-300/90 space-y-1">
                <li>• When your downline members in the same slab claim growth to external wallet, you earn override bonuses</li>
                <li>• Override is paid from 20% of the 60% slab pool distribution</li>
                <li>• First Wave partners in same slab generate 10% override for you</li>
                <li>• Second Wave partners in same slab generate 5% override for you</li>
                <li>• Third Wave partners in same slab generate 5% override for you</li>
                <li>• Override earnings can be claimed to your Main Wallet or Safe Wallet</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="cyber-glass rounded-2xl p-6 border-2 border-neon-green">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-neon-green mb-2 uppercase tracking-wide">Complete Slab Income Structure</h2>
          <p className="text-sm text-cyan-300/90">
            Slab Income is based on <span className="text-neon-green font-semibold">difference income</span> - you earn the percentage difference between your slab level and your team member's slab level on their business volume.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="cyber-glass border border-cyan-500/30 rounded-xl p-4">
            <h3 className="text-base font-bold text-cyan-300 mb-3">How Difference Income Works</h3>
            <div className="space-y-2 text-sm">
              <p className="text-cyan-300"><span className="text-neon-green font-semibold">Example:</span></p>
              <p className="text-cyan-300">• You are at Slab 5 (17% commission)</p>
              <p className="text-cyan-300">• Your team member is at Slab 2 (8% commission)</p>
              <p className="text-cyan-300">• They have $10,000 business volume</p>
              <p className="text-neon-green font-bold mt-2">Your earnings: $10,000 × (17% - 8%) = $900</p>
            </div>
          </div>

          <div className="cyber-glass border border-neon-orange/30 rounded-xl p-4">
            <h3 className="text-base font-bold text-neon-orange mb-3">Business Volume Calculation</h3>
            <div className="space-y-2 text-sm">
              <div className="bg-dark-950/50 rounded-lg p-3">
                <p className="text-neon-orange font-semibold mb-1">With 3 Direct Legs:</p>
                <p className="text-cyan-300 text-xs">40% (strongest) + 30% + 30% = 100%</p>
              </div>
              <div className="bg-dark-950/50 rounded-lg p-3">
                <p className="text-neon-orange font-semibold mb-1">With 3+ Direct Legs:</p>
                <p className="text-cyan-300 text-xs">100% of all leg volumes combined</p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-neon-green/30">
                <th className="text-left py-3 px-4 text-sm font-semibold text-neon-green">Slab Level</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neon-green">Tier Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neon-green">Required Volume</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neon-green">Commission %</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neon-green">Min Directs</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neon-green">Your Status</th>
              </tr>
            </thead>
            <tbody>
              {SLAB_LEVELS.map((slab, idx) => {
                const slabNum = idx + 1;
                const isAchieved = slabNum <= currentSlabIndex;
                const isCurrent = slabNum === currentSlabIndex;

                return (
                  <tr
                    key={idx}
                    className={`border-b border-cyan-500/10 transition-colors ${
                      isCurrent ? 'bg-neon-green/5 hover:bg-neon-green/10' : isAchieved ? 'bg-emerald-500/5 hover:bg-emerald-500/10' : 'hover:bg-cyan-500/5'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        isCurrent ? 'bg-gradient-to-br from-neon-green to-cyan-500 text-dark-950'
                        : isAchieved ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white'
                        : 'cyber-glass border border-cyan-500/30 text-cyan-300/50'
                      }`}>
                        {slabNum}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${
                        isCurrent ? 'text-neon-green' : isAchieved ? 'text-emerald-400' : 'text-cyan-300/50'
                      }`}>
                        {SLAB_TIER_NAMES[idx]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-cyan-300">
                      {formatUSD(slab.requiredVolumeUSD)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold text-lg ${
                        isCurrent ? 'text-neon-green' : isAchieved ? 'text-emerald-400' : 'text-cyan-300/50'
                      }`}>
                        {formatPercentage(slab.percentageBPS)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-cyan-300">
                      {slab.minDirects}
                    </td>
                    <td className="py-3 px-4">
                      {isCurrent ? (
                        <span className="px-3 py-1 bg-gradient-to-r from-neon-green to-cyan-500 text-dark-950 rounded-full text-xs font-bold">
                          Current Level
                        </span>
                      ) : isAchieved ? (
                        <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full text-xs font-bold">
                          Achieved
                        </span>
                      ) : (
                        <span className="px-3 py-1 cyber-glass border border-cyan-500/30 text-cyan-300/50 rounded-full text-xs font-medium">
                          Locked
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 cyber-glass border border-neon-purple/30 rounded-xl p-4">
          <h3 className="text-base font-bold text-neon-purple mb-3">Same-Slab Override Bonus</h3>
          <p className="text-sm text-cyan-300 mb-3">
            When your team members reach the same slab level as you, you earn special override bonuses:
          </p>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-dark-950/50 rounded-lg p-3">
              <p className="text-neon-purple font-semibold text-sm">1st Occurrence</p>
              <p className="text-xl font-bold text-neon-purple">10%</p>
              <p className="text-xs text-cyan-300/70">First same-slab partner</p>
            </div>
            <div className="bg-dark-950/50 rounded-lg p-3">
              <p className="text-neon-purple font-semibold text-sm">2nd Occurrence</p>
              <p className="text-xl font-bold text-neon-purple">5%</p>
              <p className="text-xs text-cyan-300/70">Second same-slab partner</p>
            </div>
            <div className="bg-dark-950/50 rounded-lg p-3">
              <p className="text-neon-purple font-semibold text-sm">3rd+ Occurrence</p>
              <p className="text-xl font-bold text-neon-purple">5%</p>
              <p className="text-xs text-cyan-300/70">All additional partners</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30">
          <h3 className="font-semibold text-cyan-300 mb-4">How Slab Income Works</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-cyan-300">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-cyan-300">Difference Income</p>
                <p className="text-xs text-cyan-300/90">Earn the percentage difference between your slab and your downline's slab</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-cyan-300">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-cyan-300">60% Pool Distribution</p>
                <p className="text-xs text-cyan-300/90">Slab income is paid from 60% of downline's claimed growth</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-cyan-300">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-cyan-300">Same-Slab Override</p>
                <p className="text-xs text-cyan-300/90">First 3 same-slab uplines receive 10%, 5%, and 5% override bonuses</p>
              </div>
            </div>
          </div>
        </div>

        <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30">
          <h3 className="font-semibold text-cyan-300 mb-4">Claim Requirements</h3>
          <div className="space-y-4">
            <div className="p-4 cyber-glass border border-cyan-500/20 rounded-lg">
              <p className="text-sm font-medium text-cyan-300 mb-2">Rule 2: Direct Activation</p>
              <p className="text-xs text-cyan-300">
                Requires 1 new $50 direct ID activation before claiming slab income
              </p>
              <div className="mt-2">
                {userStatus.nextSlabClaimRequiresDirects === '1' ? (
                  <span className="text-xs font-medium text-neon-orange">⚠ Activation Required</span>
                ) : (
                  <span className="text-xs font-medium text-neon-green">✓ Ready to Claim</span>
                )}
              </div>
            </div>

            <div className="p-4 cyber-glass border border-neon-orange/20 rounded-lg">
              <p className="text-sm font-medium text-neon-orange mb-2">Rule 10: 24-Hour Cooldown</p>
              <p className="text-xs text-neon-orange/80">
                Slab income claims have a 24-hour cooldown period
              </p>
            </div>
          </div>

          <button
            onClick={() => alert('Claim Slab Income: Initiating claim transaction to transfer accumulated slab income to your chosen wallet.')}
            className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-500 to-neon-green text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Claim Slab Income
          </button>
        </div>
      </div>

      <div className="cyber-glass border border-cyan-500/20 border border-cyan-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-cyan-400 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-medium text-cyan-300 mb-1">Passive Income</p>
            <p className="text-xs text-cyan-300">
              Slab income is accumulated and ready to claim when downline members claim to external wallet. Use the claim button to transfer earnings to your Main Wallet (5% fee) or Safe Wallet (0% fee).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
