import { Link } from 'react-router-dom';

import playlistCoverImageOne from '../assets/img/playlist-cover-image-1.png';
import playlistCoverImageTwo from '../assets/img/playlist-cover-image-2.png';
import playlistCoverImageThree from '../assets/img/playlist-cover-image-3.png';
import playlistCoverImageFour from '../assets/img/playlist-cover-image-4.png';
import cassetteImage from '../assets/img/cassette.png';

const presetCards = [
  {
    title: 'Daily Drive',
    description: '1 hour of music and news',
    image: playlistCoverImageOne,
    overlay: 'bg-black/10',
    label: 'Daily Drive',
  },
  {
    title: 'Uptown Funk',
    description: 'Funky Grooves',
    image: playlistCoverImageTwo,
    overlay: 'bg-[#ffee93]/30',
    label: 'Uptown Funk',
  },
  {
    title: 'Sad vibes',
    description: 'moody music to your liking!',
    image: playlistCoverImageThree,
    overlay: 'bg-[#ffc1c1]/30',
    label: 'Sad vibes',
  },
  {
    title: 'Night Drive',
    description: 'vibey music for driving',
    image: playlistCoverImageFour,
    overlay: 'bg-black/40',
    label: 'Night drive',
  },
];

export function MainPage() {
  return (
    <div className="flex flex-col gap-10 py-4 sm:gap-16 sm:py-8">
      <section className="flex flex-col gap-4 sm:gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="max-w-2xl font-vampire text-2xl font-bold leading-tight tracking-tight text-[#1e1e1e] sm:text-4xl">
            Pick from our daily recommendations!
          </h2>
          <p className="font-quub text-base font-semibold text-gray-600 sm:text-lg">Presets</p>
        </div>

        <div className="grid grid-cols-1 gap-5 font-sans sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
          {presetCards.map((card) => (
            <article key={card.title} className="mx-auto flex w-full max-w-[240px] flex-col gap-2 sm:max-w-none">
              <div className="relative aspect-[5/4] overflow-hidden rounded-[24px] shadow-soft sm:aspect-[4/5] sm:rounded-[28px]">
                <img src={card.image} alt={card.title} className="h-[70%] w-full object-cover" />
                <div className={`absolute inset-0 ${card.overlay}`} />
                <h3 className="absolute left-3 top-3 max-w-[78%] text-lg font-bold tracking-wide text-white sm:left-4 sm:top-4 sm:text-3xl">
                  {card.label}
                </h3>
                <div className="flex flex-col gap-1 px-4 pt-0.5 sm:px-1 sm:pt-1">
                  <h4 className="text-sm font-bold text-black sm:text-xl">{card.title}</h4>
                  <p className="text-xs font-medium leading-5 text-gray-600 sm:text-base">{card.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6 font-sans sm:gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="max-w-2xl font-vampire text-2xl font-bold leading-tight tracking-tight text-[#1e1e1e] sm:text-4xl">
            Customize your own playlist
          </h2>
          <p className="font-quub text-base font-semibold text-gray-600 sm:text-lg">Custom</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_0.95fr] lg:gap-6">
          <div className="relative overflow-hidden rounded-[28px] border border-[#e0e0e0] bg-white p-5 shadow-soft sm:rounded-[32px] sm:p-8">
            <div className="absolute left-0 top-1/2 hidden h-20 w-10 -translate-x-1/2 -translate-y-1/2 bg-[#1e1e1e] [clip-path:polygon(0_0,100%_20%,100%_80%,0_100%)] sm:block" />
            <div className="absolute right-0 top-1/2 hidden h-20 w-10 translate-x-1/2 -translate-y-1/2 bg-[#1e1e1e] [clip-path:polygon(0_20%,100%_0,100%_100%,0_80%)] sm:block" />
            <div className="absolute inset-x-0 top-0 flex h-3 overflow-hidden">
              <div className="h-full w-1/3 bg-[#1e1e1e]" />
              <div className="h-full w-1/3 bg-[#3387b9]" />
              <div className="h-full w-1/3 bg-[#24b81f]" />
            </div>
            <div className="relative flex h-full min-h-[220px] pl-5 flex-col justify-between gap-6 sm:min-h-[280px] sm:gap-8">
              <div className="max-w-md space-y-3 text-[#1e1e1e]">
                <span className="inline-flex w-fit rounded-full border border-[#e0e0e0] bg-[#f7f9ef] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#394158] sm:text-xs">
                  Custom builder
                </span>
                <h3 className="max-w-xl font-vampire text-2xl tracking-tight sm:text-4xl">Turn the cassette into a playlist.</h3>
                <p className="max-w-lg text-sm leading-6 text-gray-600 sm:text-base">
                  Open the builder to tune the duration, familiarity, and variety of your playlist. The cassette preview acts as the entry point into the creation flow.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-sm sm:gap-3">
                <span className="rounded-full border border-[#e0e0e0] bg-[#f7f9ef] px-3 py-1.5 text-xs font-semibold text-[#1e1e1e] sm:text-sm">Duration</span>
                <span className="rounded-full border border-[#e0e0e0] bg-[#f7f9ef] px-3 py-1.5 text-xs font-semibold text-[#1e1e1e] sm:text-sm">Familiarity</span>
                <span className="rounded-full border border-[#e0e0e0] bg-[#f7f9ef] px-3 py-1.5 text-xs font-semibold text-[#1e1e1e] sm:text-sm">Variety</span>
              </div>
            </div>
          </div>

          <Link
            to="/list"
            className="group relative overflow-hidden rounded-[28px] border border-[#e0e0e0] bg-[#f7f9ef] p-4 shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e1e1e]/20 focus-visible:ring-offset-2 sm:rounded-[32px]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(52,176,255,0.08),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(36,184,31,0.08),_transparent_36%)]" />
            <div className="relative flex h-full min-h-[240px] flex-col gap-4 sm:min-h-[280px]">
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500 sm:text-xs">Tap to customize</p>
                  <h4 className="font-quub text-lg font-bold text-[#1e1e1e] sm:text-2xl">Cassette preview</h4>
                </div>
                <span className="inline-flex items-center rounded-full border border-[#1e1e1e] bg-white px-3 py-1 text-[11px] font-semibold text-[#1e1e1e] transition-transform duration-200 group-hover:-translate-y-0.5 sm:text-xs">
                  Open builder →
                </span>
              </div>

              <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-[180px] rounded-[22px] border border-[#e0e0e0] bg-white p-3 shadow-sm transition-transform duration-200 group-hover:-rotate-1 group-hover:scale-[1.01] sm:max-w-sm sm:rounded-[24px] sm:p-5">
                  <img
                    src={cassetteImage}
                    alt="Cassette illustration for custom playlist creation"
                    className="h-full w-full rounded-[16px] object-cover sm:rounded-[18px]"
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
