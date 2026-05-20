import { Link, NavLink, Outlet } from 'react-router-dom';

const imgList = "http://localhost:3845/assets/ef15fddab367e346b994dfe23b8460f38fe1ce27.svg";
const imgMusic = "http://localhost:3845/assets/d4757550b189552d9862cb12ffa27c52b5a6c16f.svg";
const imgSmile = "http://localhost:3845/assets/05be1d17f19604724919a6196e0e3344ca1ad587.svg";
const imgHome = "http://localhost:3845/assets/e81312a6407b9d8309b16179d5862e1c686af55b.svg";
const imgLogo = "http://localhost:3845/assets/39d365c3a14c0ba28c6231dcb7feeee41c5a1a87.svg";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'flex items-center gap-4 px-4 py-2.5 rounded-lg text-base font-medium transition',
    isActive ? 'bg-gray-100 text-black' : 'text-black hover:bg-gray-50',
  ].join(' ');

export function RootLayout() {
  return (
    <div className="min-h-screen bg-[#f7f9ef] flex">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-[#e0e0e0] flex flex-col pt-6 z-10 sticky top-0 h-screen">
        {/* Logo Section */}
        <div className="px-6 mb-8 flex items-center gap-3">
          <img src={imgLogo} alt="Listify" className="w-14 h-14 object-contain" />
          <span className="font-[Vampire_Raves] text-3xl font-bold">Listify</span>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-6">
          {/* Discover Section */}
          <div>
            <div className="px-4 py-2 text-sm font-semibold text-black mb-1">Discover</div>
            <nav className="flex flex-col gap-1">
              <NavLink to="/main" className={navLinkClass} end>
                <img src={imgHome} alt="" className="w-6 h-6" />
                <span>Home</span>
              </NavLink>
            </nav>
          </div>

          {/* Library Section */}
          <div>
            <div className="px-4 py-2 text-sm font-semibold text-black mb-1">Library</div>
            <nav className="flex flex-col gap-1">
              <div className="flex items-center gap-4 px-4 py-2.5 rounded-lg text-base font-medium text-black hover:bg-gray-50 cursor-not-allowed opacity-50">
                <img src={imgList} alt="" className="w-6 h-6" />
                <span>History</span>
              </div>
              <div className="flex items-center gap-4 px-4 py-2.5 rounded-lg text-base font-medium text-black hover:bg-gray-50 cursor-not-allowed opacity-50">
                <img src={imgMusic} alt="" className="w-6 h-6" />
                <span>Songs</span>
              </div>
              <NavLink to="/list" className={navLinkClass}>
                <img src={imgSmile} alt="" className="w-6 h-6" />
                <span>Customize playlist</span>
              </NavLink>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-8 overflow-y-auto">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}