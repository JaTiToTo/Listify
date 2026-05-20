import LogoImage from '../components/design/LogoImage'
import LogoText from '../components/design/LogoText'
import PolygonCorner from '../components/design/PolygonCorner'
import VerticalLines from '../components/design/verticalLines/VerticalLines'
import AuthCard from '../components/design/authCard/AuthCard'

export function AuthPage() {
  return (
    <div className="bg-[#f7f9ef] relative size-full min-h-screen overflow-hidden">

      <LogoText className="-translate-x-1/2 [word-break:break-word] absolute font-vampire h-[137px] leading-[0] left-[calc(50%-0.5px)] not-italic text-[82px] top-[166px] tracking-[-3.28px] w-[285px] whitespace-nowrap z-10" />
      <div className="absolute left-1/2 top-[10px] translate-x-[-50%] size-[163px] z-10 flex items-center justify-center">
        <LogoImage />
      </div>

      <AuthCard />
      
      <VerticalLines className="absolute left-[77px] top-[-8px] z-10" />
      <div className="absolute bottom-[0px] h-[1084px] right-[0px] w-[1114px] pointer-events-none translate-x-[400px] translate-y-[400px] z-0">
        <PolygonCorner />
      </div>
    </div>
  );
}