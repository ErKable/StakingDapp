import './App.css';
import '@rainbow-me/rainbowkit/styles.css';
import { NextUIProvider } from '@nextui-org/react';
import { createTheme } from "@nextui-org/react"
import { StakedUserView, NewUserView } from './views';
import { useState, useEffect  } from "react"
import { useAccount, useProvider, useSigner } from 'wagmi';
import { ethers } from "ethers";
import { Particless } from './components';
const darkTheme = createTheme({
  type: 'dark',  
});


function App() {


  const [priceToken, setPriceToken] = useState(0)
  const [totLock, setTotLock] = useState()
  const [tvl, setTvl] = useState()
  const [triggerStakAdd, setTriggerStakAdd] = useState(true)
  const [stakingAddress, setStakingAddress] = useState()
  const tokenAddress = "0x3F4B6015682732CF8435ce1547378e9f06f79AAE"
  const factoryAddress = "0xF531Bb513FbB8574A7CFD1651dD14d30A4193B4F"
  const factoryAbi = require('./abi/stakingFactory.json')
  let addressZero = '0x0000000000000000000000000000000000000000'
  //const { isConnected, address } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const [isInitialized, setInitialized] = useState(false);
  const { isConnected, address } = useAccount();

  useEffect(() => {
    if (isConnected && signer) {
      (async () => {
        let stakz = await getStakingAddress(signer)
        setStakingAddress(stakz)
        setInitialized(true);
        
      })();
    }else{
      console.log("disconnected",signer)
      setStakingAddress(addressZero)
    }
  }, [isConnected, signer,isInitialized, triggerStakAdd]);


  function triggerStak(){

    setTriggerStakAdd(!triggerStak)
  }

  function fixDecimals( number, decimals ){
    number = number.toString();
    let numberAbs = number.split('.')[0]
    let numberDecimals = number.split('.')[1] ? number.split('.')[1] : '';
    while( numberDecimals.length < decimals ){
        numberDecimals += "0";
    }
    return numberAbs + numberDecimals;
}
  


  async function getStakingAddress(sig){
      const factory = new ethers.Contract(factoryAddress, factoryAbi, sig)
      let stakingAddress = await factory.userStaking(address)
      let totLocked = await factory.totalUserStaked()
      setTotLock(ethers.utils.formatUnits(totLocked,9))
    return stakingAddress    
  }

  if(stakingAddress && stakingAddress != addressZero){

  return (
    <>

    <NextUIProvider theme={darkTheme}>
          <Particless />
        <StakedUserView userSigner={signer} userAddress={address} factoryAddress={factoryAddress}/>
    
    </NextUIProvider>
    
    </>
  );
  } else if(!isConnected || stakingAddress == addressZero) {
    console.log(isConnected,"____",stakingAddress)
    return (
      <>

      <NextUIProvider theme={darkTheme}>
      <Particless />
          <NewUserView factoryAddress={factoryAddress} tokenAddress={tokenAddress} userSigner={signer} trigger={triggerStak}/>
        
      
      </NextUIProvider>
      
      </>
      )
  }
}

export default App;
