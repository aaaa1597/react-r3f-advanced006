import React, { useRef, Suspense} from 'react';
import './App.css';
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls, Environment } from '@react-three/drei'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const TheModel = () => {
  const { scene, animations } = useLoader(GLTFLoader, "/animate-bones.glb");
  const mixer = new THREE.AnimationMixer(scene);
  mixer.clipAction(animations[0]).play();
  mixer.clipAction(animations[1]).play();

  useFrame((state, delta) => {
    mixer.update(delta);
  });

  return (
    <primitive object={scene} position={[0, 0, 0]} />
  )
}

const App = () => {
  return (
    <div style={{ width: "100vw", height: "75vh" }}>
      <Canvas camera={{ position: [3, 1, 2] }}>
        <ambientLight intensity={2} />
        <pointLight position={[40, 40, 40]} />
        <Suspense fallback={null}>
          <TheModel />
        </Suspense>
        <Environment preset="forest" background />
        <OrbitControls />
        <axesHelper args={[5]} />
        <gridHelper />
      </Canvas>
    </div>
  );
}

export default App;
