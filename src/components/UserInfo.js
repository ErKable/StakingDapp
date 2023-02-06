import "../css/UserInfo.css"
import LoadingNumber from "./LoadingNumber";
import Countdown from "./Countdown";

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
                    <p>STAKE TOKENS</p>
                    <input type="text" placeholder="Amount"/>
                    <button>APPROVE/DEPOSIT</button>
                </div>
                <div id="withdraw" className="interaction"><p>WITHDRAW TOKENS</p>
                <p><Countdown UNIX_timestamp={1694013165}/></p></div>
            </div>

        </div>
    </>)
}

export default UserInfo;