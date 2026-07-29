import { Link } from "react-router-dom";

import playlistCoverImageOne from "../assets/img/playlist-cover-image-1.png";
import playlistCoverImageTwo from "../assets/img/playlist-cover-image-2.png";
import playlistCoverImageThree from "../assets/img/playlist-cover-image-3.png";
import playlistCoverImageFour from "../assets/img/playlist-cover-image-4.png";
import cassetteImage from "../assets/img/cassette.png";

import GradientWaveCircleLogo from "../components/design/GradientWaveCircleLogo";

const presetCards = [
  {
    title: "Daily Drive",
    description: "1 hour of music and news",
    image: playlistCoverImageOne,
    overlay: "bg-[#24B81F]/40",
    label: "Daily Drive",
  },
  {
    title: "Sad vibes",
    description: "moody music to your liking!",
    image: playlistCoverImageThree,
    overlay: "bg-[#3387B9]/50",
    label: "Sad vibes",
  },
  {
    title: "Night Drive",
    description: "vibey music for driving",
    image: playlistCoverImageFour,
    overlay: "bg-[#D94B3D]/40",
    label: "Night drive",
  },
  {
    title: "Uptown Funk",
    description: "Funky Grooves",
    image: playlistCoverImageTwo,
    overlay: "bg-[#F0B429]/50",
    label: "Uptown Funk",
  },
];

