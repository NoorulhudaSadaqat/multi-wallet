import { useEffect } from "react";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useDisconnect } from "wagmi";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { getAccount, fetchBalance, switchNetwork } from "@wagmi/core";
import { useDispatch, useSelector } from "react-redux";
import {
  connectWallet,
  connectWalletError,
  authUser,
  connectingWallet,
  disconectWallet,
  connectedProvider,
} from "@/redux/slices/authSlice";
import {  chainsCodes } from "./chains";
import { networks } from "./network";
import { CustomToast } from "@/utils/toast";
import { availableWallets } from "@/enums/availableWallets";
import { ethers, utils } from "ethers";
import { getCoinBaseProvider, useConnectCoinbaseWallet } from "./useCoinbaseHandler";
import { getMetaMaskProvider } from "./useMetamaskHandler";
import { getBitKeepProvider } from "./useBitKeepHandler";


// custome Hook to Connect with Wallet
export const useConnectWallet = () => {

  const dispatch = useDispatch();
  const { chain } = useNetwork();
  const {
    data,
    chains,
    error,
    pendingChainId,
    status,
    switchNetwork,
    switchNetworkAsync,
  } = useSwitchNetwork();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const {isConnected} = useAccount()
  const address = getAccount().address;

  const connectWalletHandler = async () => {
    try {
      await open();
    } catch (error) {
      CustomToast.fire({ icon: "error", title: "Connection Error" });
      // toast.error(error || error.toString());
      dispatch(connectingWallet(false));
      dispatch(connectWalletError(error));
      // @ts-ignore
      dispatch(disconectWallet());
      disconnect();
    }
  };
  const disconnectWallet = () => {

    // @ts-ignore
    dispatch(connectedProvider({provider: ""}))
    // @ts-ignore
    dispatch(disconectWallet());
    disconnect();
    window.location.reload()

  };
  const handleMaintainWalletData = async (chain) => {
    try {
      if (address) {
        const balance = await fetchBalance({
          address: address,
        });
        dispatch(
          connectWallet({
            address: [address],
            chainId: chain.id,
            balance: balance.formatted,
            // chain: chainsCodes[chain?.id!],
          })
        );
        // @ts-ignore
        dispatch(connectedProvider({provider: availableWallets.WALLET_CONNECT}))
        CustomToast.fire({
          icon: "success",
          title: `Wallet Connected`,
        });
      }
    } catch (error) {
      CustomToast.fire({ icon: "error", title: "Connection Error" });
      // toast.error(error || error.toString());
      dispatch(connectingWallet(false));
      dispatch(connectWalletError(error));
      // @ts-ignore
      dispatch(disconectWallet());
      disconnect();
    }
  };
  const handleSwitchChain = async (id) => {
    try {
      let res = await switchNetworkAsync(id);
    } catch (error) {
      // CustomToast.fire({ icon: "error", title: "Please switch network" });
      handleSwitchChain(id);
    }
  };
  useEffect(() => {
    if (chain) {
      let allowedChains = chains?.map((chain) => chain.id);
      if (chain?.id && !allowedChains.includes(chain?.id)) {
        handleSwitchChain(chains[0].id);
      }
      handleMaintainWalletData(chain);
    }
  }, [chain, address]);

  return { connectWalletHandler, disconnectWallet, chain , isConnected};
};
// custome Hook to Disconnect Wallet From DAPP
export const useWalletDisconnect = () => {
  const dispatch = useDispatch();
  const { disconnect: actualDisconnect } = useDisconnect();
  const disconnect = () => {
    actualDisconnect()
    // @ts-ignore
    dispatch(disconectWallet());
  };
  return [disconnect];
};
// custome Hook to get current connected Wallet Address
export const useGetWalletAddress = () => {
  const { walletAddress, balance, chain } = useSelector(authUser);
  return [walletAddress, balance, chain];
};

// custome Hook to get current chain Id
export const useGetCurrentChainId = () => {
  const { chainId } = useSelector(authUser);
  return [chainId];
};

