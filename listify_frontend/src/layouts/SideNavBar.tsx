import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import imgLogo from '../assets/svgs/topcorner_logo.svg';
import iconList from '../assets/svgs/list.svg';
import iconMusic from '../assets/svgs/music.svg';
import iconSmile from '../assets/svgs/smile.svg';
import iconHome from '../assets/svgs/home.svg';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'flex items-center gap-4 px-4 py-2.5 rounded-lg text-base font-medium transition',
    'whitespace-nowrap',
    isActive ? 'bg-gray-100 text-black' : 'text-black hover:bg-gray-50',
  ].join(' ');

export function RootLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f9ef] flex flex-col md:flex-row">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#e0e0e0] bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <NavLink to="/main" className="flex items-center gap-3" onClick={() => setIsMobileNavOpen(false)}>
          <img src={imgLogo} alt="Listify" className="h-10 w-auto object-contain" />
        </NavLink>

        <button
          type="button"
          aria-label={isMobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileNavOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMobileNavOpen((value) => !value)}
          className="group inline-flex h-11 items-center gap-3 rounded-full border border-[#e0e0e0] bg-white px-4 text-[#1e1e1e] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c8c8c8] hover:bg-[#fafafa] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e1e1e]/20 focus-visible:ring-offset-2"
        >
          <span className="text-sm font-semibold tracking-wide">Menu</span>
          <span className="relative flex h-4 w-5 items-center justify-center">
            <span
              className={[
                'absolute h-0.5 w-5 rounded-full bg-current transition-transform duration-200',
                isMobileNavOpen ? 'translate-y-0 rotate-45' : '-translate-y-1.5',
              ].join(' ')}
            />
            <span
              className={[
                'absolute h-0.5 w-5 rounded-full bg-current transition-all duration-200',
                isMobileNavOpen ? 'scale-x-0 opacity-0' : 'opacity-100',
              ].join(' ')}
            />
            <span
              className={[
                'absolute h-0.5 w-5 rounded-full bg-current transition-transform duration-200',
                isMobileNavOpen ? 'translate-y-0 -rotate-45' : 'translate-y-1.5',
              ].join(' ')}
            />
          </span>
        </button>
      </header>

      {isMobileNavOpen ? (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 z-20 cursor-default bg-black/35 md:hidden"
        />
      ) : null}

      <aside
        id="mobile-navigation"
        className={[
          'fixed inset-y-0 left-0 z-30 w-[65vw] max-w-xs flex-col border-r border-[#e0e0e0] bg-white pt-6 shadow-2xl transition-transform duration-300 ease-out md:sticky md:top-0 md:z-10 md:flex md:h-screen md:w-64 md:translate-x-0 md:flex-shrink-0 md:border-r md:bg-white md:pt-6',
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        <div className="flex items-center justify-between md:block">
          <img src={imgLogo} alt="Listify" className="h-24 w-full object-contain" />
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col gap-6">
          {/* Discover Section */}
          <div>
            <div className="px-2 py-2 mt-2 text-sm font-semibold text-black mb-1">Discover</div>
            <nav className="flex flex-col gap-1">
              <NavLink to="/main" className={navLinkClass} end onClick={() => setIsMobileNavOpen(false)}>
                <img src={iconHome} alt="" className="w-6 h-6" />
                <span>Home</span>
              </NavLink>
            </nav>
          </div>

          {/* Library Section */}
          <div>
            <div className="px-2 py-2 mt-2 text-sm font-semibold text-black mb-1">Library</div>
            <nav className="flex flex-col gap-1">
              <div className="flex items-center gap-4 px-4 py-2.5 rounded-lg text-base font-medium text-black hover:bg-gray-50 cursor-not-allowed opacity-50">
                <img src={iconList} alt="" className="w-6 h-6" />
                <span>History</span>
              </div>
              <div className="flex items-center gap-4 px-4 py-2.5 rounded-lg text-base font-medium text-black hover:bg-gray-50 cursor-not-allowed opacity-50">
                <img src={iconMusic} alt="" className="w-6 h-6" />
                <span>Songs</span>
              </div>
              <NavLink to="/create" className={navLinkClass} onClick={() => setIsMobileNavOpen(false)}>
                <img src={iconSmile} alt="" className="w-6 h-6" />
                <span>Create playlist</span>
              </NavLink>
            </nav>
          </div>
        </div>
      </aside>

      {/* Sidebar */}
      <main className="min-w-0 flex-1 overflow-y-auto p-4 pb-8 sm:p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}