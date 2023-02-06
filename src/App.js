import logo from './logo.svg';
import './App.css';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";

import { ConnectButton, Logo, Infos } from './components';

import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import {bsc, bscTestnet} from "wagmi/chains";


const chains = [bsc, bscTestnet];

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

function App() {
  
  return (
    <>
      <WagmiConfig client={wagmiClient}>
      <Web3Modal projectId={process.env.REACT_APP_WALLETCONNET_ID} ethereumClient={ethereumClient} />
        <div><ConnectButton /></div>
        <Logo/>
        <Infos/>
      </WagmiConfig>

      <Web3Modal
        projectId={process.env.REACT_APP_WALLETCONNET_ID}
        ethereumClient={ethereumClient}
      />
    </>
  );
}

export default App;
