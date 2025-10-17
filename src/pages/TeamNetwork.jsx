import { Users, TrendingUp, Copy, CheckCircle, Eye, Search, Filter, LayoutGrid, Table } from 'lucide-react';
import { useState } from 'react';
import { getMockUserStatus, formatUSD } from '../utils/contractData';
import NumberPopup from '../components/NumberPopup';

const mockDirects = [
  { address: '0xABCD...1234', stakedUSD: 7500, teamVolume: 45000, activatedAt: '2024-09-15' },
  { address: '0xEFGH...5678', stakedUSD: 5200, teamVolume: 28000, activatedAt: '2024-09-22' },
  { address: '0xIJKL...9012', stakedUSD: 10000, teamVolume: 62000, activatedAt: '2024-10-01' },
  { address: '0xMNOP...3456', stakedUSD: 3500, teamVolume: 12000, activatedAt: '2024-10-08' },
  { address: '0xQRST...7890', stakedUSD: 2800, teamVolume: 8500, activatedAt: '2024-10-12' },
];

const mockLevelData = {
  L1: [
    { userId: 'USR-1001', address: '0xABCD...1234', stakedUSD: 7500, status: 'Active', joinDate: '2024-09-15', totalEarned: 2250 },
    { userId: 'USR-1002', address: '0xEFGH...5678', stakedUSD: 5200, status: 'Active', joinDate: '2024-09-22', totalEarned: 1560 },
    { userId: 'USR-1003', address: '0xIJKL...9012', stakedUSD: 10000, status: 'Active', joinDate: '2024-10-01', totalEarned: 3000 },
    { userId: 'USR-1004', address: '0xMNOP...3456', stakedUSD: 3500, status: 'Active', joinDate: '2024-10-08', totalEarned: 1050 },
    { userId: 'USR-1005', address: '0xQRST...7890', stakedUSD: 2800, status: 'Inactive', joinDate: '2024-10-12', totalEarned: 840 },
  ],
  L2: [
    { userId: 'USR-2001', address: '0xUVWX...1111', stakedUSD: 6000, status: 'Active', joinDate: '2024-09-20', totalEarned: 1800 },
    { userId: 'USR-2002', address: '0xYZAB...2222', stakedUSD: 4500, status: 'Active', joinDate: '2024-09-25', totalEarned: 1350 },
    { userId: 'USR-2003', address: '0xCDEF...3333', stakedUSD: 8000, status: 'Inactive', joinDate: '2024-10-02', totalEarned: 2400 },
  ],
  L3: [
    { userId: 'USR-3001', address: '0xGHIJ...4444', stakedUSD: 5500, status: 'Active', joinDate: '2024-09-28', totalEarned: 1650 },
    { userId: 'USR-3002', address: '0xKLMN...5555', stakedUSD: 7200, status: 'Active', joinDate: '2024-10-05', totalEarned: 2160 },
  ],
  L4: [
    { userId: 'USR-4001', address: '0xOPQR...6666', stakedUSD: 4800, status: 'Active', joinDate: '2024-10-10', totalEarned: 1440 },
  ],
  L5: [
    { userId: 'USR-5001', address: '0xSTUV...7777', stakedUSD: 3200, status: 'Active', joinDate: '2024-10-15', totalEarned: 960 },
  ],
  L6: [],
  L7: [],
  L8: [],
  L9: [],
  L10: [],
};


