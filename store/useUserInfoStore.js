import { create } from "zustand";
import Web3, { errors } from "web3";
import Swal from "sweetalert2";
import UserRegistryABI from './Contract_ABI/UserRegistry.json';
import PortFolioManagerABI from './Contract_ABI/PortFolioManager.json'
import OceanQueryUpgradeableABI from './Contract_ABI/OceanQueryUpgradeableABI.json'
import OceanViewUpgradeableABI from './Contract_ABI/OCEANVIEWUPGRADABLEABI.json'
import SlabManagerABI from './Contract_ABI/SlabManager.json'
import { dayShortFromUnix } from "../src/utils/helper";
import SafeWalletABI from './Contract_ABI/SafeWallet.json'
import OceanViewV2ABI from './Contract_ABI/OceanView2.json'
import OceanViewABI from './Contract_ABI/OceanView.json'
import IncomeDistributorABI from './Contract_ABI/IncomeDistributor.json'
import RoyaltyManagerABI from './Contract_ABI/RoyaltyManager.json'
import RewardVaultABI from './Contract_ABI/RewardVault.json'
import OceanicViewABI from './Contract_ABI/OceanicView.json'


const Contract = {
  UserRegistry: "0x71Ce2E2Af312e856b17d901aCDbE4ea39831C961",
  CoreConfig: "0x88feEF32db83e79BbD69c222851e45cD681D6a62",
  RoiDistribution: "0x95AeF6C4d06BcD7913F3EEd02A60Baf7Ef0b3584",
  PortFolioManager: "0xc9Fb0f8EAE5b98cd914f23dd66e277eeC5993a66",
  RoyaltyManager: "0xB953ccFe1d34BB413A0A7000259708E1ef3ca8d3",
  SlabManager: "0x631a0381473f9bC9B43Df75D67fd36E6bd3E3685",
  IncomeDistributor: "0xBdbA28a842e3c48f039b7f390aa90AEB000E352e",
  FreezePolicy: "0x75651A0ee14A400E59D1F7C46839DDe9aD6cA043",
  RewardVault: "0x6D96990EBF016d51e9399fE48C770c3336437Dc8",
  AdminControl: "0xcD8eB92E927Aa9C0DC5e58d8383D4aE211F73f96",
  MainWallet: "0x61d66989f2fA03818Fcf2f4dCb586C17D4fa9c47",
  SafeWallet: "0x58514DE6CCd50CF33d2bD90547847E212Ae93f11",
  OceanViewUpgradeable: "0xB1dA6010aCf502daaDD0aE40D03c40A686EE27c9",
  OceanQueryUpgradeable: "0x6bF2Fdcd0D0A79Ba65289d8d5EE17d4a6C2EC3e5",
  PRICEORACLE: "0xda2ad06b05Eb1b12F41bBd78724ea13cA710f4e0",
  RAMA: "0xB68295562a686f935d85A72160D1cE4c963cdeA7",
  OceanViewV2: "0x8f93fdf9A72574F9bbD40437EA1a88559082CaDD",
  OceanicView: "0x97879b4d8a3f7aF20Ad766dacEE1b05497129397"
};

const INFURA_URL = "https://blockchain.ramestta.com";
const web3 = new Web3(INFURA_URL);


const fromMicroUSD = (value) => toNumber(value) / USD_MICRO;
const fromWadToUsd = (value) => toNumber(value) / 1e18;
const formatTeamVolume = (raw) => {
  if (raw == null) return 0;
  const amount = Number(raw);
  if (!Number.isFinite(amount) || amount === 0) return 0;
  if (Math.abs(amount) >= 1e6) {
    return amount / 1e6;
  }
  if (Math.abs(amount) < 1) {
    return amount * 1e6;
  }
  return amount;
};

const toNumber = (value) => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "bigint") return Number(value);
  return Number(value);
};


const readLocalJSON = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};


const fromWeiToRama = (value) => toNumber(value) / RAMA_DECIMALS;

const USD_MICRO = 1e6;
const RAMA_DECIMALS = 1e18;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const hasAddress = (addr) =>
  typeof addr === "string" &&
  addr.startsWith("0x") &&
  addr.length === 42 &&
  addr.toLowerCase() !== ZERO_ADDRESS.toLowerCase();



