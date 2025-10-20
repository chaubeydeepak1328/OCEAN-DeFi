import { create } from "zustand";
import Web3, { errors } from "web3";
import Swal from "sweetalert2";
import UserRegistryABI from './Contract_ABI/UserRegistry.json';
import PortFolioManagerABI from './Contract_ABI/PortFolioManager.json'
import OceanQueryUpgradeableABI from './Contract_ABI/OceanQueryUpgradeableABI.json'
import OceanViewUpgradeableABI from './Contract_ABI/OCEANVIEWUPGRADABLEABI.json'
import SlabManagerABI from './Contract_ABI/SlabManager.json'
import { dayShortFromUnix } from "../src/utils/helper";

const Contract = {
  UserRegistry: "0x71Ce2E2Af312e856b17d901aCDbE4ea39831C961",
  CoreConfig: "0x88feEF32db83e79BbD69c222851e45cD681D6a62",
  RoiDistribution: "0xc7CC6f2C738646472E8bfF6d7BDFB2A82e70bafd",
  PortFolioManager: "0x09759B02B87927DB3BABc85aE7AE0f1F70C9a604",
  RoyaltyManager: "0xB953ccFe1d34BB413A0A7000259708E1ef3ca8d3",
  SlabManager: "0x631a0381473f9bC9B43Df75D67fd36E6bd3E3685",
  IncomeDistributor: "0x7d9666a5230E64B24d940F89d7eb46F1Bc5C519F",
  FreezePolicy: "0xDd09016976B8B5F550984c4B4E1FEAe4B30536e5",
  RewardVault: "0x6D96990EBF016d51e9399fE48C770c3336437Dc8",
  AdminControl: "0xcD8eB92E927Aa9C0DC5e58d8383D4aE211F73f96",
  MainWallet: "0x61d66989f2fA03818Fcf2f4dCb586C17D4fa9c47",
  SafeWallet: "0x58514DE6CCd50CF33d2bD90547847E212Ae93f11",
  OceanViewUpgradeable: "0x449E6d26f1a65E991e129f5320d65a62C896aA8a",
  OceanQueryUpgradeable: "0x9F992D83Cbfc6BAb84749EBE9Bd90Bc8b51851b9",
};

const INFURA_URL = "https://blockchain.ramestta.com";
const web3 = new Web3(INFURA_URL);


const readLocalJSON = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};



const slabsName = ["None", "Coral Reef", "Shallow Waters", "Tide Pool", "Wave Crest", 'Open Sea', "Deep Current", "Ocean Floor", "Abyssal Zone", "Mariana Trench", "Pacific Master", "Ocean Sovereign"]