export const useSwitchAddChainHandler = () => {
  const dispatch = useDispatch()

  const { chain: walletConnectChain } = useNetwork();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const {isConnected} = useAccount()
  const address = getAccount().address;
    const switchAddChainHandler = async (chain, walletProvider)=>{
      if(availableWallets.COINBASE === walletProvider){
        let coinBaseProvider = getCoinBaseProvider("Wallet Handler CB");
        if(!coinBaseProvider){
          CustomToast.fire({ icon: "error", title: `Please Install Coinbase Wallet` });
          return {
              success: false
          }
        }
        try {
          await coinBaseProvider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: utils.hexValue(networks[chain].chainId) }],
          });
          await handleUpdateWalletState(coinBaseProvider, walletProvider)
          return {
            success: true,
            status: "SWITCHED",
          };
        } catch (error) {
          console.log("COinbase switch error", error)
          if (error.code === 4902) {
            try {
              await coinBaseProvider.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    rpcUrls: networks[chain].rpcUrl,
                    chainId: utils.hexValue(networks[chain].chainId), // Mumbai network ID
                    chainName: networks[chain].chainName,
                    nativeCurrency: {
                      name: networks[chain].name,
                      symbol: networks[chain].symbol,
                      decimals: 18,
                    },
                  },
                ],
              });
          await handleUpdateWalletState(coinBaseProvider, walletProvider)
              return {
                success: true,
                status: "ADDED",
              };
            } catch (err) {
              return {
                success: false,
                msg:
                  err.reason ||
                  err.message ||
                  err.data.message ||
                  "Something went wrong",
              };
            }
          }
          return {
            success: false,
            msg:
              error.reason ||
              error.message ||
              error.data.message ||
              "Something went wrong",
          };
        }
      }else if(availableWallets.METAMASK === walletProvider){
        let metaMaskProvider = getMetaMaskProvider("Wallet Handler MM");
        if(!metaMaskProvider){
          CustomToast.fire({ icon: "error", title: `Please Install Metamask Wallet` });
          return {
              success: false
          }
        }
        try {
          await metaMaskProvider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: utils.hexValue(networks[chain].chainId) }],
          });
          await handleUpdateWalletState(metaMaskProvider, walletProvider)
          return {
            success: true,
            status: "SWITCHED",
          };
        } catch (error) {
          console.log("MetaMask switch error", error)
          if (error.code === 4902) {
            try {
              await metaMaskProvider.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    rpcUrls: networks[chain].rpcUrl,
                    chainId: utils.hexValue(networks[chain].chainId), // Mumbai network ID
                    chainName: networks[chain].chainName,
                    nativeCurrency: {
                      name: networks[chain].name,
                      symbol: networks[chain].symbol,
                      decimals: 18,
                    },
                  },
                ],
              });
          await handleUpdateWalletState(metaMaskProvider, walletProvider)
              return {
                success: true,
                status: "ADDED",
              };
            } catch (err) {
              return {
                success: false,
                msg:
                  err.reason ||
                  err.message ||
                  err.data.message ||
                  "Something went wrong",
              };
            }
          }
          return {
            success: false,
            msg:
              error.reason ||
              error.message ||
              error.data.message ||
              "Something went wrong",
          };
        }
      }
      else if(availableWallets.BITKEEP === walletProvider){
        let bitKeepProvider = getBitKeepProvider("Wallet Handler Bitkeep");
        if(!bitKeepProvider){
          CustomToast.fire({ icon: "error", title: `Please Install Bitkeep Wallet` });
          return {
              success: false
          }
        }
        try {
          await bitKeepProvider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: utils.hexValue(networks[chain].chainId) }],
          });
          await handleUpdateWalletState(bitKeepProvider, walletProvider)

          return {
            success: true,
            status: "SWITCHED",
          };
        } catch (error) {
          console.log("MetaMask switch error", error)
          if (error.code === 4902) {
            try {
              await bitKeepProvider.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    rpcUrls: networks[chain].rpcUrl,
                    chainId: utils.hexValue(networks[chain].chainId), // Mumbai network ID
                    chainName: networks[chain].chainName,
                    nativeCurrency: {
                      name: networks[chain].name,
                      symbol: networks[chain].symbol,
                      decimals: 18,
                    },
                  },
                ],
              });
          await handleUpdateWalletState(bitKeepProvider, walletProvider)
              return {
                success: true,
                status: "ADDED",
              };
            } catch (err) {
              return {
                success: false,
                msg:
                  err.reason ||
                  err.message ||
                  err.data.message ||
                  "Something went wrong",
              };
            }
          }
          return {
            success: false,
            msg:
              error.reason ||
              error.message ||
              error.data.message ||
              "Something went wrong",
          };
        }
      }
      else if(availableWallets.WALLET_CONNECT === walletProvider){
        try {
          const network = await switchNetwork({
            chainId: +networks[chain].chainId})
          handleMaintainWalletData(walletConnectChain)
          return {
            success: true,
            status: "SWITCHED",
          };
        } catch (error) {
          return {
            success: false,
            msg:
              error?.reason ||
              error?.message ||
              error?.data.message ||
              "Something went wrong",
          };
        }
      }else{
        return {
          success: false,
          status: "Error in switching",
        };
      }
    }
    const handleUpdateWalletState = async (walletProvider, wallet) => {
      const provider = new ethers.providers.Web3Provider(walletProvider, "any");  
      dispatch(connectingWallet(true));
      const network = await provider.getNetwork();
      const chainId = network.chainId;
      const chainName = chainsCodes[chainId];
        walletProvider
        .request({ method: "eth_requestAccounts" })
        .then(async (result) => {
          const balance = await walletProvider.request({
            method: "eth_getBalance",
            params: [result[0], "latest"],
          });
          let balanceInWei = parseInt(balance, 16);
          const balanceInEth = ethers.utils.formatEther(balanceInWei.toString());
          // @ts-ignore
          dispatch(connectedProvider({ provider: wallet }));
          dispatch(
            connectWallet({
              address: result,
              chainId,
              balance: balanceInEth,
              chain: chainsCodes[chainId],
            })
          );
        })
    }
    const handleMaintainWalletData = async (chain) => {
      try {
        if (address) {
          const balance = await fetchBalance({
            address: address,
          });
          dispatch(
            connectWallet({
              address: [address],
              chainId: chain.id,
              balance: balance.formatted,
              // chain: chainsCodes[chain?.id!],
            })
          );
          // @ts-ignore
          dispatch(connectedProvider({provider: availableWallets.WALLET_CONNECT}))
          CustomToast.fire({
            icon: "success",
            title: `Wallet Connected`,
          });
        }
      } catch (error) {
        CustomToast.fire({ icon: "error", title: "Connection Error" });
        // toast.error(error || error.toString());
        dispatch(connectingWallet(false));
        dispatch(connectWalletError(error));
        // @ts-ignore
        dispatch(disconectWallet());
        disconnect();
      }
    };
    return {switchAddChainHandler}
};