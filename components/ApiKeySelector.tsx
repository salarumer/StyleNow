import React, { useState, useEffect } from 'react';

// Define local interface for type safety when casting, avoiding global declaration conflicts
interface AIStudioClient {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkKey = async () => {
      try {
        const aiStudio = (window as any).aistudio as AIStudioClient | undefined;
        if (aiStudio && aiStudio.hasSelectedApiKey) {
          const selected = await aiStudio.hasSelectedApiKey();
          setHasKey(selected);
          if (selected) {
            onKeySelected();
          }
        }
      } catch (e) {
        console.error("Error checking API key", e);
      } finally {
        setIsLoading(false);
      }
    };
    checkKey();
  }, [onKeySelected]);

  const handleSelectKey = async () => {
    const aiStudio = (window as any).aistudio as AIStudioClient | undefined;
    if (aiStudio && aiStudio.openSelectKey) {
      await aiStudio.openSelectKey();
      // Assume success after dialog interaction as per guidelines
      setHasKey(true);
      onKeySelected();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="animate-pulse">Checking configuration...</div>
      </div>
    );
  }

  if (hasKey) {
    return null; // Don't render anything if key is present
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <div className="mb-6">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 serif">Access Required</h2>
          <p className="text-slate-400 mb-6">
            To use the advanced <strong>Gemini 3 Pro</strong> styling features, you need to connect your Google Cloud project.
          </p>
        </div>
        
        <button
          onClick={handleSelectKey}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
        >
          <span>Select API Key</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="mt-6 text-xs text-slate-500">
          <p>
            Requires a paid Google Cloud Project. 
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-purple-400 hover:underline ml-1">
              Read Billing Docs
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySelector;