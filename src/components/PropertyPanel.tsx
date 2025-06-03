import useStore from "../hooks/useStore";
import { Vector3 } from "three";

export default function PropertyPanel() {
    const selectedId = useStore((state) => state.selectedId);
    const mesh = useStore((state) => (selectedId ? state.meshes.find((m) => m.id === selectedId) : null));
    const updateDimensions = useStore((state) => state.updateDimensions);

    if (!mesh) return <div>No mesh selected</div>;

    return (
        <div className="flex flex-col gap-4 w-full">
            <h3 className="font-bold">Properties</h3>
            <label className="flex items-center gap-4">
                Width:
                <input type="range" min={0.5} max={5} step={0.1} value={mesh.dimensions.x} onChange={(e) => updateDimensions(mesh.id, new Vector3(+e.target.value, mesh.dimensions.y, mesh.dimensions.z))} />
                <span className="w-12 items-center">{mesh.dimensions.x.toFixed(2)}</span>
            </label>
            <label className="flex items-center gap-4">
                Height:
                <input type="range" min={0.5} max={10} step={0.1} value={mesh.dimensions.y} onChange={(e) => updateDimensions(mesh.id, new Vector3(mesh.dimensions.x, +e.target.value, mesh.dimensions.z))} />
                <span className="w-12 items-center">{mesh.dimensions.y.toFixed(2)}</span>
            </label>
            <label className="flex items-center gap-4">
                Depth:
                <input type="range" min={0.5} max={5} step={0.1} value={mesh.dimensions.z} onChange={(e) => updateDimensions(mesh.id, new Vector3(mesh.dimensions.x, mesh.dimensions.y, +e.target.value))} />
                <span className="w-12 items-center">{mesh.dimensions.z.toFixed(2)}</span>
            </label>
        </div>
    );
}
