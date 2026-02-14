import React, { useRef, useState } from 'react';
import { ImageFile } from '../types';

interface ImageUploadProps {
  label: string;
  image: ImageFile | null;
  onImageChange: (image: ImageFile) => void;
  onRemove: () => void;
  icon?: React.ReactNode;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, image, onImageChange, onRemove, icon }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange({
          file,
          preview: URL.createObjectURL(file),
          base64: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-sm font-medium text-slate-300 ml-1">{label}</span>
      
      {!image ? (
        <div 
          onClick={triggerUpload}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative h-64 w-full border-2 border-dashed rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center group
            ${isDragging 
              ? 'border-purple-400 bg-purple-500/10 scale-[1.02]' 
              : 'border-slate-600 bg-slate-800/50 hover:bg-slate-800 hover:border-purple-500'
            }
          `}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${isDragging ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-400 group-hover:bg-purple-500/20 group-hover:text-purple-400'}`}>
            {icon || (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </div>
          <p className={`text-sm font-medium transition-colors ${isDragging ? 'text-purple-300' : 'text-slate-400 group-hover:text-slate-200'}`}>
            {isDragging ? 'Drop Image Here' : 'Drag & Drop or Click to Browse'}
          </p>
          <p className="text-slate-500 text-xs mt-1">JPG, PNG, WEBP</p>
        </div>
      ) : (
        <div className="relative h-64 w-full rounded-xl overflow-hidden group border border-slate-700">
          <img 
            src={image.preview} 
            alt={label} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px]">
             <button 
              onClick={triggerUpload}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors"
              title="Change Image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="p-2 bg-red-500/80 hover:bg-red-600 rounded-full text-white backdrop-blur-md transition-colors"
              title="Remove"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />
    </div>
  );
};

export default ImageUpload;