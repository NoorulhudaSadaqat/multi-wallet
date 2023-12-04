export const useConnectWalletHook = () => {
  const connectWithMetaMask = async (setWalletAddress) => {
    console.log("connecting to metamask")
    if (window.ethereum) {
      let accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
        params: [{ chainId: "0x13881" }],
      });
      console.log("accounts : ", accounts)
      if (accounts[0]) {
        console.log("accounts ; ")
        const wallet=accounts[0];
        setWalletAddress(wallet);
      }
    } else {
      console.log("Please install Mask")
      alert("Please install Mask");
    }
  };

  const connectWithWalletConnect = async (open) => {
    const provider = window?.ethereum;
    console.log("provider", provider);
    open();
  };
  return {connectWithMetaMask, connectWithWalletConnect}
};
