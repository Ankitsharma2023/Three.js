import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import RotatingHexagon from './Hexagon';
import Terrain from './Terrain';
import PerpCam from './PerpCam';
import BackStars from './BackStars';
import { chunkSize } from './Constants';
import { Text } from '@react-three/drei';

const Light = () => {
    const light1Ref = useRef<THREE.PointLight>(null);
    const light2Ref = useRef<THREE.PointLight>(null);

    
    const interpolateColor = (startColor: THREE.Color, endColor: THREE.Color, factor: number) => {
        const color = new THREE.Color();
        color.lerpColors(startColor, endColor, factor);
        return color;
    };

    useFrame((state) => {
        if (light1Ref.current && light2Ref.current) {
            
            const cameraPosition = state.camera.position;
            
            
            const distance = cameraPosition.length(); 
            const normalizedDistance = THREE.MathUtils.clamp(distance / 100, 0, 1);
            const orange = new THREE.Color(0xFFA500); 
            const purple = new THREE.Color(0x800080); 
            const interpolatedColor = interpolateColor(purple,orange, normalizedDistance);
            
            light1Ref.current.color.set(interpolatedColor);
            light2Ref.current.color.set(interpolatedColor);
            light1Ref.current.position.setZ(cameraPosition.z-65);
            light2Ref.current.position.setZ(cameraPosition.z-60);
        }
    });

    return (
        <>
            <pointLight ref={light1Ref} intensity={600} position={[-15, 10, -50]} color={0xFFA500} />
            <pointLight ref={light2Ref} intensity={600} position={[15, 10, -45]} color={0xFFA500} />
        </>
    );
};

const Scene = () => {
    const [chunks, setChunks] = useState<{ position: [number, number, number] }[]>([
        { position: [0, 0, 0] },
        { position: [0, 0, -chunkSize] },
    ]);

    const cameraPositionRef = useRef(new THREE.Vector3(0, 100, 105));
    const cameraSpeedRef = useRef(0.1); 
    const speedBoostRef = useRef(0); 

    useEffect(() => {
        const handleScroll = (event: WheelEvent) => {

            const scrollDirection = Math.sign(event.deltaY);
            if(cameraPositionRef.current.y!=20){
                speedBoostRef.current = event.deltaY*0.1; 
                return;
            }
            if((cameraPositionRef.current.z === 105 && scrollDirection === -1 && cameraPositionRef.current.y===20)) {
                cameraPositionRef.current.z=90;
                return;
            }
            if(cameraPositionRef.current.z === 100 && scrollDirection === 1 && cameraPositionRef.current.y===20) {
                speedBoostRef.current = event.deltaY*0.1; 
                cameraPositionRef.current.y=40;
                cameraPositionRef.current.z=105;
                return;
            } 
            const boostAmount = 0.05; 
            speedBoostRef.current = Math.min(0.7, speedBoostRef.current + boostAmount); 
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
            <directionalLight position={[5, 10, 5]} intensity={0.5} castShadow />
            
            <Light />
            {chunks.map((chunk, index) => (
                <Terrain key={index} position={chunk.position} />
            ))}
             <Text
                position={[0, 100, -50]} 
                fontSize={10} 
                color="white" 
                anchorX="center" 
                anchorY="middle" 
            >
                Hello World
            </Text>
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
