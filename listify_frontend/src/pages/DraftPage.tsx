import { useEffect, useState } from "react";

import { apiGetJson, apiPostJson } from "../lib/api";

import { formatDuration, sumDuration } from "../components/StatMeter";

type MockResult = {
  tracks: {
    items: TrackItem[];
  };
};

type RecommendationDebugResponse = {
  items?: Array<{
    id?: string;
    name?: string;
    external_ids?: { isrc?: string };
  }>;
  selectedTags?: string[];
};

const RECOMMENDATIONS_DEBUG_STORAGE_KEY = "listify:last-recommendations-response";
type CreatePlaylistRequest = {
  songIds: string[];
  playlistName: string;
};

type PlaylistResponse = {
  playlistId: string;
};

const playlistRequestPayload: CreatePlaylistRequest = {
  songIds: [
    "spotify:track:2saoOMgzvDizi7CE8qxvyB",
    "spotify:track:4yH9v7cWu7QXJffkusO5bW",
    "spotify:track:0G21yYKMZoHa30cYVi1iA8",
    "spotify:track:0ofHAoxe9vBkTCp2UQIavz",
  ],
  playlistName: "test_playlist",
};

type TrackItem = {
  id?: string;
  name: string;
  popularity: number;
  duration_ms: number;
  preview_url?: string | null;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  artists: Array<{ name: string }>;
  tempo?: number;
  loudness?: number;
  acousticness?: number;
  danceability?: number;
  energy?: number;
  instrumentalness?: number;
  valence?: number;
};

type MetricDefinition = {
  key: "tempo" | "loudness" | "instrumentalness" | "valence" | "acousticness" | "danceability" | "energy";
  label: string;
  accentColor: string;
  toPercent: (track: TrackItem) => number | null;
  valueLabel: (track: TrackItem) => string;
};

const cassetteStripColors = ["#D94B3D", "#F0B429", "#24B81F", "#3387B9"];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function hashSeed(track: TrackItem) {
  const source = `${track.name}-${track.artists.map((artist) => artist.name).join("|")}`;
  return source.split("").reduce((accumulator, char) => accumulator + char.charCodeAt(0), 0);
}

function getFallbackAudioProfile(track: TrackItem) {
  const seed = hashSeed(track);
  const durationMinutes = Math.max(1, Math.round(track.duration_ms / 60000));
  const baseVibe = clamp(track.popularity / 100, 0.15, 0.95);

  return {
    tempo: 90 + (seed % 90),
    loudness: -32 + (seed % 24),
    instrumentalness: clamp((seed % 45) / 100, 0.02, 0.45),
    valence: clamp(baseVibe - 0.12 + ((seed % 16) / 100), 0.1, 0.95),
    acousticness: clamp(0.25 + ((durationMinutes + seed) % 55) / 100, 0.12, 0.85),
    danceability: clamp(baseVibe - 0.08 + ((seed % 14) / 100), 0.2, 0.96),
    energy: clamp(baseVibe + ((seed % 12) / 100), 0.25, 0.98),
  };
}

function getMetricValue(track: TrackItem, key: MetricDefinition["key"]) {
  if (typeof track[key] === "number") {
    return track[key] as number;
  }

  return getFallbackAudioProfile(track)[key];
}

const toUnitPercent = (value?: number) => {
  if (typeof value !== "number") {
    return null;
  }

  const normalized = value > 1 ? value / 100 : value;
  return clamp(Math.round(normalized * 100), 0, 100);
};

const toTempoPercent = (value?: number) => {
  if (typeof value !== "number") {
    return null;
  }

  return clamp(Math.round(((value - 60) / (200 - 60)) * 100), 0, 100);
};

const toLoudnessPercent = (value?: number) => {
  if (typeof value !== "number") {
    return null;
  }

  return clamp(Math.round(((value + 60) / 60) * 100), 0, 100);
};

