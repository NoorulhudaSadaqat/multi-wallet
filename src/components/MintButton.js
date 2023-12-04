import React from 'react';
import { useAccount } from 'wagmi';
import { ethers } from "ethers";
import { Mint } from '../Contract';


const MintButton = () => {
    const { data: accountData } = useAccount();

    return <button onClick={Mint}>Mint Contract</button>;
};
 export default MintButton