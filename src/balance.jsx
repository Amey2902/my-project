
import { useState, useEffect } from "react";
import { ethers } from "ethers";

const Balance = ({ account }) => {
  const [balance, setBalance] = useState("");

  useEffect(() => {
    const getBalance = async () => {
      if (!account || typeof window.ethereum === "undefined") return;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const rawBalance = await provider.getBalance(account);
      setBalance(ethers.utils.formatEther(rawBalance));
    };

    getBalance().catch(console.error);
  }, [account]);

  if (!balance) {
    return <p>Loading...</p>;
  }

  return <p><strong>Your Balance:</strong> {balance} ETH</p>;
};

export default Balance;
