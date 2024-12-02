import { useState } from 'react';
import * as THREE from 'three';
import { chunkSize } from './Constants';

const generateTerrain = (size: number, scale: number) => {
    const geometry = new THREE.PlaneGeometry(size, size, size/2, size/2);
    geometry.rotateX(-Math.PI / 2);

    const vertices = geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const z = vertices[i + 2];
        const noise = Math.sin(x * 0.1) * Math.cos(z * 0.1) * scale;
        vertices[i + 1] = noise;
    }

    return geometry;
};


const Terrain = ({ position }: { position: [number, number, number] }) => {
    const [terrainGeometry] = useState(() => generateTerrain(chunkSize, 10));

    return (
        <mesh geometry={terrainGeometry} position={position} receiveShadow>
            <meshStandardMaterial color="white" wireframe />
        </mesh>
    );
};
export default Terrain;
