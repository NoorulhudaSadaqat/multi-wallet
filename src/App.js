import { useEffect, useState } from "react";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  polygonMumbai,
  polygon
} from "wagmi/chains";
import WalletButtons from './components/WalletButtons';
import MintButton from "./components/MintButton";
 
const projectId = "0da20b565eb4ec5fd3a87eb3717615df";

// 2. Configure wagmi client
const chains = [polygonMumbai, polygon];

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: false,
  connectors: w3mConnectors({ chains, projectId }),
  publicClient,
});

// 3. Configure modal ethereum client
const ethereumClient = new EthereumClient(wagmiConfig, chains);

function App() {
  return (
    <>
     (
        <WagmiConfig config={wagmiConfig}>
          <WalletButtons />
          <MintButton/>
        </WagmiConfig>
      ) 

      <Web3Modal
        projectId={"0da20b565eb4ec5fd3a87eb3717615df"}
        ethereumClient={ethereumClient}
        enableExplorer={true}
      />
    </>
  );
}

export default App;
