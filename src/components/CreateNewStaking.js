import { useEffect, useState } from "react"
import TierDropDown from "./TierDropDown"
import Countdown from "./Countdown";
import "../css/CreateNewStaking.css";
import { Input, Button, Dropdown, Card, Text } from '@nextui-org/react';
import { ethers } from "ethers";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

function CreateNewStaking({factoryAddress, tokenAddress, userSigner}){

    const[amountToDeposit, setAmountToDeposit] = useState()
    const[amountToStake, setAmountToStake] = useState()
    const[calculatedReward, setCalculatedReward] = useState()
    const[selectedTier, setSelectedTier] = useState(0)
    const[apyInfo, setApyInfo] = useState()
    const[tiers, setTiers] = useState()
    const tokenAbi = require('../abi/erc20Abu.json')
    const factoryAbi = require('../abi/stakingFactory.json')
    const RPC = "https://data-seed-prebsc-1-s3.binance.org:8545/";
    const provider = new ethers.providers.JsonRpcProvider(RPC);
    const tiersArray = []

    const notyf = new Notyf({
        position: { x: "center", y: "top" },
        duration: 5000,
    });

    useEffect(() => {
        getTiers()
    })

    useEffect(() => {
        getApyInfos()
        getMinimumAmountToStake()
    }, [])

    useEffect(() => {
        getApyInfos()
        if(amountToDeposit){
            getCalculateReward()
        }
    }, [selectedTier])

    useEffect(() => {
        getCalculateReward()
    }, [amountToDeposit])

    for(let i = 0; i < tiers+1; i++){
        tiersArray[i] = i+1;
    }

    function getAmountToDeposit(e){
        setAmountToDeposit(e)
    }

    async function getTiers(){
        const factory = new ethers.Contract(factoryAddress, factoryAbi, provider)
        let factoTiers = await factory.apyTiers()
        setTiers(Number(factoTiers))
    }

    async function getApyInfos(){
        const factory = new ethers.Contract(factoryAddress, factoryAbi, provider)
        let info = await factory.getApyRatios(selectedTier)

        let today = new Date()
        today = today.getTime()        
        let daysLocked = new Date(Number(Number(today) + (Number(info.lockedUntil) * 1000)))        
        
        let infos = {
            apy: Number(info.apy),
            lockedUntil:daysLocked, 
        }
        console.log(infos)
        setApyInfo(infos)
    }

    async function getMinimumAmountToStake(){
        const factory = new ethers.Contract(factoryAddress, factoryAbi, provider)
        let minAmountToS = await factory.minimumAmountToStake()
        //console.log('min', Number(minAmountToS))
        setAmountToStake(Number(minAmountToS))
    }

    async function getCalculateReward(){
        if(amountToDeposit < amountToStake){
            notyf.error('I dont calculate rewards for poor boys')
        } else {
            const factory = new ethers.Contract(factoryAddress, factoryAbi, provider)        
            let calculatedReward = await factory.calculateRewards(amountToDeposit, selectedTier)
            console.log('Calculated rewartd', calculatedReward)
            setCalculatedReward(Number(calculatedReward.rewardAmount))
        }
    }

    async function deposit(){
        if(amountToDeposit < amountToStake){
            notyf.error("Stake more, poor boy")
        } else {
            console.log('HEYYY', userSigner)
            const token = new ethers.Contract(tokenAddress, tokenAbi, userSigner)
            let approve = await token.approve(factoryAddress, (amountToDeposit * 10 ** 9).toString())
            await approve.wait()
            notyf.success('token approved')  
            const factory = new ethers.Contract(factoryAddress, factoryAbi, userSigner)
            let deposit = await factory.createStaking(amountToDeposit, selectedTier)
            await deposit.wait()
            notyf.success('token staked')            
        }
    }

    //console.log((apyInfo.lockedUntil).getTime())
    
    //console.log('Date', new Date(apyInfo.lockedUntil),'dddddddd', new Date(apyInfo.lockedUntil) - new Date()  )



    return(
        <Card id="newStak">
            <div id="tierInfos">
            
                <Card  className="tierInfo">
                    <Card.Body>
                        <Text>APY:<br/> {apyInfo ? apyInfo.apy : "select tier"}</Text>
                    </Card.Body>
                </Card>

                <Card  className="tierInfo">
                    <Card.Body>
                        <Text>LOCK UNTILL <br/>{apyInfo ? new Date(apyInfo.lockedUntil).toDateString() : "select tier"}</Text>
                    </Card.Body>
                </Card>

                <Card  className="tierInfo">
                    <Card.Body>
                        <Text>REWARD <br/> {calculatedReward ? calculatedReward : `Insert amount, cannot stake less than ${amountToStake}`}</Text>
                    </Card.Body>
                </Card>
            </div>
            
            <div id="userSelect">

            <Dropdown color="secondary">
                <Dropdown.Button color='gradient' rounded bordered shadow flat>SELECT TIER</Dropdown.Button>
                <Dropdown.Menu selectionMode='single' onAction={(tierId) => {setSelectedTier(Number(tierId - 1))}}>
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
                onChange={(e) => {console.log(e.target.value)
                    getAmountToDeposit(e.target.value)}}/>
                <Button auto color="gradient" rounded bordered shadow onClick={() => deposit()}>DEPOSIT</Button>
            </div>
        </Card>
    )
}

export default CreateNewStaking;