import Link from "next/link";
import { FileQuestion, ArrowLeft, Briefcase } from "lucide-react";

export const metadata = {
  title: "Page Not Found",
  description: "Oops! The page you are looking for does not exist or has been moved.",
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-[85vh] flex-col items-center justify-center bg-zinc-950 px-6 text-center text-zinc-100 overflow-hidden">
      {/* Decorative ambient glowing gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-md w-full space-y-8">
        {/* Animated Icon container */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative flex items-center justify-center w-24 h-24 rounded-3xl bg-zinc-900 border border-zinc-800 text-indigo-400 shadow-[0_0_50px_rgba(99,102,241,0.1)] transition-transform hover:rotate-6 duration-300">
            <FileQuestion className="h-12 w-12" />
            <div className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
            </div>
          </div>
          <h1 className="text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 drop-shadow-sm select-none">
            404
          </h1>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Lost in Space?
          </h2>
        </div>

        {/* Description */}
        <p className="text-zinc-400 text-base leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let&apos;s get you back on track!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 text-sm font-semibold shadow-lg shadow-indigo-950/30 transition-all active:scale-[0.98] duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back Home
          </Link>

          <Link
            href="/opportunities"
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300 hover:text-white px-6 py-3 text-sm font-semibold transition-all active:scale-[0.98] duration-200"
          >
            <Briefcase className="h-4 w-4" />
            Explore Opportunities
          </Link>
        </div>
      </div>
    </div>
  );
}