const metrics: MetricDefinition[] = [
  {
    key: "tempo",
    label: "Tempo",
    accentColor: "#3387B9",
    toPercent: (track) => toTempoPercent(getMetricValue(track, "tempo")),
    valueLabel: (track) => `${Math.round(getMetricValue(track, "tempo"))} BPM`,
  },
  {
    key: "loudness",
    label: "Loudness",
    accentColor: "#D94B3D",
    toPercent: (track) => toLoudnessPercent(getMetricValue(track, "loudness")),
    valueLabel: (track) => `${Math.round(getMetricValue(track, "loudness"))} dB`,
  },
  {
    key: "instrumentalness",
    label: "Instr.",
    accentColor: "#24B81F",
    toPercent: (track) => toUnitPercent(getMetricValue(track, "instrumentalness")),
    valueLabel: (track) => {
      const value = toUnitPercent(getMetricValue(track, "instrumentalness"));
      return `${value ?? 0}%`;
    },
  },
  {
    key: "valence",
    label: "Valence",
    accentColor: "#F0B429",
    toPercent: (track) => toUnitPercent(getMetricValue(track, "valence")),
    valueLabel: (track) => {
      const value = toUnitPercent(getMetricValue(track, "valence"));
      return `${value ?? 0}%`;
    },
  },
  {
    key: "acousticness",
    label: "Acoustic",
    accentColor: "#B96C33",
    toPercent: (track) => toUnitPercent(getMetricValue(track, "acousticness")),
    valueLabel: (track) => {
      const value = toUnitPercent(getMetricValue(track, "acousticness"));
      return `${value ?? 0}%`;
    },
  },
  {
    key: "danceability",
    label: "Dance",
    accentColor: "#7A5CFA",
    toPercent: (track) => toUnitPercent(getMetricValue(track, "danceability")),
    valueLabel: (track) => {
      const value = toUnitPercent(getMetricValue(track, "danceability"));
      return `${value ?? 0}%`;
    },
  },
  {
    key: "energy",
    label: "Energy",
    accentColor: "#24B81F",
    toPercent: (track) => toUnitPercent(getMetricValue(track, "energy")),
    valueLabel: (track) => {
      const value = toUnitPercent(getMetricValue(track, "energy"));
      return `${value ?? 0}%`;
    },
  },
];

