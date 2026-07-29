import { useEffect, useState } from "react";

import { apiGetJson, apiPostJson } from "../lib/api";

import { sumDuration } from "../components/StatMeter";
import { TrackItem } from "../components/TrackCard";

import TrackCard from "../components/TrackCard";

type MockResult = {
  tracks: {
    items: TrackItem[];
  };
};

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

const DraftPage = () => {
  const [data, setData] = useState<MockResult | null>(null);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);

  useEffect(() => {
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
    <div className="flex flex-col gap-8 mx-auto py-8 max-w-5xl">
      <div className="flex flex-col gap-2">
        <h1 className="font-vampire font-bold text-[#1e1e1e] text-4xl tracking-tight">
          Draft playlist
        </h1>
        <p className="font-quub font-semibold text-gray-800 text-lg">
          {data.tracks.items.length} tracks
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {data.tracks.items.map((track) => (
          <TrackCard
            key={`${track.name}-${track.artists.map((a) => a.name).join(",")}`}
            track={track}
          />
        ))}
      </div>

      {/* Footer: duration summary + save action */}
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4 bg-[#f7f9ef] shadow-soft p-4 border border-[#24B81F] rounded-3xl">
        <p className="font-vampire font-medium text-gray-500 text-sm uppercase tracking-[0.18em]">
          Overall duration{" "}
          <span
            className="ml-2 font-vampire text-lg normal-case tracking-normal"
            style={{ color: "#24B81F", textShadow: "0 0 6px #24B81F66" }}
          >
            {sumDuration(data)}
          </span>
        </p>

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
