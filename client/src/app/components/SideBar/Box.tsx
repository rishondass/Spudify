import clsx from 'clsx';
type Props = {
  children: React.ReactNode;
  className?: string;
}

const Box = ({children, className}:Props) => {
  "bg-componentBg p-4 flex flex-col gap-2"
  return (
    <div className={`${clsx("bg-componentBg p-4 flex flex-col gap-2 rounded-lg", className)}`} >
      {children}
    </div>
  )
}

export default Box