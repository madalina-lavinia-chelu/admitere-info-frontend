import { paths } from "@/routes/paths";
import Image from "next/image";
import Link from "next/link";

type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  size?: LogoSize;
  onNavigate?: () => void;
}

const Logo = ({ size = "md", onNavigate }: LogoProps) => {
  const sizeClasses = {
    sm: "!size-4",
    md: "!size-16",
    lg: "!size-24",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const gapClasses = {
    sm: "gap-1",
    md: "gap-3",
    lg: "gap-4",
  };

  return (
    <Link
      className={`flex items-center ${gapClasses[size]}`}
      href={paths.app.root}
      onClick={onNavigate}>
      <Image
        src="/logo.png"
        alt="Grile Admitere Logo"
        className={sizeClasses[size]}
        width={size === "lg" ? 86 : size === "md" ? 64 : 16}
        height={size === "lg" ? 86 : size === "md" ? 64 : 16}
      />
      <div
        className={`${textSizeClasses[size]} font-bold text-gray-900 dark:text-gray-100 leading-none`}>
        <div>Admitere</div>
        <div>Info</div>
      </div>
    </Link>
  );
};

export default Logo;
