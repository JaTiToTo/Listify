const imgPlaylistCoverImage = "http://localhost:3845/assets/ddafd214680dadd2835dc69a669d8ce023421b1c.png";
const imgImage = "http://localhost:3845/assets/0f2eef527276a8ac29692b71ccc8efd60c3648d1.png";
const imgImage1 = "http://localhost:3845/assets/fc2731f31997ae3a2a019044c6bcceb95d4b1f9c.png";
const imgImage2 = "http://localhost:3845/assets/dab432531d8d817fdf7df94c27ea22d6593b57bc.png";
const img360F249147728PmrpdMaVzaZ9No6JgwCn3I8W7AJDw1Wc1 = "http://localhost:3845/assets/56e7242eef223b0f62041a2319c8e004b94603ef.png";

export function MainPage() {
  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Presets Section */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="font-vampire text-4xl text-[#1e1e1e] font-bold tracking-tight">Pick our daily recommendations!</h2>
          <p className="text-gray-600 font-quub font-semibold text-lg">Presets</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 font-sans">
          {/* Card 1 */}
          <div className="flex flex-col gap-4">
            <div className="relative h-56 rounded-2xl overflow-hidden shadow-sm">
              <img src={imgPlaylistCoverImage} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/10" />
              <h3 className="absolute top-4 left-4 text-3xl font-bold text-white tracking-wide">Daily Drive</h3>
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-xl font-bold text-black">Daily Drive</h4>
              <p className="text-gray-600 font-medium">1 hour of music and news</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col gap-4">
            <div className="relative h-56 rounded-2xl overflow-hidden bg-[#ffee93] shadow-sm">
              <img src={imgImage} alt="" className="w-full h-full object-cover opacity-90 mix-blend-multiply" />
              <h3 className="absolute top-4 left-4 text-3xl font-bold text-white tracking-wide">Uptown Funk</h3>
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-xl font-bold text-black">Uptown Funk</h4>
              <p className="text-gray-600 font-medium">Funky Grooves</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col gap-4">
            <div className="relative h-56 rounded-2xl overflow-hidden bg-[#ffc1c1] shadow-sm">
              <img src={imgImage1} alt="" className="w-full h-full object-cover opacity-90 mix-blend-multiply" />
              <h3 className="absolute top-4 left-4 text-3xl font-bold text-white tracking-wide">Sad vibes</h3>
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-xl font-bold text-black">Sad vibes</h4>
              <p className="text-gray-600 font-medium">moody music to your liking!</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="flex flex-col gap-4">
            <div className="relative h-56 rounded-2xl overflow-hidden bg-[#f5f5f5] shadow-sm">
              <img src={imgImage2} alt="" className="w-full h-full object-cover opacity-90 mix-blend-multiply" />
              <h3 className="absolute top-4 left-4 text-3xl font-bold text-white tracking-wide">Night drive</h3>
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-xl font-bold text-black">Night Drive</h4>
              <p className="text-gray-600 font-medium">vibey music for driving</p>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Playlist Section */}
      <section className="flex flex-col gap-8 font-sans">
        <div className="flex flex-col gap-2">
          <h2 className="font-vampire text-4xl text-[#1e1e1e] font-bold tracking-tight">Customize your own playlist</h2>
          <p className="text-gray-600 font-quub font-semibold text-lg">Custom</p>
        </div>

        <div className="relative w-full max-w-2xl h-80 rounded-3xl overflow-hidden shadow-md">
          <img src={img360F249147728PmrpdMaVzaZ9No6JgwCn3I8W7AJDw1Wc1} alt="" className="w-full h-full object-cover" />
        </div>
      </section>
    </div>
  );
}

