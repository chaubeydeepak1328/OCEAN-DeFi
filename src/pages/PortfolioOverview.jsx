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
  ArrowDownRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  getMockPortfolioDetails,
  getMockUserStatus,
  formatUSD,
  formatRAMA,
} from "../utils/contractData";
import { PortfolioStatus } from "../types/contract";
import NumberPopup from "../components/NumberPopup";
import Tooltip from "../components/Tooltip";
import CopyButton from "../components/CopyButton";
import ProgressBar from "../components/ProgressBar";

export default function PortfolioOverview() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const portfolio = getMockPortfolioDetails();
  const userStatus = getMockUserStatus();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());
    }, 1500);
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const portfolioCapProgress =
    (parseFloat(portfolio.totalEarnedUSD) / parseFloat(portfolio.maxCapUSD)) *
    100;
  const globalCapProgress =
    (parseFloat(portfolio.totalLifetimeEarnedUSD) /
      parseFloat(portfolio.maxLifetimeEarnableUSD)) *
    100;

  const dailyRate = portfolio.isBooster
    ? parseFloat(portfolio.stakedUSD) >= 5010e8
      ? 0.8
      : 0.66
    : parseFloat(portfolio.stakedUSD) >= 5010e8
      ? 0.4
      : 0.33;

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

        {" "}

        <div className="cyber-glass rounded-xl p-4 border border-neon-green/30 hover:border-neon-green/80 relative overflow-hidden group transition-all">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-green/50 to-transparent" />
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-neon-green/90 uppercase tracking-wide">
              Total Earned
            </p>
            <Tooltip content="Total earnings from portfolio growth, slab income, and rewards combined.">
              <Info size={12} className="text-neon-green/50" />
            </Tooltip>
          </div>
          <NumberPopup
            value={formatUSD(portfolio.totalEarnedUSD)}
            label="Total Earnings"
            className="text-xl sm:text-2xl font-bold text-neon-green mb-1"
          />
          <div className="flex items-center gap-1 text-xs">
            <span className="text-cyan-400/70">Daily Rate:</span>
            <span className="text-neon-green font-semibold">{dailyRate}%</span>
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
            value={formatUSD(portfolio.accruedGrowthUSD)}
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
        <div className="lg:col-span-3 cyber-glass rounded-2xl p-4 sm:p-6 border border-cyan-500/30 hover:border-cyan-500/80 relative overflow-hidden transition-all">
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

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs sm:text-sm font-medium text-cyan-400 uppercase tracking-wider">
                  Lifetime 4x Cap Progress
                </span>
                <Tooltip content="Global lifetime earnings cap across all your portfolios. Maximum total earnings: 4x your lifetime staked amount.">
                  <Info size={14} className="text-cyan-400/70" />
                </Tooltip>
              </div>
              <ProgressBar
                progress={globalCapProgress}
                current={formatUSD(portfolio.totalLifetimeEarnedUSD)}
                max={formatUSD(portfolio.maxLifetimeEarnableUSD)}
                label=""
                color="green"
                showMilestones={true}
              />
              <p className="text-xs text-cyan-400/80 mt-2">
                Remaining:{" "}
                {formatUSD(
                  parseFloat(portfolio.maxLifetimeEarnableUSD) -
                  parseFloat(portfolio.totalLifetimeEarnedUSD)
                )}
              </p>
            </div>
          </div>


        </div>

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
                parseInt(portfolio.freezeEndsAt) * 1000
              ).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
