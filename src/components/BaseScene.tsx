import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Scene from "./Scene";
import ToolBar from "./Toolbar";

export default function BaseScene() {
    return (
        <div className="w-full h-full bg-amber-100">
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Scene />
                <OrbitControls />
            </Canvas>
            <ToolBar />
        </div>
    );
}
