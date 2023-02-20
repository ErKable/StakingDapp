import "../css/UserInfo.css"
import Countdown from "./Countdown";
import { Button, Input, Dropdown, Text } from "@nextui-org/react";
import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import CountUp from 'react-countup';
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

function UserInfo({userSigner,factoryAddress}){
    const [callTrigger, setCallTrigger] = useState(true)
    const [trigger, setTrigger] = useState(false)
    const [tier, setTiers] = useState([])
    const [selectedTier, setTierSelected] = useState()
    const [lockedUntil, setLockedUntil] = useState()
    const [claimedAmount, setAmountClaimed] = useState()
    const [apy, setApy] = useState()
    const [allocatedAmount, setAmountAllocate] = useState()
    const [balance, setBalance] = useState()
    const [address, setAddress] = useState()
    const [is, setIs] = useState(false)
    const [stakingAddress, setStakingAddress] = useState()
    const [amountToAdd, setAmountToAdd] = useState()
    const [pending, setPending] = useState()
    const [oldpending, setOldPending] = useState()
    const tokenAbi = require("../abi/erc20Abu.json")
    const tokenAddress = "0x3F4B6015682732CF8435ce1547378e9f06f79AAE"
    const factoryAbi = require("../abi/stakingFactory.json")
    const stakingAbi = require("../abi/stakingAbi.json")
    const tierzArray = []
    const RPC = "https://data-seed-prebsc-1-s3.binance.org:8545/";
    const provider = new ethers.providers.JsonRpcProvider(RPC);

    //console.log("hei sto nella view stack", userSigner,userSigner._address)
    const notyf = new Notyf({
        position: { x: "center", y: "top" },
        duration: 5000,
    });

    useEffect(() => { 
        async function tst(){
            //console.log("2come posibile che non ti fai diomerdadicanebastardo",userSigner)
            let prew = await getPenidingReward()
            //console.log("diomerda????",prew,pending)
            return prew
        }

        const interval = setInterval(() => {
            tst().then((value) => {
                //setOldPending(pending) //nfame nfunziona co start del countup :(
                setPending(value)
            })
            }, 5000);
            return () => clearInterval(interval);
        },[is,userSigner])

    useEffect(() => {
        async function balAndTier(){
            //console.log("HEY????")
            let bal = await getBalance()
            let apyz = await getTiers()
            //console.log("aaaapay",apyz,bal)
            return [apyz,bal]
        }
        let diomerda = balAndTier().then((ap)=>{
            console.log("tiiiiiierrr",ap)
            setTiers(ap[0])
            setBalance(ap[1])
        })
        //console.log("ahhhhhhhhhhhhhhhhhhhhhhhhhhhhh", tier)
        

    }, [userSigner, callTrigger])

    useEffect(() => {
        //console.log("GETTING STAKING DATA!")     
        if(stakingAddress)   {
            getStackData()
        }
        
        
    }, [stakingAddress])



    
    async function getTiers(){
        try{
            //console.log("HEY????1")
            const factory = new ethers.Contract(factoryAddress, factoryAbi, provider)
            //console.log("USER SIGNER ADDRES", userSigner._address)
            let avTier = await factory.getAvailableTiers(userSigner._address)
            console.log("AVAILABLE TIERS", avTier)
            
                    let tempTiers = []     
                    for(let i=0; i < avTier.length; i++){
                        let tempTier = await factory.getApyRatios(avTier[i])
                        let apyInfos = {
                            id: avTier[i],
                            apy: Number(tempTier.apy),
                            dayLock: parseInt((tempTier.lockedUntil)/86400),
                        }
                        tempTiers.push(apyInfos)                
                    }
                    console.log("TEEEEEEEEMP",tempTiers)
            
            return tempTiers
        }catch{}
    }

    function getAmountToAdd(amount) {
        setAmountToAdd(amount)
    }    

    async function claim(){
        try{
            const stak = new ethers.Contract(stakingAddress, stakingAbi, userSigner)
            let claim = await stak.claimRewardTokens();
            setTrigger(true)
            await claim.wait()
            notyf.success('Rewards claimed succesfully')
        } catch{
            notyf.error('Could not claim')
        } finally{
            setTrigger(false)
            setCallTrigger(!callTrigger)
        }
    }

    async function withdraw(){
        try{
            const stak = new ethers.Contract(stakingAddress, stakingAbi, userSigner)
            let withd = await stak.claimTokens()
            setTrigger(true)
            await withd.wait()
            notyf.success('Tokens withdrawn succesfully')
        } catch{
            notyf.error('Cannot withdraw yet')
        } finally {
            setTrigger(false)
            setCallTrigger(!callTrigger)
        }
    }

    async function deposit(){
        try{
            const token = new ethers.Contract(tokenAddress, tokenAbi, userSigner)
            
            console.log("porcodio l allowance", (await token.allowance(userSigner._address,factoryAddress)).toString())
            let approve = await token.approve(factoryAddress, (ethers.utils.parseUnits(amountToAdd,9)).toString())
            await approve.wait()
            notyf.success('Token approved')
            const fact = new ethers.Contract(factoryAddress, factoryAbi, userSigner)
            console.log("porcodio l allowance", (await token.allowance(userSigner._address,factoryAddress)).toString())
            console.log("SELECTED TIER",selectedTier," amount add:",amountToAdd,"approvev amount",(ethers.utils.parseUnits(amountToAdd,9)).toString())
            let dep = await fact.addToStaking(amountToAdd, selectedTier+1)
            setTrigger(true)
            await dep.wait()
            notyf.success('Token deposited succesfully')
        } catch{
            notyf.error('Something went wrong while depositing')
        } finally{
            setTrigger(false)
            setCallTrigger(!callTrigger)
        }
    }
    
    async function getPenidingReward(){
        try{
            if(!stakingAddress){
                const factory = new ethers.Contract(factoryAddress, factoryAbi, userSigner)
                let stakingAdd = await factory.userStaking(userSigner._address)
                setStakingAddress(stakingAdd)
            }
            //console.log('prima di stak')
            if(stakingAddress && stakingAddress != '0x0000000000000000000000000000000000000000'){
                const stack = new ethers.Contract(stakingAddress, stakingAbi, userSigner)
                //console.log('dopo stak')
                let pendingRewards = await stack.getPendingTokens()
                //console.log("Pending rewards", Number(ethers.utils.formatUnits(pendingRewards, 9)).toFixed(3))            
                return Number(ethers.utils.formatUnits(pendingRewards, 9)).toFixed(3)
            }else{
                //console.log("else???")
                setIs(!is)
            }
        }catch{}
    }

    async function getBalance(){
        //console.log("HEY????2")
        try{
            const token = new ethers.Contract(tokenAddress, tokenAbi, userSigner)
            let bal = await token.balanceOf(userSigner._address)
            //console.log(Number(ethers.utils.formatUnits(bal, 9)).toFixed(3),"nfaaaaaaaaaaaaadadad")
            return bal
        } catch{}
    }

    async function getStackData() {
        try{
            //console.log("HEY????3")
            const stak = new ethers.Contract(stakingAddress, stakingAbi, userSigner)
            let info = await stak.StakingData()
            //console.log("STAK DATA",info)
            setAmountAllocate(info[0])
            setApy(Number(info[1]))
            setLockedUntil(info[2])
            setAmountClaimed(info[3])
        } catch{}
    }

    if(!trigger){
    return(<>
        <div id="userInfoContainer">
            <div id="userInfo">
                <div id='circle'><p>STAKED AMOUNT</p>
                <p>
                <CountUp start ={oldpending ? oldpending : 0} end={allocatedAmount? ethers.utils.formatUnits(allocatedAmount,9):0} decimals={2} style={{color: "#15aeff"}}/>
                </p></div>
                <div className="info"><Text css={{color: "#1363eb"}}>BALANCE</Text> <Text css={{color: "#2d96f2"}}><CountUp end={balance ? ethers.utils.formatUnits(balance,9):0} style={{color: "#15aeff"}}/></Text></div>
                <div className="info"><Text css={{color: "#1363eb"}}>PENDING REWARDS</Text> <Text css={{color: "#2d96f2"}}><CountUp end={pending?pending:0} decimals={3} style={{color: "#15aeff"}}/></Text>                   
                </div>
                <div className="info"><Text css={{color: "#1363eb"}}>APY</Text> <Text css={{color: "#2d96f2"}}><CountUp end={apy} style={{color: "#15aeff"}}/> %</Text>                   
                </div>
                <div className="info"><Button auto color="gradient" rounded bordered shadow css={{width: "150px"}} onClick={() => claim()}>CLAIM</Button></div>
            </div>

            <div id="buttons">
                <div id="deposit" className="interaction">
                <Text css={{color: "#1363eb"}}>ADD TO STAK</Text>
                    <Input 
                        id="insertAm"
                        bordered 
                        labelPlaceholder="Amount to deposit" 
                        color="primary" 
                        onChange={(e) => {console.log(e.target.value)
                        getAmountToAdd(e.target.value)}}/>
                    
                    <Dropdown color="secondary">
                        <Dropdown.Button color='gradient' rounded bordered shadow flat>SELECT TIER</Dropdown.Button>
                        <Dropdown.Menu selectionMode='single'  onAction={(tierId) => {console.log("tier selected;",tierId);setTierSelected(Number(tierId))}} >
                            {
                                tier.map((tierz) => {
                                    return (
                                        <Dropdown.Item key={tierz.id}>{"Apy: "+ tierz.apy +"% / "+" Lock "+tierz.dayLock + " Days"}</Dropdown.Item>
                                        );
                                })
                            }
                            
                        </Dropdown.Menu>
                    </Dropdown>

                    <Button auto color="gradient" rounded bordered shadow onClick={() => deposit()}>DEPOSIT</Button>
                    
                    
                </div>
                <div id="withdraw" className="interaction"><Text css={{color: "#1363eb"}}>WITHDRAW TOKENS</Text>
                    <p><Countdown UNIX_timestamp={lockedUntil}/></p>
                    <Button auto color="gradient" rounded bordered shadow css={{width: "150px"}} onClick={() => withdraw()}>WITHDRAW</Button>
                </div>
                
            </div>

        </div>
    </>)
    } else if(trigger){
        return(<>
            <div id="userInfoContainer">
                <div id="userInfo">
                    <div id='circle'><p>STAKED AMOUNT</p>
                    <p>
                    <CountUp start ={oldpending ? oldpending : 0} end={allocatedAmount? ethers.utils.formatUnits(allocatedAmount,9):0} decimals={2} style={{color: "#15aeff"}}/>
                    </p></div>
                    <div className="info"><Text css={{color: "#1363eb"}}>BALANCE</Text>  <Text css={{color: "#2d96f2"}}><CountUp end={balance ? ethers.utils.formatUnits(balance,9):0} style={{color: "#15aeff"}}/></Text></div>
                    <div className="info"><Text css={{color: "#1363eb"}}>PENDING REWARDS</Text> <Text css={{color: "#2d96f2"}}><CountUp end={pending?pending:0} decimals={3} style={{color: "#15aeff"}}/></Text>                   
                    </div>
                    <div className="info"><Text css={{color: "#1363eb"}}>APY</Text> <Text css={{color: "#2d96f2"}}><CountUp end={apy} style={{color: "#15aeff"}}/> %</Text>                   
                    </div>
                    <div className="info"><Button auto color="gradient" rounded bordered shadow css={{width: "150px"}} disabled={true} onClick={() => claim()}>CLAIM</Button></div>
                </div>
    
                <div id="buttons">
                    <div id="deposit" className="interaction">
                    <Text css={{color: "#1363eb"}}>ADD TO STAK</Text>
                        <Input 
                            id="insertAm"
                            bordered 
                            labelPlaceholder="Amount to deposit" 
                            color="secondary" 
                            onChange={(e) => {console.log(e.target.value)
                            getAmountToAdd(e.target.value)}}/>
                        
                        <Dropdown color="secondary">
                            <Dropdown.Button color='gradient' rounded bordered shadow flat>SELECT TIER</Dropdown.Button>
                            <Dropdown.Menu selectionMode='single'  onAction={(tierId) => {setTierSelected(Number(tierId))}} >
                                {
                                    tier.map((tierz) => {
                                        return (
                                            <Dropdown.Item key={tierz.id}>{"Apy: "+ tierz.apy +"% / "+" Lock "+tierz.dayLock + " Days"}</Dropdown.Item>
                                            );
                                    })
                                }
                                
                            </Dropdown.Menu>
                        </Dropdown>
    
                        <Button auto color="gradient" rounded bordered shadow disabled={true} onClick={() => deposit()}>DEPOSIT</Button>
                        
                        
                    </div>
                    <div id="withdraw" className="interaction"><Text css={{color: "#1363eb"}}>WITHDRAW TOKENS</Text>
                        <p><Countdown UNIX_timestamp={lockedUntil}/></p>
                        <Button auto color="gradient" rounded bordered disabled={true} shadow css={{width: "150px"}} onClick={() => withdraw()}>WITHDRAW</Button>
                    </div>
                    
                </div>
    
            </div>
        </>)
    }
}

export default UserInfo;