import useStore from "../hooks/useStore";

export default function Scene() {
    const { selectMesh, selectedId, meshes } = useStore();
    // const { pointer, raycaster, camera, gl } = useThree();

    function handleClick(id: number) {
        const meshData = meshes.find((m) => m.id === id);
        if (meshData) {
            selectMesh(meshData.id);
        }
    }

    return (
        <>
            {meshes.map((mesh) => {
                let color = "blue";
                if (mesh.type === "tallSpacer" || mesh.type === "bottomSpacer" || mesh.type === "topSpacer") {
                    color = "orange";
                }
                if (selectedId === mesh.id) {
                    color = "purple";
                }

                const transparent = mesh.type === "tallSpacer" || mesh.type === "bottomSpacer" || mesh.type === "topSpacer";

                const opacity = transparent ? 0.5 : 1.0;

                return (
                    <mesh key={mesh.id} name={mesh.id.toString()} position={mesh.position} scale={mesh.scale} onClick={(_event) => handleClick(mesh.id)}>
                        <boxGeometry />
                        <meshStandardMaterial color={color} transparent={transparent} opacity={opacity} />
                    </mesh>
                );
            })}
        </>
    );
}
