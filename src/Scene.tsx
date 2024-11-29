import { useRef, useState, useEffect } from 'react';
import { Canvas, } from '@react-three/fiber';
import * as THREE from 'three';
import RotatingHexagon from './Hexagon';
import Terrain from './Terrain';
import PerpCam from './PerpCam';
import BackStars from './BackStars';
import { chunkSize } from './Constants';










const Scene = () => {
    const [chunks, setChunks] = useState<{ position: [number, number, number] }[]>([
        { position: [0, 0, 0] },
        { position: [0, 0, -chunkSize] },
    ]);

    
    const cameraPositionRef = useRef(new THREE.Vector3(0, 20, 100));
    const cameraSpeedRef = useRef(0.3); 
    const speedBoostRef = useRef(0); 

    
    useEffect(() => {
        const handleScroll = (event: WheelEvent) => {
            const scrollDirection = Math.sign(event.deltaY);
            if(cameraPositionRef.current.z>=100&&scrollDirection==-1){
                return;
            } 
            const boostAmount = 0.3; 
            speedBoostRef.current = Math.min(2, speedBoostRef.current + boostAmount); 

            
            cameraSpeedRef.current = scrollDirection * Math.abs(cameraSpeedRef.current); 
        };

        window.addEventListener('wheel', handleScroll);
        return () => {
            window.removeEventListener('wheel', handleScroll);
        };
    }, []);

    return (
        <Canvas
            style={{ height: '90vh', width: '100%', backgroundColor: 'black' }}
            gl={{ antialias: true }}
        >
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
            {chunks.map((chunk, index) => (
                <Terrain key={index} position={chunk.position} />
            ))}
            <BackStars cameraPositionRef={cameraPositionRef} />
            <PerpCam
                setChunks={setChunks}
                cameraPositionRef={cameraPositionRef}
                cameraSpeedRef={cameraSpeedRef}
                speedBoostRef={speedBoostRef}
            />
                       <RotatingHexagon cameraPositionRef={cameraPositionRef} />  

        </Canvas>
    );
};

export default Scene;
