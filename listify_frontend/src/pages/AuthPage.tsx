import LogoImage from '../components/design/LogoImage'
import LogoText from '../components/design/LogoText'
import PolygonCorner from '../components/design/PolygonCorner'
import VerticalLines from '../components/design/verticalLines/VerticalLines'
import AuthCard from '../components/design/authCard/AuthCard'

export function AuthPage() {
  return (
    <>
      <div className="bg-[#f7f9ef] relative w-full min-h-screen overflow-hidden">
        {/* Left decorative lines */}
        <VerticalLines className="absolute left-[77px] top-[-8px] z-0" />

        <div className="absolute left-1/2 top-[10px] translate-x-[-50%] size-[163px] z-10 flex items-center justify-center">
          <LogoImage />
        </div>
        <LogoText className="-translate-x-1/2 [word-break:break-word] absolute font-vampire h-[137px] leading-[0] left-[calc(50%-0.5px)] not-italic text-[82px] top-[166px] tracking-[-3.28px] w-[285px] whitespace-nowrap z-10" />

        <div className="absolute left-[50%] top-[320px] transform -translate-x-1/2 z-10 backdrop-blur-md rounded-2xl p-8">
          <AuthCard />
        </div>

        {/* Right decorative polygon */}
        <PolygonCorner className="absolute bottom-[0px] h-[1000px] right-[0px] w-[1114px] pointer-events-none translate-x-[400px] translate-y-[400px] z-0" />
      </div>
    </>
  );
}