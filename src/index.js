import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { bsc, bscTestnet} from "wagmi/chains";
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import {
  argentWallet,
  braveWallet,
  imTokenWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  omniWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
  coinbaseWallet
} from '@rainbow-me/rainbowkit/wallets';
const { chains, provider } = configureChains(
  [bscTestnet],
  [alchemyProvider({ apiKey: proces.env.REACT_APP_ALCHEMY_KEY }), publicProvider()]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Inject your wallet',
    wallets: [injectedWallet({ chains })]
  },
  {
    groupName: 'Select your wallet',
    wallets: [
      metaMaskWallet({ chains, shimDisconnect: true }),
      trustWallet({ chains, shimDisconnect: true }),
      coinbaseWallet({ appName: 'King', chains })
    ]
  },
  {
    groupName: 'Others',
    wallets: [
      walletConnectWallet({ chains }),
      ledgerWallet({ chains }),
      braveWallet({ chains }),
      argentWallet({ chains }),
      imTokenWallet({ chains }),
      omniWallet({ chains }),
      rainbowWallet({ chains })
    ]
  }
]);

const wagmiClient = createClient({
  connectors,
  autoConnect: true,
  provider
});

//const ethereumClient = new EthereumClient(wagmiClient, chains);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
      chains={chains}
      appInfo={{
        appName: 'King Pass'
      }}
    >
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </RainbowKitProvider>
  </WagmiConfig>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
