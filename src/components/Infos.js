import "../css/Info.css"
import LoadingNumber from "./LoadingNumber";
import UserInfo from "./UserInfo";

function Info(){

    return(
        <>
            <div id="infoContainer">  
                <div className="infos">
                    <p>MINIMUM AMOUNT TO STAKE</p>
                    <LoadingNumber n={3500000000} />
                </div>

            <div className="infos">
                <p>TOTAL USER STAKED</p>
            </div>
            </div>

            <UserInfo />
            
           {/*  <div className="infos">
                <p>USER STAKING ADDRESS</p>
            </div>

            <div className="infos">
                <p>COSE STRANE COI TIER</p>
            </div> */}
        </>
    )
}

export default Info;
