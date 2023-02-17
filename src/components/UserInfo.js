import "../css/UserInfo.css"
import LoadingNumber from "./LoadingNumber";
import Countdown from "./Countdown";
import { Button, Input, Dropdown } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import CountUp from 'react-countup';
import { getAccount, fetchSigner } from '@wagmi/core'
import { bsc, bscTestnet} from "wagmi/chains";


function UserInfo({userSigner,userAddress, factoryAddress}){

    const [address, setAddress] = useState()
    const [is, setIs] = useState()
    const [stakingAddress, setStakingAddress] = useState()
    const [amountToAdd, setAmountToAdd] = useState()
    const [pending, setPending] = useState()
    const [balance, setBalance] = useState()
    const [remTime, setRemTime] = useState()
    const factoryAbi = require("../abi/stakingFactory.json")
    const stakingAbi = require("../abi/stakingAbi.json")
    const tokenAbi = require("../abi/erc20Abu.json")
    const tokenAddress = "0x21836a89de0D420a2251b8Cf2A40c393E80e0e1F"
    const factoryAddress = "0x81Eb97d54bF7Cc520bE5da7Add75b48eA2836c3e"
    const RPC = "https://data-seed-prebsc-1-s3.binance.org:8545/";
    const provider = new ethers.providers.JsonRpcProvider(RPC);

    /* useEffect(() => {   
        (async () =>{
            console.log("come posibile che non ti fai diomerdadicanebastardo")
            let prew = await getPenidingReward()
            setPending(prew)
        })()
    }, []) */
    useEffect(() => {
        const interval = setInterval(() => {
            getPenidingReward()
          
        }, 3000);
        return () => clearInterval(interval);
    }, [is]);

    useEffect(() => {
        getStackData()
        getBalance()
        getRemTime()
    }, [userSigner])

    // useEffect(() => {
    //     console.log("come possibile chenon ti chiami diomerda") 
    // });
    
    function getAmountToAdd(amount) {
        setAmountToAdd(amount)
    }

    async function getStakingAddress(){
        
    }

    async function claim(){
        const stak = new ethers.Contract(stakingAddress, stakingAbi, userSigner)
        await stak.claimRewardTokens();
    }

    // async function internalSigner(){
    //     let signerz = await fetchSigner(bscTestnet.id);
    //     let adr = await signerz._address

    //     return {signerz,adr}
    // }

    // async function getAddress(){
    //     let address = await userSigner.getAddress()
    //     console.log('userinfo address', address)
    //     setAddress(address)
    // }

    async function getStackData() {
        const stak = new ethers.Contract(stakingAddress, stakingAbi, userSigner)
        let info = await stak.getStakData()
        setAmountAllocated(info.amountAllocated)
        setApy(info.apy)
    }

    async function getBalance(){
        const token = new ethers.Contract(tokenAddress, tokenAbi, userSigner)
        let bal = await token.balanceOf(address)
        setBalance(bal)
    }

    async function withdraw(){
        const stak = new ethers.Contract(stakingAddress, stakingAbi, userSigner)
        await stak.claimTokens()
    }

    async function getRemTime(){
        const stak = new ethers.Contract(stakingAddress, stakingAbi, userSigner)
        let time = await stak.getRemainingTime()
        setRemTime(time)
    }


    async function deposit(){

    }
    
    async function getPenidingReward(){
        console.log('pending reward signer', userSigner)
        console.log('prima factory')
        const factory = new ethers.Contract(factoryAddress, factoryAbi, userSigner)
        console.log('dopo facotyr',userAddress)
        let stakingAdd = await factory.userStaking(userAddress)
        console.log('stakingAdd', stakingAdd)
        setStakingAddress(stakingAdd)
        console.log('prima di stak')
        if(stakingAdd != '0x0000000000000000000000000000000000000000'){
            const stack = new ethers.Contract(stakingAdd, stakingAbi, userSigner)
            console.log('dopo stak')
            let pendingRewards = await stack.getPendingTokens()
            console.log("Pending rewards", Number(ethers.utils.formatUnits(pendingRewards, 9)).toFixed(3))
            
            return Number(ethers.utils.formatUnits(pendingRewards, 9)).toFixed(3)
        }
    }

    

    

    

    return(<>
        <div id="userInfoContainer">
            <div id="userInfo">
                <div id='circle'><p>STAKED AMOUNT</p>
                <p><LoadingNumber n={1000000} /></p></div>
                <div className="info"><p>BALANCE</p>  <p><LoadingNumber n={1000000}/></p></div>
                <div className="info"><p>PENDING REWARDS</p> <p><CountUp end={pending} decimals={3} style={{color: "#15aeff"}}/></p>
                    
                </div>
                <div className="info"><Button auto color="gradient" rounded bordered shadow css={{width: "150px"}} onClick={() => {claim()}}>CLAIM</Button></div>
            </div>

            <div id="buttonContainer">
                <div id="deposit" className="interaction">
                    <p>ADD TO STAK</p>
                    <Input 
                        id="insertAm"
                        bordered 
                        labelPlaceholder="Amount to deposit" 
                        color="secondary" 
                        onChange={(e) => {console.log(e.target.value)
                        getAmountToAdd(e.target.value)}}/>
                    
                    <Dropdown color="secondary">
                        <Dropdown.Button color='gradient' rounded bordered shadow flat>SELECT TIER</Dropdown.Button>
                        <Dropdown.Menu selectionMode='single' /* onAction={(tierId) => {setSelectedTier(Number(tierId - 1))}} */>
                            {/* {
                                tiersArray.map(tier => {
                                return (
                                    <Dropdown.Item key={tier}>{`Tier`+` `+`${tier}`}</Dropdown.Item>
                                    );
                                })
                            } */}
                            <Dropdown.Item >TIER</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Button auto color="gradient" rounded bordered shadow onClick={() => deposit()}>DEPOSIT</Button>
                    
                    
                </div>
                <div id="withdraw" className="interaction"><p>WITHDRAW TOKENS</p>
                    <p><Countdown UNIX_timestamp={1694013165}/></p>
                    <Button auto color="gradient" rounded bordered shadow css={{width: "150px"}} onClick={() =>{withdraw()}}>WITHDRAW</Button>
                </div>
                
            </div>

        </div>
    </>)
}

export default UserInfo;