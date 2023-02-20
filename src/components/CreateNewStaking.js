import { useEffect, useState } from "react"
import TierDropDown from "./TierDropDown"
import Countdown from "./Countdown";
import "../css/CreateNewStaking.css";
import { Input, Button, Dropdown, Card, Text } from '@nextui-org/react';
import { ethers } from "ethers";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import StakeInfo from "./StakeInfo";
import { useFeeData } from "wagmi";

function CreateNewStaking({factoryAddress, tokenAddress, userSigner, trigger}){
    const[dontClick, setDontClick] = useState(false)
    const[amountToDeposit, setAmountToDeposit] = useState()
    const[amountToStake, setAmountToStake] = useState()
    const[calculatedReward, setCalculatedReward] = useState()
    const[selectedTier, setSelectedTier] = useState(0)
    const[apyInfo, setApyInfo] = useState()
    const[tiers, setTiers] = useState()
    const[stakTiers, setStakTiers] = useState([])
    const [apys, setApys] = useState([])
    const[days, setDays] = useState([])
    const[bal, setBal] = useState()
    const tokenAdd = "0x3F4B6015682732CF8435ce1547378e9f06f79AAE"
    const tokenAbi = require('../abi/erc20Abu.json')
    const factoryAbi = require('../abi/stakingFactory.json')
    const RPC = "https://data-seed-prebsc-1-s3.binance.org:8545/";
    const provider = new ethers.providers.JsonRpcProvider(RPC);
    const tiersArray = []

    const notyf = new Notyf({
        position: { x: "center", y: "top" },
        duration: 5000,
    });

    useEffect(() =>{
        balanceOf()
    }, [userSigner])
    useEffect(() => {
        getTiers()
    })

    useEffect(() => {
        getApyAndDays()
    }, [tiers])

    useEffect(() => {
        getApyInfos()
        getMinimumAmountToStake()
    }, [])

    useEffect(() => {
        getApyInfos()
        if(amountToDeposit){
            console.log("passi e smani?")
            getCalculateReward()
        }
    }, [selectedTier])

    useEffect(() => {
        if(amountToDeposit){
            getCalculateReward()}
    }, [amountToDeposit])

    for(let i = 0; i < tiers+1; i++){
        tiersArray[i] = i+1;
    }

    function getAmountToDeposit(e){
        setAmountToDeposit(e)
    }

    async function getTiers(){
        try{
            const factory = new ethers.Contract(factoryAddress, factoryAbi, provider)
            let factoTiers = await factory.apyTiers()
            setTiers(Number(factoTiers))
        }catch{}
    }



    async function getApyInfos(){
        try{
            const factory = new ethers.Contract(factoryAddress, factoryAbi, provider)
            let info = await factory.getApyRatios(selectedTier)

            let today = new Date()
            today = today.getTime()        
            let daysLocked = new Date(Number(Number(today) + (Number(info.lockedUntil) * 1000)))        
        
            let infos = {
                apy: Number(info.apy),
                lockedUntil:daysLocked, 
            }
            //console.log(infos)
            setApyInfo(infos)
        }catch{}
    }

    async function getApyAndDays(){
        try{ 
            const factory = new ethers.Contract(factoryAddress, factoryAbi, provider)
             
            let tempTiers = []  
            let tempApy = []
            let tempDay = []        
            for(let i=0; i < tiers + 1; i++){
                let tempTier = await factory.getApyRatios(i)
                let apyInfos = {
                    id: i,
                    apy: Number(tempTier.apy),
                    dayLock: parseInt((tempTier.lockedUntil)/86400),
                }
                tempTiers.push(apyInfos)                
            }
            console.log("TEEEEEEEEMP",tempTiers)
            setStakTiers(tempTiers)
        }catch{}
    }

    async function getMinimumAmountToStake(){
        try{
            const factory = new ethers.Contract(factoryAddress, factoryAbi, provider)
            let minAmountToS = await factory.minimumAmountToStake()
            //console.log('min', Number(minAmountToS))
            setAmountToStake(Number(minAmountToS))
        }catch{}
    }

    async function getCalculateReward(){
        try{
            const factory = new ethers.Contract(factoryAddress, factoryAbi, provider)        
            let calculatedReward = await factory.calculateRewards(amountToDeposit, selectedTier)
            //console.log('Calculated rewartd', calculatedReward)
            setCalculatedReward(ethers.utils.formatUnits(calculatedReward.rewardAmount,9))
        } catch{} 
        
    }

    async function deposit(){
        try{
            //console.log('HEYYY', userSigner)
            
            const token = new ethers.Contract(tokenAdd, tokenAbi, userSigner)
            //console.log("deposit - who - balance", amountToDeposit,userSigner._address, Number(await token.balanceOf(userSigner._address)))
            let allow = await token.allowance(userSigner._address,factoryAddress)
            console.log("prima if allow", allow)
            if(allow < ethers.utils.parseUnits(amountToDeposit,9)){
                console.log("dopo if")
                let approve = await token.approve(factoryAddress, (ethers.utils.parseUnits(amountToDeposit,9)).toString())
                await approve.wait()
                notyf.success('Token approved',amountToDeposit) 
            }
            const factory = new ethers.Contract(factoryAddress, factoryAbi, userSigner)
            let deposit = await factory.createStaking(amountToDeposit, selectedTier)
            setDontClick(true)
            await deposit.wait() 
            notyf.success("Token staked sucessfully")  
            trigger()          
        } catch{
            notyf.error("Something went wrong while depositing")
        }      
    }

    async function balanceOf(){
        try{
            const tok = new ethers.Contract(tokenAdd, tokenAbi, userSigner)
            let balz = await tok.balanceOf(userSigner._address)
            console.log(Number(balz))
            setBal(ethers.utils.formatUnits(balz,9))
        }catch{            
        }
    }
    //console.log((apyInfo.lockedUntil).getTime())
    
    //console.log('Date', new Date(apyInfo.lockedUntil),'dddddddd', new Date(apyInfo.lockedUntil) - new Date()  )


if(!dontClick){
    return(
        <div id="Cont">
        <div id="newStak">

            <div id="tierInfos">
            
                <div  className="tierInfo">
                    {/* <Card.Body> */}
                        <Text css={{color: "#1363eb"}}>APY:</Text><br/> <Text css={{color: "#2d96f2"}}>{apyInfo ? apyInfo.apy : "select tier"}</Text>
                    {/* </Card.Body> */}
                </div>

                <div  className="tierInfo">
                    {/* <Card.Body> */}
                        <Text css={{color: "#1363eb"}}>LOCK UNTILL </Text><br/><Text css={{color: "#2d96f2"}}>{apyInfo ? new Date(apyInfo.lockedUntil).toDateString() : "select tier"}</Text>
                   {/*  </Card.Body> */}
                </div>

                <div  className="tierInfo">
                    {/* <Card.Body> */}
                        <Text css={{color: "#1363eb"}}>REWARD </Text><br/> <Text css={{color: "#2d96f2"}}>{calculatedReward ? Number(calculatedReward).toFixed(3) : `0`}</Text>
                    {/* </Card.Body> */}
                </div>

            </div>
            
            <div id="userSelect">

            <Dropdown color="secondary">
                <Dropdown.Button color='gradient' rounded bordered shadow flat>SELECT TIER</Dropdown.Button>
                <Dropdown.Menu selectionMode='single' onAction={(tierId) => {setSelectedTier(Number(tierId))}}>
                {
                     stakTiers.map((tier) => {
                        return (
                            <Dropdown.Item key={tier.id}>{"Apy: "+ tier.apy +"% / "+" Lock "+tier.dayLock + " Days"}</Dropdown.Item>
                            );
                    })
                }
                </Dropdown.Menu>
            </Dropdown>

                <Input 
                id="insertAm"
                bordered 
                labelPlaceholder="Amount to deposit"
                css={{marginTop: "5%",}} 
                color="primary" 
                onChange={(e) => {console.log("ooooooooooooooooooooooooooooooo",e.target.value)
                    getAmountToDeposit(e.target.value)}}/>
                    <div id="balance">
                    <Text css={{color: "#1363eb"}}>Balance:</Text><Text css={{color: "#2d96f2"}}>{Number(bal)}</Text>
                    </div>
                <Button auto color="gradient" rounded bordered shadow onClick={() => deposit()}>DEPOSIT</Button>
            </div>
        </div>
        </div>
    )
    } else if(dontClick){
        return(
            <div id="Cont">
            <div id="newStak">
                <div id="tierInfos">
                
                    <div  className="tierInfo">
                        {/* <Card.Body> */}
                            <Text>APY:<br/> {apyInfo ? apyInfo.apy : "select tier"}</Text>
                        {/* </Card.Body> */}
                    </div>
    
                    <div  className="tierInfo">
                        {/* <Card.Body> */}
                            <Text>LOCK UNTILL <br/>{apyInfo ? new Date(apyInfo.lockedUntil).toDateString() : "select tier"}</Text>
                        {/* </Card.Body> */}
                    </div>
    
                    <div  className="tierInfo">
                        {/* <Card.Body> */}
                            <Text>REWARD <br/> {calculatedReward ? Number(calculatedReward).toFixed(3) : `0`}</Text>
                        {/* </Card.Body> */}
                    </div>
                </div>
                
                <div id="userSelect">
    
                <Dropdown color="secondary" >
                    <Dropdown.Button color='gradient' rounded bordered shadow flat>SELECT TIER</Dropdown.Button>
                    <Dropdown.Menu selectionMode='single' onAction={(tierId) => {setSelectedTier(Number(tierId))}}>
                    {
                         stakTiers.map((tier) => {
                            return (
                                <Dropdown.Item key={tier.id}>{"Apy: "+ tier.apy +"% / "+" Lock "+tier.dayLock + " Days"}</Dropdown.Item>
                                );
                        })
                    }
                    </Dropdown.Menu>
                </Dropdown>
    
                    <Input 
                    id="insertAm"
                    bordered 
                    labelPlaceholder="Amount to deposit" 
                    color="primary" 
                    css={{marginTop: "5%"}}
                    onChange={(e) => {console.log(e.target.value)
                        getAmountToDeposit(e.target.value)}}/>
                        <div id="balance">
                    <Text css={{color: "#1363eb"}}>Balance:</Text><Text css={{color: "#2d96f2"}}> {bal}</Text>
                        </div>
                    <Button auto color="gradient" rounded bordered disabled={true} shadow onClick={() => deposit()}>DEPOSIT</Button>
                </div>
            </div>
            </div>
        )
    }
}

export default CreateNewStaking;