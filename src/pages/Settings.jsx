import { Settings as SettingsIcon, AlertCircle, Clock, Lock, Copy, ExternalLink } from 'lucide-react';
import { getMockPortfolioDetails } from '../utils/contractData';
import { PortfolioStatus } from '../types/contract';

export default function Settings() {
  const portfolio = getMockPortfolioDetails();
  const isFrozen = portfolio.status === PortfolioStatus.Frozen;
  const freezeEndsAt = parseInt(portfolio.freezeEndsAt);

  const oceanContractAddress = "0x1234567890123456789012345678901234567890";
  const sponsorAddress = portfolio.upline;
  const userAddress = "0x9876543210987654321098765432109876543210";
  const referralLink = `https://oceandefi.com/signup?ref=${userAddress}`;

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-neon-green relative inline-block">
          Settings & Information
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-neon-green/20 blur-xl -z-10" />
        </h1>
        <p className="text-cyan-300/90 mt-1">Platform rules and withdrawal management</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <h2 className="text-lg font-semibold text-cyan-300 mb-4 uppercase tracking-wide">Principal Withdrawal</h2>

            {!isFrozen ? (
              <>
                <div className="cyber-glass border border-cyan-500/30 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-cyan-400 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="text-sm font-medium text-cyan-300 mb-2 uppercase tracking-wide">0% Trust Policy - Withdrawal Anytime</p>
                      <ul className="text-xs text-cyan-400/80 space-y-1">
                        <li>✓ Request withdrawal anytime (complete freedom)</li>
                        <li>⏱ 72-hour freeze period (no income during freeze)</li>
                        <li>✓ Cancel within 72 hours to resume earning</li>
                        <li>⚠ Only lose income during freeze period if cancelled</li>
                        <li>💰 After 72 hours: 80% refund (20% exit fee)</li>
                        <li>📉 Closed portfolio removes business from uplines</li>
                      </ul>
                      <p className="text-xs text-neon-green italic mt-3 font-medium">"Withdraw anytime with 20% fee after 72h freeze — or cancel to keep earning."</p>
                    </div>
                  </div>
                </div>

                <button className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-bold hover:shadow-lg transition-all hover:scale-[1.02] uppercase tracking-wide border border-red-500/30">
                  Request Principal Withdrawal
                </button>
              </>
            ) : (
              <>
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-6 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="text-rose-600" size={24} />
                    <div>
                      <p className="font-semibold text-rose-900">Withdrawal Freeze Active</p>
                      <p className="text-sm text-rose-700">
                        Ends: {new Date(freezeEndsAt * 1000).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-rose-800 mb-4">
                    <p>⏱ Time remaining: {Math.max(0, Math.floor((freezeEndsAt - Date.now() / 1000) / 3600))} hours</p>
                    <p>⚠ No income accruing during freeze</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-emerald-800 font-medium mb-1">💡 Cancel Benefit:</p>
                    <p className="text-xs text-emerald-700">If you cancel now, your portfolio will resume earning from the cancellation time. You'll only lose the income that would have been earned during this freeze period.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
                    Cancel & Resume
                  </button>
                  <button
                    disabled={Date.now() / 1000 < freezeEndsAt}
                    className="py-3 bg-rose-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Complete (80% Refund)
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="cyber-glass rounded-2xl p-6 border border-cyan-500/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <h2 className="text-lg font-semibold text-cyan-300 mb-4 uppercase tracking-wide">Contract Rules Reference</h2>
            <div className="space-y-4">
              {[
                { title: 'Rule 1: Minimum Stake', desc: '$50 minimum for ID activation' },
                { title: 'Rule 2: Slab Claim Requirement', desc: 'Requires 1 new $50 direct before slab claim' },
                { title: 'Rule 3: Qualified Volume', desc: '40:30:30 calculation for 3 legs, 100% for 4+ legs' },
                { title: 'Rule 4: Withdrawal Fee', desc: '5% fee on external wallet claims' },
                { title: 'Rule 5: Safe Wallet', desc: 'Fee-free internal balance for passive income' },
                { title: 'Rule 6: Royalty Renewal', desc: '10% growth required every 2 months, LifeTime' },
                { title: 'Rule 7: Principal Exit', desc: '72-hour freeze with 20% exit fee' },
                { title: 'Rule 8: Global Cap', desc: '4x lifetime earnings limit based on total staked' },
                { title: 'Rule 9: Cooldown', desc: '24-hour cooldown for slab claims' },
                { title: 'Rule 10: Minimum Claim', desc: '$10 minimum for growth claims' },
                { title: 'Rule 11: Top-up', desc: 'Re-stake must be equal or higher than last stake' },
              ].map((rule, idx) => (
                <div key={idx} className="p-4 cyber-glass rounded-lg hover:bg-cyan-500/5 transition-all border border-cyan-500/20 hover:border-cyan-500/30 hover:shadow-neon-cyan">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-neon-green/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-cyan-300">{idx + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-cyan-300">{rule.title}</p>
                      <p className="text-xs text-cyan-300/90 mt-1">{rule.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="cyber-glass rounded-xl p-6 border border-cyan-500/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <div className="flex items-center gap-3 mb-4">
              <SettingsIcon className="text-cyan-400" size={20} />
              <h3 className="font-semibold text-cyan-300 uppercase tracking-wide">Platform Info</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-cyan-300/90 mb-1 uppercase tracking-wide text-xs">Ocean Smart Contract</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-xs text-cyan-300 break-all flex-1">{oceanContractAddress.slice(0, 10)}...{oceanContractAddress.slice(-8)}</p>
                  <button
                    onClick={() => copyToClipboard(oceanContractAddress, 'Contract address')}
                    className="p-1.5 hover:bg-cyan-500/10 rounded transition-colors"
                    title="Copy contract address"
                  >
                    <Copy size={14} className="text-cyan-400" />
                  </button>
                  <a
                    href={`https://ramascan.com/address/${oceanContractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-cyan-500/10 rounded transition-colors"
                    title="View on explorer"
                  >
                    <ExternalLink size={14} className="text-cyan-400" />
                  </a>
                </div>
              </div>
              <div>
                <p className="text-cyan-300/90 mb-1 uppercase tracking-wide text-xs">Sponsor Address</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-xs text-cyan-300 break-all flex-1">{sponsorAddress.slice(0, 10)}...{sponsorAddress.slice(-8)}</p>
                  <button
                    onClick={() => copyToClipboard(sponsorAddress, 'Sponsor address')}
                    className="p-1.5 hover:bg-cyan-500/10 rounded transition-colors"
                    title="Copy sponsor address"
                  >
                    <Copy size={14} className="text-cyan-400" />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-cyan-300/90 mb-1 uppercase tracking-wide text-xs">Your Referral Link</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-xs text-cyan-300 break-all flex-1">{referralLink.slice(0, 35)}...</p>
                  <button
                    onClick={() => copyToClipboard(referralLink, 'Referral link')}
                    className="p-1.5 hover:bg-cyan-500/10 rounded transition-colors"
                    title="Copy referral link"
                  >
                    <Copy size={14} className="text-cyan-400" />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-cyan-300/90 mb-1 uppercase tracking-wide text-xs">Chain ID</p>
                <p className="font-medium text-cyan-300">1370</p>
              </div>
              <div>
                <p className="text-cyan-300/90 mb-1 uppercase tracking-wide text-xs">Blockchain Name</p>
                <p className="font-medium text-cyan-300">Ramestta Mainnet</p>
              </div>
              <div>
                <p className="text-cyan-300/90 mb-1 uppercase tracking-wide text-xs">Currency Symbol</p>
                <p className="font-medium text-cyan-300">RAMA</p>
              </div>
              <div>
                <p className="text-cyan-300/90 mb-1 uppercase tracking-wide text-xs">RPC Endpoint 1</p>
                <a href="https://blockchain.ramestta.com" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-cyan-400 hover:text-neon-green transition-colors">https://blockchain.ramestta.com</a>
              </div>
              <div>
                <p className="text-cyan-300/90 mb-1 uppercase tracking-wide text-xs">RPC Endpoint 2</p>
                <a href="https://blockchain2.ramestta.com" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-cyan-400 hover:text-neon-green transition-colors">https://blockchain2.ramestta.com</a>
              </div>
              <div>
                <p className="text-cyan-300/90 mb-1 uppercase tracking-wide text-xs">Block Explorer</p>
                <a href="https://ramascan.com" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-cyan-400 hover:text-neon-green transition-colors">https://ramascan.com</a>
              </div>
              <div>
                <p className="text-cyan-300/90 mb-1 uppercase tracking-wide text-xs">Bridge</p>
                <a href="https://ramabridge.com" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-cyan-400 hover:text-neon-green transition-colors">https://ramabridge.com</a>
              </div>
              <div>
                <p className="text-cyan-300/90 mb-1 uppercase tracking-wide text-xs">Swap DApp</p>
                <a href="https://ramaswap.com" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-cyan-400 hover:text-neon-green transition-colors">https://ramaswap.com</a>
              </div>
              <div>
                <p className="text-cyan-300/90 mb-1 uppercase tracking-wide text-xs">Price Feed</p>
                <p className="font-medium text-neon-green flex items-center gap-2">
                  <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse shadow-neon-green"></span>
                  Active
                </p>
              </div>
            </div>
          </div>

          <div className="cyber-glass border border-cyan-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Lock className="text-cyan-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-medium text-cyan-300 mb-1 uppercase tracking-wide">Security</p>
                <p className="text-xs text-cyan-300/90">
                  All contracts are audited and verified. Your funds are secured by blockchain technology.
                </p>
              </div>
            </div>
          </div>

          <div className="cyber-glass border border-neon-green/30 rounded-xl p-4">
            <p className="text-sm font-medium text-neon-green mb-2 uppercase tracking-wide">Investment Tiers</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-cyan-300/90">Tier 1 ($50+)</span>
                <span className="font-bold text-cyan-300">0.33%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-cyan-300/90">Tier 2 ($5,010+)</span>
                <span className="font-bold text-cyan-300">0.40%</span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-cyan-500/30">
                <span className="text-neon-green/70">Booster T1</span>
                <span className="font-bold text-neon-green">0.66%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neon-green/70">Booster T2</span>
                <span className="font-bold text-neon-green">0.80%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
