import type { MeshType } from "../types";
import useStore from "../hooks/useStore";
import PropertyPanel from "./PropertyPanel";
import Button from "./Button";

const meshButtons: { label: string; type: MeshType }[] = [
    { label: "Add Tall", type: "Full" },
    { label: "Add Top", type: "Upper" },
    { label: "Add Bottom", type: "Lower" },
    { label: "Add Tall Spacer", type: "FullSpacer" },
    { label: "Add Bottom Spacer", type: "LowerSpacer" },
    { label: "Add Top Spacer", type: "UpperSpacer" },
];

export default function ToolBar() {
    const addMesh = useStore((state) => state.addMesh);
    const selectedId = useStore((state) => state.selectedId);
    const deleteMesh = useStore((state) => state.deleteMesh);
    const offset = useStore((state) => state.offset);
    const setOffset = useStore((state) => state.setOffset);

    const handleDeleteSelected = () => {
        if (selectedId !== null) {
            deleteMesh(selectedId);
        }
    };

    return (
        <div className="absolute top-4 right-4 z-10 flex flex-col bg-white border rounded-xl gap-4 p-4">
            {meshButtons.map((btn) => (
                <Button key={btn.type} onClick={() => addMesh(btn.type)}>
                    {btn.label}
                </Button>
            ))}

            <label className="flex items-center gap-4">
                Offset:
                <input type="range" min={0} max={5} step={0.1} value={offset} onChange={(e) => setOffset(parseFloat(e.target.value))} />
                <span className="w-12 items-center">{offset.toFixed(2)}</span>
            </label>

            {selectedId && (
                <Button className="flex items-center justify-center bg-pink-900 text-white rounded-lg border border-white p-3" onClick={handleDeleteSelected}>
                    Delete Selected
                </Button>
            )}

            <PropertyPanel />
        </div>
    );
}
