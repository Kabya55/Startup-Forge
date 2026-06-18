'use client';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Spinner */}
        <div className="relative w-16 h-16">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-400 animate-spin"></div>
          
          {/* Middle ring */}
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-purple-500 border-l-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          
          {/* Inner dot */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20"></div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Loading</h2>
          <p className="text-slate-400 text-sm">Please wait while we prepare your content...</p>
        </div>

        {/* Animated dots */}
        <div className="flex gap-2 mt-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0s' }}></span>
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
        </div>
      </div>
    </div>
  );
}
