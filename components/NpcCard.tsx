import React from 'react';
import { NpcDetails } from '../types';

interface NpcCardProps {
  details: NpcDetails;
  isWon: boolean;
  isImageLoading: boolean;
}

const NpcCard: React.FC<NpcCardProps> = ({ details, isWon, isImageLoading }) => {
  return (
    <div className="h-full flex flex-col p-6 bg-dark-800 border-r border-white/5 relative">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-dark-700/50 via-dark-900 to-dark-900 pointer-events-none" />

      {/* Scrollable Content Container */}
      <div className="relative z-10 flex flex-col h-full overflow-y-auto">
        
        {/* Header */}
        <div className="mb-6 flex-shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-gold-500/10 text-gold-500 border border-gold-500/20">
              타겟 NPC
            </span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>
          <h2 className="text-3xl font-fantasy font-bold text-white tracking-wide drop-shadow-md">{details.name}</h2>
          <p className="text-sm font-ui text-gray-400 mt-1">{details.role}</p>
        </div>

        {/* Environment / Clues (Moved Above Image) */}
        <div className="mb-6 bg-dark-900/50 p-4 rounded-lg border border-white/5 backdrop-blur-sm flex-shrink-0">
          <h3 className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-3 flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
             </svg>
             주변 환경 관찰
          </h3>
          <ul className="space-y-2.5">
            {details.description.map((desc, index) => (
              <li key={index} className="text-sm text-gray-300 font-ui leading-relaxed pl-3 border-l-2 border-gold-500/30">
                {desc}
              </li>
            ))}
          </ul>
        </div>

        {/* Image Container */}
        <div className="relative w-full flex-grow min-h-[250px] rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-dark-900 group mb-4 shrink-0">
          {isImageLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gold-500/50">
              <div className="w-12 h-12 border-2 border-current border-t-transparent rounded-full animate-spin mb-4"></div>
              <span className="font-fantasy text-sm animate-pulse">NPC 소환 중...</span>
            </div>
          ) : (
            <>
              <img 
                src={details.imageUrl} 
                alt="NPC Portrait" 
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${isWon ? 'grayscale contrast-125 brightness-50' : 'group-hover:scale-105'}`}
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-transparent to-transparent opacity-60" />
              
              {/* Status Indicator */}
              <div className={`absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border ${isWon ? 'bg-red-900/40 border-red-500/50' : 'bg-dark-900/60 border-white/10'}`}>
                <div className={`w-2 h-2 rounded-full ${isWon ? 'bg-red-500 animate-ping' : 'bg-green-500'}`}></div>
                <span className="text-xs font-bold text-white uppercase">{isWon ? '공략 완료' : '비밀 엄수 중'}</span>
              </div>
            </>
          )}

          {isWon && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="border-4 border-red-600 p-6 transform -rotate-12 bg-black/80 shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                <span className="text-4xl font-fantasy font-bold text-red-500 tracking-widest text-center leading-tight">
                  비밀<br/>발각됨
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="pt-4 border-t border-white/5 mt-auto">
          <p className="text-xs text-gray-500 italic">
            <span className="text-gold-500 font-bold not-italic">목표: </span> 
            주인을 심문하여 숨겨진 진실을 밝혀내세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NpcCard;