const makeContract = (abi, address) =>
  hasAddress(address) ? new web3.eth.Contract(abi, address) : null;




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
      // UserRegistry ABI exposes `getId(address)` for user ID lookup
      const userId = await contract.methods.getId(userAddress).call();

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
    console.log("port id is", portId)
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

      const OceanViewV2 = new web3.eth.Contract(
        OceanViewV2ABI,
        Contract['OceanViewV2']
      );
      const oceanView = new web3.eth.Contract(
        OceanViewUpgradeableABI,
        Contract["OceanViewUpgradeable"]
      );

      const safeWallCont = new web3.eth.Contract(
        SafeWalletABI,
        Contract["SafeWallet"]
      );

      const OceanicViewCont = new web3.eth.Contract(OceanicViewABI, Contract["OceanicView"]);


      // Fire all calls at once
      const [dashboardData, safeWalletBalanceRaw, slabPanelRaw, GrantTotalEarn] = await Promise.all([

        OceanViewV2.methods.getDashboardData(userAddress).call(),
        safeWallCont.methods.balanceOf(userAddress).call(),
        oceanView.methods.getSlabPanel(userAddress).call(),
        OceanicViewCont.methods.getGrandTotalEarned(userAddress).call()
      ]);


      console.log("this is sfe wallet", safeWalletBalanceRaw)

      return {
        // directChildrenCount: toNum(referralCountRaw),
        safeWalletRAMAWei: parseFloat(safeWalletBalanceRaw) / 1e6, // keep as string/BigInt; format at render
        slabPanel: slabPanelRaw,                // map fields if needed
        dashboardData,
        GrantTotalEarn
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

      // Contract expects a dayId (uint32), i.e., days since epoch
      const nowSec = Math.floor(Date.now() / 1000)
      const todayDayId = Math.floor(nowSec / 86400)

      const Last7DaysEarning = await oceanView.methods.getLast7DaysEarningsUSD(userAddress, todayDayId).call();

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

  getSlabIncomeOverview: async (userAddress) => {
    try {
      if (!userAddress) throw new Error("Missing user address");

      const oceanViewV2 = makeContract(
        OceanViewV2ABI,
        Contract["OceanViewV2"]
      );
      const oceanQuery = makeContract(
        OceanQueryUpgradeableABI,
        Contract["OceanQueryUpgradeable"]
      );
      const slabManager = makeContract(SlabManagerABI, Contract["SlabManager"]);

      const portfolioManager = makeContract(
        PortFolioManagerABI,
        Contract["PortFolioManager"]
      );


      const todayDayId = Math.floor(Date.now() / 86400000);
      let summary = null;
      if (oceanViewV2) {
        try {
          const [summaryRaw] = await oceanViewV2.methods
            .getDashboardData(userAddress, todayDayId)
            .call();
          summary = summaryRaw ?? null;
        } catch (err) {
          console.warn("OceanViewV2.getDashboardData (slab) failed:", err);
        }
      }

      const [
        slabIncomeRaw,
        slabIncomeAvailableRaw,
        sameSlabOverrideRaw,
        sameSlabEarningsRaw,
        sameSlabPartnersRaw,
        slabClaimStatusRaw,
        slabIndexRaw,
        qualifiedBusinessUsdRaw,
        userStatusRaw,
      ] = await Promise.all([
        oceanQuery.methods.getSlabIncome(userAddress).call(),
        oceanQuery.methods.getSlabIncomeAvailable(userAddress).call(),
        oceanQuery.methods.getSameSlabOverrideIncome(userAddress).call(),
        oceanQuery.methods.getSameSlabOverrideEarnings(userAddress).call(),
        oceanQuery.methods.getSameSlabPartners(userAddress).call(),
        oceanQuery.methods.getSlabClaimStatus(userAddress).call(),
        slabManager
          ? slabManager.methods.getSlabIndex(userAddress).call()
          : 0,
        slabManager
          ? slabManager.methods.getQualifiedBusinessUSD(userAddress).call()
          : 0,
        oceanQuery.methods.getUserStatus(userAddress).call(),
      ]);

      let ramaPerUsdWei = null;
      if (portfolioManager) {
        try {
          const ratioStr = await portfolioManager.methods
            .getPackageValueInRAMA("1000000")
            .call();
          ramaPerUsdWei = BigInt(ratioStr);
        } catch (err) {
          console.warn("getPackageValueInRAMA failed:", err);
        }
      }

      const USD_MICRO_BI = BigInt(USD_MICRO);
      const convertUsdMicroToRamaWei = (value) => {
        if (!ramaPerUsdWei) return "0";
        try {
          const usdMicroBig = BigInt(value ?? "0");
          const wei = (usdMicroBig * ramaPerUsdWei) / USD_MICRO_BI;
          return wei.toString();
        } catch {
          return "0";
        }
      };

      const slabIncomeUsd = fromMicroUSD(slabIncomeRaw);
      const slabIncomeAvailableUsd = fromMicroUSD(slabIncomeAvailableRaw);
      const slabIncomeRama = fromWeiToRama(
        convertUsdMicroToRamaWei(slabIncomeRaw)
      );
      const slabIncomeAvailableRama = fromWeiToRama(
        convertUsdMicroToRamaWei(slabIncomeAvailableRaw)
      );

      const overrideIncomeUsd = fromMicroUSD(sameSlabOverrideRaw);
      const overrideIncomeRama = fromWeiToRama(
        convertUsdMicroToRamaWei(sameSlabOverrideRaw)
      );

      const overrideWavesUsd = [
        fromMicroUSD(sameSlabEarningsRaw?.[0]),
        fromMicroUSD(sameSlabEarningsRaw?.[1]),
        fromMicroUSD(sameSlabEarningsRaw?.[2]),
      ];
      const overrideWavesRama = [
        fromWeiToRama(
          convertUsdMicroToRamaWei(sameSlabEarningsRaw?.[0])
        ),
        fromWeiToRama(
          convertUsdMicroToRamaWei(sameSlabEarningsRaw?.[1])
        ),
        fromWeiToRama(
          convertUsdMicroToRamaWei(sameSlabEarningsRaw?.[2])
        ),
      ];

      const slabLevelFromSummary = summary
        ? toNumber(summary?.slabLevel)
        : null;
      const slabLevel = Number.isFinite(slabLevelFromSummary)
        ? slabLevelFromSummary
        : toNumber(slabIndexRaw);

      const qualifiedVolumeUsd = summary
        ? fromMicroUSD(summary?.qualifiedVolumeUsdMicro)
        : fromMicroUSD(qualifiedBusinessUsdRaw);

      const directs = summary
        ? toNumber(summary?.directRefs)
        : toNumber(userStatusRaw?.directs);

      const canClaim =
        typeof slabClaimStatusRaw?.canClaim === "boolean"
          ? slabClaimStatusRaw.canClaim
          : Boolean(slabClaimStatusRaw?.[0]);
      const lastClaimEpoch = toNumber(
        slabClaimStatusRaw?.lastClaimAtEpoch ?? slabClaimStatusRaw?.[1]
      );
      const currentEpoch = toNumber(
        slabClaimStatusRaw?.currentEpoch ?? slabClaimStatusRaw?.[2]
      );

      const partners =
        sameSlabPartnersRaw && sameSlabPartnersRaw.firstWave !== undefined
          ? sameSlabPartnersRaw
          : {
            firstWave: sameSlabPartnersRaw?.[0] ?? [],
            secondWave: sameSlabPartnersRaw?.[1] ?? [],
            thirdWave: sameSlabPartnersRaw?.[2] ?? [],
          };

      return {
        slabLevel,
        qualifiedVolumeUsd,
        directs,
        canClaim,
        currentEpoch,
        lastClaimEpoch,
        slabIncomeUsd,
        slabIncomeAvailableUsd,
        slabIncomeRama,
        slabIncomeAvailableRama,
        overrideIncomeUsd,
        overrideIncomeRama,
        OverrideEarnings: {
          l1Usd: overrideWavesUsd[0] ?? 0,
          l2Usd: overrideWavesUsd[1] ?? 0,
          l3Usd: overrideWavesUsd[2] ?? 0,
          l1: overrideWavesRama[0] ?? 0,
          l2: overrideWavesRama[1] ?? 0,
          l3: overrideWavesRama[2] ?? 0,
        },
        totalOverrideUsd: overrideWavesUsd.reduce(
          (acc, val) => acc + (val || 0),
          0
        ),
        totalOverrideRama: overrideWavesRama.reduce(
          (acc, val) => acc + (val || 0),
          0
        ),
        sameSlabPartners: {
          firstWave: partners.firstWave ?? [],
          secondWave: partners.secondWave ?? [],
          thirdWave: partners.thirdWave ?? [],
        },
        summary,
      };
    } catch (error) {
      console.error("getSlabIncomeOverview error:", error);
      throw error;
    }
  },

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
      const pm = new web3.eth.Contract(PortFolioManagerABI, Contract["PortFolioManager"]);
      const query = new web3.eth.Contract(OceanQueryUpgradeableABI, Contract["OceanQueryUpgradeable"]);

      // Fetch actual minimum stake from chain (micro-USD)
      const minUsdMicroStr = await query.methods.getMinimumStake().call();
      const minUsdMicro = parseInt(minUsdMicroStr);
      const portFolioAmtUsd = minUsdMicro / 1e6; // convert micro-USD -> USD

      // Quote required RAMA (wei) for that USD amount
      const AmtInRamaWei = await pm.methods.getPackageValueInRAMA(minUsdMicro.toString()).call();
      const ramaAmt = parseInt(AmtInRamaWei) / 1e18;

      return { portFolioAmtUsd, ramaAmt };

    } catch (error) {
      console.log("regPortFoliAmt error:", error);
    }
  },

  CreateportFolio: async (userAddress, sponsorInput, amt = 10) => {
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
      const usdMicro = amt * 1e6; // $10 -> 10,000,000 micro-USD
      const ramaWeiQuoteStr = await pm.methods
        .getPackageValueInRAMA(usdMicro.toString())
        .call();

      const valueToSend = parseInt(ramaWeiQuoteStr);
      if (valueToSend <= 0) throw new Error('Invalid RAMA quote (0)');



      console.log(sponsorAddress, valueToSend.toString(), valueToSend)

      // --- 2) Build tx: createPortfolio(usdAmountMicro, referrer) PAYABLE
      const data = pm.methods.RegisterAndActivate(sponsorAddress, valueToSend).encodeABI();

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
      const safeContract = new web3.eth.Contract(
        SafeWalletABI,
        Contract["SafeWallet"]
      );

      const safeWalletBalanceRaw = await safeContract.methods.balanceOf(userAddress).call()
      const SafeWalletFund = parseFloat(safeWalletBalanceRaw) / 1e6;

      console.log("safe Wallet fund", SafeWalletFund)

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



  // ==========================================================================
  // Stake And Invest
  // ==========================================================================

  CreateSelfPort: async (userAddress, Amt) => {
    console.log('CreateSelfPort args:', userAddress, Amt);
    try {

      const pm = new web3.eth.Contract(PortFolioManagerABI, Contract.PortFolioManager);

      const usdMicro = Amt * 1e6;
      const ramaWeiQuoteStr = await pm.methods
        .getPackageValueInRAMA(usdMicro.toString())
        .call();

      const valueToSend = parseInt(ramaWeiQuoteStr);
      if (valueToSend <= 0) throw new Error('Invalid RAMA quote (0)');



      console.log(valueToSend.toString(), valueToSend)

      const data = pm.methods
        .createPortfolio(valueToSend)
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
      console.error('CreateSelfPort error:', error);
      Swal.fire({ icon: 'error', title: 'CreateSelfPort error', text: error?.message || 'Unknown error' });
      throw error;
    }
  },

  CreateOtherfPort: async (userAddress, toBeActivatedUSer, Amt) => {
    console.log('CreateOtherfPort args:', userAddress, toBeActivatedUSer, Amt);
    try {
      const pm = new web3.eth.Contract(PortFolioManagerABI, Contract.PortFolioManager);

      const usdMicro = Amt * 1e6;
      const ramaWeiQuoteStr = await pm.methods
        .getPackageValueInRAMA(usdMicro.toString())
        .call();

      const valueToSend = parseInt(ramaWeiQuoteStr);
      if (valueToSend <= 0) throw new Error('Invalid RAMA quote (0)');

      console.log(valueToSend.toString(), valueToSend)

      const data = pm.methods
        .createPortfolioForOthers(toBeActivatedUSer, userAddress, Amt)
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
      console.error('CreateOtherfPort error:', error);
      Swal.fire({ icon: 'error', title: 'CreateOtherfPort error', text: error?.message || 'Unknown error' });
      throw error;
    }
  },

  SafeSelfPort: async (userAddress, Amt) => {
    console.log('SafeSelfPort args:', userAddress, Amt);
    try {

      const pm = new web3.eth.Contract(PortFolioManagerABI, Contract.PortFolioManager);

      const usdMicro = Amt * 1e6;
      const ramaWeiQuoteStr = await pm.methods
        .getPackageValueInRAMA(usdMicro.toString())
        .call();

      const valueToSend = parseInt(ramaWeiQuoteStr);
      if (valueToSend <= 0) throw new Error('Invalid RAMA quote (0)');



      console.log(valueToSend.toString(), valueToSend)

      const data = pm.methods
        .createPortfolioFromSafe(userAddress, valueToSend, userAddress)
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
      console.error('SafeSelfPort error:', error);
      Swal.fire({ icon: 'error', title: 'SafeSelfPort error', text: error?.message || 'Unknown error' });
      throw error;
    }
  },

  SafeOtherPort: async (userAddress, beneficiary, Amt) => {
    console.log('SafeOtherPort args:', userAddress, Amt);
    try {

      const pm = new web3.eth.Contract(PortFolioManagerABI, Contract.PortFolioManager);

      const usdMicro = Amt * 1e6;
      const ramaWeiQuoteStr = await pm.methods
        .getPackageValueInRAMA(usdMicro.toString())
        .call();

      const valueToSend = parseInt(ramaWeiQuoteStr);
      if (valueToSend <= 0) throw new Error('Invalid RAMA quote (0)');



      console.log(valueToSend.toString(), valueToSend)

      const data = pm.methods
        .createPortfolioForOthersFromSafe(userAddress, beneficiary, valueToSend, userAddress)
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
      console.error('SafeOtherPort error:', error);
      Swal.fire({ icon: 'error', title: 'CreateSelfPort error', text: error?.message || 'Unknown error' });
      throw error;
    }
  },

  // ==========================================================================
  //PortFolio   OverView
  // ==========================================================================

  getPortfolioIds: async (userAddress) => {
    try {
      if (!userAddress) return [];

      const pm = new web3.eth.Contract(
        PortFolioManagerABI,
        Contract["PortFolioManager"]
      );

      const rawIds = await pm.methods.portfoliosOf(userAddress).call();
      return rawIds.map((id) => Number(id));
    } catch (error) {
      console.error("getPortfolioIds error:", error);
      throw error;
    }
  },

  // =====================================================================
  // Spot / Direct Income
  // =====================================================================

  getSpotIncomeSummary: async (userAddress, options = {}) => {
    const { limit = 25, portfolioLimit = 4 } = options;
    try {
      if (!userAddress) throw new Error("Missing user address");

      const distributor = makeContract(
        IncomeDistributorABI,
        Contract["IncomeDistributor"]
      );
      if (!distributor) throw new Error("IncomeDistributor contract unavailable");

      const oceanQuery = makeContract(
        OceanQueryUpgradeableABI,
        Contract["OceanQueryUpgradeable"]
      );
      const portfolioManager = makeContract(
        PortFolioManagerABI,
        Contract["PortFolioManager"]
      );

      const [
        summaryRaw,
        countRaw,
        totalDirectUsdRaw,
        totalDirectRamaRaw,
        sliceRaw,
        totalEarningsRaw,
      ] = await Promise.all([
        distributor.methods.getDirectIncomeSummary(userAddress).call(),
        distributor.methods.getDirectIncomeCount(userAddress).call(),
        distributor.methods.totalDirectUsd(userAddress).call(),
        distributor.methods.totalDirectRama(userAddress).call(),
        distributor.methods
          .getDirectIncomeSlice(userAddress, 0, limit)
          .call(),
        oceanQuery
          ? oceanQuery.methods.getTotalEarnings(userAddress).call()
          : [0, 0],
      ]);

      const entries = toNumber(summaryRaw?.entries);
      const lifetimeUsdMicro = toNumber(summaryRaw?.lifetimeUsd);
      const lifetimeUsd = lifetimeUsdMicro / USD_MICRO;
      const lifetimeRamaWei = toNumber(summaryRaw?.lifetimeRama);
      const lifetimeRama = fromWeiToRama(summaryRaw?.lifetimeRama);
      const claimableRamaWei = toNumber(summaryRaw?.claimableRama);
      const claimableRama = fromWeiToRama(summaryRaw?.claimableRama);

      let claimableUsdMicro = 0;
      if (
        portfolioManager &&
        summaryRaw?.claimableRama &&
        summaryRaw.claimableRama !== "0"
      ) {
        try {
          const usdMicro = await portfolioManager.methods
            .getPackageValueInUSD(summaryRaw.claimableRama)
            .call();
          claimableUsdMicro = toNumber(usdMicro);
        } catch (conversionErr) {
          console.warn("Claimable USD conversion failed:", conversionErr);
        }
      }

      const transactions =
        (sliceRaw ?? []).map((item) => ({
          receiver: item.receiver,
          from: item.receivedFrom,
          portfolioId: toNumber(item.portfolioId),
          amountUsdMicro: toNumber(item.amountUsd),
          amountUsd:
            toNumber(item.amountUsd) / USD_MICRO,
          amountRamaWei: toNumber(item.amountRama),
          amountRama: toNumber(item.amountRama) / RAMA_DECIMALS,
          timestamp: toNumber(item.timestamp),
          dayId: toNumber(item.dayId),
        })) ?? [];

      const nowTs = Math.floor(Date.now() / 1000);
      const cutoff = nowTs - 86400;
      let last24hUsdMicro = 0;
      let last24hRamaWei = 0;
      const portfolioSet = new Set();
      transactions.forEach((tx) => {
        if (tx.portfolioId != null && !Number.isNaN(tx.portfolioId)) {
          portfolioSet.add(tx.portfolioId);
        }
        if (tx.timestamp >= cutoff) {
          last24hUsdMicro += tx.amountUsdMicro ?? 0;
          last24hRamaWei += tx.amountRamaWei ?? 0;
        }
      });

      const totalEntries = toNumber(countRaw);
      const averageSpotUsdMicro =
        entries > 0 ? lifetimeUsdMicro / entries : 0;
      const averageSpotUsd = averageSpotUsdMicro / USD_MICRO;
      const totalDirectUsdMicro = toNumber(totalDirectUsdRaw);
      const totalDirectUsd = totalDirectUsdMicro / USD_MICRO;
      const totalDirectRamaWei = toNumber(totalDirectRamaRaw);
      const totalDirectRama = totalDirectRamaWei / RAMA_DECIMALS;
      const totalEarningsUsd = fromWadToUsd(totalEarningsRaw?.[0] ?? 0);
      const totalEarningsRama = fromWeiToRama(totalEarningsRaw?.[1] ?? 0);

      const uniquePortfolioIds = new Set(portfolioSet);
      try {
        const additionalIds = await get().getPortfolioIds(userAddress);
        (additionalIds ?? []).forEach((pid) => {
          const numPid = Number(pid);
          if (Number.isFinite(numPid)) uniquePortfolioIds.add(numPid);
        });
      } catch (pidErr) {
        console.warn("getPortfolioIds failed for spot income:", pidErr);
      }

      const portfolioIdsList = Array.from(uniquePortfolioIds).slice(
        0,
        portfolioLimit
      );

      const totalsByPortfolio = await Promise.all(
        portfolioIdsList.map(async (pid) => {
          try {
            const totals = await distributor.methods
              .getDirectIncomeTotalsByPortfolio(userAddress, pid)
              .call();
            return {
              pid,
              usdMicro: toNumber(totals?.usdSum ?? totals?.[0]),
              usd:
                toNumber(totals?.usdSum ?? totals?.[0]) / USD_MICRO,
              ramaWei: toNumber(totals?.ramaSum ?? totals?.[1]),
              rama:
                toNumber(totals?.ramaSum ?? totals?.[1]) / RAMA_DECIMALS,
              count: toNumber(totals?.count ?? totals?.[2]),
            };
          } catch (err) {
            console.warn(
              `getDirectIncomeTotalsByPortfolio(${pid}) failed`,
              err
            );
            return null;
          }
        })
      ).then((res) => res.filter(Boolean));

      return {
        overview: {
          entries,
          totalEntries,
          lifetimeUsdMicro,
          lifetimeUsd,
          lifetimeRama,
          lifetimeRamaWei,
          totalDirectUsdMicro,
          totalDirectUsd,
          totalDirectRama,
          totalDirectRamaWei,
          claimableRama,
          claimableRamaWei,
          claimableUsdMicro,
          claimableUsd: claimableUsdMicro / USD_MICRO,
          last24hUsdMicro,
          last24hUsd: last24hUsdMicro / USD_MICRO,
          last24hRamaWei,
          last24hRama: last24hRamaWei / RAMA_DECIMALS,
          averageSpotUsd,
          averageSpotUsdMicro,
          totalEarningsUsd,
          totalEarningsRama,
          activeSpots: totalsByPortfolio.length
            ? totalsByPortfolio.length
            : totalEntries,
        },
        transactions,
        totalsByPortfolio,
        hasMore: totalEntries > transactions.length,
      };
    } catch (error) {
      console.error("getSpotIncomeSummary error:", error);
      throw error;
    }
  },

  getSpotIncomeTransactions: async (
    userAddress,
    { offset = 0, limit = 20 } = {}
  ) => {
    try {
      if (!userAddress) throw new Error("Missing user address");

      const distributor = makeContract(
        IncomeDistributorABI,
        Contract["IncomeDistributor"]
      );
      if (!distributor) throw new Error("IncomeDistributor contract unavailable");

      const sliceRaw = await distributor.methods
        .getDirectIncomeSlice(userAddress, offset, limit)
        .call();

      return (sliceRaw ?? []).map((item) => ({
        receiver: item.receiver,
        from: item.receivedFrom,
        portfolioId: toNumber(item.portfolioId),
        amountUsdMicro: toNumber(item.amountUsd),
        amountUsd: toNumber(item.amountUsd) / USD_MICRO,
        amountRamaWei: toNumber(item.amountRama),
        amountRama: toNumber(item.amountRama) / RAMA_DECIMALS,
        timestamp: toNumber(item.timestamp),
        dayId: toNumber(item.dayId),
      }));
    } catch (error) {
      console.error("getSpotIncomeTransactions error:", error);
      throw error;
    }
  },

  getPortfolioSummaries: async (userAddress) => {
    try {
      if (!userAddress) return [];

      const oceanViewV2 = makeContract(
        OceanViewV2ABI,
        Contract["OceanViewV2"]
      );

      if (oceanViewV2) {
        try {
          const [cardsRaw] = await oceanViewV2.methods
            .getPortfolioCards(userAddress)
            .call();

          const pick = (record, key, index) =>
            record?.[key] != null ? record[key] : record?.[index];

          return (cardsRaw ?? []).map((entry) => {
            const pid = Number(pick(entry, "pid", 0));
            const principalUsdMicro =
              pick(entry, "principalUsdMicro", 2) ??
              pick(entry, "principalUSD", 2) ??
              0;
            const principalRamaWei =
              pick(entry, "principalRamaWei", 1) ??
              pick(entry, "principalRama", 1) ??
              0;
            const capRamaWei =
              pick(entry, "capRamaWei", 3) ?? pick(entry, "capRama", 3) ?? 0;
            const creditedRamaWei =
              pick(entry, "creditedRamaWei", 5) ??
              pick(entry, "creditedRama", 5) ??
              0;
            const capPct = Number(pick(entry, "capPct", 9) ?? 0);
            const booster = Boolean(pick(entry, "booster", 11));
            const tier = Number(pick(entry, "tier", 10) ?? 0);
            const dailyRateWad = pick(entry, "dailyRateWad", 8);
            const active = Boolean(pick(entry, "active", 12));
            const createdAt = Number(pick(entry, "createdAt", 13) ?? 0);
            const frozenUntil = Number(pick(entry, "frozenUntil", 14) ?? 0);
            const capProgressBps = Number(
              pick(entry, "capProgressBps", 7) ?? 0
            );

            return {
              pid,
              principalUsdRaw: principalUsdMicro,
              principalUsd: fromMicroUSD(principalUsdMicro),
              principalRama: fromWeiToRama(principalRamaWei),
              principalRamaWei,
              capRama: toNumber(capRamaWei),
              creditedRama: toNumber(creditedRamaWei),
              capPct,
              booster,
              tier,
              dailyRateWad,
              active,
              createdAt,
              frozenUntil,
              capProgressBps,
            };
          });
        } catch (err) {
          console.warn(
            "OceanViewV2.getPortfolioCards fallback to legacy:",
            err?.message ?? err
          );
        }
      }

      const oceanView = new web3.eth.Contract(
        OceanViewABI,
        Contract["OceanViewUpgradeable"]
      );
      const oceanQuery = new web3.eth.Contract(
        OceanQueryUpgradeableABI,
        Contract["OceanQueryUpgradeable"]
      );

      const rawSummaries = await oceanView.methods
        .getPortfolioSummaries(userAddress)
        .call();

      const pickValue = (entry, key, index) =>
        entry?.[key] != null ? entry[key] : entry?.[index];

      const items = [];
      for (const entry of rawSummaries ?? []) {
        const pid = Number(pickValue(entry, "pid", 0));
        const principalUsdRaw = toNumber(pickValue(entry, "principalUSD", 2));
        const principalRama = toNumber(pickValue(entry, "principalRama", 1));
        const capRama = toNumber(pickValue(entry, "capRama", 3));
        const creditedRama = toNumber(pickValue(entry, "creditedRama", 4));
        const capPct = Number(pickValue(entry, "capPct", 5));
        const booster = Boolean(pickValue(entry, "booster", 6));
        const tier = Number(pickValue(entry, "tier", 7));
        const dailyRateWad = pickValue(entry, "dailyRateWad", 8);
        const active = Boolean(pickValue(entry, "active", 9));
        const createdAt = Number(pickValue(entry, "createdAt", 10));
        const frozenUntil = Number(pickValue(entry, "frozenUntil", 11));

        let capProgressBps = null;
        if (Number.isFinite(pid) && pid >= 0) {
          try {
            const progressRaw = await oceanQuery.methods
              .getPortfolioCapProgress(pid)
              .call();
            capProgressBps = Number(progressRaw);
          } catch {
            capProgressBps = null;
          }
        }

        items.push({
          pid,
          principalUsdRaw,
          principalUsd: fromMicroUSD(principalUsdRaw),
          principalRama,
          capRama,
          creditedRama,
          capPct,
          booster,
          tier,
          dailyRateWad,
          active,
          createdAt,
          frozenUntil,
          capProgressBps,
        });
      }

      return items;
    } catch (error) {
      console.error("getPortfolioSummaries error:", error);
      throw error;
    }
  },

  getLifetimeCapProgress: async (userAddress) => {
    try {
      if (!userAddress) return null;

      const oceanViewV2 = makeContract(
        OceanViewV2ABI,
        Contract["OceanViewV2"]
      );

      if (oceanViewV2) {
        try {
          const [, lifetimeCapRaw] = await oceanViewV2.methods
            .getPortfolioCards(userAddress)
            .call();
          return Number(lifetimeCapRaw ?? 0);
        } catch (err) {
          console.warn(
            "OceanViewV2.getPortfolioCards (lifetimeCap) fallback:",
            err?.message ?? err
          );
        }
      }

      const oceanQuery = new web3.eth.Contract(
        OceanQueryUpgradeableABI,
        Contract["OceanQueryUpgradeable"]
      );
      const raw = await oceanQuery.methods
        .getLifetimeCapProgress(userAddress)
        .call();
      return Number(raw);
    } catch (error) {
      console.error("getLifetimeCapProgress error:", error);
      throw error;
    }
  },



  // =====================================================================
  // Royalty Program
  // =====================================================================

  getRoyaltyOverview: async (userAddress) => {
    try {
      if (!userAddress) throw new Error("Missing user address");

      const oceanViewV2 = makeContract(
        OceanViewV2ABI,
        Contract["OceanViewV2"]
      );
      const oceanQuery = makeContract(
        OceanQueryUpgradeableABI,
        Contract["OceanQueryUpgradeable"]
      );
      const royaltyManager = makeContract(
        RoyaltyManagerABI,
        Contract["RoyaltyManager"]
      );
      const portfolioManager = makeContract(
        PortFolioManagerABI,
        Contract["PortFolioManager"]
      );

      const todayDayId = Math.floor(Date.now() / 86400000);
      let summary = null;
      let incomeSummary = null;

      if (oceanViewV2) {
        try {
          const dashboardData = await oceanViewV2.methods
            .getDashboardData(userAddress, todayDayId)
            .call();
          summary = dashboardData?.[0] ?? null;
          incomeSummary = dashboardData?.[1] ?? null;
        } catch (err) {
          console.warn("OceanViewV2.getDashboardData (royalty) failed:", err);
        }
      }

      const [
        royaltyIncomeRaw,
        nextClaimRaw,
        renewalRaw,
        currentLevelRaw,
        canClaimRaw,
      ] = await Promise.all([
        oceanQuery.methods.getRoyaltyIncome(userAddress).call(),
        oceanQuery.methods.getNextRoyaltyClaimDate(userAddress).call(),
        oceanQuery.methods.getRoyaltyRenewalRequirement(userAddress).call(),
        oceanQuery.methods.getCurrentRoyaltyLevel(userAddress).call(),
        oceanQuery.methods.canClaimRoyalty(userAddress).call(),
      ]);

      let royaltyState = null;
      if (royaltyManager) {
        try {
          royaltyState = await royaltyManager.methods
            .royalty(userAddress)
            .call();
        } catch (err) {
          console.warn("RoyaltyManager.royalty call failed:", err);
        }
      }

      const royaltyUsdMicroRaw = incomeSummary?.royaltyUsdMicro ?? royaltyIncomeRaw;
      const royaltyIncomeUsd = fromMicroUSD(royaltyUsdMicroRaw);

      let royaltyIncomeRama = 0;
      if (portfolioManager && royaltyUsdMicroRaw && royaltyUsdMicroRaw !== "0") {
        try {
          const ramaWei = await portfolioManager.methods
            .getPackageValueInRAMA(royaltyUsdMicroRaw)
            .call();
          royaltyIncomeRama = fromWeiToRama(ramaWei);
        } catch (err) {
          console.warn("Royalty USD->RAMA conversion failed:", err);
        }
      }

      const currentLevel = summary
        ? toNumber(summary.royaltyLevel)
        : toNumber(currentLevelRaw);
      const canClaim = summary
        ? Boolean(summary.royaltyCanClaim)
        : Boolean(canClaimRaw);
      const paused = summary
        ? Boolean(summary.royaltyPaused)
        : Boolean(renewalRaw?.paused);

      const paidMonths = summary
        ? toNumber(summary.royaltyPaidMonths)
        : 0;

      const lastPaidMonthEpoch = summary
        ? toNumber(summary.royaltyLastMonthEpoch)
        : toNumber(nextClaimRaw?.[0] ?? 0);
      const nextMonthEpoch = summary
        ? toNumber(summary.royaltyNextMonthEpoch)
        : toNumber(nextClaimRaw?.[1] ?? 0);

      const renewalSnapshotUsd = summary
        ? fromMicroUSD(summary.royaltyRenewalSnapshotUsd)
        : fromMicroUSD(renewalRaw?.lastT ?? 0);
      const renewalRecentUsd = summary
        ? fromMicroUSD(summary.royaltyRecentSnapshotUsd)
        : fromMicroUSD(renewalRaw?.nowT ?? 0);
      const renewalTargetUsd =
        renewalSnapshotUsd > 0 ? renewalSnapshotUsd * 1.1 : 0;
      const renewalRequiredUsd = Math.max(
        0,
        renewalTargetUsd - renewalRecentUsd
      );

      const qualifiedVolumeUsd = summary
        ? fromMicroUSD(summary.qualifiedVolumeUsdMicro)
        : 0;
      const directs = summary ? toNumber(summary.directRefs) : 0;

      const overrideUsdMicro = incomeSummary?.overrideUsdMicro ?? 0;
      const overrideUsd = fromMicroUSD(overrideUsdMicro);
      const pendingRoyaltyUsd = royaltyIncomeUsd;

      let overrideIncomeRama = 0;
      if (portfolioManager && overrideUsdMicro && overrideUsdMicro !== "0") {
        try {
          const ramaWei = await portfolioManager.methods
            .getPackageValueInRAMA(overrideUsdMicro)
            .call();
          overrideIncomeRama = fromWeiToRama(ramaWei);
        } catch (err) {
          console.warn("Override USD->RAMA conversion failed:", err);
        }
      }

      let tiers = [];
      if (royaltyManager) {
        try {
          let tierCount = toNumber(
            await royaltyManager.methods.getTierCount().call()
          );
          if (!Number.isFinite(tierCount) || tierCount <= 0)
            tierCount = ROYALTY_LEVELS_FALLBACK.length;
          const indices = Array.from({ length: tierCount }, (_, i) => i);
          tiers = await Promise.all(
            indices.map(async (i) => {
              const [threshold, salary] = await Promise.all([
                royaltyManager.methods.thresholdUSD(i).call(),
                royaltyManager.methods.salaryUSD(i).call(),
              ]);
              return {
                thresholdUsd: fromMicroUSD(threshold),
                monthlyUsd: fromMicroUSD(salary),
              };
            })
          );
        } catch (err) {
          console.warn("RoyaltyManager tier fetch failed:", err);
        }
      }
      if (!tiers.length) {
        tiers = ROYALTY_LEVELS_FALLBACK.map((level) => ({
          thresholdUsd: fromMicroUSD(level.requiredVolumeUSD),
          monthlyUsd: fromMicroUSD(level.monthlyRoyaltyUSD),
        }));
      }

      let lastPaidTier = 0;
      if (royaltyState) {
        lastPaidTier = toNumber(royaltyState.lastPaidTier ?? royaltyState[0]);
      }

      return {
        currentLevel,
        lastPaidTier,
        canClaim,
        paused,
        royaltyIncomeUsd: pendingRoyaltyUsd,
        royaltyIncomeRama,
        overrideIncomeUsd: overrideUsd,
        overrideIncomeRama,
        paidMonths,
        lastPaidMonthEpoch,
        nextMonthEpoch,
        qualifiedVolumeUsd,
        directs,
        renewalSnapshotUsd,
        renewalRecentUsd,
        renewalTargetUsd,
        renewalRequiredUsd,
        tiers,
      };
    } catch (error) {
      console.error("getRoyaltyOverview error:", error);
      throw error;
    }
  },



  // =====================================================================
  // One-Time Rewards 
  // =====================================================================

  getTeamNetworkData: async (userAddress, options = {}) => {
    try {
      if (!hasAddress(userAddress)) {
        throw new Error('Invalid user address');
      }

      const userRegistry = makeContract(
        UserRegistryABI,
        Contract["UserRegistry"]
      );
      if (!userRegistry) {
        throw new Error('UserRegistry contract unavailable');
      }

      const incomeDistributor = makeContract(
        IncomeDistributorABI,
        Contract["IncomeDistributor"]
      );
      const oceanQuery = makeContract(
        OceanQueryUpgradeableABI,
        Contract["OceanQueryUpgradeable"]
      );

      const maxDepthInput = Number.isFinite(Number(options.maxDepth))
        ? Number(options.maxDepth)
        : 5;
      const maxDepth = Math.min(Math.max(maxDepthInput, 1), 10);
      const detailLimit = Number.isFinite(Number(options.detailLimit))
        ? Math.max(1, Number(options.detailLimit))
        : 50;

      const [directAddressesRaw, levelCountsRaw] = await Promise.all([
        userRegistry.methods.getDirectTeam(userAddress).call(),
        userRegistry.methods.getLevelTeamCounts(userAddress, maxDepth).call(),
      ]);

      const directAddresses = Array.isArray(directAddressesRaw)
        ? directAddressesRaw.filter(hasAddress)
        : [];
      const directCount = directAddresses.length;

      const levelCounts = Array.isArray(levelCountsRaw)
        ? levelCountsRaw.map(toNumber)
        : [];
      const totalTeamSize = levelCounts.reduce((sum, val) => sum + toNumber(val), 0);

      const levelPromises = [];
      for (let level = 1; level <= maxDepth; level += 1) {
        levelPromises.push(
          userRegistry.methods
            .getLevelTeam(userAddress, level)
            .call()
            .then((addresses) => ({
              level,
              addresses: Array.isArray(addresses)
                ? addresses.filter(hasAddress)
                : [],
            }))
            .catch((err) => {
              console.warn(`UserRegistry.getLevelTeam failed for L${level}:`, err);
              return { level, addresses: [] };
            })
        );
      }
      const levelResults = await Promise.all(levelPromises);
      const levels = {};
      levelResults.forEach(({ level, addresses }) => {
        levels[`L${level}`] = addresses;
      });

      let teamVolumeSummary = null;
      if (oceanQuery) {
        try {
          const raw = await oceanQuery.methods.getTeamVolume(userAddress).call();
          const pick = (record, key, index) => {
            if (!record) return "0";
            if (record[key] != null) return record[key];
            if (record[index] != null) return record[index];
            return "0";
          };
          teamVolumeSummary = {
            qualifiedUsd: formatTeamVolume(fromWadToUsd(pick(raw, "qualifiedUSD", 0))),
            leg1Usd: formatTeamVolume(fromWadToUsd(pick(raw, "L1", 1))),
            leg2Usd: formatTeamVolume(fromWadToUsd(pick(raw, "L2", 2))),
            legRestUsd: formatTeamVolume(fromWadToUsd(pick(raw, "Lrest", 3))),
          };
        } catch (err) {
          console.warn("OceanQuery.getTeamVolume failed:", err);
        }
      }

      const detailAddresses = directAddresses.slice(0, detailLimit);
      const detailPromises = detailAddresses.map(async (addr) => {
        const safeCall = (promise, label) =>
          promise.catch((err) => {
            console.warn(`${label} failed for ${addr}:`, err);
            return null;
          });

        const userPromise = safeCall(
          userRegistry.methods.getUser(addr).call(),
          "UserRegistry.getUser"
        );

        const incomePromise =
          incomeDistributor
            ? safeCall(
              incomeDistributor.methods
                .getDirectIncomeSummary(addr)
                .call(),
              "IncomeDistributor.getDirectIncomeSummary"
            )
            : Promise.resolve(null);

        const teamVolumePromise =
          oceanQuery
            ? safeCall(
              oceanQuery.methods.getTeamVolume(addr).call(),
              "OceanQuery.getTeamVolume"
            )
            : Promise.resolve(null);

        const stakePromise =
          oceanQuery
            ? safeCall(
              oceanQuery.methods.getTotalStakedAmount(addr).call(),
              "OceanQuery.getTotalStakedAmount"
            )
            : Promise.resolve(null);

        const [info, incomeRaw, teamVolumeRaw, stakeRaw] = await Promise.all([
          userPromise,
          incomePromise,
          teamVolumePromise,
          stakePromise,
        ]);

        const pickField = (record, key, index) => {
          if (!record) return null;
          if (record[key] != null) return record[key];
          if (Array.isArray(record) && record[index] != null) return record[index];
          return null;
        };

        const directsCount = toNumber(pickField(info, "directsCount", 3));
        const createdAt = toNumber(pickField(info, "createdAt", 4));

        const lifetimeUsd = incomeRaw
          ? fromWadToUsd(pickField(incomeRaw, "lifetimeUsd", 1) ?? 0)
          : null;
        const lifetimeRama = incomeRaw
          ? fromWeiToRama(pickField(incomeRaw, "lifetimeRama", 2) ?? 0)
          : null;
        const claimableRama = incomeRaw
          ? fromWeiToRama(pickField(incomeRaw, "claimableRama", 3) ?? 0)
          : null;

        const teamVolume = teamVolumeRaw
          ? {
            qualifiedUsd: formatTeamVolume(
              fromWadToUsd(pickField(teamVolumeRaw, "qualifiedUSD", 0))
            ),
            leg1Usd: formatTeamVolume(
              fromWadToUsd(pickField(teamVolumeRaw, "L1", 1))
            ),
            leg2Usd: formatTeamVolume(
              fromWadToUsd(pickField(teamVolumeRaw, "L2", 2))
            ),
            legRestUsd: formatTeamVolume(
              fromWadToUsd(pickField(teamVolumeRaw, "Lrest", 3))
            ),
          }
          : null;

        let stakeUsd = null;
        let stakeRama = null;
        if (stakeRaw) {
          const totalUsdMicro = pickField(stakeRaw, "totalUsdMicro", 1);
          const totalRamaWei = pickField(stakeRaw, "totalRamaWei", 0);
          stakeUsd =
            totalUsdMicro != null
              ? fromMicroUSD(totalUsdMicro)
              : stakeRaw?.[1]
                ? fromMicroUSD(stakeRaw[1])
                : null;
          stakeRama =
            totalRamaWei != null
              ? fromWeiToRama(totalRamaWei)
              : stakeRaw?.[0]
                ? fromWeiToRama(stakeRaw[0])
                : null;
        }

        return {
          address: addr,
          directs: directsCount,
          joinedAt: createdAt ? new Date(createdAt * 1000) : null,
          registered: Boolean(pickField(info, "registered", 0)),
          id: toNumber(pickField(info, "id", 1)),
          sponsor: pickField(info, "referrer", 2),
          summary: {
            lifetimeUsd,
            lifetimeRama,
            claimableRama,
          },
          stake: {
            usd: stakeUsd,
            rama: stakeRama,
          },
          teamVolume,
        };
      });
      const directMembers = await Promise.all(detailPromises);

      let directIncomeSummary = null;
      if (incomeDistributor) {
        try {
          const summaryRaw = await incomeDistributor.methods
            .getDirectIncomeSummary(userAddress)
            .call();
          const pick = (record, key, index) => {
            if (!record) return "0";
            if (record[key] != null) return record[key];
            if (record[index] != null) return record[index];
            return "0";
          };
          const entries = toNumber(pick(summaryRaw, "entries", 0));
          const lifetimeUsdWad = pick(summaryRaw, "lifetimeUsd", 1);
          const lifetimeRamaWei = pick(summaryRaw, "lifetimeRama", 2);
          const claimableRamaWei = pick(summaryRaw, "claimableRama", 3);
          directIncomeSummary = {
            entries,
            lifetimeUsd: fromWadToUsd(lifetimeUsdWad),
            lifetimeRama: fromWeiToRama(lifetimeRamaWei),
            claimableRama: fromWeiToRama(claimableRamaWei),
          };
        } catch (err) {
          console.warn("IncomeDistributor.getDirectIncomeSummary failed:", err);
        }
      }

      const directTeamVolumeSum = directMembers.reduce(
        (sum, member) => sum + (member.teamVolume?.qualifiedUsd ?? 0),
        0
      );
      const aggregatedTeamVolumeUsd =
        teamVolumeSummary?.qualifiedUsd ??
        (directTeamVolumeSum > 0 ? directTeamVolumeSum : null);

      return {
        directCount,
        totalTeamSize,
        levels,
        levelCounts,
        directMembers,
        detailLimit,
        detailFetched: directMembers.length,
        directAddresses,
        directIncomeSummary,
        teamVolumeSummary,
        teamVolumeUsd: aggregatedTeamVolumeUsd,
        fetchedAt: Date.now(),
      };
    } catch (error) {
      console.error('getTeamNetworkData error:', error);
      throw error;
    }
  },

  getOneTimeRewardsOverview: async (userAddress) => {
    try {
      if (!userAddress) throw new Error("Missing user address");

      const oceanViewV2 = makeContract(
        OceanViewV2ABI,
        Contract["OceanViewV2"]
      );
      const oceanQuery = makeContract(
        OceanQueryUpgradeableABI,
        Contract["OceanQueryUpgradeable"]
      );
      const rewardVault = makeContract(
        RewardVaultABI,
        Contract["RewardVault"]
      );
      const portfolioManager = makeContract(
        PortFolioManagerABI,
        Contract["PortFolioManager"]
      );

      const todayDayId = Math.floor(Date.now() / 86400000);
      let summary = null;
      if (oceanViewV2) {
        try {
          const dashboardData = await oceanViewV2.methods
            .getDashboardData(userAddress, todayDayId)
            .call();
          summary = dashboardData?.[0] ?? null;
        } catch (err) {
          console.warn("OceanViewV2.getDashboardData (rewards) failed:", err);
        }
      }

      const [
        claimedCountRaw,
        pendingRewardRaw,
        userTotalsRaw,
        claimedStatusRaw,
        allMilestonesRaw,
      ] = await Promise.all([
        oceanQuery.methods.getTotalRewardsClaimed(userAddress).call(),
        oceanQuery.methods.getOneTimeRewardIncome(userAddress).call(),
        rewardVault
          ? rewardVault.methods.getUserTotals(userAddress).call()
          : [0, 0],
        rewardVault
          ? rewardVault.methods.getUserMilestoneStatus(userAddress).call()
          : [],
        rewardVault
          ? rewardVault.methods.getAllMilestones().call()
          : [[], []],
      ]);

      console.log(allMilestonesRaw)

      const qualifiedVolumeUsd = summary
        ? fromMicroUSD(summary?.qualifiedVolumeUsdMicro)
        : 0;
      const directs = summary ? toNumber(summary?.directRefs) : 0;

      const claimedCount = toNumber(claimedCountRaw);
      const pendingRewardUsd = fromWadToUsd(pendingRewardRaw);

      let pendingRewardRama = 0;
      if (portfolioManager && pendingRewardRaw && pendingRewardRaw !== "0") {
        try {
          const ramaWei = await portfolioManager.methods
            .getPackageValueInRAMA(pendingRewardRaw)
            .call();
          pendingRewardRama = fromWeiToRama(ramaWei);
        } catch (err) {
          console.warn("One-time reward USD->RAMA conversion failed:", err);
        }
      }

      const totalEarnedUsd = fromWadToUsd(userTotalsRaw?.[0] ?? 0);
      const totalEarnedRama = fromWeiToRama(userTotalsRaw?.[1] ?? 0);

      const thresholdsRaw = allMilestonesRaw?.[0] ?? [];
      const rewardsRaw = allMilestonesRaw?.[1] ?? [];

      let milestones = [];
      if (thresholdsRaw.length && rewardsRaw.length) {
        milestones = thresholdsRaw.map((threshold, idx) => {
          const thresholdUsd = fromWadToUsd(threshold ?? 0);
          const rewardUsd = fromWadToUsd(rewardsRaw[idx] ?? 0);
          const claimed = Boolean(claimedStatusRaw?.[idx]);
          const unlocked = qualifiedVolumeUsd >= thresholdUsd;
          return {
            idx,
            thresholdUsd,
            rewardUsd,
            claimed,
            unlocked,
            claimable: unlocked && !claimed,
          };
        });
      }

      if (!milestones.length) {
        milestones = ONE_TIME_REWARDS_FALLBACK.map((reward, idx) => {
          const thresholdUsd = parseFloat(reward.requiredVolumeUSD) / 1e8;
          const rewardUsd = parseFloat(reward.rewardUSD) / 1e8;
          const claimed = Boolean(claimedStatusRaw?.[idx]);
          const unlocked = qualifiedVolumeUsd >= thresholdUsd;
          return {
            idx,
            thresholdUsd,
            rewardUsd,
            claimed,
            unlocked,
            claimable: unlocked && !claimed,
          };
        });
      }

      const claimedMilestones = milestones.filter((m) => m.claimed).length;
      const remainingUsd = milestones
        .filter((m) => !m.claimed)
        .reduce((sum, m) => sum + (m.rewardUsd ?? 0), 0);

      return {
        claimedCount: claimedMilestones || claimedCount,
        totalEarnedUsd,
        totalEarnedRama,
        pendingRewardUsd,
        pendingRewardRama,
        qualifiedVolumeUsd,
        directs,
        milestones,
        remainingUsd,
      };
    } catch (error) {
      console.error("getOneTimeRewardsOverview error:", error);
      throw error;
    }
  },

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



}));
