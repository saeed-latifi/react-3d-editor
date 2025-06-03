import type { Vector3 } from "three";

export type MeshType = "Full" | "Upper" | "Lower" | "FullSpacer" | "UpperSpacer" | "LowerSpacer";

export interface Mesh {
    id: number;
    type: MeshType;
    position: Vector3;
    dimensions: Vector3;
}
