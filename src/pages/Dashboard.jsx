// src/screens/Dashboard.jsx
import { useEffect, useMemo, useState } from 'react';
import { TrendingUp, Wallet, Users, Award, DollarSign, Clock, Zap, Gift, Trophy, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatUSD, formatRAMA } from '../utils/contractData';
import NumberPopup from '../components/NumberPopup';
import LivePriceFeed from '../components/LivePriceFeed';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../../store/useUserInfoStore';



export default function Dashboard() {
  const [portfolio, setPortfolioComputed] = useState({ totalEarnedUSD: 0 });
  const [userStatus, setUserStatusComputed] = useState({
    qualifiedVolumeUSD: 0,
    currentRoyaltyLevelIndex: 0,
    royaltyPayoutsReceived: 0,
  });

  const [portfolioIds, setPortFolioId] = useState([])
  const [selectedPid, setSelectedPid] = useState(1);
  const [portFolioDetails, setFortFolioDetails] = useState();
  const [DashBoardDetail, setDashboardDetails] = useState();
  const [last7Day, setLast7Days] = useState();


  const getTOtalPortFolio = useStore((s) => s.getTOtalPortFolio);
  const getPortFoliById = useStore((s) => s.getPortFoliById);
  const getDashboardDetails = useStore((s) => s.getDashboardDetails);
  const get7DayEarningTrend = useStore((s) => s.get7DayEarningTrend);


  const userAddress = localStorage.getItem("userAddress") || null;

  const fetchPortFolio = async () => {
    try {
      console.log(userAddress)
      const res = await getTOtalPortFolio(userAddress);
      console.log("-------------->$%^&*(",userAddress,res)
      setPortFolioId(res?.ArrPortfolio?.map(Number) || [])
      setFortFolioDetails(res?.ProtFolioDetail)
    } catch (error) {
      console.log(error)
    }
  }


  // ===========================================================================
  // Dashboard details
  // ---------------------------------------------------------------------------

  const getDashboardInfo = async () => {
    try {
      if (!userAddress) {
        return
      }
      const response = await getDashboardDetails(userAddress);
      console.log(response)
      setDashboardDetails(response)
    } catch (error) {
      console.log(error)
    }
  }

  const get7daysTrend = async () => {
    try {
      if (!userAddress) {
        return;
      }
      const res = await get7DayEarningTrend(userAddress);
      console.log("7-Days Trend",res)
      setLast7Days(res)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getDashboardInfo();
    fetchPortFolio();
    get7daysTrend();
  }, [])

  const GetPortFolioById = async () => {
    try {
      const res = await getPortFoliById(selectedPid);
      console.log(res)
      setFortFolioDetails(res)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (selectedPid&&portfolioIds.length>0) {
      GetPortFolioById()
    }
  }, [selectedPid])

  // --- Portfolio ID Select (array of numeric IDs) -----------------------------

  useEffect(() => {
    // if IDs change and current selection is missing, reset to first
    if (portfolioIds.length && !portfolioIds.includes(Number(selectedPid))) {
      setSelectedPid(portfolioIds[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolioIds.join(',')]); // join to keep dep simple

  useEffect(() => {
    if (selectedPid !== '' && Number.isFinite(Number(selectedPid))) {
      localStorage.setItem('selectedPortfolioId', String(selectedPid));
    }
  }, [selectedPid]);





  // Compute UI-facing aggregates from fetched data (no UI changes)
  useEffect(() => {
    // Map "Total Earned" tile to accrued growth as on-chain value (USD precision)
    setPortfolioComputed((prev) => ({
      ...prev,
      totalEarnedUSD: DashBoardDetail?.accuredGrowth || 0,
    }));

    // userStatus cards — if qualified volume is present in slabPanel, use it
    const qv = DashBoardDetail?.slabPanel?.qualifiedVolumeUSD ?? 0;
    setUserStatusComputed((prev) => ({
      ...prev,
      qualifiedVolumeUSD: qv,
      // currentRoyaltyLevelIndex and royaltyPayoutsReceived require store methods
    }));
  }, [DashBoardDetail]);

  const captPct = parseFloat(portFolioDetails?.capPct);
  const principalUSD = parseFloat(portFolioDetails?.principalUSD) / 1e6;
  const totalEarning = principalUSD * captPct / 1e2;
  const progress = (principalUSD / (principalUSD * (captPct / 1e2))) * 100;

  console.log(principalUSD, totalEarning, captPct, progress)

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-neon-green bg-clip-text text-transparent relative inline-block">
            Dashboard
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-neon-green/20 blur-xl -z-10" />
          </h1>
          <p className="text-sm sm:text-base text-cyan-300/70 mt-1">Welcome back! Here's your complete overview</p>
        </div>
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 cyber-glass border border-neon-green/30 rounded-lg flex-shrink-0 w-fit">
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
          <span className="text-xs sm:text-sm font-medium text-neon-green uppercase tracking-wide">Active {"("} {userAddress.slice(0,6)+"..."+userAddress.slice(-4)} {")"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Link to="/dashboard" className="cyber-glass border border-cyan-500/30 hover:border-cyan-500/80 rounded-xl p-4 sm:p-5 text-white transition-all group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="p-2 bg-cyan-500/20 rounded-lg flex-shrink-0 border border-cyan-500/30">
              <Wallet size={20} className="text-cyan-400" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-cyan-300 uppercase tracking-wide">Staked Amount</p>
          </div>
          <NumberPopup
            value={formatUSD(parseFloat(DashBoardDetail?.dashboardData?.summary?.totalStakedUsdMicro)/1e6)}
            label="Staked Amount"
            className="text-xl sm:text-2xl font-bold mb-2 text-cyan-400 relative z-10"
          />
          <div className="flex items-center gap-1 text-xs text-cyan-300/90 relative z-10">
            <span>View Portfolio</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </Link>

        <Link to="/dashboard/earnings" className="cyber-glass border border-neon-green/30 hover:border-neon-green/80 rounded-xl p-4 sm:p-5 text-white transition-all group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="p-2 bg-neon-green/20 rounded-lg flex-shrink-0 border border-neon-green/30">
              <TrendingUp size={20} className="text-neon-green" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-neon-green uppercase tracking-wide">Total Earned</p>
          </div>
          <NumberPopup
            // value={parseFloat(DashBoardDetail?.dashboardData?.summary?.totalEarnedRamaWei)/1e18 + " RAMA"}
            value={parseFloat(DashBoardDetail?.GrantTotalEarn)/1e18}

            label="Total Earned"
            className="text-xl sm:text-2xl font-bold mb-2 text-neon-green relative z-10"
          />
          <div className="flex items-center gap-1 text-xs text-neon-green/70 relative z-10">
            <span>Claim Earnings</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </Link>

        <Link to="/dashboard/team" className="cyber-glass border border-neon-orange/30 hover:border-neon-orange/80 rounded-xl p-4 sm:p-5 text-white transition-all group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="p-2 bg-neon-orange/20 rounded-lg flex-shrink-0 border border-neon-orange/30">
              <Users size={20} className="text-neon-orange" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-neon-orange uppercase tracking-wide">Team Network</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold mb-2 text-neon-orange relative z-10">{parseInt(DashBoardDetail?.slabPanel?.directMembers)} Direct</p>
          <div className="flex items-center gap-1 text-xs text-neon-orange/70 relative z-10">
            <span>View Team</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </Link>

        <Link to="/dashboard/safe-wallet" className="cyber-glass border border-cyan-400/30 hover:border-cyan-400/80 rounded-xl p-4 sm:p-5 text-white transition-all group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="p-2 bg-cyan-400/20 rounded-lg flex-shrink-0 border border-cyan-400/30">
              <Wallet size={20} className="text-cyan-400" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-cyan-400 uppercase tracking-wide">Safe Wallet</p>
          </div>
          <NumberPopup
            value={"$"+(parseFloat(DashBoardDetail?.dashboardData?.wallet?.safeWalletUsdMicro)/1e6).toFixed(5)}
            label="Safe Wallet"
            className="text-xl sm:text-2xl font-bold mb-2 text-cyan-400 relative z-10"
          />
          <div className="flex items-center gap-1 text-xs text-cyan-300/90 relative z-10">
            <span>Manage Wallet</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="cyber-glass rounded-2xl p-4 sm:p-6 border border-cyan-500/30 hover:border-cyan-500/80 relative overflow-hidden transition-all">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-cyan-300 uppercase tracking-wide">Active Portfolio Status</h2>
              {portFolioDetails?.booster && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-neon-orange to-neon-pink text-white rounded-lg text-xs sm:text-sm font-bold flex-shrink-0 w-fit shadow-lg animate-glow-pulse border border-neon-orange/50">
                  <Zap size={14} className="animate-pulse" />
                  <span className="uppercase">Booster Active</span>
                </div>
              )}

              {/* Portfolio ID Select */}
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                  Portfolio ID
                </label>
                <div className="relative">
                  <select
                    value={selectedPid}
                    onChange={(e) => setSelectedPid(Number(e.target.value))}
                    className="
                      peer w-full sm:w-56 appearance-none pr-10 pl-3 py-2 rounded-lg
                      bg-dark-900/60 text-cyan-200 border border-cyan-500/30
                      focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400
                      transition-all cyber-glass
                    "
                  >
                    {portfolioIds.length === 0 && <option value="">No portfolios</option>}
                    {portfolioIds.map((pid) => (
                      <option key={pid} value={pid}>
                        {pid}
                      </option>
                    ))}
                  </select>

                  {/* Chevron */}
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-70"
                    width="18" height="18" viewBox="0 0 24 24" fill="none"
                  >
                    <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>


              </div>
            </div>

            <div className="space-y-4">
              <div>

                {
                  portfolioIds.length != 0 ? (
                    <>
                      <div className="flex justify-between items-center mb-2 gap-2">
                        <span className="text-xs sm:text-sm font-medium text-cyan-400 uppercase tracking-wider">Portfolio Cap Progress</span>
                        <span className="text-xs sm:text-sm font-bold text-neon-green">{progress}%</span>
                      </div>
                      <div className="h-3 bg-dark-900 rounded-full overflow-hidden border border-cyan-500/30 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-neon-green/20 animate-pulse" />
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-neon-green rounded-full transition-all relative z-10"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-cyan-300/90 mt-1">
                        $0 / {formatUSD(parseFloat(portFolioDetails?.principalUSD) / 1e6)} / {formatUSD((parseFloat(portFolioDetails?.principalUSD) / 1e6) * parseFloat(portFolioDetails?.capPct) / 1e2)}
                        <span className="ml-1 text-neon-green">{portFolioDetails?.booster ? '(250% Cap)' : '(200% Cap)'}</span>
                      </p>
                    </>
                  ) : (
                    <div>
                      <p>
                        No PortFolio Data Available
                      </p>
                    </div>
                  )
                }
              </div>

              {portfolioIds.length !== 0 && (
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="p-3 sm:p-4 cyber-glass rounded-xl border border-cyan-500/30 hover:border-cyan-500/80 transition-all group">
                    <p className="text-xs text-cyan-400 font-medium mb-1 uppercase tracking-wider">Daily Rate</p>
                    <p className="text-lg sm:text-xl font-bold text-cyan-300 group-hover:text-neon-glow transition-all">{(parseFloat(portFolioDetails?.dailyRateWad) / 1e18) * 100}%</p>
                  </div>
                  <div className="p-3 sm:p-4 cyber-glass rounded-xl border border-neon-green/30 hover:border-neon-green/80 transition-all group">
                    <p className="text-xs text-neon-green font-medium mb-1 uppercase tracking-wider">Direct Refs</p>
                    <p className="text-lg sm:text-xl font-bold text-neon-green group-hover:text-neon-glow transition-all">{parseInt(DashBoardDetail?.slabPanel?.directMembers)}</p>
                  </div>
                  <div className="p-3 sm:p-4 cyber-glass rounded-xl border border-neon-orange/30 hover:border-neon-orange/80 transition-all group">
                    <p className="text-xs text-neon-orange font-medium mb-1 uppercase tracking-wider">Slab Tier</p>
                    <p className="text-lg sm:text-xl font-bold text-neon-orange group-hover:text-neon-glow transition-all">
                      {['Coral Reef', 'Shallow Waters', 'Tide Pool', 'Wave Crest', 'Open Sea', 'Deep Current', 'Ocean Floor', 'Abyssal Zone', 'Mariana Trench', 'Pacific Master', 'Ocean Sovereign'][parseInt(DashBoardDetail?.slabPanel?.slabIndex) - 1] || 'None'}
                    </p>
                    <p className="text-xs text-neon-orange/70 mt-0.5">Level {parseInt(DashBoardDetail?.slabPanel?.slabIndex)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="cyber-glass rounded-2xl p-4 sm:p-6 border border-cyan-500/30 hover:border-cyan-500/80 relative overflow-hidden transition-all">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <h2 className="text-base sm:text-lg font-semibold text-cyan-300 mb-4 uppercase tracking-wide">7-Day Earnings Trend</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={last7Day}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,240,255,0.1)" />
                <XAxis dataKey="day" stroke="#22d3ee" fontSize={12} />
                <YAxis stroke="#22d3ee" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(0,240,255,0.3)',
                    borderRadius: '8px',
                    color: '#22d3ee',
                    backdropFilter: 'blur(10px)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="url(#dashGradient)"
                  strokeWidth={3}
                  dot={{ fill: '#00f0ff', r: 5, strokeWidth: 2, stroke: '#39ff14' }}
                />
                <defs>
                  <linearGradient id="dashGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00f0ff" />
                    <stop offset="100%" stopColor="#39ff14" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>

          <LivePriceFeed />
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="cyber-glass border border-neon-green/50 hover:border-neon-green rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden group transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-green/10 to-cyan-500/10 opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-green/70 to-transparent" />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2 bg-neon-green/20 rounded-lg flex-shrink-0 border border-neon-green/40">
                <TrendingUp size={20} className="text-neon-green" />
              </div>
              <div>
                <p className="text-sm text-neon-green font-medium uppercase tracking-wide">Accrued Growth</p>
                <p className="text-xs text-cyan-300/90">Available to claim</p>
              </div>
            </div>
            <NumberPopup
              value={formatUSD(DashBoardDetail?.dashboardData?.summary?.accruedGrowthUsdMicro)}
              label="Accrued Growth"
              className="text-2xl sm:text-3xl font-bold mb-4 text-neon-green relative z-10"
            />
            <Link
              to="/dashboard/earnings"
              className="block w-full py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500 to-neon-green hover:from-cyan-400 hover:to-neon-green/90 rounded-lg text-sm sm:text-base font-bold transition-all text-dark-950 text-center relative z-10 group-hover:shadow-neon-green"
            >
              Claim Now
            </Link>
          </div>

          <div className="cyber-glass rounded-2xl p-4 sm:p-6 border border-cyan-500/30 hover:border-cyan-500/80 relative overflow-hidden transition-all">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <h3 className="text-base font-semibold text-cyan-300 mb-4 uppercase tracking-wide">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to="/dashboard/stake"
                className="flex items-center gap-3 p-3 cyber-glass hover:bg-cyan-500/10 rounded-lg transition-all group border border-transparent hover:border-cyan-500/30"
              >
                <div className="p-2 bg-cyan-500/20 rounded-lg flex-shrink-0 border border-cyan-500/30">
                  <Wallet className="text-cyan-400" size={16} />
                </div>
                <span className="text-sm font-medium text-cyan-300 flex-1">Stake & Invest</span>
                <ArrowUpRight size={16} className="text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <Link
                to="/dashboard/slab"
                className="flex items-center gap-3 p-3 cyber-glass hover:bg-neon-green/10 rounded-lg transition-all group border border-transparent hover:border-neon-green/30"
              >
                <div className="p-2 bg-neon-green/20 rounded-lg flex-shrink-0 border border-neon-green/30">
                  <Award className="text-neon-green" size={16} />
                </div>
                <span className="text-sm font-medium text-neon-green flex-1">Slab Income</span>
                <ArrowUpRight size={16} className="text-neon-green group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <Link
                to="/dashboard/royalty"
                className="flex items-center gap-3 p-3 cyber-glass hover:bg-neon-orange/10 rounded-lg transition-all group border border-transparent hover:border-neon-orange/30"
              >
                <div className="p-2 bg-neon-orange/20 rounded-lg flex-shrink-0 border border-neon-orange/30">
                  <Trophy className="text-neon-orange" size={16} />
                </div>
                <span className="text-sm font-medium text-neon-orange flex-1">Royalty Program</span>
                <ArrowUpRight size={16} className="text-neon-orange group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <Link
                to="/dashboard/rewards"
                className="flex items-center gap-3 p-3 cyber-glass hover:bg-cyan-400/10 rounded-lg transition-all group border border-transparent hover:border-cyan-400/30"
              >
                <div className="p-2 bg-cyan-400/20 rounded-lg flex-shrink-0 border border-cyan-400/30">
                  <Gift className="text-cyan-400" size={16} />
                </div>
                <span className="text-sm font-medium text-cyan-400 flex-1">Rewards</span>
                <ArrowUpRight size={16} className="text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="cyber-glass rounded-2xl p-4 sm:p-6 border border-cyan-500/30 hover:border-cyan-500/80 relative overflow-hidden transition-all">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <h3 className="text-base font-semibold text-cyan-300 mb-4 uppercase tracking-wide">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-cyan-500/5 transition-colors">
                <div className="p-1.5 bg-neon-green/20 rounded-lg flex-shrink-0 border border-neon-green/30">
                  <DollarSign className="text-neon-green" size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-cyan-300">Daily Growth</p>
                  <p className="text-xs text-neon-green">+$28.50 earned</p>
                  <p className="text-xs text-cyan-400/50">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-cyan-500/5 transition-colors">
                <div className="p-1.5 bg-cyan-500/20 rounded-lg flex-shrink-0 border border-cyan-500/30">
                  <Users className="text-cyan-400" size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-cyan-300">New Team Member</p>
                  <p className="text-xs text-cyan-300">Direct referral joined</p>
                  <p className="text-xs text-cyan-400/50">5 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-cyan-500/5 transition-colors">
                <div className="p-1.5 bg-neon-orange/20 rounded-lg flex-shrink-0 border border-neon-orange/30">
                  <Clock className="text-neon-orange" size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-cyan-300">Slab Claimed</p>
                  <p className="text-xs text-neon-orange">Level 3 rewards</p>
                  <p className="text-xs text-cyan-400/50">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/dashboard/analytics" className="cyber-glass rounded-xl p-5 border border-cyan-500/30 hover:border-cyan-500/80 transition-all group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="p-2 bg-cyan-500/20 rounded-lg flex-shrink-0 border border-cyan-500/30">
              <TrendingUp className="text-cyan-400" size={20} />
            </div>
            <p className="text-sm font-medium text-cyan-400 uppercase tracking-wide">Performance</p>
            <ArrowUpRight size={16} className="ml-auto text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-neon-green relative z-10">30% Progress</p>
          <p className="text-xs text-cyan-300/90 mt-1 relative z-10">79 days active</p>
        </Link>

        <div className="cyber-glass rounded-xl p-5 border border-cyan-500/30 hover:border-cyan-500/80 relative overflow-hidden transition-all">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-neon-green/20 rounded-lg flex-shrink-0 border border-neon-green/30">
              <Award className="text-neon-green" size={20} />
            </div>
            <p className="text-sm font-medium text-neon-green uppercase tracking-wide">Qualified Volume</p>
          </div>
          <NumberPopup
            value={formatUSD(parseFloat(DashBoardDetail?.dashboardData?.summary?.qualifiedVolumeUsdMicro)/1e6)}
            label="Qualified Volume"
            className="text-2xl font-bold text-cyan-300"
          />
          <p className="text-xs text-cyan-300/90 mt-1">40:30:30 Calculation</p>
        </div>

        <div className="cyber-glass rounded-xl p-5 border border-cyan-500/30 hover:border-cyan-500/80 relative overflow-hidden transition-all">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-neon-orange/20 rounded-lg flex-shrink-0 border border-neon-orange/30">
              <Trophy className="text-neon-orange" size={20} />
            </div>
            <p className="text-sm font-medium text-neon-orange uppercase tracking-wide">Royalty Status</p>
          </div>
          <p className="text-2xl font-bold text-cyan-300">Level {parseFloat(DashBoardDetail?.dashboardData?.summary?.royaltyLevel)}</p>
          <p className="text-xs text-cyan-300/90 mt-1">{userStatus.royaltyPayoutsReceived} / LifeTime</p>
        </div>
      </div>
    </div>
  );
}
