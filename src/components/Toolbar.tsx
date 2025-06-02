import type { MeshType } from "../enums";
import useStore from "../hooks/useStore";

const meshButtons: { label: string; type: MeshType }[] = [
    { label: "Add Tall", type: "tall" },
    { label: "Add Top", type: "top" },
    { label: "Add Bottom", type: "bottom" },
    { label: "Add Tall Spacer", type: "tallSpacer" },
    { label: "Add Bottom Spacer", type: "bottomSpacer" },
    { label: "Add Top Spacer", type: "topSpacer" },
];

export default function ToolBar() {
    const addMesh = useStore((state) => state.addMesh);
    const selectedId = useStore((state) => state.selectedId);
    const deleteMesh = useStore((state) => state.deleteMesh);

    const handleDeleteSelected = () => {
        if (selectedId !== null) {
            deleteMesh(selectedId);
        }
    };

    return (
        <div className="absolute top-4 right-4 z-10 flex flex-col p-4 bg-green-300">
            {meshButtons.map((btn) => (
                <button key={btn.type} onClick={() => addMesh(btn.type)}>
                    {btn.label}
                </button>
            ))}
            <button
                onClick={handleDeleteSelected}
                disabled={selectedId === null}
                style={{
                    marginLeft: "10px",
                    backgroundColor: selectedId === null ? "#ccc" : "red",
                    color: "white",
                }}
            >
                Delete Selected
            </button>
        </div>
    );
}
