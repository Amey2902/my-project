import React, { useState } from "react";
import "./App.css"
import { ethers } from "ethers";
import Balance from "./balance";
function App()
{
    const [amount,setAmount] = useState("");
    const [account, setAccount] = useState(null);
    const [contractBalance, setContractBalance] = useState("0");
    const [depositHistory, setDepositHistory] = useState([]);
    const [withdrawHistory, setWithdrawHistory] = useState([]);
    const [connect, setConnect] = useState(false);
  

   const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";

   const abi = [{
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalanceCont",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }],
    "name": "withdrawAmt",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

    function updateAmount(event) {
            setAmount(event.target.value);
          }


    async function connectWallet()
        {
            if (window.ethereum){
                try{
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            console.log("Connected Address:", address);
             setAccount(address); 
             setConnect(true);


           
            const bal = await provider.getBalance(contractAddress) //balance in wei
            const balance = ethers.utils.formatEther(bal) 
            console.log("Contract Balance:", balance);
            setContractBalance(balance);
           } catch(err){
            console.error("Wallet connection error:", err);
           }
        }
           else {
           alert("MetaMask is not installed!");
        }
    
    }
    async function handleWithdraw() {
  if (!amount || isNaN(amount)) return alert("Enter a valid amount");

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const userBalance = await signer.getBalance();
    const weiAmount = ethers.utils.parseEther(amount);

    if (userBalance.lt(weiAmount)) {
      return alert("You don't have enough Ether to withdraw that amount.");
    }

    const contract = new ethers.Contract(contractAddress, abi, signer);
    const tx = await contract.withdrawAmt(weiAmount);
    await tx.wait();

    alert("Withdrawal successful");

    const updatedBal = await provider.getBalance(contractAddress);
    setContractBalance(ethers.utils.formatEther(updatedBal));
    setWithdrawHistory(prev => [...prev, `Withdrew ${amount} ETH`]);
    setAmount("");
  } catch (error) {
    console.error("Withdraw error:", error);
  }
}

 async function handleDeposit() {
  if (!amount || isNaN(amount)) return alert("Enter a valid amount");

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const userBalance = await signer.getBalance();
    const weiAmount = ethers.utils.parseEther(amount);

    if (userBalance.lt(weiAmount)) {
      return alert(" You don't have enough Ether to deposit that amount.");
    }

    const contract = new ethers.Contract(contractAddress, abi, signer);
    const tx = await contract.deposit({ value: weiAmount });
    await tx.wait();

    alert("Deposit successful");

    const updatedBal = await provider.getBalance(contractAddress);
    setContractBalance(ethers.utils.formatEther(updatedBal));
    setDepositHistory(prev => [...prev, `Deposited ${amount} ETH`]);
    setAmount("");
  } catch (error) {
    console.error("Deposit error:", error);
  }
}

    return(

        <div className="app-container">
            <div className="card">
                 <h2> {'\uD83E\uDD8A'} DeFi dApp</h2>
                <p>Solidity Based Defi Contract</p>
            </div>
         
           <button className="btn Metamask" onClick={connectWallet} disabled={connect}>
              {'\uD83E\uDD8A'} Connect with MetaMask
           </button>

           
          <div className="wallet-info">
         <p>Connected Account: <span className="faded">
             {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Not connected"}</span></p>
         <p>Contract Balance: <strong> {contractBalance} ETH</strong></p>
         </div>
          
           <div className="smtLogic">
            <h3>Smart Contract Interface</h3>
             <label htmlFor="amount" className="amount-label">{'\uD83D\uDCB0'}Enter Amount:</label>
            <input type="number" placeholder="Enter amount eg.0.5" id="amount"  value={amount}
           onChange={updateAmount}/> 
           </div>

        
           <div className="balance-card">
           <h4>{'\uD83D\uDCB0'}Your ETH Balance</h4>
           <p> <Balance account={account} /></p>
           </div>
<div className="history-card">
  <h4>📈 Deposit History</h4>
  <ul>
    {depositHistory.length === 0 ? (
      <li>No deposits yet</li>
    ) : (
      depositHistory.map((tx, index) => <li key={index}>{tx}</li>)
    )}
  </ul>

  <h4>📉 Withdraw History</h4>
  <ul>
    {withdrawHistory.length === 0 ? (
      <li>No withdrawals yet</li>
    ) : (
      withdrawHistory.map((tx, index) => <li key={index}>{tx}</li>)
    )}
  </ul>
</div>
           <button className="depo" onClick={handleDeposit}>{'\u2B06\uFE0F'}Deposit</button>
           <button className="depo2" onClick={handleWithdraw}>{'\u2B07\uFE0F'} Withdraw</button>   
        </div>
    )
}
export default App;
