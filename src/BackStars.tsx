import { Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from 'three';



const BackStars = ({ cameraPositionRef }: { cameraPositionRef: React.MutableRefObject<THREE.Vector3> }) => {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame(() => {
        if (groupRef.current) {
            
            groupRef.current.position.copy(cameraPositionRef.current);
        }
    });

    return (
        <group ref={groupRef}>
            <Stars count={5000} />
        </group>
    );
};
export default BackStars;