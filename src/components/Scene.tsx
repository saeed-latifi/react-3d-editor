// src/components/Scene.tsx
// import { Center } from "@react-three/drei";
import useStore from "../hooks/useStore";

export default function Scene() {
    const { selectMesh, selectedId, meshes } = useStore();

    return (
        <>
            {meshes.map((mesh) => {
                const isSelected = mesh.id === selectedId;
                let color = "blue";
                if (mesh.type.includes("Spacer")) color = "orange";
                if (isSelected) color = "purple";

                const transparent = mesh.type.includes("Spacer");
                const opacity = transparent ? 0.5 : 1.0;

                return (
                    <mesh key={mesh.id} name={mesh.id.toString()} position={[mesh.position.x, mesh.position.y, mesh.position.z]} onClick={() => selectMesh(mesh.id)}>
                        {/* <Center translateX="left" translateY={mesh.type === "Upper" ? "top" : "bottom"} translateZ="back"> */}
                        <boxGeometry args={[mesh.dimensions.x, mesh.dimensions.y, mesh.dimensions.z]} />
                        <meshStandardMaterial color={color} transparent={transparent} opacity={opacity} />
                        {/* </Center> */}
                    </mesh>
                );
            })}
        </>
    );
}
