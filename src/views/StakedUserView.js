import {Logo, Infos, StakeInfo, Navbar, Particles } from '../components';

function StakedUserView({userSigner, factoryAddress}){
    return(
        <div style={{zIndex: "1"}}>
        
        <Navbar />
        <Logo/>
        <StakeInfo />
        <Infos userSigner={userSigner} factoryAddress={factoryAddress}/>
        
        </div>
    )
}

export default StakedUserView;