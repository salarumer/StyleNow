import React from 'react';
import { InspirationItem } from '../types';

interface InspirationViewProps {
  items: InspirationItem[];
  isLoading: boolean;
  eventContext: string;
  onSelect: (item: InspirationItem) => void;
  isSelecting: boolean;
}

const InspirationCard: React.FC<{ item: InspirationItem; onSelect: (item: InspirationItem) => void; isSelecting: boolean }> = ({ item, onSelect, isSelecting }) => {
  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-purple-500/50 transition-colors flex flex-col justify-between overflow-hidden group h-full shadow-md hover:shadow-purple-500/10">
      <div className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-bold text-slate-200 leading-tight text-lg pr-2">{item.outfitName}</h4>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded whitespace-nowrap border border-emerald-500/20">
            {item.estimatedPrice}
          </span>
        </div>
        
        <p className="text-sm text-slate-400 mb-4 flex-1 leading-relaxed">{item.description}</p>
        
        {item.sourceUrl && (
          <div className="mb-5 text-xs flex items-center gap-2 py-2 px-3 bg-slate-800/50 rounded border border-slate-700/50">
            <span className="text-slate-500">Available at:</span>
            <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300 underline truncate block font-medium flex-1">
              {new URL(item.sourceUrl).hostname.replace('www.', '')}
            </a>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        )}

        <div className="flex items-center gap-3 mt-auto">
          <button
            onClick={() => onSelect(item)}
            disabled={isSelecting}
            className={`
              flex-1 py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2
              ${isSelecting 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white hover:scale-[1.02]'}
            `}
          >
            {isSelecting ? (
              <>
                <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                </svg>
                Visualize This Look
              </>
            )}
          </button>
          
          <a 
            href={item.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="py-3 px-4 rounded-lg border border-slate-600 hover:border-slate-400 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors bg-slate-800 hover:bg-slate-700"
          >
            Buy
          </a>
        </div>
      </div>
    </div>
  );
};

const InspirationView: React.FC<InspirationViewProps> = ({ items, isLoading, eventContext, onSelect, isSelecting }) => {
  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mt-8">
        <h3 className="text-xl font-bold text-white serif mb-4 flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Searching global trends for "{eventContext}"...
        </h3>
        <p className="text-sm text-slate-400 mb-6">Browsing major retailers for real products...</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-slate-700/50 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden mt-8">
      <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-800/80">
        <h3 className="text-xl font-bold text-white serif flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          Inspiration for {eventContext}
        </h3>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {items.map((item, idx) => (
          <InspirationCard 
            key={idx} 
            item={item} 
            onSelect={onSelect} 
            isSelecting={isSelecting} 
          />
        ))}
      </div>
    </div>
  );
};

export default InspirationView;
