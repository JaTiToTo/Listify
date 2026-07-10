import { useEffect, useState } from 'react';

import { apiGet } from '../lib/api';

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

const DraftPage = () => {
    const [data, setData] = useState<MockResult | null>(null);

    useEffect(() => {
        apiGet<MockResult>('/mock-result')
            .then(setData)
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    if (!data) {
{/* TODO: Implement loading state */ }
        return <div>Loading...</div>;
    }


    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-8 py-8">
            <div className="flex flex-col gap-2">
                <h1 className="font-vampire text-4xl font-bold tracking-tight text-[#1e1e1e]">Draft playlist</h1>
                <p className="font-quub text-lg font-semibold text-gray-800">{data.tracks.items.length} tracks</p>
            </div>

            <div className="flex-col flex gap-4 space-x-0">
                {data.tracks.items.map((track) => {
                    const coverImage = track.album.images[0]?.url;
                    const artistName = track.artists.map((artist) => artist.name).join(', ');

                    return (
                        <article key={`${track.name}-${artistName}`} className="rounded-3xl border border-[#24B81F] bg-[#f7f9ef] overflow-hidden shadow-soft">
{/* TODO: Implement reorder functionality */ }
                            <div className="flex">
                                <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 md:flex-row">

                                    {/* Cover + Info */}
                                    <div className="flex min-w-0 flex-1 items-center gap-4">
                                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#3387B9] bg-[#f7f9ef]">
                                            {coverImage ? (
                                                <img src={coverImage} alt={`${track.album.name} cover`} className="h-full w-full object-cover" />
                                            ) : null}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h2 className="truncate font-quub text-lg font-semibold text-[#1e1e1e]">{track.name}</h2>
                                            <p className="truncate text-sm text-gray-600">{artistName}</p>
                                            <p className="mt-1.5 truncate text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                                                {track.album.name} | {formatDuration(track.duration_ms)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Vibe Section */}
                                    <div className="w-full border-t-2 border-[#1e1e1e] pt-4 md:w-52 md:border-l-2 md:border-t-0 md:pl-6 md:pr-2 md:pt-0">
                                        <div className="space-y-3">
                                            {STATS.map(({ label, key, color }) => (
                                                <StatMeter key={key} label={label} value={track[key]} color={color} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Remove Section */}
                                <div className="flex shrink-0">
                                    <button
                                        className="flex w-8 self-stretch items-center justify-center rounded-l-none rounded-r-3xl
                                        bg-red-100 text-red-500 transition hover:bg-red-300 hover:scale-105">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="22"
                                            height="22"
                                            viewBox="0 0 24 24"
                                            fill="red"
                                        >
                                            <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16zm-9.489 5.14a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" />
                                            <path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            {/* Footer: duration summary + save action */}
            <div className="flex flex-col gap-4 rounded-3xl border border-[#24B81F] bg-[#f7f9ef] p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
                <p className="font-vampire text-sm font-medium uppercase tracking-[0.18em] text-gray-500">
                    Overall duration{" "}
                    <span
                        className="ml-2 font-vampire text-lg normal-case tracking-normal"
                        style={{ color: "#24B81F", textShadow: "0 0 6px #24B81F66" }}
                    >
                        {sumDuration(data)}
                    </span>
                </p>

                <button
                    className="rounded-2xl border border-[#1e1e1e] bg-[#3387B9] px-6 py-3
                   font-vampire text-sm uppercase font-medium tracking-[0.12em] text-[#f7f9ef]
                   transition-colors hover:bg-[#1e9a1a]
                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24B81F]"
                >
                    Save playlist to library
                </button>
            </div>
        </div>
    );
};

{/* Statistic Meters Logic */ }
const STATS = [
    { label: "ENRG", key: "energy", color: "#FFD319" },
    { label: "DNCE", key: "danceability", color: "#F41A2B" },
    { label: "MOOD", key: "valence", color: "#3387B9" },
] as const;

function StatMeter({ label, value, color }: { label: string; value?: number; color: string }) {
    const pct = Math.round((value ?? 0) * 100);
    const SEGMENTS = 12;
    const filled = Math.round((pct / 100) * SEGMENTS);

    return (
        <div>
            <div className="mb-1 flex justify-between font-quub text-[10px] font-normal uppercase tracking-[0.12em]">
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
                className="flex h-2.5 gap-[2px] border border-[#1e1e1e] bg-[#0a0a0a] p-[2px]"
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

function formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function sumDuration(data: MockResult): string {
    const totalMs = data?.tracks.items.reduce((sum, track) => sum + track.duration_ms, 0) ?? 0;
    return formatDuration(totalMs);
}

export default DraftPage;