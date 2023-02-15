import "../css/UserInfo.css"
import LoadingNumber from "./LoadingNumber";
import Countdown from "./Countdown";
import { Button, Input, Dropdown } from "@nextui-org/react";
import { useState } from "react";

function UserInfo(){

    const [amountToAdd, setAmountToAdd] = useState()

    function getAmountToAdd(amount) {
        setAmountToAdd(amount)
    }

    async function deposit(){

    }

    return(<>
        <div id="userInfoContainer">
            <div id="userInfo">
                <div id='circle'><p>STAKED AMOUNT</p>
                <p><LoadingNumber n={1000000} /></p></div>
                <div className="info"><p>BALANCE</p>  <p><LoadingNumber n={1000000}/></p></div>
                <div className="info"><p>PENDING REWARDS</p> <p><LoadingNumber n={1000000}/></p></div>
                <div className="info"><Button auto color="gradient" rounded bordered shadow css={{width: "150px"}}>CLAIM</Button></div>
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
                    <Button auto color="gradient" rounded bordered shadow css={{width: "150px"}}>WITHDRAW</Button>
                </div>
                
            </div>

        </div>
    </>)
}

export default UserInfo;