export const useStore = create((set, get) => ({

  UserRegistryAddress: Contract["UserRegistry"],
  CoreConfigAddress: Contract["CoreConfig"],
  RoiDistributionAddress: Contract["RoiDistribution"],
  PortFolioManagerAddress: Contract["PortFolioManager"],
  RoyaltyManagerAddress: Contract["RoyaltyManager"],
  SlabManagerAddress: Contract["SlabManager"],
  IncomeDistributorAddress: Contract["IncomeDistributor"],
  FreezePolicyAddress: Contract["FreezePolicy"],
  RewardVaultAddress: Contract["RewardVault"],
  AdminControlAddress: Contract["AdminControl"],
  MainWalletAddress: Contract["MainWallet"],
  SafeWalletAddress: Contract["SafeWallet"],

  // Session
  userAddress: readLocalJSON('userAddress'),


  userIdByAdd: async (userAddress) => {
    try {
      if (!userAddress) {
        throw new Error("Invalid userAddress");
      }

      const contract = new web3.eth.Contract(UserRegistryABI, Contract["UserRegistry"]);
      const userId = await contract.methods.user(userAddress).call();

      return userId;
    } catch (error) {
      console.log(error);
    }
  },

  RegisterUser: async (userAddress, value) => {
    console.log('RegisterUser args:', userAddress, value);
    try {
      if (!userAddress || typeof userAddress !== 'string' || !userAddress.startsWith('0x')) {
        throw new Error('Invalid user address');
      }

      const contract = new web3.eth.Contract(UserRegistryABI, Contract['UserRegistry']);

      // --- Resolve sponsor: address or numeric ID
      let sponsorAddress;
      if (typeof value === 'string' && value.startsWith('0x')) {
        sponsorAddress = value;
      } else {
        const userId = typeof value === 'number' ? value : Number(value);
        if (!Number.isFinite(userId) || userId <= 0) throw new Error('Invalid sponsor id');
        sponsorAddress = await contract.methods.idToAddress(userId).call();
      }

      if (!sponsorAddress || !sponsorAddress.startsWith('0x')) {
        throw new Error('Resolved sponsor address is invalid');
      }
      const ZERO = '0x0000000000000000000000000000000000000000';
      if (sponsorAddress.toLowerCase() === ZERO.toLowerCase()) {
        throw new Error('Sponsor not found (zero address)');
      }

      const data = contract.methods.registerUser(sponsorAddress).encodeABI();

      // --- Gas price
      const gasPrice = await web3.eth.getGasPrice(); // string in wei

      // --- IMPORTANT: do NOT send any value; fn is nonpayable
      let gasLimit;
      try {
        gasLimit = await web3.eth.estimateGas({
          from: userAddress,
          to: Contract['UserRegistry'],
          data,                  // no "value" here
        });
      } catch (err) {
        console.error('Gas estimation failed:', err);
        Swal.fire({ icon: 'error', title: 'Gas estimation failed', text: err?.message || 'Check contract & inputs.' });
        throw err;
      }

      const toHex = web3.utils.toHex;
      const tx = {
        from: userAddress,
        to: Contract['UserRegistry'],
        data,
        // value omitted (or explicitly zero)
        // value: '0x0',
        gas: toHex(gasLimit),
        gasPrice: toHex(gasPrice),
        // optional: include chainId if your wallet needs it for signing
        // chainId: <Rama chain id here>
      };

      // Return tx for the wallet to sign/send (WalletConnect, MetaMask, etc.)
      return tx;
    } catch (error) {
      console.error('RegisterUser error:', error);
      Swal.fire({ icon: 'error', title: 'Registration error', text: error?.message || 'Unknown error' });
      throw error;
    }
  },

  checkUserById: async (userId) => {
    try {
      if (!userId) {
        throw new Error("Invalid userId");
      }

      const contract = new web3.eth.Contract(UserRegistryABI, Contract["UserRegistry"]);

      const userAddress = await contract.methods.idToAddress(userId).call();

      return userAddress;
    } catch (error) {
      console.error("Error:", error);
      alert(`Error checking user: ${error.message}`);
      throw error;
    }
  },

  getUserDetails: async (Value) => {
    try {
      const contract = new web3.eth.Contract(UserRegistryABI, Contract['UserRegistry']);

      console.log(Value)

      // --- Resolve sponsor: address or numeric ID
      let UserAddress;
      if (typeof Value === 'string' && Value.startsWith('0x')) {
        UserAddress = Value;
      } else {
        const userId = typeof Value === 'number' ? Value : Number(Value);
        if (!Number.isFinite(userId) || userId <= 0) throw new Error('Invalid user id');
        UserAddress = await contract.methods.idToAddress(userId).call();
      }

      if (!UserAddress || !UserAddress.startsWith('0x')) {
        throw new Error('Resolved address is invalid');
      }
      const ZERO = '0x0000000000000000000000000000000000000000';
      if (UserAddress.toLowerCase() === ZERO.toLowerCase()) {
        throw new Error('User Address not found (zero address)');
      }


      console.log(UserAddress);
      const response = await contract.methods.getUser(UserAddress).call()

      localStorage.setItem("userAddress", UserAddress)

      return { response, UserAddress }
    } catch (error) {
      console.error('User id/Address error:', error);
      Swal.fire({ icon: 'error', title: 'id/Address  error', text: error?.message || 'Unknown error' });
      throw error;
    }
  },


  isUserRegisterd: async (userAddress) => {
    try {
      if (!userAddress) {
        throw new Error("Invalid userId");
      }
      const contract = new web3.eth.Contract(UserRegistryABI, Contract["UserRegistry"]);

      const isUserExist = await contract.methods.isRegistered(userAddress).call();

      console.log(isUserExist)
      return isUserExist;
    } catch (error) {
      console.error("Error:", error);
      alert(`Error checking user: ${error.message}`);
      throw error;
    }
  },

  // =====================================================================
  // Dashboard 
  // =====================================================================

  getTOtalPortFolio: async (userAddress) => {
    try {
      if (!userAddress) {
        return;
      }


      const contract = new web3.eth.Contract(PortFolioManagerABI, Contract["PortFolioManager"]);
      const contract1 = new web3.eth.Contract(OceanQueryUpgradeableABI, Contract["OceanQueryUpgradeable"]);


      const ArrPortfolio = await contract.methods.portfoliosOf(userAddress).call();

      console.log("=====>",ArrPortfolio)

      let ProtFolioDetail;
      if (ArrPortfolio.length > 0) {
        ProtFolioDetail = await contract1.methods.getPortfolioDetails(ArrPortfolio[0]).call();
      }


      return { ArrPortfolio, ProtFolioDetail }

    } catch (error) {
      console.error('Portfolio error:', error);
      Swal.fire({ icon: 'error', title: 'Portfolio error', text: error?.message || 'Unknown error' });
      throw error;
    }
  },

  getPortFoliById: async (portId) => {
    console.log("port id is",portId)
    try {
      if (!portId) {
        return;
      }
      const contract = new web3.eth.Contract(OceanQueryUpgradeableABI, Contract["OceanQueryUpgradeable"]);
      const ArrPortfolio = await contract.methods.getPortfolioDetails(portId).call();

      return ArrPortfolio
    } catch (error) {
      console.error('Portfolio error:', error);
      Swal.fire({ icon: 'error', title: 'Portfolio error', text: error?.message || 'Unknown error' });
      throw error;
    }
  },

  getDashboardDetails: async (userAddress) => {
    try {
      if (!userAddress) throw new Error("Missing user address");

      const oceanQuery = new web3.eth.Contract(
        OceanQueryUpgradeableABI,
        Contract["OceanQueryUpgradeable"]
      );
      const oceanView = new web3.eth.Contract(
        OceanViewUpgradeableABI,
        Contract["OceanViewUpgradeable"]
      );

      

      // Fire all calls at once
      const [accuredGrowth, safeWalletBalanceRaw, slabPanelRaw] = await Promise.all([

        oceanQuery.methods.getAccruedGrowth(userAddress).call({ from: userAddress }),
        oceanQuery.methods.getSafeWalletBalance(userAddress).call({ from: userAddress }),
        oceanView.methods.getSlabPanel(userAddress).call({ from: userAddress }),
      ]);

      // Normalize as needed (avoid Number for >53-bit values)
      const toNum = (v) => (typeof v === 'bigint' ? Number(v) : Number(String(v)));
      const toStr = (v) => (v == null ? "" : String(v));

      return {
        // directChildrenCount: toNum(referralCountRaw),
        safeWalletRAMAWei: toStr(safeWalletBalanceRaw), // keep as string/BigInt; format at render
        slabPanel: slabPanelRaw,                // map fields if needed
        accuredGrowth
      };

    } catch (error) {
      console.log(error)
    }
  },

  get7DayEarningTrend: async (userAddress) => {
    try {
      if (!userAddress) return;

      const oceanView = new web3.eth.Contract(
        OceanViewUpgradeableABI,
        Contract.OceanViewUpgradeable
      );

      // UNIX seconds
      const nowSec = Math.floor(Date.now() / 1000)

      // If your solidity fn signature is: getLast7DaysEarningsUSD(address user, uint256 startTs, uint256 endTs)
      const Last7DaysEarning = await oceanView.methods.getLast7DaysEarningsUSD(userAddress, nowSec).call();

      const formatedRecord = [0, 1, 2, 3, 4, 5, 6].map((val, index) => (
        { day: dayShortFromUnix(Last7DaysEarning?.dayIds[index]), 'amount': parseInt(Last7DaysEarning?.usdAmounts[index]) }
      ))

      return formatedRecord;





    } catch (error) {
      console.log("get7DayEarningTrend error:", error);
    }
  },

  // =====================================================================
  // Slab Income 
  // =====================================================================

  getSlabLevel: async (userAddress) => {
    try {
      if (!userAddress) throw new Error("Missing user address");

      const oceanQuery = new web3.eth.Contract(
        OceanQueryUpgradeableABI,
        Contract["OceanQueryUpgradeable"]
      );

      const slabLevel = await oceanQuery.methods.getCurrentSlabLevel(userAddress).call();
      const OverrideEarnings = await oceanQuery.methods.getSameSlabOverrideEarnings(userAddress).call();
      const getSameSlabPartner = await oceanQuery.methods.getSameSlabPartners(userAddress).call();

      return {
        slabLevel,
        OverrideEarnings,
        getSameSlabPartner
      }

    } catch (err) {
      console.log(err)
    }
  },


  // =====================================================================
  // One-Time Rewards 
  // =====================================================================

  oneTimeRewardClaimed: async (userAddress) => {
    try {
      if (!userAddress) throw new Error("Missing user address");

      const oceanQuery = new web3.eth.Contract(
        OceanQueryUpgradeableABI,
        Contract["OceanQueryUpgradeable"]
      );
      const slabManag = new web3.eth.Contract(
        SlabManagerABI,
        Contract["SlabManager"]
      );

      const rewardClaimed = await oceanQuery.methods.getTotalRewardsClaimed(userAddress).call();
      const slabIncome = await oceanQuery.methods.getSlabIncome(userAddress).call();
      const slabIncomeAvail = await oceanQuery.methods.getSlabIncomeAvailable(userAddress).call();


      const slapIndex = await slabManag.methods.getSlabIndex(userAddress).call();



      return {
        rewardClaimed,
        slabIncome,
        slabIncomeAvail,

        slapIndex,
        slabName: slabsName[slapIndex]
      }

    } catch (err) {
      console.log(err)
    }
  },


  // =====================================================================
  // Setting And Rules
  // =====================================================================

  regPortFoliAmt: async () => {
    try {

      const contract = new web3.eth.Contract(PortFolioManagerABI, Contract["PortFolioManager"]);

      const portFolioAmtUsd = 10
      const protFolioMicroUsd = portFolioAmtUsd * 1e6
      console.log(protFolioMicroUsd)
      const AmtInRamaWei = await contract.methods.getPackageValueInRAMA(protFolioMicroUsd).call();
      const ramaAmt = parseInt(AmtInRamaWei) / 1e18

      console.log(AmtInRamaWei)

      return {
        portFolioAmtUsd,
        ramaAmt
      };

    } catch (error) {
      console.log("regPortFoliAmt error:", error);
    }
  },

  CreateportFolio: async (userAddress, sponsorInput) => {
    console.log('CreateportFolio args:', userAddress, sponsorInput);
    try {
      if (!userAddress || typeof userAddress !== 'string' || !userAddress.startsWith('0x')) {
        throw new Error('Invalid user address');
      }

      // Always use PROXY addresses here
      const regContract = new web3.eth.Contract(UserRegistryABI, Contract.UserRegistry);
      const pm = new web3.eth.Contract(PortFolioManagerABI, Contract.PortFolioManager);

      // --- Resolve sponsor (address or numeric ID)
      let sponsorAddress;
      if (typeof sponsorInput === 'string' && sponsorInput.startsWith('0x')) {
        sponsorAddress = sponsorInput;
      } else {
        const userId = typeof sponsorInput === 'number' ? sponsorInput : Number(sponsorInput);
        if (!Number.isFinite(userId) || userId <= 0) throw new Error('Invalid sponsor id');
        sponsorAddress = await regContract.methods.idToAddress(userId).call();
      }

      if (!sponsorAddress || !sponsorAddress.startsWith('0x')) {
        throw new Error('Resolved sponsor address is invalid');
      }
      if (/^0x0{40}$/i.test(sponsorAddress)) {
        throw new Error('Sponsor not found (zero address)');
      }

      // --- 1) Quote RAMA for $10 (micro-USD, 1e6)
      const usdMicro = 10 * 1e6; // $10 -> 10,000,000 micro-USD
      const ramaWeiQuoteStr = await pm.methods
        .getPackageValueInRAMA(usdMicro.toString())
        .call();

      const ramaWei = parseInt(ramaWeiQuoteStr);
      if (ramaWei <= 0) throw new Error('Invalid RAMA quote (0)');

      // Optional: +0.5% tolerance for price movement (keep in sync with contract checks)
      const tol = ramaWei / 200; // 0.5%
      const valueToSend = (ramaWei + tol).toString();

      console.log(sponsorAddress, valueToSend.toString(), ramaWei)

      // --- 2) Build tx: createPortfolio(usdAmountMicro, referrer) PAYABLE
      const data = pm.methods
        .createPortfolio(sponsorAddress, valueToSend)
        .encodeABI();

      // --- 3) Gas price & gas limit (estimate against PortfolioManager, include "value")
      const gasPrice = await web3.eth.getGasPrice();

      let gasLimit;
      try {
        gasLimit = await web3.eth.estimateGas({
          from: userAddress,
          to: Contract.PortFolioManager,
          data,
          value: valueToSend,
        });
      } catch (err) {
        console.error('Gas estimation failed:', err);
        Swal.fire({
          icon: 'error',
          title: 'Gas estimation failed',
          text: err?.message || 'Check contract & inputs.',
        });
        throw err;
      }

      const toHex = web3.utils.toHex;

      const tx = {
        from: userAddress,
        to: Contract.PortFolioManager,   // ✅ correct target (PM)
        data,
        value: valueToSend,       // ✅ must send RAMA wei
        gas: toHex(gasLimit),
        gasPrice: toHex(gasPrice),
        // chainId: <your chain id> // optional, wallet usually fills it
      };

      return tx; // your wallet (AppKit/WalletConnect) will sign & send this
    } catch (error) {
      console.error('CreateportFolio error:', error);
      Swal.fire({ icon: 'error', title: 'Portfolio creation error', text: error?.message || 'Unknown error' });
      throw error;
    }
  },



  // =====================================================================
  // PortFolio Withdrawal
  // =====================================================================


  withdrawPortFolio: async (userAddress, pid) => {
    try {
      if (!userAddress && !pid) {
        throw new Error('Invalid user address and PId');
      }

      const contract = new web3.eth.Contract(PortFolioManagerABI, Contract["PortFolioManager"]);


      const data = contract.methods.applyExit(pid).encodeABI();

      // --- Gas price
      const gasPrice = await web3.eth.getGasPrice(); // string in wei

      // --- IMPORTANT: do NOT send any value; fn is nonpayable
      let gasLimit;
      try {
        gasLimit = await web3.eth.estimateGas({
          from: userAddress,
          to: Contract['PortFolioManager'],
          data,                  // no "value" here
        });
      } catch (err) {
        console.error('Gas estimation failed:', err);
        Swal.fire({ icon: 'error', title: 'Gas estimation failed', text: err?.message || 'Check contract & inputs.' });
        throw err;
      }
      const toHex = web3.utils.toHex;
      const tx = {
        from: userAddress,
        to: Contract['PortFolioManager'],
        data,
        gas: toHex(gasLimit),
        gasPrice: toHex(gasPrice),
      };
      return tx;
    } catch (error) {
      console.error('withdraw error:', error);
      Swal.fire({ icon: 'error', title: 'Registration error', text: error?.message || 'Unknown error' });
      throw error;
    }
  },

  cancelExitPortFolio: async (userAddress, pid) => {
    try {
      if (!userAddress && !pid) {
        throw new Error('Invalid user address and PId');
      }

      const contract = new web3.eth.Contract(PortFolioManagerABI, Contract["PortFolioManager"]);


      const data = contract.methods.cancelExit(pid).encodeABI();

      // --- Gas price
      const gasPrice = await web3.eth.getGasPrice(); // string in wei

      // --- IMPORTANT: do NOT send any value; fn is nonpayable
      let gasLimit;
      try {
        gasLimit = await web3.eth.estimateGas({
          from: userAddress,
          to: Contract['PortFolioManager'],
          data,                  // no "value" here
        });
      } catch (err) {
        console.error('Gas estimation failed:', err);
        Swal.fire({ icon: 'error', title: 'Gas estimation failed', text: err?.message || 'Check contract & inputs.' });
        throw err;
      }
      const toHex = web3.utils.toHex;
      const tx = {
        from: userAddress,
        to: Contract['PortFolioManager'],
        data,
        gas: toHex(gasLimit),
        gasPrice: toHex(gasPrice),
      };
      return tx;
    } catch (error) {
      console.error('withdraw error:', error);
      Swal.fire({ icon: 'error', title: 'Registration error', text: error?.message || 'Unknown error' });
      throw error;
    }
  },



  // =====================================================================
  // Stake And Invest
  // =====================================================================


  GetchStakeInvest: async (userAddress) => {
    try {
      if (!userAddress) {
        return
      }
      const oceanQuery = new web3.eth.Contract(
        OceanQueryUpgradeableABI,
        Contract["OceanQueryUpgradeable"]
      );

      const safeWalletBalanceRaw = await oceanQuery.methods.getSafeWalletBalance(userAddress).call({ from: userAddress })
      const SafeWalletFund = parseFloat(safeWalletBalanceRaw);

      return SafeWalletFund

    } catch (error) {
      console.error('InvestInPortFolio error:', error);
      Swal.fire({ icon: 'error', title: 'GetchStakeInvest error', text: error?.message || 'Unknown error' });
      throw error;
    }
  },


  usdToRama: async (amt) => {
    try {
      if (!amt) {
        return;
      }
      const contract = new web3.eth.Contract(PortFolioManagerABI, Contract["PortFolioManager"]);
      const usdMicro = amt * 1e6;
      const ramaWeiQuoteStr = await contract.methods.getPackageValueInRAMA(usdMicro.toString()).call();
      const formattedAmt = parseFloat(ramaWeiQuoteStr) / 1e18

      return formattedAmt

    } catch (error) {
      console.error('InvestInPortFolio error:', error);
      Swal.fire({ icon: 'error', title: 'Portfolio creation error', text: error?.message || 'Unknown error' });
      throw error;
    }
  },

  RamaTOUsd: async (amt) => {
    try {
      // Ensure we have a valid amount to convert
      if (!amt) {
        return 0; // Return 0 or undefined based on your desired behavior for empty input
      }

      // 1. Setup contract instance
      const contract = new web3.eth.Contract(PortFolioManagerABI, Contract["PortFolioManager"]);

      // 2. Define the reference amount (1 USD in micro-units)
      const usdMicro = 1e6; // 1 USD = 1,000,000 (used for querying the contract)

      // 3. Get the amount of RAMA in Wei that equals 1 USD
      const ramaWeiQuoteStr = await contract.methods.getPackageValueInRAMA(usdMicro.toString()).call();

      // 4. Convert the RAMA value from Wei to full tokens.
      // RamaValue is now the amount of RAMA tokens that equals $1 USD.
      // (e.g., 20.0 RAMA per 1 USD)
      const RamaValue = parseFloat(ramaWeiQuoteStr) / 1e18;

      console.log(`RAMA tokens required for $1 USD: ${RamaValue}`);

      // 5. CORRECT CONVERSION LOGIC:
      // To get the USD amount, you divide the user's RAMA amount (amt)
      // by the rate of RAMA per USD (RamaValue).
      const UsdAmt = parseFloat(amt) / RamaValue;

      // Example: If RamaValue is 20 (20 RAMA = $1 USD) and amt is 10 RAMA,
      // UsdAmt = 10 / 20 = 0.5 (i.e., $0.50 USD).

      return UsdAmt;

    } catch (error) {
      console.error('RamaTOUsd error:', error);
      // Swal.fire removed as it requires an external library and might not be available
      throw error;
    }
  },


  InvestInPortFolio: async (userAddress, Amt) => {
    console.log('InvestInPortFolio args:', userAddress, Amt);
    try {

      const pm = new web3.eth.Contract(PortFolioManagerABI, Contract.PortFolioManager);

      const usdMicro = Amt * 1e6;
      const ramaWeiQuoteStr = await pm.methods
        .getPackageValueInRAMA(usdMicro.toString())
        .call();

      const ramaWei = parseInt(ramaWeiQuoteStr);
      if (ramaWei <= 0) throw new Error('Invalid RAMA quote (0)');

      const tol = ramaWei / 200; // 0.5%
      const valueToSend = (ramaWei + tol).toString();

      console.log(sponsorAddress, valueToSend.toString(), ramaWei)

      const data = pm.methods
        .createPortfolio(sponsorAddress, valueToSend)
        .encodeABI();

      const gasPrice = await web3.eth.getGasPrice();

      let gasLimit;
      try {
        gasLimit = await web3.eth.estimateGas({
          from: userAddress,
          to: Contract.PortFolioManager,
          data,
          value: valueToSend,
        });
      } catch (err) {
        console.error('Gas estimation failed:', err);
        Swal.fire({
          icon: 'error',
          title: 'Gas estimation failed',
          text: err?.message || 'Check contract & inputs.',
        });
        throw err;
      }

      const toHex = web3.utils.toHex;

      const tx = {
        from: userAddress,
        to: Contract.PortFolioManager,   // ✅ correct target (PM)
        data,
        value: valueToSend,       // ✅ must send RAMA wei
        gas: toHex(gasLimit),
        gasPrice: toHex(gasPrice),
      };

      return tx; // your wallet (AppKit/WalletConnect) will sign & send this
    } catch (error) {
      console.error('InvestInPortFolio error:', error);
      Swal.fire({ icon: 'error', title: 'Portfolio creation error', text: error?.message || 'Unknown error' });
      throw error;
    }
  },







}));