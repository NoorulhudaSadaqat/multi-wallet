import { useWeb3Modal } from "@web3modal/react";
import { useEffect, useState } from "react";
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { ethers } from "ethers";
import { useConnectWalletHook } from "../hooks/useConnectWallet";

const WalletButtons = () => {
  const { connectWithMetaMask, connectWithWalletConnect } =
    useConnectWalletHook();
  const [loading, setLoading] = useState(false);
  const { open } = useWeb3Modal();
  const { isConnected, address } = useAccount();
  const [walletAddress, setWalletAddress] = useState(null);
  const { disconnect } = useDisconnect();
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

  useEffect(() => {
    if (address) {
      setWalletAddress(address);
    }
  }, [address]);

  return (
    !loading && (
      <>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button className="wallet-button" onClick={()=>connectWithMetaMask(setWalletAddress)}>
            Connect with MetaMask
          </button>
          <button
            className="wallet-button"
            onClick={() => connectWithWalletConnect(open)}
          >
            Connect with Wallet Connect
          </button>
        </div>
        <br />
        {walletAddress && <span>Connected Wallet: {walletAddress}</span>}
        {chain && <div>Using {chain.name}</div>}
      </>
    )
  );
};

export default WalletButtons;
