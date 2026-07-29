import LogoText from "../components/design/LogoText";
import PolygonCorner from "../components/design/PolygonCorner";
import VerticalLines from "../components/design/verticalLines/VerticalLines";
import AuthCard from "../components/design/authCard/AuthCard";

import GradientWaveCircleLogo from "../components/design/GradientWaveCircleLogo";

export function AuthPage() {
  return (
    <>
      <div className="relative bg-[#f7f9ef] w-full min-h-screen overflow-hidden">
        {/* Left decorative lines */}
        <VerticalLines className="top-[-8px] left-[77px] z-0 absolute" />

        <div className="top-[10px] left-1/2 z-10 absolute flex justify-center items-center size-[163px] translate-x-[-50%]">
          <GradientWaveCircleLogo size={150} />
        </div>
        <LogoText className="top-[166px] left-[calc(50%-0.5px)] z-10 absolute w-[285px] h-[137px] font-vampire text-[82px] not-italic leading-[0] tracking-[-3.28px] whitespace-nowrap -translate-x-1/2 [word-break:break-word]" />

        <div className="top-[320px] left-[50%] z-10 absolute backdrop-blur-md p-8 rounded-2xl -translate-x-1/2 transform">
          <AuthCard />
        </div>

        {/* Right decorative polygon */}
        <PolygonCorner className="right-[0px] bottom-[0px] z-0 absolute w-[1114px] h-[1000px] translate-x-[400px] translate-y-[400px] pointer-events-none" />
      </div>
    </>
  );
}
