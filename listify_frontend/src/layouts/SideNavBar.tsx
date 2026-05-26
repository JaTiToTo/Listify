import { NavLink, Outlet } from 'react-router-dom';

const imgLogo = "src/assets/svgs/topcorner_logo.svg";
const iconList = "src/assets/svgs/list.svg";
const iconMusic = "src/assets/svgs/music.svg";
const iconSmile = "src/assets/svgs/smile.svg";
const iconHome = "src/assets/svgs/home.svg";

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
        <img src={imgLogo} alt="Listify" className="w-64 h-32 object-contain" />

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-6">
          {/* Discover Section */}
          <div>
            <div className="px-4 py-2 text-sm font-semibold text-black mb-1">Discover</div>
            <nav className="flex flex-col gap-1">
              <NavLink to="/main" className={navLinkClass} end>
                <img src={iconHome} alt="" className="w-6 h-6" />
                <span>Home</span>
              </NavLink>
            </nav>
          </div>

          {/* Library Section */}
          <div>
            <div className="px-4 py-2 text-sm font-semibold text-black mb-1">Library</div>
            <nav className="flex flex-col gap-1">
              <div className="flex items-center gap-4 px-4 py-2.5 rounded-lg text-base font-medium text-black hover:bg-gray-50 cursor-not-allowed opacity-50">
                <img src={iconList} alt="" className="w-6 h-6" />
                <span>History</span>
              </div>
              <div className="flex items-center gap-4 px-4 py-2.5 rounded-lg text-base font-medium text-black hover:bg-gray-50 cursor-not-allowed opacity-50">
                <img src={iconMusic} alt="" className="w-6 h-6" />
                <span>Songs</span>
              </div>
              <NavLink to="/list" className={navLinkClass}>
                <img src={iconSmile} alt="" className="w-6 h-6" />
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