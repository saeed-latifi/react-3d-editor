import { create } from "zustand";
import { Vector3 } from "three";
import type { Mesh, MeshType } from "../types";

type State = {
    meshes: Mesh[];
    selectedId: number | null;
    nextId: number;
    offset: number;
};

type Actions = {
    addMesh: (type: MeshType) => void;
    selectMesh: (id: number | null) => void;
    deleteMesh: (id: number) => void;
    setOffset: (value: number) => void;
    updateDimensions: (id: number, dimensions: Vector3) => void;
};

const dimensionMap: Record<MeshType, Vector3> = {
    Full: new Vector3(1, 3, 1),
    Upper: new Vector3(1, 0.5, 1),
    Lower: new Vector3(1, 0.5, 1),
    FullSpacer: new Vector3(1, 3, 1),
    UpperSpacer: new Vector3(1, 0.5, 1),
    LowerSpacer: new Vector3(1, 0.5, 1),
};

const getYPosition = (meshType: MeshType, offset: number): number => {
    switch (meshType) {
        case "Upper":
        case "UpperSpacer":
            return 1 + offset / 2;
        case "Lower":
        case "LowerSpacer":
            return -1 - offset / 2;
        default:
            return 0;
    }
};

const getFullHeightFromParts = (upperHeight: number, lowerHeight: number, offset: number): number => {
    return upperHeight + lowerHeight + offset;
};

const meshesInit = [
    {
        id: 1,
        type: "Full",
        position: {
            x: 0,
            y: 0,
            z: 0,
        },
        dimensions: {
            x: 1,
            y: 3,
            z: 1,
        },
    },
    {
        id: 2,
        type: "Upper",
        position: {
            x: 1,
            y: 1.25,
            z: 0,
        },
        dimensions: {
            x: 1,
            y: 0.5,
            z: 1,
        },
    },
    {
        id: 3,
        type: "Lower",
        position: {
            x: 1,
            y: -1.25,
            z: 0,
        },
        dimensions: {
            x: 1,
            y: 0.5,
            z: 1,
        },
    },
    {
        id: 4,
        type: "FullSpacer",
        position: {
            x: 2,
            y: 0,
            z: 0,
        },
        dimensions: {
            x: 1,
            y: 3,
            z: 1,
        },
    },
    {
        id: 5,
        type: "Lower",
        position: {
            x: 3,
            y: -1.25,
            z: 0,
        },
        dimensions: {
            x: 1,
            y: 0.5,
            z: 1,
        },
    },
    {
        id: 6,
        type: "Upper",
        position: {
            x: 3,
            y: 1.25,
            z: 0,
        },
        dimensions: {
            x: 1,
            y: 0.5,
            z: 1,
        },
    },
    {
        id: 7,
        type: "Full",
        position: {
            x: 4,
            y: 0,
            z: 0,
        },
        dimensions: {
            x: 1,
            y: 3,
            z: 1,
        },
    },
];

