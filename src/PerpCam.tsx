import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from 'three';
import { chunkSize } from "./Constants";


const PerpCam = ({
    setChunks,
    cameraPositionRef,
    cameraSpeedRef,
    speedBoostRef,
}: {
    setChunks: React.Dispatch<React.SetStateAction<{ position: [number, number, number] }[]>>;
    cameraPositionRef: React.MutableRefObject<THREE.Vector3>;
    cameraSpeedRef: React.MutableRefObject<number>;
    speedBoostRef: React.MutableRefObject<number>;
}) => {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
    const { set } = useThree();

    
    useEffect(() => {
        if (cameraRef.current) {
            set({ camera: cameraRef.current });
        }
    }, [set]);

    useFrame((_, delta) => {
        if (cameraRef.current) {
            
            speedBoostRef.current = Math.max(0, speedBoostRef.current - delta * 2); 
            const speed = (cameraSpeedRef.current + speedBoostRef.current) * (cameraSpeedRef.current < 0 ? -1 : 1);
            
            cameraRef.current.position.z =  Math.min(100,cameraRef.current.position.z-speed);
            cameraRef.current.position.z =  Math.max(-60,cameraRef.current.position.z-speed);
            
            cameraPositionRef.current.copy(cameraRef.current.position);

            const cameraZ = cameraRef.current.position.z;

            setChunks((prevChunks) => {
                const updatedChunks = prevChunks.filter(
                    (chunk) => Math.abs(chunk.position[2]) + chunkSize > Math.abs(cameraZ)
                );

                while (updatedChunks.length < 5) {
                    const newChunkZ = updatedChunks[updatedChunks.length - 1].position[2] - chunkSize;
                    updatedChunks.push({ position: [0, 0, newChunkZ] });
                }

                return updatedChunks;
            });
        }
    });

    return <perspectiveCamera ref={cameraRef} position={[0, 20, 100]} fov={75} />;
};
export default PerpCam;