type AudioFeatureKey = 'energy' | 'danceability' | 'valence';


type TrackItem = {
    name: string;
    popularity: number;
    duration_ms: number;
    album: {
        name: string;
        images: Array<{ url: string }>;
    };
    artists: Array<{ name: string }>;
} & Partial<Record<AudioFeatureKey, number>>;


type MockResult = {
    tracks: {
        items: TrackItem[];
    };
};

export const STATS = [
    { label: "ENRG", key: "energy", color: "#FFD319" },
    { label: "DNCE", key: "danceability", color: "#F41A2B" },
    { label: "MOOD", key: "valence", color: "#3387B9" },
] as const;

export function StatMeter({ label, value, color }: { label: string; value?: number; color: string }) {
    const pct = Math.round((value ?? 0) * 100);
    const SEGMENTS = 12;
    const filled = Math.round((pct / 100) * SEGMENTS);

    return (
        <div>
            <div className="flex justify-between mb-1 font-quub font-normal text-[10px] uppercase tracking-[0.12em]">
                <span className="text-[#888]">{label}</span>
                <span className="font-mono" style={{ color, textShadow: `0 0 6px ${color}66` }}>
                    {String(pct).padStart(3, "0")}
                </span>
            </div>

            <div
                role="meter"
                aria-label={label}
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                className="flex gap-[2px] bg-[#0a0a0a] p-[2px] border border-[#1e1e1e] h-2.5"
            >
                {Array.from({ length: SEGMENTS }).map((_, i) => (
                    <div
                        key={i}
                        className="flex-1 transition-colors duration-200"
                        style={{
                            backgroundColor: i < filled ? color : "#1a1a1a",
                            boxShadow: i < filled ? `0 0 4px ${color}80` : "none",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export function formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function sumDuration(data: MockResult): string {
    const totalMs = data?.tracks.items.reduce((sum, track) => sum + track.duration_ms, 0) ?? 0;
    return formatDuration(totalMs);
}
