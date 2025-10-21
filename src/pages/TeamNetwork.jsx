import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users,
  TrendingUp,
  Copy,
  CheckCircle,
  Eye,
  Search,
  Filter,
  LayoutGrid,
  Table,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import NumberPopup from "../components/NumberPopup";
import { formatUSD } from "../utils/contractData";
import { useStore } from "../../store/useUserInfoStore";
import { useNavigate } from "react-router-dom";

/** Helpers */
const normalizeUsdDisplay = (value) => {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount) || amount === 0) return 0;
  if (Math.abs(amount) >= 1e6) return amount / 1e6;
  if (Math.abs(amount) < 1) return amount * 1e6;
  return amount;
};

const LEVEL_KEYS = ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L10"];

const truncateAddress = (addr) => {
  if (!addr || addr.length < 10) return addr || "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

export default function TeamNetwork() {
  const getTeamNetworkData = useStore((state) => state.getTeamNetworkData);
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState("overview");
  const [activeLevel, setActiveLevel] = useState("L1");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [network, setNetwork] = useState(null);

  const userAddress =
    typeof window !== "undefined" ? localStorage.getItem("userAddress") : null;

  const referralLink = userAddress
    ? `https://oceandefi.io/ref/${userAddress}`
    : null;

  /** Load real network data */
  const loadNetwork = useCallback(async () => {
    if (!userAddress || !getTeamNetworkData) {
      setNetwork(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTeamNetworkData(userAddress, {
        maxDepth: 10,
        detailLimit: 100,
      });
      setNetwork(data || null);
    } catch (err) {
      console.error("TeamNetwork load error:", err);
      setError(err?.message || "Failed to load team network data");
      setNetwork(null);
    } finally {
      setIsLoading(false);
    }
  }, [userAddress, getTeamNetworkData]);

  useEffect(() => {
    loadNetwork();
  }, [loadNetwork]);

  /** Choose first non-empty level as active (if available) */
  useEffect(() => {
    if (!network?.levels) return;
    if (network.levels[activeLevel]) return;
    const firstLevel =
      LEVEL_KEYS.find((key) => (network.levels[key] || []).length > 0) ||
      Object.keys(network.levels)[0] ||
      "L1";
    setActiveLevel(firstLevel);
  }, [network, activeLevel]);

  /** Derive real data (no fallbacks) */
  const directMembers = network?.directMembers ?? [];
  const directCount = directMembers.length;

  // Sum volumes from members if summary isn’t present
  const directVolumeFromMembers = directMembers.reduce(
    (sum, member) => sum + Number(member?.stake?.usd ?? 0),
    0
  );

  const teamVolumeFromMembers = directMembers.reduce(
    (sum, member) => sum + Number(member?.teamVolume?.qualifiedUsd ?? 0),
    0
  );

  // Prefer summaries if your store returns them; otherwise safe sum
  const directIncomeSummary = network?.directIncomeSummary;
  const directVolumeUsd = Number(
    directIncomeSummary?.lifetimeUsd ?? directVolumeFromMembers ?? 0
  );
  const teamVolumeQualifiedUsd = Number(
    network?.qualifiedVolumeUsd ??
      network?.teamVolumeUsd ??
      teamVolumeFromMembers ??
      0
  );

  /** Map address→info for quick lookup */
  const directMap = useMemo(() => {
    const map = new Map();
    for (const member of directMembers) {
      const key = (member?.address ?? "").toLowerCase();
      if (key) map.set(key, member);
    }
    return map;
  }, [directMembers]);

  /** Build direct list for UI */
  const directList = useMemo(() => {
    if (!directMembers.length) return [];
    return directMembers.map((member) => {
      const stakeUsd = Number(member?.stake?.usd ?? 0);
      const teamVolUsd = Number(member?.teamVolume?.qualifiedUsd ?? 0);
      return {
        address: truncateAddress(member?.address),
        addressFull: member?.address,
        stakedUSD: stakeUsd,
        stakedUSDDisplay: normalizeUsdDisplay(stakeUsd),
        teamVolume: teamVolUsd,
        teamVolumeDisplay: normalizeUsdDisplay(teamVolUsd),
        activatedAt: member?.joinedAt
          ? new Date(member.joinedAt).toISOString().slice(0, 10)
          : "—",
        raw: member ?? null,
      };
    });
  }, [directMembers]);

  /** Levels (purely from real network.levels) */
  const dynamicLevelData = useMemo(() => {
    if (!network?.levels) return {};
    const result = {};
    for (const key of LEVEL_KEYS) {
      const addresses = network.levels[key] ?? [];
      result[key] = addresses.map((addr, idx) => {
        const info = directMap.get((addr ?? "").toLowerCase());
        const registered = Boolean(info?.registered);
        const joined = info?.joinedAt
          ? new Date(info.joinedAt).toISOString().slice(0, 10)
          : "—";
        const id = info?.id ? `USR-${String(info.id).padStart(4, "0")}` : `ADDR-${idx + 1}`;
        const stakeUsd = Number(info?.stake?.usd ?? 0);
        const teamVolumeUsd = Number(info?.teamVolume?.qualifiedUsd ?? 0);

        return {
          userId: id,
          address: truncateAddress(addr),
          stakedUSD: stakeUsd,
          stakedUSDDisplay: normalizeUsdDisplay(stakeUsd),
          status: registered ? "Active" : "Inactive",
          joinDate: joined,
          totalEarned: Number(info?.summary?.lifetimeUsd ?? 0),
          totalEarnedDisplay: normalizeUsdDisplay(
            Number(info?.summary?.lifetimeUsd ?? 0)
          ),
          teamVolumeUsd,
          teamVolumeDisplay: normalizeUsdDisplay(teamVolumeUsd),
          raw: info ?? null,
        };
      });
    }
    return result;
  }, [network, directMap]);

  /** Totals (no fake numbers) */
  const totalDirectVolume = normalizeUsdDisplay(directVolumeUsd);
  const totalTeamVolume = normalizeUsdDisplay(teamVolumeQualifiedUsd);

  const currentLevelData = dynamicLevelData[activeLevel] ?? [];

  /** Filters */
  const filteredData = currentLevelData.filter((member) => {
    const matchesSearch =
      (member.userId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.address || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  /** Copy referral link */
  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  /** Loading skeleton (modern shimmer) */
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-neon-green relative inline-block">
              Team Network
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-neon-green/20 blur-xl -z-10" />
            </h1>
            <p className="text-cyan-300/90 mt-1">
              Manage your referral network and team structure
            </p>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-28 cyber-glass rounded-lg border border-cyan-500/30 animate-pulse" />
            <div className="h-10 w-28 cyber-glass rounded-lg border border-cyan-500/30 animate-pulse" />
            <div className="h-10 w-24 bg-gradient-to-r from-cyan-500 to-neon-green rounded-lg animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="cyber-glass rounded-xl p-4 border border-cyan-500/30"
            >
              <div className="h-3 w-24 bg-white/10 rounded mb-3 animate-pulse" />
              <div className="h-8 w-20 bg-white/10 rounded animate-pulse" />
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
              </div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="p-4 cyber-glass border border-cyan-500/20 rounded-lg"
                  >
                    <div className="h-4 w-48 bg-white/10 rounded mb-2 animate-pulse" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-5 w-24 bg-white/10 rounded animate-pulse" />
                      <div className="h-5 w-24 bg-white/10 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30">
              <div className="h-4 w-40 bg-white/10 rounded mb-4 animate-pulse" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="p-3 cyber-glass border border-cyan-500/20 rounded-lg"
                  >
                    <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
            <div className="cyber-glass border border-cyan-500/20 rounded-xl p-4">
              <div className="h-4 w-28 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /** Error / Not connected */
  if (error) {
    return (
      <div className="cyber-glass border border-red-400/40 rounded-xl p-4 flex items-start gap-3 text-red-300">
        <AlertCircle size={18} className="mt-0.5" />
        <div>
          <p className="text-sm font-medium">Unable to load network data</p>
          <p className="text-xs opacity-80">{error}</p>
        </div>
      </div>
    );
  }

  if (!userAddress) {
    return (
      <div className="cyber-glass border border-cyan-500/30 rounded-xl p-4 text-cyan-300">
        Connect your wallet or log in to view your team network.
      </div>
    );
  }

  /** Friendly empty state when there is truly no team */
  const isTrulyEmpty =
    directCount === 0 &&
    (!network?.levels ||
      LEVEL_KEYS.every((k) => (network.levels[k] || []).length === 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-neon-green relative inline-block">
            Team Network
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-neon-green/20 blur-xl -z-10" />
          </h1>
          <p className="text-cyan-300/90 mt-1">
            Manage your referral network and team structure
          </p>
        </div>
        <div className="flex gap-2">
          {referralLink && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cyber-glass border border-cyan-500/30 hover:border-cyan-500/50"
            >
              {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
              {copied ? "Copied" : "Copy Link"}
            </button>
          )}
          <button
            onClick={() => setViewMode("overview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === "overview"
                ? "bg-gradient-to-r from-cyan-500 to-neon-green text-dark-950"
                : "cyber-glass text-cyan-400 border border-cyan-500/30 hover:border-cyan-500/50"
            }`}
          >
            <LayoutGrid size={18} />
            <span className="hidden sm:inline">Overview</span>
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === "table"
                ? "bg-gradient-to-r from-cyan-500 to-neon-green text-dark-950"
                : "cyber-glass text-cyan-400 border border-cyan-500/30 hover:border-cyan-500/50"
            }`}
          >
            <Table size={18} />
            <span className="hidden sm:inline">Matrix View</span>
          </button>
          <button
            onClick={loadNetwork}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gradient-to-r from-cyan-500 to-neon-green text-dark-950 disabled:opacity-60"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Empty state (friendly) */}
      {isTrulyEmpty && (
        <div className="cyber-glass rounded-2xl p-8 border border-cyan-500/30 text-center">
          <Users className="mx-auto text-cyan-400/60 mb-3" size={48} />
          <h3 className="text-cyan-200 font-semibold text-lg">
            You don’t have any team yet
          </h3>
          <p className="text-cyan-300/90 mt-1">
            Share your referral link to invite your first direct member.
          </p>
          {referralLink && (
            <button
              onClick={handleCopy}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cyber-glass border border-cyan-500/30 hover:border-cyan-500/50"
            >
              {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
              {copied ? "Copied" : "Copy Referral Link"}
            </button>
          )}
        </div>
      )}

      {/* Overview */}
      {viewMode === "overview" && !isTrulyEmpty && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="cyber-glass rounded-xl p-4 border border-cyan-500/30">
              <p className="text-xs text-cyan-300/90 mb-1 truncate">
                Direct Members
              </p>
              <p className="text-2xl md:text-3xl font-bold text-cyan-300">
                {directCount}
              </p>
            </div>
            <div className="cyber-glass rounded-xl p-4 border border-cyan-500/30">
              <p className="text-xs text-cyan-300/90 mb-1 truncate">
                Direct Volume
              </p>
              <NumberPopup
                value={formatUSD(totalDirectVolume)}
                label="Direct Volume"
                className="text-lg md:text-xl font-bold text-cyan-400"
              />
            </div>
            <div className="cyber-glass rounded-xl p-4 border border-cyan-500/30">
              <p className="text-xs text-cyan-300/90 mb-1 truncate">
                Team Volume
              </p>
              <NumberPopup
                value={formatUSD(totalTeamVolume)}
                label="Team Volume"
                className="text-lg md:text-xl font-bold text-neon-green"
              />
            </div>
            <div className="cyber-glass rounded-xl p-4 border border-cyan-500/30">
              <p className="text-xs text-cyan-300/90 mb-1 truncate">
                Qualified Volume
              </p>
              <NumberPopup
                value={formatUSD(teamVolumeQualifiedUsd)}
                label="Qualified Volume"
                className="text-lg md:text-xl font-bold text-neon-orange"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Direct referrals list */}
            <div className="lg:col-span-2">
              <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-cyan-300">
                    Direct Referrals
                  </h2>
                  <span className="text-sm text-cyan-300/90">
                    {directList.length} {directList.length === 1 ? "member" : "members"}
                  </span>
                </div>

                {directList.length === 0 ? (
                  <div className="text-center py-10">
                    <Users className="mx-auto text-cyan-400/50 mb-3" size={40} />
                    <p className="text-cyan-300/90 font-medium">
                      No direct members yet
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto -mx-6 px-6">
                    <div className="min-w-full space-y-3">
                      {directList.map((direct, idx) => (
                        <div
                          key={idx}
                          className="p-4 cyber-glass border border-cyan-500/20 rounded-lg hover:cyber-glass transition-colors min-w-0"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <code className="text-sm font-mono text-cyan-300 truncate">
                              {direct.address}
                            </code>
                            <span className="text-xs text-cyan-300/90 flex-shrink-0">
                              {direct.activatedAt}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="min-w-0">
                              <p className="text-xs text-cyan-300/90 mb-1">
                                Stake Amount
                              </p>
                              <NumberPopup
                                value={formatUSD(
                                  (direct.stakedUSDDisplay ?? 0) * 1e8
                                )}
                                label="Stake Amount"
                                className="text-sm font-semibold text-cyan-400"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-cyan-300/90 mb-1">
                                Team Volume
                              </p>
                              <NumberPopup
                                value={formatUSD(
                                  (direct.teamVolumeDisplay ?? 0) 
                                )}
                                label="Team Volume"
                                className="text-sm font-semibold text-neon-green"
                              />
                            </div>
                          </div>
                          <button
                            className="mt-3 text-xs text-cyan-400 hover:text-cyan-400 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                            onClick={() => {
                              if (!direct.addressFull) return;
                              navigate(`/dashboard/team/${direct.addressFull}`, {
                                state: { direct: direct.raw ?? null },
                              });
                            }}
                            disabled={!direct.addressFull}
                          >
                            <Eye size={14} />
                            View Details
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tips / info */}
            <div className="space-y-6">
              <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30">
                <h3 className="font-semibold text-cyan-300 mb-4">
                  Volume Calculation
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-cyan-400 mb-2">
                      40:30:30 Rule
                    </p>
                    <p className="text-xs text-cyan-300/90 mb-3">
                      For 3 legs, volume is calculated with caps
                    </p>
                    <div className="space-y-2">
                      <div className="p-2.5 cyber-glass border border-cyan-500/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-cyan-300">
                            Leg 1
                          </span>
                          <span className="text-xs font-bold text-cyan-300">
                            40% Cap
                          </span>
                        </div>
                      </div>
                      <div className="p-2.5 cyber-glass border border-neon-green/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-neon-green">
                            Leg 2
                          </span>
                          <span className="text-xs font-bold text-neon-green">
                            30% Cap
                          </span>
                        </div>
                      </div>
                      <div className="p-2.5 cyber-glass border border-neon-orange/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-neon-orange">
                            Leg 3
                          </span>
                          <span className="text-xs font-bold text-neon-orange">
                            30% Cap
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-cyan-500/30">
                    <div className="p-3 cyber-glass border border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-neon-green/5 rounded-lg">
                      <p className="text-xs font-medium text-cyan-300 mb-1">
                        4+ Legs Bonus
                      </p>
                      <p className="text-xs text-cyan-300/90">
                        100% of total volume qualifies (no caps)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="cyber-glass border border-cyan-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp
                    className="text-cyan-400 flex-shrink-0 mt-0.5"
                    size={20}
                  />
                  <div>
                    <p className="text-sm font-medium text-cyan-300 mb-1">
                      Build Smart
                    </p>
                    <p className="text-xs text-cyan-300">
                      Focus on balanced leg growth to unlock higher slab levels
                      and royalty income.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Matrix View */}
      {viewMode === "table" && (
        <div className="cyber-glass rounded-2xl border border-cyan-500/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-6 border-b border-cyan-500/20">
            <div>
              <h2 className="text-lg font-semibold text-cyan-300">
                Total Team Matrix
              </h2>
              {/* Counts derived from real data */}
              <p className="text-xs text-cyan-300/80">
                {(network?.levels
                  ? LEVEL_KEYS.reduce(
                      (sum, level) => sum + (network.levels[level]?.length ?? 0),
                      0
                    )
                  : 0) || 0}{" "}
                members
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {LEVEL_KEYS.map((level) => (
                <button
                  key={level}
                  onClick={() => setActiveLevel(level)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeLevel === level
                      ? "bg-gradient-to-r from-cyan-500 to-neon-green text-dark-950"
                      : "cyber-glass border border-cyan-500/30 text-cyan-300 hover:border-cyan-500/50"
                  }`}
                >
                  {level}
                  <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded text-[11px] text-white/90">
                    {network?.levels?.[level]?.length ?? 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-cyan-500/20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300/70"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by User ID or Address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 cyber-glass border border-cyan-500/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="relative">
                <Filter
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300/70"
                  size={18}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 cyber-glass border border-cyan-500/20 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="cyber-glass border border-cyan-500/20 rounded-lg px-4 py-2.5 text-sm text-cyan-300 flex items-center justify-between">
                <span>Level</span>
                <span className="font-semibold text-cyan-100">{activeLevel}</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="p-4 sm:p-6">
            {filteredData.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto text-cyan-400/50 mb-3" size={48} />
                <p className="text-cyan-300/90 font-medium">
                  No team members found at {activeLevel}
                </p>
                <p className="text-sm text-cyan-300/90 mt-1">
                  {searchTerm || statusFilter !== "All"
                    ? "Try adjusting your filters"
                    : "This level is empty"}
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
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cyan-500/10">
                      {filteredData.map((member, idx) => (
                        <tr key={`${member.userId}-${idx}`}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-cyan-100">
                            {member.userId}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-cyan-100">
                            {member.address}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <NumberPopup
                              value={formatUSD(
                                (member.stakedUSDDisplay ?? member.stakedUSD ?? 0) * 1e8
                              )}
                              label="Portfolio Amount"
                              className="text-cyan-300 font-medium"
                            />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <NumberPopup
                              value={formatUSD(
                                (normalizeUsdDisplay(member.totalEarned ?? 0)) * 1e8
                              )}
                              label="Total Earned"
                              className="text-neon-green font-medium"
                            />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                member.status === "Active"
                                  ? "bg-neon-green/20 text-neon-green"
                                  : "bg-cyan-500/10 text-cyan-300"
                              }`}
                            >
                              {member.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-cyan-100">
                            {member.joinDate || "—"}
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
      )}
    </div>
  );
}
