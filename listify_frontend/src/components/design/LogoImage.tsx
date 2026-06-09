import imgLogo from '../../assets/svgs/Logo.svg'

type Props = {
  className?: string
}

export default function LogoImage({ className = '' }: Props) {
  return (
    <div className={className}>
      <img alt="Listify" className="block max-w-none size-full object-contain" src={imgLogo} />
    </div>
  )
}
