import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Hexagon = ({ cameraPositionRef }: { cameraPositionRef: React.MutableRefObject<THREE.Vector3> }) => {
  const hexagonRef = useRef<THREE.Mesh>(null!);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  
  
  useEffect(() => {
    let previousScrollTop = 0;
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setScrollDirection(scrollTop > previousScrollTop ? 'down' : 'up');
      previousScrollTop = scrollTop;
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  
  useFrame(() => {
    if (hexagonRef.current) {
      hexagonRef.current.rotation.z += scrollDirection === 'down' ? 0.01 : -0.01;

      
      if (cameraPositionRef.current) {
        const cameraZ = cameraPositionRef.current.z;

        
        const targetX = THREE.MathUtils.lerp(-10,10, Math.min(-cameraZ / 100, 1)); 
        const targetZ = -50; 

        
        hexagonRef.current.position.set(targetX, 20, targetZ);
      }
    }
  });

  return (
    <mesh ref={hexagonRef} rotation={[0, 0, Math.PI / 4]} position={[-20,20,-50]}>
      <ringGeometry args={[1, 2, 6]} />
      <meshBasicMaterial color={0x9370DB} wireframe={false} />
    </mesh>
  );
};

export default Hexagon;
