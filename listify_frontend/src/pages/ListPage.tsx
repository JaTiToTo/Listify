import { useNavigate } from "react-router-dom";
let sessionIdMock = (Math.random() * 0xFFFFFFFFFFFFF).toString(16).slice(0, 10) // Todo thing about or remove

const imgEllipse5 = "http://localhost:3845/assets/74fff0ec14bff54456d34d392831e3ffba627ef4.svg";
const imgEllipse6 = "http://localhost:3845/assets/34f3bc866a904eb6a85a520122f57fa2cfca44cc.svg";
const imgEllipse8 = "http://localhost:3845/assets/1e6aa8f685eab8418b42ade99a128256234ad07b.svg";

export function ListPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-12 py-8 max-w-5xl mx-auto pb-32">
      <div className="flex flex-col gap-2">
        <h2 className="font-vampire text-4xl text-[#1e1e1e] font-bold tracking-tight">Customize your own playlist</h2>
        <p className="text-gray-600 font-quub font-semibold text-lg">Custom</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Duration Widget */}
        <div className="bg-white rounded-3xl p-8 shadow-sm flex flex-col items-center gap-12 relative">
          <div className="text-2xl font-bold font-sans text-[#1e1e1e]">Duration</div>
          <div className="relative w-full h-10 flex items-center mt-4">
            <div className="absolute w-full h-0.5 bg-gray-200" />
            <div className="absolute w-1/3 h-0.5 bg-black" />
            <div className="absolute left-1/3 -ml-3 z-10 flex flex-col items-center">
              <div className="bg-white border rounded-md px-3 py-1 shadow-sm font-sans text-sm font-bold absolute -top-12">45 min</div>
              <img src={imgEllipse5} alt="" className="w-6 h-6 border-[3px] border-black rounded-full select-none bg-white" draggable="false" />
            </div>
            <div className="absolute top-6 left-0 text-black font-sans text-sm font-medium">5 min</div>
            <div className="absolute top-6 right-0 text-black font-sans text-sm font-medium">2 h</div>
          </div>
        </div>

        {/* Familiarity Widget */}
        <div className="bg-white rounded-3xl p-8 shadow-sm flex flex-col items-center gap-12 relative">
          <div className="text-2xl font-bold font-sans text-[#1e1e1e]">Familiarity</div>
          <div className="relative w-full h-10 flex items-center mt-4">
            <div className="absolute w-full h-0.5 bg-gray-200" />
            <div className="absolute w-3/5 h-0.5 bg-black" />
            <div className="absolute left-3/5 -ml-3 z-10 flex flex-col items-center">
              <div className="bg-white border rounded-md px-3 py-1 shadow-sm font-sans text-sm font-bold absolute -top-12">60%</div>
              <img src={imgEllipse6} alt="" className="w-6 h-6 border-[3px] border-black rounded-full select-none bg-white" draggable="false" />
            </div>
            <div className="absolute top-6 left-0 text-black font-sans text-sm font-medium">Discovery</div>
            <div className="absolute top-6 right-0 text-black font-sans text-sm font-medium">Favourites</div>
          </div>
        </div>

        {/* Variety / Energy Widget */}
        <div className="bg-white rounded-3xl p-8 shadow-sm flex flex-col items-center gap-12 relative w-full md:col-start-2">
          <div className="text-2xl font-bold font-sans text-[#1e1e1e]">Variety</div>
          <div className="relative w-full h-10 flex items-center mt-4">
            <div className="absolute w-full h-0.5 bg-gray-200" />
            <div className="absolute w-1/2 h-0.5 bg-black" />
            <div className="absolute left-1/2 -ml-3 z-10 flex flex-col items-center">
              <div className="bg-white border rounded-md px-3 py-1 shadow-sm font-sans text-sm font-bold absolute -top-12">3 / 5</div>
              <img src={imgEllipse8} alt="" className="w-6 h-6 border-[3px] border-black rounded-full select-none bg-white" draggable="false" />
            </div>
            <div className="absolute top-6 left-0 text-black font-sans text-sm font-medium">Cohesive</div>
            <div className="absolute top-6 right-0 text-black font-sans text-sm font-medium">Diverse</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button className="bg-[#1e1e1e] text-[#f7f9ef] font-quub font-bold text-xl px-14 py-6 rounded-xl hover:bg-black transition-colors"
                onClick={() => navigate(`/list/${sessionIdMock}/draft`)}>
          Start playlist creation
        </button>
      </div>
    </div>
  );
}
