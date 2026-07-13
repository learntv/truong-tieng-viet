import halongScene from "@/assets/scenes/halong-scene.jpg";
import goldenBridgeScene from "@/assets/scenes/golden-bridge-scene.jpg";

// Each chủ đề gets its own backdrop; topics without a dedicated scene yet fall back to Hạ Long.
export const CHU_DE_SCENES: Record<number, string> = {
  0: halongScene,
  1: goldenBridgeScene,
};

export function sceneForChuDe(chuDeIndex: number): string {
  return CHU_DE_SCENES[chuDeIndex] ?? halongScene;
}

export const ALL_SCENES = Array.from(new Set([halongScene, ...Object.values(CHU_DE_SCENES)]));

export { halongScene, goldenBridgeScene };
