
import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "Firing up the grill...",
  "Reading your terrible copy...",
  "Judging your font choices...",
  "Consulting the SEO gods...",
  "Finding all your broken dreams (and links)...",
  "Sharpening the brutal honesty knife...",
  "Comparing your site to a 1990s Geocities page...",
  "Analyzing why your visitors are fleeing...",
  "Preparing the roast. Hope you have thick skin.",
  "Almost there. The truth hurts."
];

const LoadingScreen: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="relative mb-8">
        <div className="w-24 h-24 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="fas fa-fire text-3xl text-orange-500 animate-pulse"></i>
        </div>
      </div>
      <h2 className="text-3xl font-black mb-4 roaster-font tracking-widest uppercase">ROASTING IN PROGRESS</h2>
      <p className="text-xl text-gray-400 h-8 transition-all duration-500 animate-pulse">{MESSAGES[msgIndex]}</p>
      
      <div className="mt-12 w-full max-w-md bg-zinc-900 h-2 rounded-full overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 h-full animate-[progress_15s_ease-in-out_infinite]"></div>
      </div>
      
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 95%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
