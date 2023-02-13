import { useEffect, useState } from "react"
import TierDropDown from "./TierDropDown"
import "../css/CreateNewStaking.css";
import { Input, Button } from '@nextui-org/react';
import { ethers } from "ethers";

function CreateNewStaking({factoryAddress}){

    const[amountToDeposit, setAmountToDeposit] = useState()
    const[tiers, setTiers] = useState()
    const factoryAbi = require('../abi/stakingFactory.json')
    const RPC = "https://data-seed-prebsc-1-s3.binance.org:8545/";
    const provider = new ethers.providers.JsonRpcProvider(RPC);

    useEffect(() => {
        getTiers()
    })

    function getAmountToDeposit(e){
        setAmountToDeposit(e)
    }

    async function getTiers(){
        const factory = new ethers.Contract(factoryAddress, factoryAbi, provider)
        let factoTiers = await factory.apyTiers()
        setTiers(Number(factoTiers))
    }

    return(
        <div id="newStak">
            <div id="tierInfos">
                <div className="tierInfo"><p>APY</p></div>
                <div className="tierInfo"><p>LOCKTIME</p></div>
                <div className="tierInfo"><p>REWARD</p></div>
            </div>
            <div id="userSelect">

            <TierDropDown  tierNumber={tiers}/>

                <Input 
                id="insertAm"
                bordered 
                labelPlaceholder="Amount to deposit" 
                color="secondary" 
                onChange={(e) => getAmountToDeposit(e.target.value)}/>
                <Button auto color="gradient" rounded bordered shadow>DEPOSIT</Button>
            </div>
        </div>
    )
}

export default CreateNewStaking;