import {
  StatMeter,
  STATS,
  formatDuration,
  sumDuration,
} from "./StatMeter";

type AudioFeatureKey = "energy" | "danceability" | "valence";

export type TrackItem = {
  name: string;
  popularity: number;
  duration_ms: number;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  artists: Array<{ name: string }>;
} & Partial<Record<AudioFeatureKey, number>>;

type Props = {
  track: TrackItem;
};

export default function TrackCard({ track }: Props) {
  const coverImage = track.album.images[0]?.url;
  const artistName = track.artists.map((artist) => artist.name).join(", ");

  return (
    <article
      key={`${track.name}-${artistName}`}
      className="bg-[#f7f9ef] shadow-soft border border-[#24B81F] rounded-3xl overflow-hidden"
    >
      {/* TODO: Implement reorder functionality */}
      <div className="flex">
        <div className="flex md:flex-row flex-col flex-1 gap-4 p-4 min-w-0">
          {/* Cover + Info */}
          <div className="flex flex-1 items-center gap-4 min-w-0">
            <div className="bg-[#f7f9ef] border border-[#3387B9] rounded-2xl w-20 h-20 overflow-hidden shrink-0">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt={`${track.album.name} cover`}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-quub font-semibold text-[#1e1e1e] text-lg truncate">
                {track.name}
              </h2>
              <p className="text-gray-600 text-sm truncate">{artistName}</p>
              <p className="mt-1.5 font-semibold text-gray-500 text-xs truncate uppercase tracking-[0.18em]">
                {track.album.name} | {formatDuration(track.duration_ms)}
              </p>
            </div>
          </div>

          {/* Vibe Section */}
          <div className="pt-4 md:pt-0 md:pr-2 md:pl-6 border-[#1e1e1e] border-t-2 md:border-t-0 md:border-l-2 w-full md:w-52">
            <div className="space-y-3">
              {STATS.map(({ label, key, color }) => (
                <StatMeter
                  key={key}
                  label={label}
                  value={track[key]}
                  color={color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Remove Section */}
        <div className="flex shrink-0">
          <button className="flex justify-center items-center self-stretch bg-red-100 hover:bg-red-300 rounded-r-3xl rounded-l-none w-8 text-red-500 hover:scale-105 transition">
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
}
