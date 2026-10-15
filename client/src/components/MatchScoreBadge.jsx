import React from 'react';
import { Sparkles, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';

const MatchScoreBadge = ({ score = 0, size = 'md', showRecommendation = false, recommendation = '' }) => {
  const numScore = Number(score) || 0;

  // Determine color scheme based on score
  let badgeColor = 'bg-[#FBECEC] text-[#B54747] border-[#B54747]/25';
  let barColor = 'bg-[#B54747]';
  let textColor = 'text-[#B54747]';
  let defaultRec = 'Low Match';

  if (numScore >= 80) {
    badgeColor = 'bg-[#E8F3EC] text-[#34765B] border-[#34765B]/25';
    barColor = 'bg-[#34765B]';
    textColor = 'text-[#34765B]';
    defaultRec = 'Strong Match';
  } else if (numScore >= 65) {
    badgeColor = 'bg-[#EAF1F7] text-[#426D8A] border-[#426D8A]/25';
    barColor = 'bg-[#426D8A]';
    textColor = 'text-[#426D8A]';
    defaultRec = 'Good Match';
  } else if (numScore >= 50) {
    badgeColor = 'bg-[#FBF3E3] text-[#946A24] border-[#946A24]/25';
    barColor = 'bg-[#946A24]';
    textColor = 'text-[#946A24]';
    defaultRec = 'Potential Match';
  }

  const recText = recommendation || defaultRec;

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${badgeColor}`}>
        <Sparkles className="w-3 h-3" />
        {numScore}% Match
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className="flex items-center gap-3">
        <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl border ${badgeColor} shadow-sm`}>
          <span className="text-2xl font-bold tracking-tight">{numScore}%</span>
          <span className="text-[10px] uppercase font-medium tracking-wider opacity-80">AI Fit</span>
        </div>
        {showRecommendation && (
          <div>
            <div className={`text-sm font-semibold ${textColor}`}>{recText}</div>
            <div className="text-xs text-[#7A8781]">Weighted AI Compatibility</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${badgeColor}`}>
      <Sparkles className="w-3.5 h-3.5" />
      <span>{numScore}% AI Match</span>
      {showRecommendation && (
        <>
          <span className="opacity-40">•</span>
          <span className="text-xs">{recText}</span>
        </>
      )}
    </div>
  );
};

export default MatchScoreBadge;
