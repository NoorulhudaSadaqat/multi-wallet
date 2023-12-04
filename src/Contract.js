import { ethers } from 'ethers';
import contractABI from './ContractABI.json'; 
import { getEthersProvider, getEthersSigner } from './hooks/useEthersAdapter';
import { Buffer } from 'buffer';


const contractAddress = "0x9dB30DD62FBC87A40D35Dc52E0e10D148e128aAc";
const nftMetadata = {
  name: "My Test NFT",
  description: "This is a test NFT",
  image: "https://unsplash.com/photos/a-steering-wheel-and-dashboard-of-a-car-FPzfl_8cRho", 
};

const uri = `data:application/json;base64,${Buffer.from(
  JSON.stringify(nftMetadata)
).toString("base64")}`;

export const getContractInstance = (signerOrProvider) => {
    return new ethers.Contract(contractAddress, contractABI, signerOrProvider);
};

export const Mint = async () => {
    if (!window.ethereum) {
      return alert("Please install wallet");
    }
    try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const provider = getEthersProvider(); 
        if (!provider) {
            throw new Error('No Ethereum provider available. Please connect a wallet.');
        }
        // const network = await provider.getNetwork();
        // const chainId = network.chainId;
        const signer = await getEthersSigner({ chainId });
        if (!signer) {
            throw new Error('No Ethereum signer available. Please connect a wallet.');
        }
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

    //   const signer = await provider.getSigner();
    //   const contract = new ethers.Contract(
    //     contractAddress,
    //     contractABI,
    //     signer
    //   );

      const toAddress = await signer.getAddress(); 
      const tokenId = 1; 
      const tx = await contract.mintNft(toAddress, tokenId, uri);
      console.log("Transaction Hash:", tx.hash);
    } catch (error) {
      console.error(error);
    }
  };