import "../css/UserInfo.css"
import LoadingNumber from "./LoadingNumber";
import Countdown from "./Countdown";
import { Button } from "@nextui-org/react";

function UserInfo(){

    return(<>
        <div id="userInfoContainer">
            <div id="userInfo">
                <div id='circle'><p>STAKED AMOUNT</p>
                <p><LoadingNumber n={1000000} /></p></div>
                <div className="info"><p>BALANCE</p>  <p><LoadingNumber n={1000000}/></p></div>
                <div className="info"><p>PENDING REWARDS</p> <p><LoadingNumber n={1000000}/></p></div>
            </div>

            <div id="buttonContainer">
                <div id="deposit" className="interaction">
                    <p>...</p>
                    <Button auto color="gradient" rounded bordered shadow css={{width: "150px"}}>CLAIM</Button>
                    <Button auto color="gradient" rounded bordered shadow css={{width: "150px"}}>WITHDRAW</Button>
                </div>
                <div id="withdraw" className="interaction"><p>WITHDRAW TOKENS</p>
                <p><Countdown UNIX_timestamp={1694013165}/></p></div>
            </div>

        </div>
    </>)
}

export default UserInfo;