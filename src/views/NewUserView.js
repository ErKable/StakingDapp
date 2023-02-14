import { CreateNewStaking, Logo } from "../components";
import "../css/NewUserView.css";

function NewUserView({factoryAddress, userSigner}){
    return(<div id="newUser"><Logo /><CreateNewStaking factoryAddress={factoryAddress} userSigner={userSigner}/></div>)
}

export default NewUserView;