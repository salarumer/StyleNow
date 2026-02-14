import React, { useState, useCallback, useEffect } from 'react';
import ImageUpload from './components/ImageUpload';
import AnalysisView from './components/AnalysisView';
import StudioControls from './components/StudioControls';
import ApiKeySelector from './components/ApiKeySelector';
import { 
  ImageFile, AnalysisResult, StudioSettings, 
  AspectRatio, FocalLength, DepthOfField, Pose, 
  LightingStyle, Environment, ColorGrade 
} from './types';
import { generateTryOnImage, analyzeFashionMatch } from './services/geminiService';

function App() {
  const [personImage, setPersonImage] = useState<ImageFile | null>(null);
  const [itemImages, setItemImages] = useState<ImageFile[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  // Advanced Pro Studio State
  const [studioSettings, setStudioSettings] = useState<StudioSettings>({
    aspectRatio: AspectRatio.PORTRAIT,
    focalLength: FocalLength.PORTRAIT_85,
    depthOfField: DepthOfField.BALANCED,
    pose: Pose.CLASSIC,
    lighting: LightingStyle.SOFTBOX,
    environment: Environment.STUDIO_GREY,
    colorGrade: ColorGrade.TRUE,
    customEnvironment: "",
    enhanceTexture: true,
    filmGrain: false,
    beautyFilter: true
  });
  
  const [autoUpdate, setAutoUpdate] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  const handlePersonChange = (file: ImageFile) => {
    setPersonImage(file);
    setAnalysis(null);
    setGeneratedImage(null);
  };

  const addItemImage = (file: ImageFile) => {
    setItemImages(prev => [...prev, file]);
  };

  const removeItemImage = (index: number) => {
    setItemImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = useCallback(async () => {
    if (!personImage || itemImages.length === 0) return;
    if (!hasApiKey) return;

    setIsGenerating(true);

    try {
      // 1. Generate Image with advanced settings
      const resultImage = await generateTryOnImage(
        personImage.base64,
        itemImages.map(i => i.base64),
        studioSettings
      );
      setGeneratedImage(resultImage);

      // 2. Analyze
      setIsAnalyzing(true);
      const analysisResult = await analyzeFashionMatch(
        resultImage, 
        personImage.base64
      );
      setAnalysis(analysisResult);

    } catch (error) {
      alert("Failed to generate. Please try again.");
      console.error(error);
    } finally {
      setIsGenerating(false);
      setIsAnalyzing(false);
    }
  }, [personImage, itemImages, studioSettings, hasApiKey]);

  // Auto-Update Logic
  useEffect(() => {
    if (autoUpdate && personImage && itemImages.length > 0 && !isGenerating && hasApiKey) {
      const timer = setTimeout(() => {
        handleGenerate();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [itemImages.length, autoUpdate]); 

  const handleReset = () => {
    setPersonImage(null);
    setItemImages([]);
    setGeneratedImage(null);
    setAnalysis(null);
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `StyleNow_Render_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 selection:bg-purple-500/30 font-sans">
      <ApiKeySelector onKeySelected={() => setHasApiKey(true)} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-900/50">
              <span className="text-white font-bold text-lg serif">S</span>
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              StyleNow <span className="text-purple-500 font-light">PRO STUDIO</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Settings & Inputs */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Pro Studio Controls */}
            <StudioControls 
              settings={studioSettings} 
              onChange={setStudioSettings} 
              disabled={isGenerating} 
            />

            {/* Upload Area */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-xl">
              
              {/* Person Upload */}
              <div className="mb-8">
                 <ImageUpload 
                  label="MODEL REFERENCE" 
                  image={personImage} 
                  onImageChange={handlePersonChange} 
                  onRemove={() => handlePersonChange(null as any)}
                  icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                />
              </div>
              
              {/* Item Uploads - List */}
              <div className="space-y-4 mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Wardrobe Selection</span>
                
                {itemImages.map((img, idx) => (
                  <div key={idx} className="relative group animate-fadeIn bg-slate-900 rounded-lg p-2 border border-slate-700 hover:border-slate-500 transition-colors">
                    
                    {/* UPDATED: Contrast checkerboard background to see items clearly */}
                    <div 
                      className="w-full h-32 flex items-center justify-center rounded overflow-hidden relative"
                      style={{
                        backgroundColor: '#1e293b',
                        backgroundImage: `linear-gradient(45deg, #0f172a 25%, transparent 25%), linear-gradient(-45deg, #0f172a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #0f172a 75%), linear-gradient(-45deg, transparent 75%, #0f172a 75%)`,
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                      }}
                    >
                      <img src={img.preview} alt="Item" className="w-full h-full object-contain drop-shadow-xl z-10" />
                    </div>
                    
                    <button 
                      onClick={() => removeItemImage(idx)}
                      className="absolute top-1 right-1 p-1.5 bg-red-500 hover:bg-red-600 rounded-md text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all z-20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {!img.file && (
                      <span className="absolute bottom-2 left-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg z-20">
                        AI
                      </span>
                    )}
                  </div>
                ))}

                <ImageUpload 
                  label={itemImages.length > 0 ? "ADD ANOTHER PIECE" : "UPLOAD GARMENT"}
                  image={null} 
                  onImageChange={addItemImage} 
                  onRemove={() => {}}
                  icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>}
                />
              </div>

              {/* Action Area */}
              <div className="mt-8 border-t border-slate-700 pt-6">
                
                <div className="flex items-center justify-between mb-4 px-1">
                  <label className="text-xs text-slate-400 font-medium flex items-center gap-2 cursor-pointer uppercase tracking-wide">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={autoUpdate} 
                        onChange={(e) => setAutoUpdate(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                    </div>
                    <span>Auto-Render</span>
                  </label>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!personImage || itemImages.length === 0 || isGenerating || !hasApiKey}
                  className={`
                    w-full py-4 px-6 rounded-lg font-bold text-sm uppercase tracking-widest shadow-lg transition-all transform
                    flex items-center justify-center gap-3
                    ${!personImage || itemImages.length === 0 || isGenerating || !hasApiKey
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                      : 'bg-white text-slate-900 hover:bg-purple-50 hover:scale-[1.01]'
                    }
                  `}
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      PROCESSING...
                    </>
                  ) : (
                    <>
                      <span>RENDER SHOOT</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Result Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Main Generated Image */}
            <div className="relative bg-[#0a0a0a] rounded-xl overflow-hidden shadow-2xl border border-slate-800 min-h-[700px] flex items-center justify-center group">
              {generatedImage ? (
                <>
                  <img src={generatedImage} alt="Generated Try-On" className="w-full h-full object-contain max-h-[850px]" />
                  
                  {/* Overlay Information */}
                  <div className="absolute top-6 left-6 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded text-[10px] font-mono text-slate-300 border-l-2 border-purple-500 uppercase">
                      LENS: {studioSettings.focalLength.split(' ')[0]}
                    </div>
                    <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded text-[10px] font-mono text-slate-300 border-l-2 border-purple-500 uppercase">
                      APERTURE: {studioSettings.depthOfField.split(' ')[0]}
                    </div>
                    <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded text-[10px] font-mono text-slate-300 border-l-2 border-purple-500 uppercase">
                      GRADE: {studioSettings.colorGrade}
                    </div>
                  </div>

                  <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded text-xs font-bold text-white tracking-widest border border-white/20">
                    RAW PREVIEW
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end">
                     <div>
                       <p className="text-white font-bold text-lg tracking-tight">StyleNow RENDER</p>
                       <p className="text-slate-400 text-xs font-mono mt-1">
                         {new Date().toLocaleTimeString()} • {studioSettings.lighting.split('(')[0]}
                       </p>
                     </div>
                     <div className="flex gap-4">
                       <button onClick={handleDownload} className="text-white hover:text-emerald-400 text-xs font-bold uppercase tracking-widest border-b border-white hover:border-emerald-400 pb-1 transition-colors flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        DOWNLOAD
                       </button>
                       <button onClick={handleReset} className="text-white hover:text-purple-400 text-xs font-bold uppercase tracking-widest border-b border-white hover:border-purple-400 pb-1 transition-colors">
                         NEW SESSION
                       </button>
                     </div>
                  </div>
                </>
              ) : (
                <div className="text-center p-8">
                  <div className="w-px h-24 bg-gradient-to-b from-transparent via-slate-700 to-transparent mx-auto mb-6"></div>
                  <h3 className="text-3xl font-light text-slate-500 mb-3 tracking-[0.2em] uppercase">Studio Offline</h3>
                  <p className="text-slate-600 text-sm font-mono">
                    INITIALIZE MODELS & WARDROBE
                  </p>
                </div>
              )}
            </div>

            {/* Analysis Result */}
            {(analysis || isAnalyzing) && (
              <AnalysisView analysis={analysis} isLoading={isAnalyzing} />
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;