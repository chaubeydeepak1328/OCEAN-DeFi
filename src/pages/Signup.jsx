import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Wallet, User, Mail, Hash, ArrowRight, Check, AlertCircle, Wallet2 } from 'lucide-react';
import { useAppKitAccount } from '@reown/appkit/react';
import { useStore } from '../../store/useUserInfoStore';
import Swal from 'sweetalert2';
import { useTransaction } from "../../config/register";
import { useWaitForTransactionReceipt } from "wagmi";
// import { mockConnectWallet, registerUser } from '../utils/walletAuth';

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const walletFromState = location.state?.walletAddress || '';

  const [UserValue, setUserValue] = useState();
  const { address, isConnected } = useAppKitAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [trxData, setTrxData] = useState();
  const [trxHash, setTrxHash] = useState();
  const RegisterUser = useStore((s) => s.RegisterUser);
  const isUserRegisterd = useStore((s) => s.isUserRegisterd); // <-- add




  // =====================================================================
  //  For making transaction
  // =====================================================================
  const { handleSendTx, hash } = useTransaction(trxData !== null && trxData);
  useEffect(() => {
    if (trxData) {
      try {
        handleSendTx(trxData);
      } catch (error) {
        alert("somthing went Wrong");
      }
    }
  }, [trxData]);

  useEffect(() => {
    if (hash) {
      setTrxHash(hash)
    }
  }, [hash]);





  const { data: receipt, isLoading: progress, isSuccess, isError } =
    useWaitForTransactionReceipt({
      hash,
      confirmations: 1,
    });


  useEffect(() => {
    if (isSuccess && receipt?.status === "success") {
      const txUrl = `https://ramascan.com/tx/${receipt?.transactionHash}`;
      const addrUrl = `https://ramascan.com/address/${address}`;

      localStorage.setItem("userAddress", address)

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        html: `
        <div style="text-align:left">
          <p style="margin:0 0 8px 0">Your registration has been confirmed on-chain.</p>
          <p style="margin:0 0 8px 0">Redirecting to dashboard...</p>
          <p style="margin:0 0 6px 0">
            <a href="${txUrl}" target="_blank" rel="noopener">View Transaction</a>
          </p>
          <p style="margin:0">
            <a href="${addrUrl}" target="_blank" rel="noopener">View Address on Ramascan</a>
          </p>
        </div>
      `,
        showConfirmButton: false,
        timer: 5000,         // ✅ Auto-close after 2.5 sec
        willClose: () => {
          navigate('/dashboard');   // ✅ Auto-redirect after successful registration
        }
      });
    }
    else if (isError || receipt?.status === "reverted") {
      Swal.fire({
        icon: "error",
        title: "Transaction Failed",
        text: "Your transaction failed or was reverted."
      });
    }
  }, [isSuccess, isError, receipt, address]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {

      // 1) Check if address is already registered
      const already = await isUserRegisterd(address);
      if (already) {
        navigate("/dashboard")
        setIsSubmitting(false);
        return; // stop here, do not build tx
      }
      const response = await RegisterUser(address, UserValue);

      if (response) {
        setTrxData(response); // ✅ this triggers the useEffect
      } else {
        Swal.fire({
          icon: "error",
          title: "Transaction Error",
          text: "Unable to build registration transaction." + trxHash,
          confirmButtonText: "OK",
        });
      }

      setIsSubmitting(false)
    } catch (error) {
      console.error('Registration failed:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };



  const CheckUserStatus = async () => {
    if (!isConnected && !address) {
      navigate("/login")
    }
  }
  useEffect(() => {
    CheckUserStatus()
  }, [isConnected,address])



  return (
    <div className="min-h-screen bg-dark-950 cyber-grid-bg relative flex items-center justify-center p-4 overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-neon-green/10 pointer-events-none" />
      <div className="fixed inset-0 scan-lines pointer-events-none opacity-30" />
      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-neon-green rounded-xl flex items-center justify-center shadow-neon-cyan animate-glow-pulse relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-neon-green rounded-xl blur-xl opacity-60" />
              <Wallet className="text-dark-950 relative z-10" size={32} />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-neon-green bg-clip-text text-transparent mb-2 text-neon-glow">
            OCEAN DeFi
          </h1>
          <p className="text-cyan-300/90 uppercase tracking-widest text-sm">Join the Validator-Backed Ecosystem</p>
        </div>

        <div className="cyber-glass rounded-2xl shadow-neon-cyan border border-cyan-500/30 p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/70 to-transparent" />
          <h2 className="text-2xl font-bold text-cyan-300 mb-6 uppercase tracking-wide">Create Account</h2>

          {error && (
            <div className="mb-4 p-4 cyber-glass border border-red-500/50 rounded-xl flex items-start gap-3 shadow-lg">
              <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5 animate-pulse" size={20} />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="p-4 cyber-glass border border-neon-green/50 rounded-xl flex items-center gap-3 shadow-neon-green">
              <div className="w-8 h-8 bg-neon-green rounded-full flex items-center justify-center flex-shrink-0 shadow-neon-green animate-pulse">
                <Check className="text-dark-950" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-neon-green font-medium mb-1 uppercase tracking-wide">Wallet Connected</p>
                <p className="text-sm text-cyan-300 font-mono truncate">{address?.slice(0, 8) + "..." + address?.slice(-7)}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2 uppercase tracking-wide">
                Sponser Address/Id
              </label>
              <div className="relative">
                <Wallet2 className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/50" size={20} />
                <input
                  type="text"
                  name="userId"
                  value={UserValue}
                  onChange={(e) => setUserValue(e.target.value)}
                  placeholder="Enter the Sponser Id/Address"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-dark-900/50 border border-cyan-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-cyan-300 placeholder-cyan-400/30 transition-all"
                />
              </div>
              <p className="text-xs text-cyan-400/50 mt-1">This will be your unique identifier</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-neon-green text-dark-950 rounded-xl font-bold hover:shadow-neon-cyan transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] uppercase tracking-wide relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
              <ArrowRight size={20} className="relative z-10" />
            </button>
          </form>

          <p className="text-center text-sm text-cyan-300/90 mt-6">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-neon-green hover:text-cyan-400 font-bold transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-cyan-400/50 mt-6 uppercase tracking-widest">
          By creating an account, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
