import { useEffect, useState } from "react";

import { apiPostJson } from "../lib/api";

import { formatDuration, sumDuration } from "../components/StatMeter";
import { useLocation, useNavigate, useParams } from "react-router-dom";

type RecommendationDebugResponse = {
  items?: TrackItem[];
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
  key:
    | "tempo"
    | "loudness"
    | "instrumentalness"
    | "valence"
    | "acousticness"
    | "danceability"
    | "energy";
  label: string;
  accentColor: string;
  toPercent: (track: TrackItem) => number | null;
  valueLabel: (track: TrackItem) => string;
};

const cassetteStripColors = ["#D94B3D", "#F0B429", "#24B81F", "#3387B9"];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function hashSeed(track: TrackItem) {
  const source = `${track.name}-${track.artists.map((artist) => artist.name).join("|")}`;
  return source
    .split("")
    .reduce((accumulator, char) => accumulator + char.charCodeAt(0), 0);
}

function getFallbackAudioProfile(track: TrackItem) {
  const seed = hashSeed(track);
  const durationMinutes = Math.max(1, Math.round(track.duration_ms / 60000));
  const baseVibe = clamp(track.popularity / 100, 0.15, 0.95);

  return {
    tempo: 90 + (seed % 90),
    loudness: -32 + (seed % 24),
    instrumentalness: clamp((seed % 45) / 100, 0.02, 0.45),
    valence: clamp(baseVibe - 0.12 + (seed % 16) / 100, 0.1, 0.95),
    acousticness: clamp(
      0.25 + ((durationMinutes + seed) % 55) / 100,
      0.12,
      0.85,
    ),
    danceability: clamp(baseVibe - 0.08 + (seed % 14) / 100, 0.2, 0.96),
    energy: clamp(baseVibe + (seed % 12) / 100, 0.25, 0.98),
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
    valueLabel: (track) =>
      `${Math.round(getMetricValue(track, "loudness"))} dB`,
  },
  {
    key: "instrumentalness",
    label: "Instr.",
    accentColor: "#24B81F",
    toPercent: (track) =>
      toUnitPercent(getMetricValue(track, "instrumentalness")),
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

function MetricRail({
  label,
  valueLabel,
  percent,
  accentColor,
}: {
  label: string;
  valueLabel: string;
  percent: number | null;
  accentColor: string;
}) {
  return (
    <div className="bg-[#d8dfc2] p-3 border border-[#e0e0e0] rounded-2xl">
      <div className="flex justify-between items-center gap-2 mb-2">
        <span className="font-semibold text-[10px] text-gray-500 uppercase tracking-[0.2em]">
          {label}
        </span>
        <span className="bg-[#f7f9ef] px-2 py-0.5 border border-[#1e1e1e] rounded-full font-semibold text-[#1e1e1e] text-[11px]">
          {valueLabel}
        </span>
      </div>
      <div className="bg-[#ececec] border border-[#1e1e1e] rounded-full h-2">
        <div
          className="rounded-full h-full"
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

function PlaylistTrackCard({
  track,
  index,
}: {
  track: TrackItem;
  index: number;
}) {
  const coverImage = track.album.images[0]?.url;
  const artistName = track.artists.map((artist) => artist.name).join(", ");

  return (
    <article className="bg-[#f7f9ef] shadow-sm border border-[#e0e0e0] rounded-3xl overflow-hidden">
      <div className="flex h-1 overflow-hidden">
        {cassetteStripColors.map((color) => (
          <span
            key={`${track.id ?? track.name}-${color}`}
            className="flex-1 h-full"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div className="flex items-stretch">
        <div className="flex flex-col flex-1 gap-4 p-4 sm:p-5 min-w-0">
          <div className="flex items-center gap-3">
            <span className="flex justify-center items-center bg-[#f7f9ef] border border-[#1e1e1e] rounded-full w-9 h-9 font-vampire text-[#1e1e1e] text-sm shrink-0">
              {index + 1}
            </span>

            <div className="bg-[#f7f9ef] border border-[#3387B9] rounded-2xl w-14 sm:w-16 h-14 sm:h-16 overflow-hidden shrink-0">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt={`${track.album.name} cover`}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-quub font-bold text-[#1e1e1e] text-base sm:text-lg truncate">
                {track.name}
              </h2>
              <p className="text-gray-600 text-sm truncate">{artistName}</p>
              <p className="mt-1 font-semibold text-[11px] text-gray-500 truncate uppercase tracking-[0.18em]">
                {track.album.name}
              </p>
            </div>

            <div className="hidden sm:block bg-[#f7f9ef] px-3 py-1 border border-[#1e1e1e] rounded-full font-semibold text-[#1e1e1e] text-xs uppercase tracking-[0.16em]">
              {formatDuration(track.duration_ms)}
            </div>
          </div>
          <div className="sm:hidden flex justify-between items-center">
            <span className="bg-[#f7f9ef] px-3 py-1 border border-[#1e1e1e] rounded-full font-semibold text-[#1e1e1e] text-xs uppercase tracking-[0.16em]">
              {formatDuration(track.duration_ms)}
            </span>
          </div>
        </div>

        <button
          type="button"
          aria-label={`Remove ${track.name} from draft`}
          className="flex justify-center items-center self-stretch bg-[#fff2f0] hover:bg-[#ffd9d4] border-[#e0e0e0] border-l w-11 text-[#d94b3d] transition-colors shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16zm-9.489 5.14a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" />
            <path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z" />
          </svg>
        </button>
      </div>
    </article>
  );
}

const DraftPage = () => {
  const { id: sessionId } = useParams();
  const navigate = useNavigate();
  const [recommendationDebug, setRecommendationDebug] = useState<RecommendationDebugResponse | null>(null);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const playlistName = params.get("name") ?? "Listify Playlist";
  let playlistUrlId: string = "";

  useEffect(() => {
    const storedResponse = sessionStorage.getItem(RECOMMENDATIONS_DEBUG_STORAGE_KEY);
    if (storedResponse) {
      try {
        setRecommendationDebug(JSON.parse(storedResponse) as RecommendationDebugResponse);
      } catch (error) {
        console.error("Failed to parse stored recommendations response:", error);
      }
    }
  }, []);

  const tracks = recommendationDebug?.items ?? [];
  const totalDuration = sumDuration({
    tracks: {
      items: tracks,
    },
  });

  function generatePlaylistRequestPayload(): CreatePlaylistRequest {
    const playlistRequestPayload: CreatePlaylistRequest = {
      songIds: [
        "spotify:track:2saoOMgzvDizi7CE8qxvyB",
        "spotify:track:4yH9v7cWu7QXJffkusO5bW",
        "spotify:track:0G21yYKMZoHa30cYVi1iA8",
        "spotify:track:0ofHAoxe9vBkTCp2UQIavz",
      ],
      playlistName: playlistName,
    };
    return playlistRequestPayload;
  }

  const handleSavePlaylist = async () => {
    setIsCreatingPlaylist(true);

    try {
      const response = await apiPostJson<
        CreatePlaylistRequest,
        PlaylistResponse
      >("/playlists", generatePlaylistRequestPayload());
      console.log("Playlist created with id:", response.playlistId);

      playlistUrlId = response.playlistId ? response.playlistId : "";
      console.log("Playlist URL ID:", playlistUrlId);
      console.log("response is", response);
    } catch (error) {
      console.error("Failed to create playlist:", error);
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 mx-auto py-8 pb-32 max-w-6xl">
      <div className="flex flex-col gap-2">
        <h1 className="font-vampire text-4xl font-bold tracking-tight text-[#1e1e1e]">Draft playlist</h1>
        <p className="font-quub text-lg font-semibold text-gray-600">{tracks.length} tracks selected</p>
          <p className="mt-2 normal-case tracking-normal text-gray-600">
            Tags: {recommendationDebug?.selectedTags?.join(", ")}
          </p>
      </div>

      <div className="bg-[#f7f9ef] shadow-soft p-4 sm:p-6 border border-[#e0e0e0] rounded-[32px]">
        <div className="flex flex-col gap-4">
          {tracks.map((track, index) => (
            <PlaylistTrackCard
              key={
                track.id ??
                `${track.name}-${track.artists.map((a) => a.name).join(",")}`
              }
              track={track}
              index={index}
            />
          ))}
        </div>
      </div>

      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4 bg-white shadow-sm p-5 sm:p-6 border border-[#e0e0e0] rounded-[28px]">
        <div className="space-y-2">
          <p className="font-quub font-semibold text-gray-500 text-sm uppercase tracking-[0.22em]">
            Current draft
          </p>
        </div>
        <div className="bg-[#f7f9ef] px-4 py-3 rounded-2xl font-semibold text-[#1e1e1e] text-sm">
          {tracks.length} tracks, {totalDuration} total
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() =>
            handleSavePlaylist().then(() =>
              navigate(
                `/create/${sessionId}/result?playlistId=${playlistUrlId}&duration=${encodeURIComponent(totalDuration)}&name=${encodeURIComponent(playlistName)}`,
              ),
            )
          }
          className="group relative bg-[#efe8cf] shadow-[0_10px_0_#1e1e1e,0_20px_30px_rgba(0,0,0,0.22)] px-12 py-5 border-[#1e1e1e] border-[3px] rounded-[30px] overflow-hidden font-quub font-bold text-[#1e1e1e] text-lg transition-transform hover:-translate-y-1 duration-200"
        >
          <span className="top-0 absolute inset-x-0 flex h-3 overflow-hidden">
            {cassetteStripColors.map((color) => (
              <span
                key={color}
                className="flex-1 h-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </span>
          {isCreatingPlaylist ? "Saving..." : "Generate playlist"}
        </button>
      </div>
    </div>
  );
};

export default DraftPage;
