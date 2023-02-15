import {Logo, Infos } from '../components';

function StakedUserView({userSigner, factoryAddress}){
    return(
        <>
        <Logo/>
        <Infos userSigner={userSigner} factoryAddress={factoryAddress}/>
        </>
    )
}

export default StakedUserView;