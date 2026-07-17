const PROJECT_BACKGROUNDS = [
    "linear-gradient(145deg, #1a3a2a 0%, #0d1f16 55%, #1F1F21 100%)",
    "linear-gradient(145deg, #1a2a3a 0%, #0d1520 55%, #1F1F21 100%)",
    "linear-gradient(145deg, #2a1a3a 0%, #160d20 55%, #1F1F21 100%)",
    "linear-gradient(145deg, #3a2a1a 0%, #20150d 55%, #1F1F21 100%)",
    "linear-gradient(145deg, #1a3a3a 0%, #0d2020 55%, #1F1F21 100%)",
    "linear-gradient(145deg, #2a3a1a 0%, #15200d 55%, #1F1F21 100%)",
    "linear-gradient(145deg, #3a1a2a 0%, #200d15 55%, #1F1F21 100%)",
    "linear-gradient(145deg, #1a2a2a 0%, #0d1818 55%, #1F1F21 100%)",
] as const;

const ACCENT_OVERLAYS = [
    "radial-gradient(ellipse 80% 60% at 20% 20%, rgba(58, 230, 1, 0.22), transparent 60%)",
    "radial-gradient(ellipse 80% 60% at 80% 30%, rgba(58, 180, 230, 0.2), transparent 60%)",
    "radial-gradient(ellipse 80% 60% at 30% 80%, rgba(180, 58, 230, 0.18), transparent 60%)",
    "radial-gradient(ellipse 80% 60% at 70% 70%, rgba(230, 180, 58, 0.18), transparent 60%)",
    "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(58, 230, 180, 0.2), transparent 60%)",
    "radial-gradient(ellipse 80% 60% at 15% 50%, rgba(120, 230, 58, 0.18), transparent 60%)",
    "radial-gradient(ellipse 80% 60% at 85% 60%, rgba(230, 58, 120, 0.16), transparent 60%)",
    "radial-gradient(ellipse 80% 60% at 40% 40%, rgba(58, 230, 1, 0.16), transparent 60%)",
] as const;

export function getProjectBackground(projectId: number | string): string {
    const id = Number(projectId) || 0;
    const base = PROJECT_BACKGROUNDS[id % PROJECT_BACKGROUNDS.length];
    const overlay = ACCENT_OVERLAYS[id % ACCENT_OVERLAYS.length];
    return `${overlay}, ${base}`;
}