export default function TeamNetwork() {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('overview');
  const [activeLevel, setActiveLevel] = useState('L1');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const userStatus = getMockUserStatus();
  const referralLink = 'https://oceandefi.io/ref/0x1234...5678';

  const levels = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10'];
  const currentLevelData = mockLevelData[activeLevel];

  const filteredData = currentLevelData.filter((member) => {
    const matchesSearch =
      member.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalDirectVolume = mockDirects.reduce((sum, d) => sum + d.stakedUSD, 0);
  const totalTeamVolume = mockDirects.reduce((sum, d) => sum + d.teamVolume, 0);
  const totalTeamMembers = Object.values(mockLevelData).reduce((sum, level) => sum + level.length, 0);
  const activeMembers = Object.values(mockLevelData).flat().filter(m => m.status === 'Active').length;
  const inactiveMembers = totalTeamMembers - activeMembers;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-neon-green relative inline-block">
            Team Network
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-neon-green/20 blur-xl -z-10" />
          </h1>
          <p className="text-cyan-300/90 mt-1">Manage your referral network and team structure</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'overview'
                ? 'bg-gradient-to-r from-cyan-500 to-neon-green text-dark-950'
                : 'cyber-glass text-cyan-400 border border-cyan-500/30 hover:border-cyan-500/50'
            }`}
          >
            <LayoutGrid size={18} />
            <span className="hidden sm:inline">Overview</span>
          </button>
          <button
            onClick={() => setViewMode('levels')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'levels'
                ? 'bg-gradient-to-r from-cyan-500 to-neon-green text-dark-950'
                : 'cyber-glass text-cyan-400 border border-cyan-500/30 hover:border-cyan-500/50'
            }`}
          >
            <Table size={18} />
            <span className="hidden sm:inline">Level View</span>
          </button>
        </div>
      </div>

      <div className="cyber-glass border border-neon-green/50 rounded-2xl p-6 text-white relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-green/10 to-cyan-500/10 opacity-50 group-hover:opacity-70 transition-opacity" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-green/70 to-transparent" />
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className="p-2 bg-neon-green/20 rounded-lg backdrop-blur-sm border border-neon-green/30">
            <Users size={24} className="text-neon-green" />
          </div>
          <div>
            <p className="text-sm text-neon-green font-medium uppercase tracking-wide">Your Referral Link</p>
            <p className="text-xs text-cyan-300/90">Share to grow your team</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 cyber-glass border border-neon-green/30 rounded-lg overflow-hidden relative z-10">
          <code className="flex-1 text-sm font-mono truncate text-cyan-300">{referralLink}</code>
          <button
            onClick={handleCopy}
            className="p-2 bg-neon-green/20 hover:bg-neon-green/30 rounded-lg transition-colors flex-shrink-0 border border-neon-green/30"
            title={copied ? 'Copied!' : 'Copy link'}
          >
            {copied ? <CheckCircle size={20} className="text-neon-green" /> : <Copy size={20} className="text-neon-green" />}
          </button>
        </div>
      </div>

      {viewMode === 'overview' ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="cyber-glass rounded-xl p-4 border border-cyan-500/30">
              <p className="text-xs text-cyan-300/90 mb-1 truncate">Direct Members</p>
              <p className="text-2xl md:text-3xl font-bold text-cyan-300">{userStatus.directChildrenCount}</p>
            </div>
            <div className="cyber-glass rounded-xl p-4 border border-cyan-500/30">
              <p className="text-xs text-cyan-300/90 mb-1 truncate">Direct Volume</p>
              <NumberPopup
                value={formatUSD(totalDirectVolume * 1e8)}
                label="Direct Volume"
                className="text-lg md:text-xl font-bold text-cyan-400"
              />
            </div>
            <div className="cyber-glass rounded-xl p-4 border border-cyan-500/30">
              <p className="text-xs text-cyan-300/90 mb-1 truncate">Team Volume</p>
              <NumberPopup
                value={formatUSD(totalTeamVolume * 1e8)}
                label="Team Volume"
                className="text-lg md:text-xl font-bold text-neon-green"
              />
            </div>
            <div className="cyber-glass rounded-xl p-4 border border-cyan-500/30">
              <p className="text-xs text-cyan-300/90 mb-1 truncate">Qualified Volume</p>
              <NumberPopup
                value={formatUSD(userStatus.qualifiedVolumeUSD)}
                label="Qualified Volume"
                className="text-lg md:text-xl font-bold text-neon-orange"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-cyan-300">Direct Referrals</h2>
                  <span className="text-sm text-cyan-300/90">{mockDirects.length} members</span>
                </div>

                <div className="overflow-x-auto -mx-6 px-6">
                  <div className="min-w-full space-y-3">
                    {mockDirects.map((direct, idx) => (
                      <div key={idx} className="p-4 cyber-glass border border-cyan-500/20 rounded-lg hover:cyber-glass border border-cyan-500/20 transition-colors min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <code className="text-sm font-mono text-cyan-300 truncate">{direct.address}</code>
                          <span className="text-xs text-cyan-300/90 flex-shrink-0">{direct.activatedAt}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="min-w-0">
                            <p className="text-xs text-cyan-300/90 mb-1">Stake Amount</p>
                            <NumberPopup
                              value={formatUSD(direct.stakedUSD * 1e8)}
                              label="Stake Amount"
                              className="text-sm font-semibold text-cyan-400"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-cyan-300/90 mb-1">Team Volume</p>
                            <NumberPopup
                              value={formatUSD(direct.teamVolume * 1e8)}
                              label="Team Volume"
                              className="text-sm font-semibold text-neon-green"
                            />
                          </div>
                        </div>
                        <button className="mt-3 text-xs text-cyan-400 hover:text-cyan-400 flex items-center gap-1">
                          <Eye size={14} />
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30">
                <h3 className="font-semibold text-cyan-300 mb-4">Volume Calculation</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-cyan-400 mb-2">40:30:30 Rule</p>
                    <p className="text-xs text-cyan-300/90 mb-3">
                      For 3 legs, volume is calculated with caps
                    </p>
                    <div className="space-y-2">
                      <div className="p-2.5 cyber-glass border border-cyan-500/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-cyan-300">Leg 1</span>
                          <span className="text-xs font-bold text-cyan-300">40% Cap</span>
                        </div>
                      </div>
                      <div className="p-2.5 cyber-glass border border-neon-green/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-neon-green">Leg 2</span>
                          <span className="text-xs font-bold text-neon-green">30% Cap</span>
                        </div>
                      </div>
                      <div className="p-2.5 cyber-glass border border-neon-orange/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-neon-orange">Leg 3</span>
                          <span className="text-xs font-bold text-neon-orange">30% Cap</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-cyan-500/30">
                    <div className="p-3 cyber-glass border border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-neon-green/5 rounded-lg">
                      <p className="text-xs font-medium text-cyan-300 mb-1">4+ Legs Bonus</p>
                      <p className="text-xs text-cyan-300/90">
                        100% of total volume qualifies (no caps)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30">
                <h3 className="font-semibold text-cyan-300 mb-4">Income Summary</h3>
                <div className="space-y-3">
                  <div className="p-3 cyber-glass border border-cyan-500/20 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-cyan-300">Direct Commission</span>
                      <span className="text-xs font-bold text-cyan-300">5%</span>
                    </div>
                    <p className="text-xs text-cyan-300">On external wallet stakes</p>
                  </div>

                  <div className="p-3 cyber-glass border border-neon-green/20 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-neon-green/80">Slab Income</span>
                      <span className="text-xs font-bold text-neon-green">Up to 60%</span>
                    </div>
                    <p className="text-xs text-neon-green">From team growth</p>
                  </div>

                  <div className="p-3 cyber-glass border border-neon-orange/20 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-neon-orange/80">Override Bonus</span>
                      <span className="text-xs font-bold text-neon-orange">10%/5%/5%</span>
                    </div>
                    <p className="text-xs text-neon-orange">Same-slab uplines</p>
                  </div>
                </div>
              </div>

              <div className="cyber-glass border border-cyan-500/20 border border-cyan-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="text-cyan-400 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-medium text-cyan-300 mb-1">Build Smart</p>
                    <p className="text-xs text-cyan-300">
                      Focus on building multiple strong legs to maximize your qualified volume and unlock higher slab levels
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="cyber-glass rounded-xl p-4 border border-cyan-500/30">
              <p className="text-xs text-cyan-300/90 mb-1 truncate">Total Members</p>
              <p className="text-2xl md:text-3xl font-bold text-cyan-300">{totalTeamMembers}</p>
            </div>
            <div className="cyber-glass rounded-xl p-4 border border-cyan-500/30">
              <p className="text-xs text-cyan-300/90 mb-1 truncate">Active Members</p>
              <p className="text-2xl md:text-3xl font-bold text-neon-green">{activeMembers}</p>
            </div>
            <div className="cyber-glass rounded-xl p-4 border border-cyan-500/30">
              <p className="text-xs text-cyan-300/90 mb-1 truncate">Inactive Members</p>
              <p className="text-2xl md:text-3xl font-bold text-neon-orange">{inactiveMembers}</p>
            </div>
            <div className="cyber-glass rounded-xl p-4 border border-cyan-500/30">
              <p className="text-xs text-cyan-300/90 mb-1 truncate">Qualified Volume</p>
              <NumberPopup
                value={formatUSD(userStatus.qualifiedVolumeUSD)}
                label="Qualified Volume"
                className="text-lg md:text-xl font-bold text-cyan-400"
              />
            </div>
          </div>

          <div className="cyber-glass rounded-2xl border border-cyan-500/30 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-cyan-500/30">
              <h2 className="text-lg font-semibold text-cyan-300 mb-4">Team Level Structure</h2>

              <div className="flex flex-wrap gap-2 mb-4">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setActiveLevel(level)}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      activeLevel === level
                        ? 'bg-gradient-to-r from-cyan-500 to-neon-green text-white'
                        : 'cyber-glass border border-cyan-500/20 text-cyan-400 hover:cyber-glass border border-cyan-500/30'
                    }`}
                  >
                    {level}
                    <span className="ml-1.5 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                      {mockLevelData[level].length}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300/80" size={18} />
                  <input
                    type="text"
                    placeholder="Search by User ID or Address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 cyber-glass border border-cyan-500/20 border border-cyan-500/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300/80" size={18} />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-auto pl-10 pr-8 py-2.5 cyber-glass border border-cyan-500/20 border border-cyan-500/30 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {filteredData.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto text-cyan-400/50 mb-3" size={48} />
                  <p className="text-cyan-300/90 font-medium">No team members found at {activeLevel}</p>
                  <p className="text-sm text-cyan-300/90 mt-1">
                    {searchTerm || statusFilter !== 'All' ? 'Try adjusting your filters' : 'This level is empty'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-4 sm:-mx-6">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-cyan-500/20">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                            User ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                            Address
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                            Portfolio
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                            Total Earned
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                            Join Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cyan-500/10">
                        {filteredData.map((member, idx) => (
                          <tr key={idx} className="hover:bg-cyan-500/5 transition-colors">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-cyan-300">{member.userId}</span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <code className="text-xs font-mono text-cyan-300">{member.address}</code>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <NumberPopup
                                value={formatUSD(member.stakedUSD * 1e8)}
                                label="Portfolio"
                                className="text-sm font-semibold text-cyan-300"
                              />
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <NumberPopup
                                value={formatUSD(member.totalEarned * 1e8)}
                                label="Total Earned"
                                className="text-sm font-semibold text-neon-green"
                              />
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                member.status === 'Active'
                                  ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
                                  : 'bg-neon-orange/20 text-neon-orange border border-neon-orange/30'
                              }`}>
                                {member.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="text-sm text-cyan-300/90">{member.joinDate}</span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <button className="text-cyan-400 hover:text-cyan-400 transition-colors">
                                <Eye size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30">
              <h3 className="font-semibold text-cyan-300 mb-4">Volume Calculation</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-cyan-400 mb-2">40:30:30 Rule</p>
                  <p className="text-xs text-cyan-300/90 mb-3">
                    For 3 legs, volume is calculated with caps
                  </p>
                  <div className="space-y-2">
                    <div className="p-2.5 cyber-glass border border-cyan-500/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-cyan-300">Leg 1</span>
                        <span className="text-xs font-bold text-cyan-300">40% Cap</span>
                      </div>
                    </div>
                    <div className="p-2.5 cyber-glass border border-neon-green/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-neon-green">Leg 2</span>
                        <span className="text-xs font-bold text-neon-green">30% Cap</span>
                      </div>
                    </div>
                    <div className="p-2.5 cyber-glass border border-neon-orange/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-neon-orange">Leg 3</span>
                        <span className="text-xs font-bold text-neon-orange">30% Cap</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-cyan-500/30">
                  <div className="p-3 cyber-glass border border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-neon-green/5 rounded-lg">
                    <p className="text-xs font-medium text-cyan-300 mb-1">4+ Legs Bonus</p>
                    <p className="text-xs text-cyan-300/90">
                      100% of total volume qualifies (no caps)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30">
              <h3 className="font-semibold text-cyan-300 mb-4">Income Summary</h3>
              <div className="space-y-3">
                <div className="p-3 cyber-glass border border-cyan-500/20 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-cyan-300">Direct Commission</span>
                    <span className="text-xs font-bold text-cyan-300">5%</span>
                  </div>
                  <p className="text-xs text-cyan-300">On external wallet stakes</p>
                </div>

                <div className="p-3 cyber-glass border border-neon-green/20 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-neon-green/80">Slab Income</span>
                    <span className="text-xs font-bold text-neon-green">Up to 60%</span>
                  </div>
                  <p className="text-xs text-neon-green">From team growth</p>
                </div>

                <div className="p-3 cyber-glass border border-neon-orange/20 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-neon-orange/80">Override Bonus</span>
                    <span className="text-xs font-bold text-neon-orange">10%/5%/5%</span>
                  </div>
                  <p className="text-xs text-neon-orange">Same-slab uplines</p>
                </div>
              </div>

              <div className="mt-4 cyber-glass border border-cyan-500/20 border border-cyan-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="text-cyan-400 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-medium text-cyan-300 mb-1">Build Smart</p>
                    <p className="text-xs text-cyan-300">
                      Focus on building multiple strong legs to maximize your qualified volume and unlock higher slab levels
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
