import { useCallback } from "react";
import Particles from 'react-tsparticles'
import { loadFull } from 'tsparticles'

export default function Particless(){
  const particlesInit = useCallback(async engine => {
    console.log(engine);
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
}, []);

const particlesLoaded = useCallback(async container => {
     console.log(container);
}, []);
    
      return (
      <Particles 
        id="tsparticles" 
        init={particlesInit} 
        loaded={particlesLoaded} 
        
        options={
          {
            fullScreen:{
                "enable": true,
                "zIndex": 1,
            },
           
            fpsLimit: 120,
            
            particles: {
                color: {
                    value: "#2aa2c7",
                },
                
                collisions: {
                    enable: true,
                },
                move: {
                    directions: "none",
                    enable: true,
                    outModes: {
                        default: "bounce",
                    },
                    random: false,
                    speed: 1,
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                        area: 800,
                    },
                    value: 80,
                },
                opacity: {
                    value: 0.5,
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1, max: 5 },
                },
            },
            detectRetina: true,
        }
        }
        />)
    
    
}