function MetricRail({ label, valueLabel, percent, accentColor }: { label: string; valueLabel: string; percent: number | null; accentColor: string }) {
  return (
    <div className="rounded-2xl border border-[#e0e0e0] bg-[#d8dfc2] p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">{label}</span>
        <span className="rounded-full border border-[#1e1e1e] bg-[#f7f9ef] px-2 py-0.5 text-[11px] font-semibold text-[#1e1e1e]">{valueLabel}</span>
      </div>
      <div className="h-2 rounded-full border border-[#1e1e1e] bg-[#ececec]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${percent ?? 0}%`,
            backgroundImage: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}dd 100%)`,
            boxShadow: percent === null ? "none" : `0 0 8px ${accentColor}66`,
            opacity: percent === null ? 0.25 : 1,
          }}
        />
      </div>
    </div>
  );
}

function PlaylistTrackCard({ track, index }: { track: TrackItem; index: number }) {
  const coverImage = track.album.images[0]?.url;
  const artistName = track.artists.map((artist) => artist.name).join(", ");

  return (
    <article className="overflow-hidden rounded-3xl border border-[#e0e0e0] bg-[#f7f9ef] shadow-sm">
      <div className="flex h-1 overflow-hidden">
        {cassetteStripColors.map((color) => (
          <span key={`${track.id ?? track.name}-${color}`} className="h-full flex-1" style={{ backgroundColor: color }} />
        ))}
      </div>

      <div className="flex items-stretch">
        <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#1e1e1e] bg-[#f7f9ef] font-vampire text-sm text-[#1e1e1e]">
              {index + 1}
            </span>

            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-[#3387B9] bg-[#f7f9ef] sm:h-16 sm:w-16">
              {coverImage ? <img src={coverImage} alt={`${track.album.name} cover`} className="h-full w-full object-cover" /> : null}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="truncate font-quub text-base font-bold text-[#1e1e1e] sm:text-lg">{track.name}</h2>
              <p className="truncate text-sm text-gray-600">{artistName}</p>
              <p className="mt-1 truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">{track.album.name}</p>
            </div>

            <div className="hidden rounded-full border border-[#1e1e1e] bg-[#f7f9ef] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#1e1e1e] sm:block">
              {formatDuration(track.duration_ms)}
            </div>
          </div>

          <details className="group rounded-2xl border border-[#e0e0e0] bg-[#f7f9ef] p-3">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
              <span className="font-quub text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">Show audio profile</span>
              <span className="rounded-full border border-[#1e1e1e] bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1e1e1e] transition group-open:-rotate-180">v</span>
            </summary>

            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {metrics.map((metric) => (
                <MetricRail
                  key={`${track.id ?? track.name}-${metric.key}`}
                  label={metric.label}
                  valueLabel={metric.valueLabel(track)}
                  percent={metric.toPercent(track)}
                  accentColor={metric.accentColor}
                />
              ))}
            </div>
          </details>

          <div className="flex items-center justify-between sm:hidden">
            <span className="rounded-full border border-[#1e1e1e] bg-[#f7f9ef] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#1e1e1e]">
              {formatDuration(track.duration_ms)}
            </span>
          </div>
        </div>

        <button
          type="button"
          aria-label={`Remove ${track.name} from draft`}
          className="flex w-11 shrink-0 items-center justify-center self-stretch border-l border-[#e0e0e0] bg-[#fff2f0] text-[#d94b3d] transition-colors hover:bg-[#ffd9d4]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16zm-9.489 5.14a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" />
            <path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z" />
          </svg>
        </button>
      </div>
    </article>
  );
}

const DraftPage = () => {
  const [data, setData] = useState<MockResult | null>(null);
  const [recommendationDebug, setRecommendationDebug] = useState<RecommendationDebugResponse | null>(null);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);

  useEffect(() => {
    const storedResponse = sessionStorage.getItem(RECOMMENDATIONS_DEBUG_STORAGE_KEY);
    if (storedResponse) {
      try {
        setRecommendationDebug(JSON.parse(storedResponse) as RecommendationDebugResponse);
      } catch (error) {
        console.error("Failed to parse stored recommendations response:", error);
      }
    }

    apiGetJson<MockResult>("/mock-result")
      .then(setData)
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSavePlaylist = async () => {
    setIsCreatingPlaylist(true);

    try {
      const response = await apiPostJson<CreatePlaylistRequest, PlaylistResponse>(
        "/playlists",
        playlistRequestPayload,
      );
      console.log("Playlist created with id:", response.playlistId);
    } catch (error) {
      console.error("Failed to create playlist:", error);
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  if (!data) {
    {
      /* TODO: Implement loading state */
    }
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 py-8 pb-32">
      <div className="flex flex-col gap-2">
        <h1 className="font-vampire text-4xl font-bold tracking-tight text-[#1e1e1e]">Draft playlist</h1>
        <p className="font-quub text-lg font-semibold text-gray-600">{data.tracks.items.length} tracks selected</p>
        <details className="group w-fit rounded-2xl border border-[#1e1e1e] bg-[#f7f9ef] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1e1e1e]">
          <summary className="flex cursor-pointer list-none items-center gap-2">
            <span>Debug response: {recommendationDebug?.items?.length ?? 0} items from /songs/recommendations</span>
            <span className="rounded-full border border-[#1e1e1e] bg-white px-2 py-0.5 text-[10px] transition group-open:-rotate-180">v</span>
          </summary>
          {recommendationDebug?.selectedTags?.length ? (
            <p className="mt-2 normal-case tracking-normal text-gray-600">
              Tags: {recommendationDebug.selectedTags.join(", ")}
            </p>
          ) : null}
        </details>
        <p className="max-w-4xl text-sm leading-6 text-gray-600">
          {recommendationDebug?.items?.length
            ? `First results: ${recommendationDebug.items.slice(0, 3).map((item) => `${item.name ?? item.id ?? "unnamed"}${item.external_ids?.isrc ? ` (${item.external_ids.isrc})` : ""}`).join(" · ")}`
            : "No recommendation response stored yet. Open the Network tab, trigger Create draft playlist, and inspect the /songs/recommendations response."}
        </p>
      </div>

      <div className="rounded-[32px] border border-[#e0e0e0] bg-[#f7f9ef] p-4 shadow-soft sm:p-6">
        <div className="flex flex-col gap-4">
          {data.tracks.items.map((track, index) => (
            <PlaylistTrackCard
              key={track.id ?? `${track.name}-${track.artists.map((a) => a.name).join(",")}`}
              track={track}
              index={index}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-[28px] border border-[#e0e0e0] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="space-y-2">
          <p className="font-quub text-sm font-semibold uppercase tracking-[0.22em] text-gray-500">Current draft</p>
          <p className="max-w-2xl text-sm leading-6 text-gray-600">Open each card to inspect tempo, loudness and vibe values before saving the playlist.</p>
        </div>
        <div className="rounded-2xl bg-[#f7f9ef] px-4 py-3 text-sm font-semibold text-[#1e1e1e]">
          {data.tracks.items.length} tracks, {sumDuration(data)} total
        </div>
      </div>

      <div className="flex justify-center">
        <button className="group relative overflow-hidden rounded-[30px] border-[3px] border-[#1e1e1e] bg-[#efe8cf] px-12 py-5 font-quub text-lg font-bold text-[#1e1e1e] shadow-[0_10px_0_#1e1e1e,0_20px_30px_rgba(0,0,0,0.22)] transition-transform duration-200 hover:-translate-y-1">
          <span className="absolute inset-x-0 top-0 flex h-3 overflow-hidden">
            {cassetteStripColors.map((color) => (
              <span key={color} className="h-full flex-1" style={{ backgroundColor: color }} />
            ))}
          </span>
        </button>

        <button
          className="bg-[#3387B9] hover:bg-[#1e9a1a] px-6 py-3 border border-[#1e1e1e] rounded-2xl focus-visible:outline focus-visible:outline-[#24B81F] focus-visible:outline-2 focus-visible:outline-offset-2 font-vampire font-medium text-[#f7f9ef] text-sm uppercase tracking-[0.12em] transition-colors disabled:cursor-not-allowed disabled:opacity-70"
          onClick={handleSavePlaylist}
          disabled={isCreatingPlaylist}
        >
          {isCreatingPlaylist ? "Saving..." : "Save playlist to library"}
        </button>
      </div>
    </div>
  );
};

export default DraftPage;
