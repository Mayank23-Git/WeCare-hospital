import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function FloatingAITrigger() {
  const location = useLocation();

  // Don't show floating button if already on the AI Assistant page
  if (location.pathname === '/ai-assistant') return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Link
        to="/ai-assistant"
        className="flex items-center space-x-2.5 px-4 py-3 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group ai-pulse border-2 border-white/80"
        title="Ask AI Doctor Assistant"
      >
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
        </div>
        <div className="text-left hidden sm:block pr-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-sky-100 -mb-0.5">
            Need Guidance?
          </div>
          <div className="text-xs font-bold whitespace-nowrap">Ask AI Doctor</div>
        </div>
      </Link>
    </div>
  );
}
