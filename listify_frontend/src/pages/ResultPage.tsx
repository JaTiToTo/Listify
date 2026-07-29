import { useLocation } from "react-router-dom";
import VhsBoxSpectrum from "../components/VhsBoxSpectrum";

const cassetteStripColors = ["#D94B3D", "#F0B429", "#24B81F", "#3387B9"];

const playlistUrl = "https://open.spotify.com/playlist/"; // Replace with the actual playlist URL

function openInSpotify() {
  window.open(playlistUrl, "_blank");
}
const ResultPage = () => {
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const totalDuration = params.get("duration") ?? "";
  const playlistName = params.get("name")?.trimEnd() ?? "Listify Playlist";

  const titleFontSize = Math.max(
    16,
    Math.min(34, (210 / playlistName.length) * 2.2),
  );

  return (
    <div className="flex justify-center items-center px-2 min-h-screen">
      <div className="flex flex-col items-center gap-6 max-w-5xl">
        <h2 className="max-w-2xl font-vampire font-bold text-[#1e1e1e] text-2xl sm:text-4xl leading-tight tracking-tight">
          Your playlist is ready!
        </h2>

        <div className="flex flex-col gap-2 w-full max-w-md">
          <VhsBoxSpectrum
            width={380}
            title={playlistName}
            titleFontSize={titleFontSize}
            label="Listfy"
            duration={totalDuration}
            footerRight="GENERATED FOR SPOTIFY"
          />

          <div className="pt-4">
            <button
              onClick={openInSpotify}
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
              Save playlist to library
              <br />
              <a href={playlistUrl} target="_blank" rel="noopener noreferrer">
                {playlistUrl}
              </a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
