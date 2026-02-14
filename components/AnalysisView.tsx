import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisViewProps {
  analysis: AnalysisResult | null;
  isLoading: boolean;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ analysis, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 animate-pulse">
        <div className="h-6 w-48 bg-slate-700 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-slate-700 rounded"></div>
          <div className="h-4 w-5/6 bg-slate-700 rounded"></div>
          <div className="h-4 w-4/6 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
      <div className="p-6 border-b border-slate-700 bg-slate-800/80 backdrop-blur">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-white serif flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 5a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V9H3a1 1 0 010-2h1V7a1 1 0 011-1zm5-6a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0V6h-1a1 1 0 010-2h1V3a1 1 0 011-1zm0 5a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0V9h-1a1 1 0 010-2h1V7a1 1 0 011-1zm5-6a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0V6h-1a1 1 0 010-2h1V3a1 1 0 011-1zm0 5a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0V9h-1a1 1 0 010-2h1V7a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Stylist's Verdict
          </h3>
          <div className={`text-2xl font-bold serif ${getScoreColor(analysis.matchScore)}`}>
            {analysis.matchScore}% Match
          </div>
        </div>
        <p className="text-slate-300 italic leading-relaxed">
          "{analysis.critique}"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-700">
        <div className="p-6">
          <h4 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-3">Rating</h4>
          <div className="flex items-center gap-2">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className={`h-2 flex-1 rounded-full ${i < analysis.rating ? 'bg-purple-500' : 'bg-slate-700'}`}
              ></div>
            ))}
            <span className="ml-2 font-bold text-white">{analysis.rating}/10</span>
          </div>
        </div>
        
        <div className="p-6">
          <h4 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-3">Suggestions</h4>
          <ul className="space-y-2">
            {analysis.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                <span className="text-purple-400 mt-1">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;
