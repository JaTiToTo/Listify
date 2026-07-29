import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import imgLogo from "../assets/svgs/topcorner_logo.svg";
import iconList from "../assets/svgs/list.svg";
import iconMusic from "../assets/svgs/music.svg";
import iconSmile from "../assets/svgs/smile.svg";
import iconHome from "../assets/svgs/home.svg";
import logout from "../assets/svgs/logout.svg";

import GradientWaveCircleLogo from "../components/design/GradientWaveCircleLogo";

import { callApi } from "../lib/api";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center gap-4 px-4 py-2.5 rounded-lg text-base font-medium transition",
    "whitespace-nowrap",
    isActive ? "bg-gray-100 text-black" : "text-black hover:bg-gray-50",
  ].join(" ");

export function RootLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    await callApi("/auth/logout", "POST");

    navigate("/");
  }

  return (
    <div className="flex md:flex-row flex-col bg-[#f7f9ef] min-h-screen">
      <header className="md:hidden top-0 z-20 sticky flex justify-between items-center bg-white/95 backdrop-blur px-4 py-3 border-[#e0e0e0] border-b">
        <NavLink
          to="/main"
          className="flex items-center gap-3"
          onClick={() => setIsMobileNavOpen(false)}
        >
          <div className="md:block relative flex justify-between items-center">
            <img
              src={imgLogo}
              alt="Listify"
              className="w-full h-24 object-contain"
            />
            <GradientWaveCircleLogo
              size={70}
              className="top-[35%] left-[23%] absolute -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </NavLink>

        <button
          type="button"
          aria-label={
            isMobileNavOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMobileNavOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMobileNavOpen((value) => !value)}
          className="group inline-flex items-center gap-3 bg-white hover:bg-[#fafafa] shadow-sm hover:shadow-md px-4 border border-[#e0e0e0] hover:border-[#c8c8c8] rounded-full focus-visible:outline-none focus-visible:ring-[#1e1e1e]/20 focus-visible:ring-2 focus-visible:ring-offset-2 h-11 text-[#1e1e1e] transition-all hover:-translate-y-0.5 duration-200"
        >
          <span className="font-semibold text-sm tracking-wide">Menu</span>
          <span className="relative flex justify-center items-center w-5 h-4">
            <span
              className={[
                "absolute h-0.5 w-5 rounded-full bg-current transition-transform duration-200",
                isMobileNavOpen
                  ? "translate-y-0 rotate-45"
                  : "-translate-y-1.5",
              ].join(" ")}
            />
            <span
              className={[
                "absolute h-0.5 w-5 rounded-full bg-current transition-all duration-200",
                isMobileNavOpen ? "scale-x-0 opacity-0" : "opacity-100",
              ].join(" ")}
            />
            <span
              className={[
                "absolute h-0.5 w-5 rounded-full bg-current transition-transform duration-200",
                isMobileNavOpen
                  ? "translate-y-0 -rotate-45"
                  : "translate-y-1.5",
              ].join(" ")}
            />
          </span>
        </button>
      </header>

      {isMobileNavOpen ? (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setIsMobileNavOpen(false)}
          className="md:hidden z-20 fixed inset-0 bg-black/35 cursor-default"
        />
      ) : null}

      <aside
        id="mobile-navigation"
        className={[
          "fixed inset-y-0 left-0 z-30 w-[65vw] max-w-xs flex-col border-r border-[#e0e0e0] bg-white pt-6 shadow-2xl transition-transform duration-300 ease-out md:sticky md:top-0 md:z-10 md:flex md:h-screen md:w-64 md:translate-x-0 md:flex-shrink-0 md:border-r md:bg-white md:pt-6",
          isMobileNavOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <div className="md:block relative flex justify-between items-center">
          <img
            src={imgLogo}
            alt="Listify"
            className="w-full h-24 object-contain"
          />
          <GradientWaveCircleLogo
            size={70}
            className="top-[35%] left-[24%] absolute -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        <div className="flex flex-col flex-1 gap-6 px-4 pb-6 overflow-y-auto">
          {/* Discover Section */}
          <div>
            <div className="mt-2 mb-1 px-2 py-2 font-semibold text-black text-sm">
              Discover
            </div>
            <nav className="flex flex-col gap-1">
              <NavLink
                to="/main"
                className={navLinkClass}
                end
                onClick={() => setIsMobileNavOpen(false)}
              >
                <img src={iconHome} alt="" className="w-6 h-6" />
                <span>Home</span>
              </NavLink>
            </nav>
          </div>

          {/* Library Section */}
          <div>
            <div className="mt-2 mb-1 px-2 py-2 font-semibold text-black text-sm">
              Library
            </div>
            <nav className="flex flex-col gap-1">
              <div className="flex items-center gap-4 hover:bg-gray-50 opacity-50 px-4 py-2.5 rounded-lg font-medium text-black text-base cursor-not-allowed">
                <img src={iconList} alt="" className="w-6 h-6" />
                <span>History</span>
              </div>
              <div className="flex items-center gap-4 hover:bg-gray-50 opacity-50 px-4 py-2.5 rounded-lg font-medium text-black text-base cursor-not-allowed">
                <img src={iconMusic} alt="" className="w-6 h-6" />
                <span>Songs</span>
              </div>
              <NavLink
                to="/create"
                className={navLinkClass}
                onClick={() => setIsMobileNavOpen(false)}
              >
                <img src={iconSmile} alt="" className="w-6 h-6" />
                <span>Create playlist</span>
              </NavLink>
            </nav>
          </div>
        </div>

        <div>
          <button
            type="button"
            className="flex items-center gap-4 hover:bg-gray-50 mb-2 px-8 py-2.5 w-full font-medium text-black mt"
            onClick={handleLogout}
          >
            <img src={logout} alt="" className="w-6 h-6" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Sidebar */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 pb-8 min-w-0 overflow-y-auto">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
