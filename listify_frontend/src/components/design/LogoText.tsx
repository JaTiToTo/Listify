type Props = {
  className?: string
}

export default function LogoText({ className }: Props) {
  return (
    <div className={className || '[word-break:break-word] font-vampire h-[137px] leading-[0] not-italic relative text-[82px] tracking-[-3.28px] w-[285px] whitespace-nowrap'}>
      <div className="absolute flex flex-col inset-[0_4.91%_10.22%_0] justify-center text-[#24b81f] select-none">
        <p className="leading-[1.5] font-vampire">Listify</p>
      </div>
      <div className="absolute flex flex-col inset-[5.11%_2.46%] justify-center text-[#3387b9] select-none">
        <p className="leading-[1.5] font-vampire">Listify</p>
      </div>
      <div className="absolute flex flex-col inset-[10.22%_0_0_4.91%] justify-center text-[#1e1e1e] select-none">
        <p className="leading-[1.5] font-vampire">Listify</p>
      </div>
    </div>
  )
}
