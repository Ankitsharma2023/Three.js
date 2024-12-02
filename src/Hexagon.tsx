import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Hexagons = ({ cameraPositionRef }: { cameraPositionRef: React.MutableRefObject<THREE.Vector3> }) => {
  const hexagonRefs = useRef<THREE.Mesh[]>([]);  
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
  
  
  useFrame((_,delta) => {
    hexagonRefs.current.forEach((hexagonRef) => {
      if (hexagonRef) {
        
        hexagonRef.rotation.z += scrollDirection === 'down' ? 1*delta : -1*delta;

        
        if (cameraPositionRef.current) {
          const cameraZ = cameraPositionRef.current.z;

          const targetX = THREE.MathUtils.lerp(hexagonRef.position.x, -hexagonRef.position.x, Math.min(-cameraZ / 100, 1));
          const targetZ = hexagonRef.position.z;

          hexagonRef.position.set(targetX, 20, targetZ);
        }
      }
    });
  });

  
  const hexagonsData = [
    { innerRadius: 3, outerRadius: 4, position: new THREE.Vector3(-20, 20, -50) },
    { innerRadius: 2.8, outerRadius: 3.8, position: new THREE.Vector3(-21, 20, -50) },
    { innerRadius: 2.5, outerRadius: 3.5, position: new THREE.Vector3(-22, 20, -50) },
    
  ];

  return (
    <>
      {hexagonsData.map((hexagon, index) => (
        <mesh
          key={index}
          ref={(el) => hexagonRefs.current[index] = el!} 
          position={hexagon.position}
        >
          <ringGeometry args={[hexagon.innerRadius, hexagon.outerRadius, 6]} />
          <meshBasicMaterial color={0x9370DB} wireframe={false} />
        </mesh>
      ))}
    </>
  );
};

export default Hexagons;
