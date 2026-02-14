import React, { useState } from 'react';
import { 
  StudioSettings, AspectRatio, FocalLength, DepthOfField, 
  Pose, LightingStyle, Environment, ColorGrade 
} from '../types';

interface StudioControlsProps {
  settings: StudioSettings;
  onChange: (newSettings: StudioSettings) => void;
  disabled: boolean;
}

const StudioControls: React.FC<StudioControlsProps> = ({ settings, onChange, disabled }) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'scene' | 'post'>('camera');

  const updateField = (field: keyof StudioSettings, value: any) => {
    onChange({ ...settings, [field]: value });
  };

  const ControlSelect = ({ label, value, options, onChange }: { label: string, value: string, options: Record<string, string>, onChange: (val: string) => void }) => (
    <div className="mb-4">
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-md py-2.5 px-3 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 hover:border-slate-500 transition-colors"
      >
        {Object.entries(options).map(([key, val]) => (
          <option key={val} value={val}>{val}</option>
        ))}
      </select>
    </div>
  );

  const Toggle = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (checked: boolean) => void }) => (
    <div className="flex items-center justify-between py-2 px-1 border-b border-slate-800/50 last:border-0">
      <span className="text-xs font-medium text-slate-300">{label}</span>
      <button
        onClick={() => !disabled && onChange(!checked)}
        className={`w-10 h-5 rounded-full relative transition-colors ${checked ? 'bg-purple-600' : 'bg-slate-700'}`}
        disabled={disabled}
      >
        <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}></div>
      </button>
    </div>
  );

  return (
    <div className="bg-[#0f172a] rounded-xl border border-slate-700 overflow-hidden shadow-2xl flex flex-col h-full">
      {/* Header / Tabs */}
      <div className="flex border-b border-slate-700">
        <button 
          onClick={() => setActiveTab('camera')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'camera' ? 'bg-slate-800 text-purple-400 border-b-2 border-purple-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Camera
        </button>
        <button 
          onClick={() => setActiveTab('scene')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'scene' ? 'bg-slate-800 text-purple-400 border-b-2 border-purple-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Scene
        </button>
        <button 
          onClick={() => setActiveTab('post')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'post' ? 'bg-slate-800 text-purple-400 border-b-2 border-purple-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Post-FX
        </button>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 overflow-y-auto max-h-[500px] lg:max-h-none scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
        
        {activeTab === 'camera' && (
          <div className="animate-fadeIn space-y-2">
            <ControlSelect 
              label="Format / Aspect Ratio" 
              value={settings.aspectRatio} 
              options={AspectRatio} 
              onChange={(v) => updateField('aspectRatio', v)} 
            />
            <ControlSelect 
              label="Lens Focal Length" 
              value={settings.focalLength} 
              options={FocalLength} 
              onChange={(v) => updateField('focalLength', v)} 
            />
            <ControlSelect 
              label="Aperture / Depth" 
              value={settings.depthOfField} 
              options={DepthOfField} 
              onChange={(v) => updateField('depthOfField', v)} 
            />
            <div className="mt-4 pt-4 border-t border-slate-800">
              <ControlSelect 
                label="Model Pose" 
                value={settings.pose} 
                options={Pose} 
                onChange={(v) => updateField('pose', v)} 
              />
            </div>
          </div>
        )}

        {activeTab === 'scene' && (
          <div className="animate-fadeIn space-y-2">
            <ControlSelect 
              label="Lighting Setup" 
              value={settings.lighting} 
              options={LightingStyle} 
              onChange={(v) => updateField('lighting', v)} 
            />
            
            <ControlSelect 
              label="Environment / Background" 
              value={settings.environment} 
              options={Environment} 
              onChange={(v) => updateField('environment', v)} 
            />

            {settings.environment === Environment.CUSTOM && (
              <div className="mb-4">
                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                   Custom Description
                 </label>
                 <textarea
                  value={settings.customEnvironment || ''}
                  onChange={(e) => updateField('customEnvironment', e.target.value)}
                  placeholder="Describe location..."
                  className="w-full bg-slate-950 border border-purple-500/30 text-slate-200 text-xs rounded-md p-3 focus:ring-1 focus:ring-purple-500 min-h-[80px]"
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'post' && (
          <div className="animate-fadeIn space-y-2">
            <ControlSelect 
              label="Color Grading / LUT" 
              value={settings.colorGrade} 
              options={ColorGrade} 
              onChange={(v) => updateField('colorGrade', v)} 
            />
            
            <div className="bg-slate-900 rounded-lg p-3 mt-4 border border-slate-800">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Enhancements</div>
              <Toggle 
                label="Enhance Fabric Texture" 
                checked={settings.enhanceTexture} 
                onChange={(v) => updateField('enhanceTexture', v)} 
              />
              <Toggle 
                label="Cinematic Film Grain" 
                checked={settings.filmGrain} 
                onChange={(v) => updateField('filmGrain', v)} 
              />
              <Toggle 
                label="Skin Retouching (Beauty)" 
                checked={settings.beautyFilter} 
                onChange={(v) => updateField('beautyFilter', v)} 
              />
            </div>
          </div>
        )}

      </div>
      
      <div className="p-3 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-2 justify-center text-[10px] text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500/50 animate-pulse"></span>
          PRO STUDIO ACTIVE
        </div>
      </div>
    </div>
  );
};

export default StudioControls;
