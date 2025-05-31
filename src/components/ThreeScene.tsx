import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";

import { useGLTF } from "@react-three/drei";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function ThreeScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight color={"#ff0"} />

      <pointLight position={[10, 10, 10]} />

      <Box>
        <meshStandardMaterial />
        <Model url="https://saeed-latifi.github.io/assets-3d/base.glb" />
      </Box>

      <OrbitControls />
    </Canvas>
  );
}
