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
import {useState, useEffect} from "react"
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { getAccount } from '@wagmi/core'
import {bsc, bscTestnet} from "wagmi/chains";


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
  const [connectedAccount, setConnectedAccount] = useState()
  const [connectedAddress, setConnectedAddress] = useState()
  const [address, setAddress] = useState(true)
  const tokenAddress = " 0x1bd5138277734c20b88C24955CfFf0660f964216"
  const stakeFactoryAddress = "0x06280B430BAFB859D3a764eEe593A08b8377579d"
  
  useEffect(() => {    
      getConnectedAccount()   
    if(connectedAccount){   
      console.log(connectedAccount)
      getConnectedAddress()
      console.log(connectedAddress)
    }
  })

  function setView(){
    setAddress(!address)
  }

  function getConnectedAccount(){
    if(!connectedAccount){
      let account = getAccount()
      setConnectedAccount(account)    
    }  
  }
  
  function getConnectedAddress(){
    let accAdd = connectedAccount.address
    setConnectedAddress(accAdd)
  }

  if(address){

  return (
    <>
    <NextUIProvider theme={darkTheme}>
      <WagmiConfig client={wagmiClient}>
      <Web3Modal projectId={process.env.REACT_APP_WALLETCONNET_ID} ethereumClient={ethereumClient} />
        <div><ConnectButton /></div>
        <button onClick={() => setView()}>Change View</button>
        <StakedUserView />
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
          <NewUserView factoryAddress={stakeFactoryAddress}/>
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
