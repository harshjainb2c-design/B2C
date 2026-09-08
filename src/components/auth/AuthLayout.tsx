import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface AuthStep {
  label: string;
  active?: boolean;
}

interface AuthLayoutProps {
  headline?: string;
  subtitle?: string;
  steps?: AuthStep[];
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="fixed inset-0 w-full h-full bg-black text-white flex flex-col lg:flex-row font-inter select-none overflow-hidden touch-none sm:touch-auto">
      <Link
        to="/"
        className="absolute top-5 left-5 sm:top-6 sm:left-6 z-30 flex items-center gap-2 text-white font-inter font-medium text-sm sm:text-xs drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] touch-auto"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </Link>

      <div className="lg:hidden absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img
          src="/auth-banner.jpg"
          alt="B2C Streetwear"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/30" />
      </div>

      <div className="hidden lg:block relative w-1/2 h-full overflow-hidden select-none border-r border-white/10 font-inter">
        <img
          src="/auth-banner.jpg"
          alt="B2C Streetwear"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black via-black/75 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 p-8 xl:p-10 z-10 text-center">
          <p className="text-xs sm:text-sm font-semibold text-white tracking-widest uppercase drop-shadow-lg">
            Exported Curated Drops
          </p>
          <p className="text-[11px] sm:text-xs text-neutral-300 font-normal tracking-wide mt-1.5 drop-shadow-md max-w-xs mx-auto">
            Authentic archival streetwear and limited releases delivered worldwide.
          </p>
        </div>
      </div>

      <div className="relative z-10 w-full lg:w-1/2 h-full flex flex-col justify-end lg:justify-center p-5 sm:p-7 lg:p-12 overflow-hidden font-inter">
        <div className="w-full max-w-[420px] sm:max-w-[390px] mx-auto pb-4 sm:py-6 touch-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
          {children}
        </div>
      </div>
    </div>
  );
};
