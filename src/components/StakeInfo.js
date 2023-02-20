import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Card, Text } from '@nextui-org/react';
import "../css/StakeInfo.css"
import CountUp from 'react-countup';

export default function StakeInfo(){
    const [isPriceSet, setisPriceSet] = useState()
    const [priceToken, setPriceToken] = useState(0)
    const [totLock, setTotLock] = useState()
    const [tvl, setTvl] = useState()
    const [stakingAddress, setStakingAddress] = useState()
    const factoryAddress = "0xF531Bb513FbB8574A7CFD1651dD14d30A4193B4F"
    const factoryAbi = require('../abi/stakingFactory.json')

    useEffect(() => {
        (async () => {            
            await gimmiePrice()            
        })();
        setisPriceSet(false)
    }, [isPriceSet])
    

    async function gimmiePrice(){
        try{
            const mainnetToken = "0xe953ec90533756a478068f0a97b92aa53fc5018b"
            let pancakeSwapAbi =  [
            {"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},
            ];
            let routeradr= "0x10ED43C718714eb63d5aA57B78B54704E256024E"
            const BNBTokenAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" //BNB
            const USDTokenAddress  = "0x55d398326f99059fF775485246999027B3197955" //USDT
            let tempProvider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/bsc")
            let router = new ethers.Contract(routeradr,pancakeSwapAbi,tempProvider)
            let amoutOut = await router.getAmountsOut(ethers.utils.parseEther("1"),[BNBTokenAddress ,USDTokenAddress])
            amoutOut = ethers.utils.formatEther(amoutOut[1])
            let tknAmOut = await router.getAmountsOut("1000000000",[mainnetToken,BNBTokenAddress])
            tknAmOut = ethers.utils.formatEther(tknAmOut[1])
            //console.log("OPREZZZOOOOOOOOOOOOOOOOO",parseFloat(tknAmOut*amoutOut).toFixed(10), "per", parseInt(totLock))
            setPriceToken(parseFloat(tknAmOut*amoutOut).toFixed(10))
          
            let totLockedVal = parseInt(totLock) * parseFloat(tknAmOut*amoutOut)
            //console.log("nduja",parseInt(parseInt(totLock))," per ",parseFloat(tknAmOut*amoutOut)," uguale ",parseInt(totLock) * parseFloat(tknAmOut*amoutOut))
            setTvl(totLockedVal.toFixed(3))
            let tempProv = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s3.binance.org:8545/')
            const factory = new ethers.Contract(factoryAddress, factoryAbi, tempProv)
            let totLocked = await factory.totalUserStaked()
            setTotLock(ethers.utils.formatUnits(totLocked,9))
            if(isNaN(tvl)){
                setisPriceSet(!isPriceSet)
            }
        }catch{}            
      }     
      
        return(
            
        <div id='stakeInfoCont'>
            <div>
            <Text h1
                size={17}
                css={{
                    color: '#1363eb',
                }}
                weight="bold">Price:</Text>
                <Text h1
                size={15}
                css={{
                    color: "#15aeff",
                }}
                weight="bold"><CountUp end={priceToken?priceToken:0} decimals={9} /> $
                </Text>
            </div>

            <div>
            <Text h1
                size={17}
                css={{
                    color: '#1363eb',
                }}
                weight="bold">Total Token Locked:</Text>
                <Text h1
                size={15}
                css={{
                    color: "#15aeff",
                }}
                weight="bold"><CountUp end={totLock?totLock:0} decimals={3} /></Text>
            </div>

            <div>
            <Text h1
                size={17}
                css={{
                    color: '#1363eb',
                }}
                weight="bold">Total Value Locked:</Text>
                <Text h1
                size={15}
                css={{
                    color: "#15aeff",
                }}
                weight="bold"><CountUp end={tvl?tvl:0} decimals={3} /> $</Text>
            
            </div>
        </div>)
}