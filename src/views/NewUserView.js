import { CreateNewStaking, Logo } from "../components";
import "../css/NewUserView.css";

function NewUserView({factoryAddress, tokenAddress, userSigner}){
    return(<div id="newUser"><Logo /><CreateNewStaking factoryAddress={factoryAddress} tokenAddress={tokenAddress} userSigner={userSigner}/></div>)
}

export default NewUserView;