export function MainPage() {
  return (
    <div className="flex flex-col gap-10 sm:gap-16 py-4 sm:py-8">
      <section className="flex flex-col gap-4 sm:gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="max-w-2xl font-vampire font-bold text-[#1e1e1e] text-2xl sm:text-4xl leading-tight tracking-tight">
            Pick from our daily recommendations!
          </h2>
          <p className="font-quub font-semibold text-gray-600 text-base sm:text-lg">
            Presets
          </p>
        </div>
        <div className="gap-5 sm:gap-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 font-sans">
          {presetCards.map((card) => (
            <article
              key={card.title}
              className="flex flex-col gap-2 mx-auto w-full max-w-[240px] sm:max-w-none"
            >
              <div className="relative shadow-soft rounded-[24px] sm:rounded-[28px] aspect-[5/4] sm:aspect-[4/5] overflow-hidden">
                <div className="z-10 relative object-cover">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-[70%] object-cover"
                  />
                </div>
                <div className={`absolute inset-0 ${card.overlay}`} />
                <h3 className="top-3 sm:top-4 left-3 sm:left-4 absolute max-w-[78%] font-bold text-white text-lg sm:text-3xl tracking-wide">
                  {card.label}
                </h3>
                <div className="flex flex-col gap-1 px-4 sm:px-1 pt-0.5 sm:pt-1">
                  <h4 className="font-bold text-black text-sm sm:text-xl">
                    {card.title}
                  </h4>
                  <p className="font-medium text-gray-600 text-xs sm:text-base leading-5">
                    {card.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6 sm:gap-8 font-sans">
        <div className="flex flex-col gap-2">
          <h2 className="max-w-2xl font-vampire font-bold text-[#1e1e1e] text-2xl sm:text-4xl leading-tight tracking-tight">
            Customize your own playlist
          </h2>
          <p className="font-quub font-semibold text-gray-600 text-base sm:text-lg">
            Custom
          </p>
        </div>

        <div className="gap-5 lg:gap-6 grid lg:grid-cols-[1fr_0.95fr]">
          <div className="relative bg-white shadow-soft p-5 sm:p-8 border border-[#e0e0e0] rounded-[28px] sm:rounded-[32px] overflow-hidden">
            <div className="hidden sm:block top-1/2 left-0 absolute bg-[#1e1e1e] w-10 h-20 -translate-x-1/2 -translate-y-1/2 [clip-path:polygon(0_0,100%_20%,100%_80%,0_100%)]" />
            <div className="hidden sm:block top-1/2 right-0 absolute bg-[#1e1e1e] w-10 h-20 -translate-y-1/2 translate-x-1/2 [clip-path:polygon(0_20%,100%_0,100%_100%,0_80%)]" />
            <div className="top-0 absolute inset-x-0 flex h-3 overflow-hidden">
              <div className="bg-[#1e1e1e] w-1/3 h-full" />
              <div className="bg-[#3387b9] w-1/3 h-full" />
              <div className="bg-[#24b81f] w-1/3 h-full" />
            </div>
            <div className="relative flex flex-col justify-between gap-6 sm:gap-8 pl-5 h-full min-h-[220px] sm:min-h-[280px]">
              <div className="space-y-3 max-w-md text-[#1e1e1e]">
                <span className="inline-flex bg-[#f7f9ef] px-3 py-1 border border-[#e0e0e0] rounded-full w-fit font-semibold text-[#394158] text-[11px] sm:text-xs uppercase tracking-[0.22em]">
                  Custom builder
                </span>
                <h3 className="max-w-xl font-vampire text-2xl sm:text-4xl tracking-tight">
                  Turn the cassette into a playlist.
                </h3>
                <p className="max-w-lg text-gray-600 text-sm sm:text-base leading-6">
                  Open the builder to tune the duration, familiarity, and
                  variety of your playlist. The cassette preview acts as the
                  entry point into the creation flow.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3 text-sm">
                <span className="bg-[#f7f9ef] px-3 py-1.5 border border-[#e0e0e0] rounded-full font-semibold text-[#1e1e1e] text-xs sm:text-sm">
                  Duration
                </span>
                <span className="bg-[#f7f9ef] px-3 py-1.5 border border-[#e0e0e0] rounded-full font-semibold text-[#1e1e1e] text-xs sm:text-sm">
                  Familiarity
                </span>
                <span className="bg-[#f7f9ef] px-3 py-1.5 border border-[#e0e0e0] rounded-full font-semibold text-[#1e1e1e] text-xs sm:text-sm">
                  Variety
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/create"
            className="group relative bg-white shadow-soft hover:shadow-md p-4 border border-[#e0e0e0] rounded-[28px] sm:rounded-[32px] focus-visible:outline-none focus-visible:ring-[#1e1e1e]/20 focus-visible:ring-2 focus-visible:ring-offset-2 overflow-hidden transition-transform hover:-translate-y-1 duration-200"
          >
            <div className="top-0 absolute inset-x-0 flex h-3 overflow-hidden">
              <div className="bg-[#3387b9] w-1/4 h-full" />
              <div className="bg-[#24b81f] w-1/4 h-full" />
              <div className="bg-[#D94B3D] w-1/4 h-full" />
              <div className="bg-[#F0B429] w-1/4 h-full" />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(52,176,255,0.08),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(36,184,31,0.08),_transparent_36%)]" />
            <div className="relative flex flex-col gap-4 h-full min-h-[240px] sm:min-h-[280px]">
              <div className="flex justify-between items-start gap-3 sm:gap-4">
                <div className="space-y-1 p-2 pl-4">
                  <p className="font-semibold text-[11px] text-gray-500 sm:text-xs uppercase tracking-[0.22em]">
                    Tap to create
                  </p>
                </div>
                <span className="inline-flex items-center bg-white px-3 py-1 border border-[#1e1e1e] rounded-full font-semibold text-[#1e1e1e] text-[11px] sm:text-xs transition-transform group-hover:-translate-y-0.5 duration-200">
                  Open builder
                </span>
              </div>

              <div className="flex flex-1 justify-center items-center">
                <div className="bg-[#f7f9ef] shadow-sm p-3 sm:p-5 border border-[#e0e0e0] rounded-[22px] sm:rounded-[24px] w-full max-w-[180px] sm:max-w-sm group-hover:-rotate-1 group-hover:scale-[1.01] transition-transform duration-200">
                  <img
                    src={cassetteImage}
                    alt="Cassette illustration for custom playlist creation"
                    className="rounded-[16px] sm:rounded-[18px] w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
