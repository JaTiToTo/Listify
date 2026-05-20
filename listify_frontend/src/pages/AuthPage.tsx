import { useNavigate } from 'react-router-dom';

import imgImage16 from '../assets/svgs/spotifyLogo.svg';
import imgLogo from '../assets/svgs/Logo.svg';
import imgPolygonCorner from '../assets/svgs/polygonCorner.svg';

import VerticalLines from '../components/design/verticalLines/VerticalLines'

function LogoText({ className }: { className?: string }) {
  return (
    <div className={className || '[word-break:break-word] font-vampire h-[137px] leading-[0] not-italic relative text-[82px] tracking-[-3.28px] w-[285px] whitespace-nowrap'}>
      <div className="absolute flex flex-col inset-[0_4.91%_10.22%_0] justify-center text-[#24b81f]">
        <p className="leading-[1.5]">Listify</p>
      </div>
      <div className="absolute flex flex-col inset-[5.11%_2.46%] justify-center text-[#3387b9]">
        <p className="leading-[1.5]">Listify</p>
      </div>
      <div className="absolute flex flex-col inset-[10.22%_0_0_4.91%] justify-center text-[#1e1e1e]">
        <p className="leading-[1.5]">Listify</p>
      </div>
    </div>
  );
}

export function AuthPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f7f9ef] relative size-full min-h-screen overflow-hidden">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex flex-col gap-[24px] items-center left-1/2 top-1/2 w-[400px] z-10">
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0">
          <div className="bg-white border border-[#e0e0e0] border-solid content-stretch flex h-[40px] items-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 w-[400px]">
            <p className="[word-break:break-word] flex-[1_0_0] font-sans font-medium leading-[1.5] min-w-px not-italic overflow-hidden relative text-[#828282] text-[20px] text-ellipsis whitespace-nowrap">
              email@domain.com
            </p>
          </div>
          <button onClick={() => navigate('/main')} className="bg-black content-stretch flex h-[40px] items-center justify-center px-[16px] relative rounded-[8px] shrink-0 w-[400px]">
            <div className="[word-break:break-word] flex flex-col font-quub font-bold italic justify-center leading-[0] relative shrink-0 text-[24px] text-white whitespace-nowrap">
              <p className="leading-[1.5]">Login with email</p>
            </div>
          </button>
        </div>
        <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0 w-full">
          <div className="bg-[#e6e6e6] flex-[1_0_0] h-px min-w-px relative" />
          <p className="[word-break:break-word] font-quub leading-[1.5] not-italic relative shrink-0 text-[#828282] text-[16px] text-center whitespace-nowrap">
            or continue with
          </p>
          <div className="bg-[#e6e6e6] flex-[1_0_0] h-px min-w-px relative" />
        </div>
        <button onClick={() => navigate('/main')} className="bg-[#eee] h-[40px] relative rounded-[8px] shrink-0 w-full hover:bg-gray-200 transition-colors">
          <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-sans font-medium justify-center leading-[0] left-[172.5px] not-italic text-[16px] text-black top-[20px] whitespace-nowrap">
            <p className="leading-[1.5]">{`Spotify `}</p>
          </div>
          <div className="absolute left-[15px] size-[30px] top-[5px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage16} />
          </div>
        </button>

        <p className="[word-break:break-word] font-sans font-normal leading-[0] min-w-full relative shrink-0 text-[#828282] text-[16px] text-center w-[min-content]">
          <span className="font-quub italic font-medium leading-[1.5]">{`By clicking continue, you agree to our `}</span>
          <span className="font-quub italic font-medium leading-[1.5] text-black">Terms of Service</span>
          <span className="font-quub italic font-medium leading-[1.5]">{` and `}</span>
          <span className="font-quub italic font-medium leading-[1.5] text-black">Privacy Policy</span>
        </p>
      </div>

      <LogoText className="-translate-x-1/2 [word-break:break-word] absolute font-vampire h-[137px] leading-[0] left-[calc(50%-0.5px)] not-italic text-[82px] top-[166px] tracking-[-3.28px] w-[285px] whitespace-nowrap z-10" />
      <div className="absolute left-1/2 top-[10px] translate-x-[-50%] size-[163px] z-10 flex items-center justify-center">
        <img alt="" className="block max-w-none size-full object-contain" src={imgLogo} />
      </div>

      <VerticalLines className="absolute left-[77px] top-[-8px] z-10" />

      <div className="absolute bottom-[0px] h-[1084px] right-[0px] w-[1114px] pointer-events-none translate-x-[400px] translate-y-[400px] z-0">
        <img alt="" className="absolute block inset-0 max-w-none size-full object-contain" src={imgPolygonCorner} />
      </div>
    </div>
  );
}