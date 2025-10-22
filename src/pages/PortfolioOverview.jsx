import {
  TrendingUp,
  Wallet,
  Clock,
  Award,
  AlertCircle,
  Zap,
  RefreshCw,
  Info,
  ArrowUpRight,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "../../store/useUserInfoStore";
import { formatUSD, formatRAMA } from "../utils/contractData";
import { PortfolioStatus } from "../types/contract";
import NumberPopup from "../components/NumberPopup";
import Tooltip from "../components/Tooltip";
import CopyButton from "../components/CopyButton";
import ProgressBar from "../components/ProgressBar";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const emptyPortfolio = {
  status: "No Portfolio",
  stakedUSD: 0,
  totalEarnedUSD: 0,
  maxCapUSD: 0,
  totalLifetimeEarnedUSD: 0,
  maxLifetimeEarnableUSD: 0,
  accruedGrowthUSD: 0,
  accruedGrowthRAMA: 0,
  readyToClaimUSD: 0,
  safeWalletRAMA: 0,
  safeWalletUsdDisplay: 0,
  upline: ZERO_ADDRESS,
  freezeEndsAt: 0,
  isBooster: false,
  capProgressPercent: 0,
  lifetimeProgressPercent: 0,
  dailyRatePercent: 0,
  capPct: 0,
  capProgressBps: 0,
  principalUsd: 0,
  pid: null,
};

const emptyUserStatus = {
  directChildrenCount: 0,
  currentSlabIndex: 0,
  currentRoyaltyLevelIndex: 0,
  royaltyPayoutsReceived: 0,
  nextSlabClaimRequiresDirects: 0,
  qualifiedVolumeUSD: 0,
};

const microToUsd = (value) => Number(value ?? 0) / 1e6;
const wadToPercent = (wad) => Number(wad ?? 0) / 1e16;
const pickNumber = (...candidates) => {
  for (const candidate of candidates) {
    if (candidate === undefined || candidate === null) continue;
    const num = Number(candidate);
    if (!Number.isNaN(num)) return num;
  }
  return 0;
};

const buildUserStatus = (dashboard) => {
  if (!dashboard) return { ...emptyUserStatus };

  const slabPanel = dashboard?.slabPanel ?? {};
  const userStatus = dashboard?.userStatus ?? {};

  const directChildrenCount = Number(
    slabPanel?.directMembers ?? userStatus?.directs ?? 0
  );
  const currentSlabIndex = Number(
    userStatus?.slabLevel ?? slabPanel?.slabIndex ?? 0
  );
  const currentRoyaltyLevelIndex = Number(userStatus?.royaltyLevel ?? 0);
  const royaltyPayoutsReceived = Number(
    userStatus?.royaltyPaidMonths ?? dashboard?.royaltyPaidMonths ?? 0
  );
  const qualifiedVolumeUSD = Number(
    userStatus?.qualifiedVolumeUsd ?? slabPanel?.qualifiedVolumeUsd ?? 0
  );
  const nextSlabClaimRequiresDirects = slabPanel?.canClaim === false ? 1 : 0;

  return {
    directChildrenCount,
    currentSlabIndex,
    currentRoyaltyLevelIndex,
    royaltyPayoutsReceived,
    nextSlabClaimRequiresDirects,
    qualifiedVolumeUSD,
  };
};

const buildPortfolioData = (entry, dashboard) => {
  const dashboardTotals = dashboard?.totals ?? {};
  const incomeTotals = dashboard?.incomeTotalsUsd ?? {};
  const safeWallet = dashboard?.safeWallet ?? {};

  const totalStakedUsd = Number(
    dashboardTotals.totalStakedUsd ?? dashboardTotals.totalValueUsd ?? 0
  );
  const totalStakedRama = Number(dashboardTotals.totalStakedRama ?? 0);
  const totalEarningsUsd = Number(
    dashboard?.totalEarningsUsd ?? incomeTotals.total ?? 0
  );
  const readyToClaimUsd = Number(
    dashboard?.totalClaimableUsd ?? incomeTotals.total ?? 0
  );
  const accruedGrowthUsd = Number(
    dashboard?.accruedGrowthUsd ?? incomeTotals.growth ?? readyToClaimUsd
  );

  const safeWalletRama = Number(safeWallet?.rama ?? 0);
  const usdPerRama =
    totalStakedRama > 0 ? totalStakedUsd / totalStakedRama : 0;
  const safeWalletUsd = Number.isFinite(Number(safeWallet?.usd))
    ? Number(safeWallet.usd)
    : safeWalletRama * usdPerRama;
  const accruedGrowthRAMA =
    usdPerRama > 0 ? accruedGrowthUsd / usdPerRama : 0;

  const summary = entry?.summary ?? {};
  const detail = entry?.detail ?? {};
  const pid = entry?.pid ?? null;

  const principalUsd = pickNumber(
    summary?.principalUsd,
    detail?.principalUsdDisplay,
    microToUsd(summary?.principalUsdRaw),
    microToUsd(summary?.principalUSD),
    microToUsd(detail?.principalUsd),
    microToUsd(detail?.principalUSD)
  );

  const capPct = pickNumber(summary?.capPct, detail?.capPct, 0);
  const capProgressBps = pickNumber(
    summary?.capProgressBps,
    detail?.capProgressBps,
    0
  );
  const capUsd = pickNumber(
    summary?.capUsd,
    microToUsd(summary?.capUsdMicro),
    microToUsd(detail?.capUsd),
    principalUsd * (capPct / 100 || 0)
  );
  const capProgressPercent = capProgressBps / 100;
  const earnedUsd = capUsd * (capProgressBps / 10000);

  const booster = Boolean(summary?.booster ?? detail?.booster);
  const activeFlag = summary?.active ?? detail?.active ?? true;
  const frozenUntil = Number(
    summary?.frozenUntil ?? detail?.frozenUntil ?? 0
  );
  const dailyRateWad = summary?.dailyRateWad ?? detail?.dailyRateWad ?? 0;
  const dailyRatePercent = wadToPercent(dailyRateWad);

  const lifetimeMaxUsd = totalStakedUsd * 4;
  const lifetimeProgressPercent = lifetimeMaxUsd
    ? (totalEarningsUsd / lifetimeMaxUsd) * 100
    : 0;

  let status = "No Portfolio";
  if (pid != null) {
    status = !activeFlag
      ? PortfolioStatus.Closed
      : frozenUntil && frozenUntil * 1000 > Date.now()
        ? PortfolioStatus.Frozen
        : PortfolioStatus.Active;
  }

  return {
    status,
    stakedUSD: principalUsd,
    totalEarnedUSD: earnedUsd,
    maxCapUSD: capUsd,
    totalLifetimeEarnedUSD: totalEarningsUsd,
    maxLifetimeEarnableUSD: lifetimeMaxUsd,
    accruedGrowthUSD: accruedGrowthUsd,
    accruedGrowthRAMA,
    readyToClaimUSD: readyToClaimUsd,
    safeWalletRAMA: safeWalletRama,
    safeWalletUsdDisplay: safeWalletUsd,
    upline: dashboard?.upline ?? dashboard?.userStatus?.referrer ?? ZERO_ADDRESS,
    freezeEndsAt: frozenUntil,
    isBooster: booster,
    capProgressPercent,
    lifetimeProgressPercent,
    dailyRatePercent,
    capPct,
    capProgressBps,
    principalUsd,
    pid,
  };
};

export default function PortfolioOverview() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [portfolio, setPortfolio] = useState(emptyPortfolio);
  const [userStatus, setUserStatus] = useState(emptyUserStatus);
  const [portfolioIds, setPortfolioIds] = useState([]);
  const [selectedPid, setSelectedPid] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [portfolioEntries, setPortfolioEntries] = useState([]);

  const getDashboardDetails = useStore((s) => s.getDashboardDetails);
  const getPortfolioSummaries = useStore((s) => s.getPortfolioSummaries);
  const getPortfolioIds = useStore((s) => s.getPortfolioIds);
  const getPortfolioById = useStore((s) => s.getPortFoliById);

  const userAddressFromStore = useStore((s) => s.userAddress);
  const userAddress =
    userAddressFromStore || localStorage.getItem("userAddress") || null;

  const mountedRef = useRef(true);

  useEffect(() => () => {
    mountedRef.current = false;
  }, []);

  const getTimeAgo = (date) => {
    if (!date) return "—";
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const loadData = useCallback(async () => {
    if (!userAddress) {
      setPortfolio(emptyPortfolio);
      setUserStatus(emptyUserStatus);
      setPortfolioIds([]);
      setLastUpdated(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [dashboard, summaries, ids] = await Promise.all([
        getDashboardDetails(userAddress),
        getPortfolioSummaries(userAddress),
        getPortfolioIds(userAddress),
      ]);

      if (!mountedRef.current) return;

      const normalizedSummaries = Array.isArray(summaries)
        ? summaries
        : [];
      const summaryEntries = normalizedSummaries
        .map((summary) => ({
          pid: Number(summary?.pid ?? summary?.[0] ?? 0),
          summary,
        }))
        .filter((item) => Number.isFinite(item.pid) && item.pid >= 0);

      const normalizedIds = Array.isArray(ids)
        ? ids.map((id) => Number(id)).filter((id) => Number.isFinite(id))
        : [];

      const detailIds = summaryEntries.length
        ? summaryEntries.map((item) => item.pid)
        : normalizedIds;

      const detailResults = detailIds.length
        ? await Promise.all(
          detailIds.map(async (pid) => {
            try {
              return await getPortfolioById(pid);
            } catch (detailErr) {
              console.warn(`getPortfolioDetails(${pid}) failed`, detailErr);
              return null;
            }
          })
        )
        : [];

      const detailMap = new Map(
        detailResults
          .filter(Boolean)
          .map((detail) => [Number(detail.pid), detail])
      );

      let combined = summaryEntries.length
        ? summaryEntries.map(({ pid, summary }) => ({
          pid,
          summary,
          detail: detailMap.get(pid) ?? null,
        }))
        : detailIds.map((pid) => ({
          pid,
          summary: null,
          detail: detailMap.get(pid) ?? null,
        }));

      if (!combined.length && Array.isArray(dashboard?.portfolios)) {
        combined = dashboard.portfolios
          .map((card) => ({
            pid: Number(card?.pid ?? 0),
            summary: card,
            detail: detailMap.get(Number(card?.pid ?? 0)) ?? null,
          }))
          .filter((item) => Number.isFinite(item.pid) && item.pid >= 0);
      }

      setDashboardData(dashboard ?? null);
      setPortfolioEntries(combined);
      setLastUpdated(new Date());

      setSelectedPid((prev) => {
        if (!combined.length) return null;
        if (
          prev != null &&
          combined.some((item) => Number(item.pid) === Number(prev))
        ) {
          return prev;
        }
        return combined[0]?.pid ?? null;
      });
    } catch (err) {
      if (!mountedRef.current) return;
      console.error(err);
      setError(err?.message || "Failed to load portfolio data");
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [
    getDashboardDetails,
    getPortfolioById,
    getPortfolioIds,
    getPortfolioSummaries,
    userAddress,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setUserStatus(buildUserStatus(dashboardData));
  }, [dashboardData]);

  useEffect(() => {
    const ids = portfolioEntries
      .map((item) => Number(item.pid))
      .filter((pid) => Number.isFinite(pid));
    setPortfolioIds(ids);
  }, [portfolioEntries]);

  useEffect(() => {
    if (!dashboardData) {
      setPortfolio(buildPortfolioData(null, null));
      return;
    }

    if (!portfolioEntries.length) {
      setPortfolio(buildPortfolioData(null, dashboardData));
      return;
    }

    let entry = portfolioEntries.find(
      (item) => Number(item.pid) === Number(selectedPid)
    );

    if (!entry) {
      entry = portfolioEntries[0];
      if (entry && selectedPid !== entry.pid) {
        setSelectedPid(entry.pid);
      }
    }

    if (!entry) {
      setPortfolio({ ...emptyPortfolio });
      return;
    }

    setPortfolio(buildPortfolioData(entry, dashboardData));
  }, [selectedPid, portfolioEntries, dashboardData]);

  const handleRefresh = () => {
    if (!userAddress) return;
    setIsRefreshing(true);
    loadData();
  };

  const handleSelectPid = (event) => {
    const value = event.target.value;
    setSelectedPid(value === "" ? null : Number(value));
  };

  const portfolioCapProgress = Math.max(
    0,
    Math.min(100, portfolio.capProgressPercent ?? 0)
  );
  const globalCapProgress = Math.max(
    0,
    Math.min(100, portfolio.lifetimeProgressPercent ?? 0)
  );
  const dailyRateValue = Number.isFinite(portfolio.dailyRatePercent)
    ? portfolio.dailyRatePercent
    : 0;
  const dailyRate = dailyRateValue.toFixed(2);
  const uplineAddress =
    typeof portfolio.upline === "string" && portfolio.upline.length >= 10
      ? portfolio.upline
      : ZERO_ADDRESS;
  const uplineDisplay = `${uplineAddress.slice(0, 6)}...${uplineAddress.slice(-4)}`;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-neon-green relative inline-block">
              Portfolio Overview
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-neon-green/20 blur-xl -z-10" />
            </h1>
            <p className="text-sm sm:text-base text-cyan-300/90 mt-1">
              Your complete OCEAN DeFi investment dashboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-2 cyber-glass border border-cyan-500/30 rounded-lg hover:border-cyan-500/50 transition-all hover:shadow-neon-cyan group disabled:opacity-50"
              aria-label="Refresh data"
            >
              <RefreshCw
                size={16}
                className={`text-cyan-400 ${isRefreshing
                  ? "animate-spin"
                  : "group-hover:rotate-180 transition-transform duration-500"
                  }`}
              />
              <span className="text-xs text-cyan-400 hidden sm:inline">
                Refresh
              </span>
            </button>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 cyber-glass border border-neon-green/30 rounded-lg flex-shrink-0 w-fit">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
              <span className="text-xs sm:text-sm font-medium text-neon-green uppercase tracking-wide">
                {portfolio.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-cyan-400/70">
          <Clock size={12} />
          <span>Last updated: {getTimeAgo(lastUpdated)}</span>
        </div>
      </div>

      {portfolioIds.length > 0 && (
        <div className="cyber-glass border border-cyan-500/20 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
            Portfolio ID
          </label>
          <div className="relative w-full sm:w-56">
            <select
              value={selectedPid ?? ""}
              onChange={handleSelectPid}
              className="w-full appearance-none bg-dark-900 border border-cyan-500/30 rounded-lg px-3 py-2 text-sm text-cyan-200 focus:outline-none focus:border-neon-green/60 pr-10"
            >
              {portfolioIds.map((pid) => (
                <option key={pid} value={pid}>
                  Portfolio #{pid}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-70"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M7 10l5 5 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}

      {error && (
        <div className="cyber-glass border border-red-400/40 bg-red-500/10 text-red-200 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {loading && !isRefreshing && (
        <div className="cyber-glass border border-cyan-500/30 text-cyan-200 rounded-xl px-4 py-3 text-sm">
          Loading portfolio data…
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-fade-in-up">
        <div className="cyber-glass rounded-xl p-4 border border-cyan-500/30 hover:border-cyan-500/80 relative overflow-hidden group transition-all">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-cyan-400/90 uppercase tracking-wide">
              Total Value
            </p>
            <Info size={20} className="text-cyan-400/50" />
          </div>
          <NumberPopup
            value={formatUSD(portfolio.stakedUSD)}
            label="Total Portfolio Value"
            className="text-xl sm:text-2xl font-bold text-cyan-300 mb-1"
          />
          <div className="flex items-center gap-1 text-xs">
            <ArrowUpRight size={12} className="text-neon-green" />
            <span className="text-neon-green">+12.5%</span>
            <span className="text-cyan-400/70">vs last month</span>
          </div>
        </div>

        <div className="cyber-glass rounded-xl p-4 border border-neon-green/30 hover:border-neon-green/80 relative overflow-hidden group transition-all">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-green/50 to-transparent" />
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-neon-green/90 uppercase tracking-wide">
              Lifetime Earnings
            </p>
            <Tooltip content="Total earnings across all time, including reinvested growth and manual claims.">
              <Info size={12} className="text-neon-green/50" />
            </Tooltip>
          </div>
          <NumberPopup
            value={formatUSD(portfolio.totalLifetimeEarnedUSD)}
            label="Lifetime Earnings"
            className="text-xl sm:text-2xl font-bold text-neon-green mb-1"
          />
          <div className="flex items-center gap-1 text-xs">
            <span className="text-cyan-400/70">Progress to 4× cap:</span>
            <span className="text-neon-green font-semibold">
              {globalCapProgress.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="cyber-glass rounded-xl p-4 border border-neon-orange/30 hover:border-neon-orange/80 relative overflow-hidden group transition-all">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-orange/50 to-transparent" />
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-neon-orange/90 uppercase tracking-wide">
              Ready to Claim
            </p>
            <Tooltip content="Amount available to claim immediately without any waiting period.">
              <Info size={12} className="text-neon-orange/50" />
            </Tooltip>
          </div>
          <NumberPopup
            value={formatUSD(portfolio.readyToClaimUSD)}
            label="Available to Claim"
            className="text-xl sm:text-2xl font-bold text-neon-orange mb-1"
          />
          <button className="mt-2 w-full py-1.5 bg-gradient-to-r from-neon-orange to-neon-pink text-white rounded-lg text-xs font-bold hover:shadow-neon-orange transition-all hover:scale-[1.02] uppercase tracking-wide">
            Claim Now
          </button>
        </div>
        <div className="cyber-glass rounded-xl p-4 border border-cyan-400/30 hover:border-cyan-400/80 relative overflow-hidden group transition-all">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-cyan-400/90 uppercase tracking-wide">
              Network Size
            </p>
            <Info size={12} className="text-cyan-400/50" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-cyan-300 mb-1">
            {userStatus.directChildrenCount}
          </p>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-cyan-400/70">Direct referrals</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 cyber-glass rounded-2xl p-4 sm:p-6 border border-cyan-500/30 hover:border-cyan-500/80 relative overflow-hidden transition-all">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-cyan-300 uppercase tracking-wide">
                Active Portfolio
              </h2>
              <p className="text-xs sm:text-sm text-cyan-300/90">
                Your current investment details
              </p>
            </div>
            {portfolio.isBooster && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-neon-orange to-neon-pink text-white rounded-lg text-xs sm:text-sm font-bold flex-shrink-0 w-fit  border border-neon-orange/50">
                <Zap size={14} className="sm:w-4 sm:h-4 animate-pulse" />
                <span className="uppercase">Booster</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-cyan-300/90 mb-1 truncate uppercase tracking-wide">
                Staked Amount
              </p>
              <NumberPopup
                value={formatUSD(portfolio.stakedUSD)}
                label="Staked Amount"
                className="text-lg sm:text-2xl font-bold text-cyan-300"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-cyan-300/90 mb-1 truncate uppercase tracking-wide">
                Total Earned
              </p>
              <NumberPopup
                value={formatUSD(portfolio.totalEarnedUSD)}
                label="Total Earned"
                className="text-lg sm:text-2xl font-bold text-neon-green"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs sm:text-sm font-medium text-cyan-400 uppercase tracking-wider">
                  Earnings Progress to Cap
                </span>
                <Tooltip content="Maximum earnings cap based on your stake. Regular portfolios: 200% (2x), Booster portfolios: 250% (2.5x) including principal.">
                  <Info size={14} className="text-cyan-400/70" />
                </Tooltip>
              </div>
              <ProgressBar
                progress={portfolioCapProgress}
                current={formatUSD(portfolio.totalEarnedUSD)}
                max={formatUSD(portfolio.maxCapUSD)}
                label=""
                color="cyan"
                showMilestones={true}
              />
              <p className="text-xs text-cyan-400/80 mt-2">
                Cap Type:{" "}
                {portfolio.isBooster ? "250% (Booster)" : "200% (Regular)"}
              </p>
            </div>
          </div>
        </div>


        <div className="flex flex-col gap-10">
          <div className="cyber-glass rounded-xl p-4 sm:p-5 border border-neon-orange/30 hover:border-neon-orange/80  relative overflow-hidden transition-all">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-orange/50 to-transparent" />
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 cyber-glass border border-neon-orange/30 rounded-lg flex-shrink-0">
              <Clock className="text-neon-orange" size={18} />
            </div>
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-neon-orange truncate uppercase tracking-wide">
                Next Slab Claim
              </p>
              <Tooltip
                content="Status of your next slab income claim. A 24-hour cooldown applies between claims."
                position="bottom"
              >
                <Info size={12} className="text-neon-orange/70 flex-shrink-0" />
              </Tooltip>
            </div>
          </div>
          <p className="text-base sm:text-lg font-bold text-cyan-300 truncate">
            {userStatus.nextSlabClaimRequiresDirects === 1
              ? "Needs Directs"
              : "Available"}
          </p>
          <p className="text-xs text-cyan-300/90 mt-1">24h cooldown period</p>
        </div>

        <div className="cyber-glass rounded-xl p-4 sm:p-5 border border-cyan-400/30 hover:border-cyan-400/80 relative overflow-hidden transition-all">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 cyber-glass border border-cyan-400/30 rounded-lg flex-shrink-0">
              <AlertCircle className="text-cyan-400" size={18} />
            </div>
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-cyan-400 truncate uppercase tracking-wide">
                Upline Sponsor
              </p>
              <Tooltip
                content="The wallet address of the person who referred you to the platform."
                position="bottom"
              >
                <Info size={12} className="text-cyan-400/70 flex-shrink-0" />
              </Tooltip>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-mono text-cyan-300 truncate flex-1">
              {uplineDisplay}
            </p>
            <CopyButton text={uplineAddress} label="" />
          </div>
          <button className="text-xs text-cyan-400 hover:text-neon-green mt-2 transition-colors inline-flex items-center gap-1">
            <span>View Details</span>
            <ArrowUpRight size={10} />
          </button>
        </div>
        </div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">




      </div>

      {portfolio.status === PortfolioStatus.Frozen && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle
            className="text-amber-600 flex-shrink-0 mt-0.5"
            size={20}
          />
          <div className="min-w-0">
            <p className="font-medium text-amber-900">Portfolio Frozen</p>
            <p className="text-sm text-amber-700 mt-1 break-words">
              Withdrawal freeze active until{" "}
              {new Date(
                (portfolio.freezeEndsAt ?? 0) * 1000
              ).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
