import { create } from "zustand";
import Web3, { errors } from "web3";
import Swal from "sweetalert2";
import UserRegistryABI from './Contract_ABI/UserRegistry.json'



const Contract = {
  UserRegistry: "0x10C73CC0249b547402B0532c5c7D1fa52E09b16e",
  CoreConfig: "0xf2Da545c361c42FC540f3F648034448CC64D6b04",
  RoiDistribution: "0x3E69b6b118D1B0c1fb4B8Fe79F32CFBd8C4bC39d",
  PortFolioManager: "0xd5EE95aa4124EF58907085689E7c50d6133e061F",
  RoyaltyManager: "0xC477e36c84ae51586c01E3bb79fDC44E919Ecf27",
  SlabManager: "0x2182fcA6577A678D6ea691faA0b2Ea8Bea5A0299",
  IncomeDistributor: "0x35785f01c35Bae437Ba091138889E35923E5fd22",
  FreezePolicy: "0xDd09016976B8B5F550984c4B4E1FEAe4B30536e5",
  RewardVault: "0x7c7426325f9334EDBE57BD74b1ac606594d454C5",
  AdminControl: "0xcD8eB92E927Aa9C0DC5e58d8383D4aE211F73f96",
  MainWallet: "0x61d66989f2fA03818Fcf2f4dCb586C17D4fa9c47",
  SafeWallet: "0x6a4a05431A5826fa35A2e9535Da662f47189232f",
};

const INFURA_URL = "https://blockchain.ramestta.com";
const web3 = new Web3(INFURA_URL);


const DEFAULT_DATA = {
  balance: "",
  address: "",
  userId: "",
  isRegistered: false,
  registrationTime: "",
  sponsor: "",
  totalEarningsUSD: 0.00,
  totalEarningsRAMA: 0.00,
  repurchaseCount: 0,
  currentOrbitX: 0,
  orbitCount: 0,
  totalUsers: 0
};


const DEFAULT_ACtiv = {
  requiredRama: '',
  requiredUSD: ''
}






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

  data: { ...DEFAULT_DATA },
  requiredAct: { ...DEFAULT_ACtiv },
  lastFetchedAt: null,
  _reqId: 0, 


  setField: (patch) => set((s) => ({ data: { ...s.data, ...patch } })),
  merge: (patch = {}) => set((s) => ({ ...s, ...patch })),

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

      // --- Gas
      const gasPrice = await web3.eth.getGasPrice(); // string wei
      let gasLimit;

      try {
        gasLimit = await web3.eth.estimateGas({
          from: userAddress,
          to: Contract['BIGBANG_CONTRACT'],
          value: gasPrice,
          data,
        });
      } catch (err) {
        console.error('Gas estimation failed:', err);
        Swal.fire({ icon: 'error', title: 'Gas estimation failed', text: 'Check contract & inputs.' });
        throw err;
      }

      const toHex = web3.utils.toHex;
      const tx = {
        from: userAddress,
        to: Contract['BIGBANG_CONTRACT'],
        data,
        value: toHex(gasPrice),
        gas: toHex(gasLimit),
        gasPrice: toHex(gasPrice),
      };

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


  // getUserDetails: async (userAddress) => {
  //   // bump a request id to ignore stale results in the store update
  //   const reqId = (get()._reqId || 0) + 1;
  //   set({ _reqId: reqId });

  //   try {
  //     if (!userAddress || typeof userAddress !== 'string' || !userAddress.startsWith('0x')) {
  //       throw new Error('Invalid userAddress');
  //     }

  //     const contract = new web3.eth.Contract(BigBang_ABI, Contract['BIGBANG_CONTRACT']);

  //     // Always get balance
  //     const balanceWei = await web3.eth.getBalance(userAddress);
  //     const balanceEth = web3.utils.fromWei(balanceWei, 'ether');

  //     // Quick membership check first (saves RPCs if false)
  //     const isRegistered = await contract.methods.isRegistered(userAddress).call();

  //     // If NOT registered, return a minimal, stable shape and (optionally) update store
  //     if (!isRegistered) {
  //       const result = {
  //         balance: Number(balanceEth).toFixed(4),
  //         address: userAddress,
  //         userId: 0,
  //         isRegistered: false,
  //         registrationTime: null,
  //         sponsor: null,
  //         totalEarningsUSD: 0,
  //         totalEarningsRAMA: 0,
  //         repurchaseCount: 0,
  //         currentOrbitX: 0,
  //         orbitCount: 0,
  //         totalUsers: 0,
  //       };

  //       if (get()._reqId === reqId) {
  //         set({ data: result, lastFetchedAt: new Date().toISOString() });
  //       }
  //       return result;
  //     }

  //     // Registered: fetch details in parallel
  //     const [
  //       userId,
  //       regTime,
  //       upline,
  //       ramaEarnedUSD,
  //       currentOrbitX,
  //       orbitCount,
  //       repurchaseCount,
  //     ] = await Promise.all([
  //       contract.methods.getUserId(userAddress).call(),
  //       contract.methods.registrationTime(userAddress).call(),
  //       contract.methods.upline(userAddress).call(),
  //       contract.methods.getTotalEarnings(userAddress).call(),
  //       contract.methods.getCurrentOrbitX(userAddress).call(),
  //       contract.methods.getOrbitCount(userAddress).call(),
  //       contract.methods.getRepurchaseCount(userAddress).call(),
  //     ]);

  //     // regTime from many contracts is in SECONDS — convert to ms if your formatDate expects ms
  //     const regTimeMs = Number(regTime) < 1e12 ? Number(regTime) * 1000 : Number(regTime);

  //     const userData = {
  //       balance: Number(balanceEth).toFixed(4),
  //       address: userAddress,
  //       userId: Number(userId),
  //       isRegistered: true,
  //       registrationTime: formatDate(regTimeMs),
  //       sponsor: upline,
  //       // adjust divisor to your contract's decimals
  //       totalEarningsUSD: Number(ramaEarnedUSD) / 1e6,
  //       totalEarningsRAMA: 0.0,
  //       repurchaseCount: Number(repurchaseCount),
  //       currentOrbitX: Number(currentOrbitX),
  //       orbitCount: Number(orbitCount),
  //       totalUsers: 0.0,
  //     };

  //     if (get()._reqId === reqId) {
  //       set({ data: userData, lastFetchedAt: new Date().toISOString() });
  //     }

  //     return userData;
  //   } catch (error) {
  //     // DO NOT return false — bubble the error so callers can handle it
  //     if (get()._reqId === reqId) {
  //       console.error('getUserDetails error:', error);
  //     }
  //     throw error;
  //   }
  // },


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

 



}));