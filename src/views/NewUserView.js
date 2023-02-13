import { CreateNewStaking, Logo } from "../components";
import "../css/NewUserView.css";

function NewUserView({factoryAddress}){
    return(<div id="newUser"><Logo /><CreateNewStaking factoryAddress={factoryAddress}/></div>)
}

export default NewUserView;