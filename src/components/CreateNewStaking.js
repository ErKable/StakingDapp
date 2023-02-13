import { useEffect, useState } from "react"
import TierDropDown from "./TierDropDown"
import "../css/CreateNewStaking.css";
import { Input, Button, Dropdown } from '@nextui-org/react';
import { ethers } from "ethers";


function CreateNewStaking({factoryAddress}){

    const[amountToDeposit, setAmountToDeposit] = useState()
    const[selectedTier, setSelectedTier] = useState()
    const[tiers, setTiers] = useState()
    const factoryAbi = require('../abi/stakingFactory.json')
    const RPC = "https://data-seed-prebsc-1-s3.binance.org:8545/";
    const provider = new ethers.providers.JsonRpcProvider(RPC);
    const tiersArray = []


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

    function getSelectedTier(tierLv){
        setSelectedTier(tierLv)
        console.log('getSelectedTier', selectedTier)
    }

    for(let i = 0; i < tiers+1; i++){
        tiersArray[i] = i+1;
    }

    return(
        <div id="newStak">
            <div id="tierInfos">
                <div className="tierInfo"><p>APY</p></div>
                <div className="tierInfo"><p>LOCKTIME</p></div>
                <div className="tierInfo"><p>REWARD</p></div>
            </div>
            <div id="userSelect">

            <Dropdown color="secondary">
                <Dropdown.Button flat>SELECT TIER</Dropdown.Button>
                <Dropdown.Menu  onAction={(tierId) => {
                    console.log(`onAction tierId value = ${tierId-1}`)
                    //getSelectedTier(tierId-1)
                    console.log(`onAction selectedTier before: ${selectedTier}`)
                    setSelectedTier(Number(tierId - 1))
                    console.log(`onAction selected tier after: ${selectedTier}`)
                    }}>
                {
                     tiersArray.map(tier => {
                        return (
                            <Dropdown.Item key={tier}>{`Tier`+` `+`${tier}`}</Dropdown.Item>
                            );
                    })
                }
      </Dropdown.Menu>
    </Dropdown>

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