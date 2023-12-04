// Networks that have to be added in Matamask
import { chains } from "./chains";
export const networks: any = {

  [chains.POLYGON]: {
    chainId: parseInt(process.env.NEXT_PUBLIC_MATIC_CHAIN_ID!),
    chainName: process.env.NEXT_PUBLIC_MATIC_CHAIN_NAME,
    rpcUrl: [process.env.NEXT_PUBLIC_MATIC_RPC_URL],
    name: process.env.NEXT_PUBLIC_MATIC_NAME,
    symbol: process.env.NEXT_PUBLIC_MATIC_SYMBOL,
    decimals: parseInt(process.env.NEXT_PUBLIC_MATIC_DECIMAL!),
    blockExplorerUrls: [process.env.NEXT_PUBLIC_MATIC_BLOCK_EXPLORER_URL],
  },
  ["MATIC"]: {
    chainId: parseInt(process.env.NEXT_PUBLIC_MATIC_CHAIN_ID!),
    chainName: process.env.NEXT_PUBLIC_MATIC_CHAIN_NAME,
    rpcUrl: [process.env.NEXT_PUBLIC_MATIC_RPC_URL],
    name: process.env.NEXT_PUBLIC_MATIC_NAME,
    symbol: process.env.NEXT_PUBLIC_MATIC_SYMBOL,
    decimals: parseInt(process.env.NEXT_PUBLIC_MATIC_DECIMAL!),
    blockExplorerUrls: [process.env.NEXT_PUBLIC_MATIC_BLOCK_EXPLORER_URL],
  }
};