const useStore = create<State & Actions>((set, _get) => ({
    meshes: meshesInit as Mesh[],
    selectedId: null,
    nextId: meshesInit.length + 1,
    offset: 0.5,

    addMesh: function (type) {
        set(function (state) {
            let lastTopX = -1;
            let lastBottomX = -1;
            let lastTallX = -1;

            for (const mesh of state.meshes) {
                const x = mesh.position.x;
                if (mesh.type === "Upper" || mesh.type === "UpperSpacer") {
                    if (x > lastTopX) lastTopX = x;
                } else if (mesh.type === "Lower" || mesh.type === "LowerSpacer") {
                    if (x > lastBottomX) lastBottomX = x;
                } else if (mesh.type === "Full" || mesh.type === "FullSpacer") {
                    if (x > lastTallX) lastTallX = x;
                }
            }

            let newX = 0;

            if (type === "Upper" || type === "UpperSpacer") {
                newX = Math.max(lastTopX + 1, lastTallX + 1);
            } else if (type === "Lower" || type === "LowerSpacer") {
                newX = Math.max(lastBottomX + 1, lastTallX + 1);
            } else {
                newX = Math.max(lastTallX + 1, lastTopX + 1, lastBottomX + 1);
            }

            const id = state.nextId;
            const y = getYPosition(type, state.offset);
            const dimensions = dimensionMap[type].clone();

            // If it's Full and there are matching Upper+Lower nearby, adjust height
            if (type === "Full" || type === "FullSpacer") {
                const sameXUpper = state.meshes.find((m) => m.position.x === newX && (m.type === "Upper" || m.type === "UpperSpacer"));
                const sameXLower = state.meshes.find((m) => m.position.x === newX && (m.type === "Lower" || m.type === "LowerSpacer"));

                if (sameXUpper && sameXLower) {
                    dimensions.y = getFullHeightFromParts(sameXUpper.dimensions.y, sameXLower.dimensions.y, state.offset);
                }
            }

            return {
                meshes: [
                    ...state.meshes,
                    {
                        id,
                        type,
                        position: new Vector3(newX, y, 0),
                        dimensions: dimensions,
                    },
                ],
                nextId: id + 1,
            };
        });
    },

    selectMesh: function (id) {
        set({ selectedId: id });
    },

    deleteMesh: function (id) {
        set(function (state) {
            const updatedMeshes = state.meshes.filter((mesh) => mesh.id !== id);

            let lastTopX = -1;
            let lastBottomX = -1;
            let lastTallX = -1;

            const recalculatedMeshes = [];

            for (const mesh of updatedMeshes) {
                let newX = 0;

                if (mesh.type === "Upper" || mesh.type === "UpperSpacer") {
                    newX = Math.max(lastTopX + 1, lastTallX + 1);
                    lastTopX = newX;
                } else if (mesh.type === "Lower" || mesh.type === "LowerSpacer") {
                    newX = Math.max(lastBottomX + 1, lastTallX + 1);
                    lastBottomX = newX;
                } else if (mesh.type === "Full" || mesh.type === "FullSpacer") {
                    newX = Math.max(lastTallX + 1, lastTopX + 1, lastBottomX + 1);
                    lastTallX = newX;
                }

                recalculatedMeshes.push({
                    ...mesh,
                    position: new Vector3(newX, mesh.position.y, mesh.position.z),
                });
            }

            return {
                meshes: recalculatedMeshes,
                selectedId: state.selectedId === id ? null : state.selectedId,
            };
        });
    },

    setOffset: function (value) {
        set(function (state) {
            const offset = Math.max(0, value);

            const updatedMeshes = state.meshes.map((mesh) => {
                const y = getYPosition(mesh.type, offset);

                if (mesh.type === "Full" || mesh.type === "FullSpacer") {
                    const upperMesh = state.meshes.find((m) => m.position.x === mesh.position.x && (m.type === "Upper" || m.type === "UpperSpacer"));
                    const lowerMesh = state.meshes.find((m) => m.position.x === mesh.position.x && (m.type === "Lower" || m.type === "LowerSpacer"));

                    if (upperMesh && lowerMesh) {
                        mesh.dimensions.y = getFullHeightFromParts(upperMesh.dimensions.y, lowerMesh.dimensions.y, offset);
                    }
                }

                return {
                    ...mesh,
                    position: new Vector3(mesh.position.x, y, mesh.position.z),
                };
            });

            return {
                offset,
                meshes: updatedMeshes,
            };
        });
    },

    updateDimensions: function (id, newDimensions) {
        set(function (state) {
            const updatedMeshes = [...state.meshes];
            const index = updatedMeshes.findIndex((m) => m.id === id);

            if (index === -1) return state;

            const oldMesh = updatedMeshes[index];

            const updatedMesh = {
                ...oldMesh,
                dimensions: newDimensions.clone(),
            };

            // If it's Upper or Lower, find matching Full and update its height
            if (oldMesh.type === "Upper" || oldMesh.type === "Lower" || oldMesh.type === "UpperSpacer" || oldMesh.type === "LowerSpacer") {
                const fullMesh = updatedMeshes.find((m) => m.position.x === oldMesh.position.x && (m.type === "Full" || m.type === "FullSpacer"));

                if (fullMesh) {
                    const otherMesh = updatedMeshes.find(
                        (m) => m.position.x === oldMesh.position.x && m.id !== oldMesh.id && (m.type === "Upper" || m.type === "Lower" || m.type === "UpperSpacer" || m.type === "LowerSpacer"),
                    );

                    if (otherMesh) {
                        fullMesh.dimensions.y = getFullHeightFromParts(
                            oldMesh.type === "Upper" || oldMesh.type === "UpperSpacer" ? newDimensions.y : otherMesh.dimensions.y,
                            oldMesh.type === "Lower" || oldMesh.type === "LowerSpacer" ? newDimensions.y : otherMesh.dimensions.y,
                            state.offset,
                        );
                    }
                }
            }

            updatedMeshes[index] = updatedMesh;

            return {
                meshes: updatedMeshes,
            };
        });
    },
}));

export default useStore;
