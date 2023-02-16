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
import { useState, useEffect, useRef  } from "react"
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { getAccount, fetchSigner } from '@wagmi/core'
import { bsc, bscTestnet} from "wagmi/chains";
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


  const [userSigner, setUserSigner] = useState()
  const [connectedAddress, setConnectedAddress] = useState()
  const [address, setAddress] = useState(true)
  const [stakingAddress, setStakingAddress] = useState()
  const tokenAddress = "0x21836a89de0D420a2251b8Cf2A40c393E80e0e1F"
  const factoryAddress = "0x81Eb97d54bF7Cc520bE5da7Add75b48eA2836c3e"
  const factoryAbi = require('./abi/stakingFactory.json')


  useEffect(() => {
        let tmout = async () => {
          await new Promise(r => setTimeout(r, 2000));
        }
        let sig = () =>{
          tmout().then(()=>{
          let res = fetchSigner(bscTestnet.id).then((r)=>{
            console.log(r,"DIOOO signer")
            setUserSigner(r)
            let accAdd = r.getAddress().then((ad)=>{
              console.log("DIOOO adrs",ad)
              setConnectedAddress(ad)
            })
          })
        })
        }
        let rees = sig()
    }, [])

    useEffect(()=>{
      if(connectedAddress){
        getStakingAddress()
      }
      

    },[connectedAddress])


  


  async function getStakingAddress(){
    if(connectedAddress != "undefined"){
      console.log("quanno entro in call stack", userSigner,connectedAddress)
      const factory = new ethers.Contract(factoryAddress, factoryAbi, userSigner)
      let stakingAddress = await factory.userStaking(connectedAddress)
      console.log('Staking address', stakingAddress)
    setStakingAddress(stakingAddress)
    }else{return}
    
  }
  //console.log('signer',userSigner)
  if(stakingAddress != '0x0000000000000000000000000000000000000000'){

  return (
    <>
    <NextUIProvider theme={darkTheme}>
      <WagmiConfig client={wagmiClient}>
      <Web3Modal projectId={process.env.REACT_APP_WALLETCONNET_ID} ethereumClient={ethereumClient} />
        <div><ConnectButton /></div>
        
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
