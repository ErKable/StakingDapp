import './App.css';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { NextUIProvider } from '@nextui-org/react';
import { createTheme } from "@nextui-org/react"
import { ConnectButton} from './components';
import { StakedUserView, NewUserView } from './views';
import { useState, useEffect } from "react"
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { getAccount, fetchSigner } from '@wagmi/core'
import {bsc, bscTestnet} from "wagmi/chains";
import { ethers } from "ethers";

const chains = [bscTestnet];

// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: process.env.REACT_APP_WALLETCONNET_ID }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    projectId: process.env.REACT_APP_WALLETCONNET_ID,
    version: "1", // or "2"
    appName: "srtaking",
    chains,
  }),
  provider,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);



const darkTheme = createTheme({
  type: 'dark',  
});


function App() {
  const [call, setCall] = useState(true)
  const [userSigner, setUserSigner] = useState()
  const [connectedAccount, setConnectedAccount] = useState()
  const [connectedAddress, setConnectedAddress] = useState()
  const [address, setAddress] = useState(true)
  const [stakingAddress, setStakingAddress] = useState()
  const tokenAddress = "0x21836a89de0D420a2251b8Cf2A40c393E80e0e1F"
  const factoryAddress = "0x81Eb97d54bF7Cc520bE5da7Add75b48eA2836c3e"
  const factoryAbi = require('./abi/stakingFactory.json')
 
  useEffect(() => {
    setCall(false)
   }, [])


  useEffect(() => { 
    //if(call){  
      console.log("ma tu spammi merda?") 

      getConnectedAccount()  
      if(connectedAccount){
        getConnectedAddress()
        getSigner()
        if(!userSigner){
          setCall(!call)
        }
      } 
    
  },[call])

  useEffect(() => {
    if(userSigner){
      getStakingAddress()
    }
    
  }, [userSigner])

  function setView(){
    setAddress(!address)
  }

  function getConnectedAccount(){
      let account = getAccount()
      //console.log(account,"fdfdfdfd")
      setConnectedAccount(account)    
    
  }
  
  function getConnectedAddress(){
    let accAdd = connectedAccount.address
    setConnectedAddress(accAdd)
  }

  async function getSigner(){
    let signer = await fetchSigner(bscTestnet.id)
    console.log("dioputtana", signer)
    setUserSigner(signer)
  }

  async function getStakingAddress(){
    const factory = new ethers.Contract(factoryAddress, factoryAbi, userSigner)
    let stakingAddress = await factory.userStaking(connectedAddress)
    console.log('Staking address', stakingAddress)
    setStakingAddress(stakingAddress)
  }
  //console.log('signer',userSigner)
  if(stakingAddress){

  return (
    <>
    <NextUIProvider theme={darkTheme}>
      <WagmiConfig client={wagmiClient}>
      <Web3Modal projectId={process.env.REACT_APP_WALLETCONNET_ID} ethereumClient={ethereumClient} />
        <div><ConnectButton /></div>
        <button onClick={() => setView()}>Change View</button>
        <StakedUserView userSigner={userSigner} factoryAddress={factoryAddress}/>
      </WagmiConfig>

      <Web3Modal
        projectId={process.env.REACT_APP_WALLETCONNET_ID}
        ethereumClient={ethereumClient}
      />
    </NextUIProvider>
    </>
  );
  } else {
    return (
      <>
      <NextUIProvider theme={darkTheme}>
        <WagmiConfig client={wagmiClient}>
        <Web3Modal projectId={process.env.REACT_APP_WALLETCONNET_ID} ethereumClient={ethereumClient} />
          <div><ConnectButton /></div>
          <button onClick={() => setView()}>Change View</button>
          <NewUserView factoryAddress={factoryAddress} tokenAddress={tokenAddress} userSigner={userSigner}/>
        </WagmiConfig>
  
        <Web3Modal
          projectId={process.env.REACT_APP_WALLETCONNET_ID}
          ethereumClient={ethereumClient}
        />
      </NextUIProvider>
      </>
      )
  }
}

export default App;
