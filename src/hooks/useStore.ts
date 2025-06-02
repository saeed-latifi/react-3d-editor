// src/store.ts
import { create } from "zustand";
import { Vector3 } from "three";
import type { MeshType } from "../enums";

interface Mesh {
    id: number;
    type: MeshType;
    position: Vector3;
    scale: Vector3;
}

type State = {
    meshes: Mesh[];
    selectedId: number | null;
    nextId: number;
};

type Actions = {
    addMesh: (type: MeshType) => void;
    selectMesh: (id: number | null) => void;
    deleteMesh: (id: number) => void;
};

const useStore = create<State & Actions>((set) => ({
    meshes: [],
    selectedId: null,
    nextId: 1,

    addMesh: function (type) {
        set(function (state) {
            const dimensionMap: Record<MeshType, Vector3> = {
                ["tall"]: new Vector3(1, 3, 1),
                ["top"]: new Vector3(1, 0.5, 1),
                ["bottom"]: new Vector3(1, 0.5, 1),
                ["tallSpacer"]: new Vector3(1, 1, 1),
                ["bottomSpacer"]: new Vector3(1, 0.5, 1),
                ["topSpacer"]: new Vector3(1, 0.5, 1),
            };

            const getYPosition = (meshType: MeshType): number => {
                switch (meshType) {
                    case "top":
                    case "topSpacer":
                        return 2.5;
                    case "bottom":
                    case "bottomSpacer":
                        return 0.5;
                    default:
                        return 1.5;
                }
            };

            // Track last positions
            let lastTopX = -1;
            let lastBottomX = -1;
            let lastTallX = -1;

            for (const mesh of state.meshes) {
                if (mesh.type === "top" || mesh.type === "topSpacer") {
                    if (mesh.position.x > lastTopX) lastTopX = mesh.position.x;
                } else if (mesh.type === "bottom" || mesh.type === "bottomSpacer") {
                    if (mesh.position.x > lastBottomX) lastBottomX = mesh.position.x;
                } else if (mesh.type === "tall" || mesh.type === "tallSpacer") {
                    if (mesh.position.x > lastTallX) lastTallX = mesh.position.x;
                }
            }

            let newX = 0;

            if (type === "top" || type === "topSpacer") {
                newX = Math.max(lastTopX + 1, lastTallX + 1);
            } else if (type === "bottom" || type === "bottomSpacer") {
                newX = Math.max(lastBottomX + 1, lastTallX + 1);
            } else if (type === "tall" || type === "tallSpacer") {
                newX = Math.max(lastTallX + 1, lastTopX + 1, lastBottomX + 1);
            }

            const id = state.nextId;
            const y = getYPosition(type);

            return {
                meshes: [
                    ...state.meshes,
                    {
                        id,
                        type,
                        position: new Vector3(newX, y, 0),
                        scale: dimensionMap[type].clone(),
                    },
                ],
                nextId: id + 1,
            };
        });
    },

    // addMesh: function (type) {
    //     set(function (state) {
    //         const dimensionMap: Record<MeshType, Vector3> = {
    //             ["tall"]: new Vector3(1, 3, 1),
    //             ["top"]: new Vector3(1, 0.5, 1),
    //             ["bottom"]: new Vector3(1, 0.5, 1),
    //             ["tallSpacer"]: new Vector3(1, 1, 1),
    //             ["bottomSpacer"]: new Vector3(1, 0.5, 1),
    //             ["topSpacer"]: new Vector3(1, 0.5, 1),
    //         };

    //         const getYPosition = (meshType: MeshType): number => {
    //             switch (meshType) {
    //                 case "top":
    //                 case "topSpacer":
    //                     return 2;
    //                 case "bottom":
    //                 case "bottomSpacer":
    //                     return -2;
    //                 default:
    //                     return 0;
    //             }
    //         };

    //         let lastX = -1;
    //         let lastTallX = -1;

    //         for (const mesh of state.meshes) {
    //             if (type === "tall") {
    //                 lastTallX = mesh.position.x;
    //             }
    //             if (mesh.position.x > lastX) {
    //                 lastX = mesh.position.x;
    //             }
    //         }

    //         let newX = lastX + 1;

    //         if ((type === "top" || type === "bottom") && lastTallX < lastX) {
    //             newX = lastX + 1;
    //         }

    //         if (lastTallX >= 0 && lastX <= lastTallX) {
    //             newX = lastTallX + 1;
    //         }

    //         const id = state.nextId;
    //         const y = getYPosition(type);

    //         return {
    //             meshes: [
    //                 ...state.meshes,
    //                 {
    //                     id,
    //                     type,
    //                     position: new Vector3(newX, y, 0),
    //                     scale: dimensionMap[type].clone(),
    //                 },
    //             ],
    //             nextId: id + 1,
    //         };
    //     });
    // },

    selectMesh: function (id) {
        set({ selectedId: id });
    },

    deleteMesh: function (id) {
        set(function (state) {
            return {
                meshes: state.meshes.filter((mesh) => mesh.id !== id),
                selectedId: state.selectedId === id ? null : state.selectedId,
            };
        });
    },
}));

export default useStore;
