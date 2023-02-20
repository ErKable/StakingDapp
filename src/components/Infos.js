import "../css/Info.css"
import LoadingNumber from "./LoadingNumber";
import UserInfo from "./UserInfo";

function Info({userSigner, factoryAddress}){

    return(
        <>
  

            <UserInfo userSigner={userSigner} factoryAddress={factoryAddress}/>
            
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
