import { useSpring, animated } from "react-spring";
import "../css/loadingNumber.css";

function LoadingNumber({n}){

    const {number} = useSpring({ // da vede, from usestate to call
        from: {number:0},
        number: n,
        delay: 1,
        config: {mass: 1, tension: 20, friction: 10},
    })

    return <animated.div id="aniDiv">{number.to((n) => n.toFixed(0))}</animated.div>
    
}

export default LoadingNumber;