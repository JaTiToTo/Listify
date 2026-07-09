import { useEffect, useState } from 'react';

import { apiGet } from '../lib/api';

type TrackItem = {
    name: string;
    popularity: number;
    duration_ms: number;
    album: {
        name: string;
        images: Array<{ url: string }>;
    };
    artists: Array<{ name: string }>;
};

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
                        <article key={`${track.name}-${artistName}`} className="rounded-3xl border border-[#e0e0e0] bg-[#f7f9ef] p-4 shadow-soft">
                            <div className="flex gap-4">

                                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#f7f9ef]">
                                    {coverImage ? <img src={coverImage} alt={"Placeholder"} className="h-full w-full object-cover" /> : null}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h2 className="truncate font-quub text-lg font-semibold text-[#1e1e1e]">{track.name}</h2>
                                    {/* Info Block */}
                                    <p className="truncate text-sm text-gray-600">{artistName}</p>
                                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                                        {track.album.name} | {Math.round(track.duration_ms / 1000)}s
                                    </p>
                                </div>

                                {/* Vibe Section */}
                                {/* TODO: later do: width: `style={{width: `${energy * 100}%`}}` */}
                                {/* Vibe Section */}
                                <div className="w-48 border-l-2 border-[#1e1e1e] pl-4">

                                    <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#666]">
                                        Audio Profile
                                    </p>

                                    <div className="space-y-3">

                                        <div>
                                            <div className="mb-1 flex justify-between font-mono text-[10px] uppercase tracking-wider">
                                                <span>ENRG</span>
                                                <span>82</span>
                                            </div>

                                            <div className="flex h-2 overflow-hidden border border-[#1e1e1e]">
                                                <div
                                                    className="bg-[#00e5ff]"
                                                    style={{ width: "82%" }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="mb-1 flex justify-between font-mono text-[10px] uppercase tracking-wider">
                                                <span>DNCE</span>
                                                <span>63</span>
                                            </div>

                                            <div className="flex h-2 overflow-hidden border border-[#1e1e1e]">
                                                <div
                                                    className="bg-[#ff00aa]"
                                                    style={{ width: "63%" }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="mb-1 flex justify-between font-mono text-[10px] uppercase tracking-wider">
                                                <span>MOOD</span>
                                                <span>91</span>
                                            </div>

                                            <div className="flex h-2 overflow-hidden border border-[#1e1e1e]">
                                                <div
                                                    className="bg-[#d7ff3f]"
                                                    style={{ width: "91%" }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Remove Section */}
                                <div className="flex shrink-0 items-start justify-end">
                                    <button
                                        className="flex h-8 w-8 items-center justify-center rounded-xl
                                        bg-red-100 text-red-500 transition hover:bg-red-200 hover:scale-105">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="25"
                                            height="25"
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
        </div>
    );
};

export default DraftPage;