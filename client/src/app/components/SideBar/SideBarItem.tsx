import {IconType} from 'react-icons';
import Link from "next/link";
import clsx from 'clsx';
type Props = {
  label : string;
  icon : IconType;
  href : string;
  active: boolean


}

const SideBarItem = ({
icon: Icon,
label,
href,
active
} : Props) => {
  return <Link href={href} className={clsx(`w-full inline-flex items-center gap-3 p-1 text-white/60 font-bold transition hover:text-white`,
  active && "text-white/100"
  )}>
    <Icon size="28"/>
    <span>{label}</span>
  </Link>
    
  
}

export default SideBarItem