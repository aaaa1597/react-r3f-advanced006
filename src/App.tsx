import React, { useRef, Suspense, useEffect, useState, useMemo } from 'react';
import './App.css';
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls, Environment } from '@react-three/drei'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

const FBXModel = () => {
  const ref = useRef<THREE.Group>(null!)
  const fbx = useLoader(FBXLoader, "./assets/Dragon_Baked_Actions_fbx_7.4_binary.fbx");
  const texture = useLoader(THREE.TextureLoader, "./assets/textures/Dragon_ground_color.jpg");
  const material = useMemo( () => new THREE.MeshBasicMaterial({ map:texture }) , []);
  const mixer = useRef<THREE.AnimationMixer>();
  const [ animIdx, setAnimIdx ] = useState<{remaintime: number, index: number}>({remaintime:0, index:0});
  const animActions = useMemo(() => [] as THREE.AnimationAction[], [])

  useEffect(() => {
    fbx.scale.multiplyScalar(0.0005)
    mixer.current = new THREE.AnimationMixer(fbx)
    if(fbx.animations.length > 0) {
      fbx.animations.forEach((val: THREE.AnimationClip, idx: number, ary: THREE.AnimationClip[]) => {
        console.log('len=', ary.length, "animations[" , idx, "] : ", val.name);
      })
      animActions[0] = mixer.current.clipAction(fbx.animations[0], ref.current)
      animActions[1] = mixer.current.clipAction(fbx.animations[1], ref.current)
      animActions[2] = mixer.current.clipAction(fbx.animations[2], ref.current)
      animActions[3] = mixer.current.clipAction(fbx.animations[3], ref.current)
      animActions[0].play()
    }
  }, [])

  useEffect(() => {
    const act: THREE.AnimationAction = animActions[animIdx.index]
    act?.reset().fadeIn(animIdx.remaintime).play()
    return () => {
      act?.fadeOut(animIdx.remaintime)
    }
  }, [animIdx])

  useFrame((state, delta) => {
    mixer.current!.update(delta);
    const durationtime: number= animActions[animIdx.index].getClip().duration
    const currenttime: number = animActions[animIdx.index].time
    if(currenttime/durationtime > 0.95/*95%を超えたら発火*/) {
      const remaintime: number = durationtime - currenttime
      const index: number = (animIdx.index+1) % (fbx.animations.length)
      console.log('remaintime=', remaintime, ' index=', index)
      setAnimIdx( {remaintime: remaintime, index: index} )
    }
  });

  return (
    // <primitive object={fbx} position={[0, 0, 0]} />
    <group ref={ref} dispose={null}  rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
      <group name="Scene">
        <group name="Armature">
          <primitive object={fbx} />
          <group name="Dragon_Mesh">
            <skinnedMesh name="Dragon_Mesh_1" material={material} />
            <skinnedMesh name="Dragon_Mesh_2" material={material} />
            <skinnedMesh name="Dragon_Mesh_3" material={material} />
          </group>
        </group>
      </group>
    </group>
  )
}

const App = () => {
  return (
    <div style={{ width: "100vw", height: "75vh" }}>
      <Canvas camera={{ position: [3, 1, 2] }}>
        <ambientLight intensity={2} />
        <pointLight position={[40, 40, 40]} />
        <Suspense fallback={null}>
          <FBXModel />
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
