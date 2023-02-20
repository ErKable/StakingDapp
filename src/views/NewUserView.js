import { CreateNewStaking, Logo, StakeInfo, Navbar, Particles } from "../components";
import "../css/NewUserView.css";

function NewUserView({factoryAddress, tokenAddress, userSigner, trigger}){
    return(
    <>
    
        <Navbar />
        <Logo />
        <StakeInfo />
        <CreateNewStaking factoryAddress={factoryAddress} tokenAddress={tokenAddress} userSigner={userSigner} trigger={trigger}/>
        
    </>)
}

export default NewUserView;