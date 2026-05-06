
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useCallback } from 'react';
import { CameraIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface Photo {
  id: string;
  url: string;
  isDeveloping: boolean;
  timestamp: number;
}

export const Photography: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      const newPhoto: Photo = {
        id: Math.random().toString(36).substring(7),
        url,
        isDeveloping: true,
        timestamp: Date.now()
      };
      
      setPhotos(prev => [newPhoto, ...prev]);

      // Simulate developing time
      setTimeout(() => {
        setPhotos(prev => prev.map(p => 
            p.id === newPhoto.id ? { ...p, isDeveloping: false } : p
        ));
      }, 3500); // 3.5s develop time
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <section id="photography" className="scroll-mt-28 py-14 px-4 max-w-7xl mx-auto bg-zinc-950">
        {/* Compact header */}
        <div className="flex items-center gap-3 mb-6">
            <CameraIcon className="w-5 h-5 text-red-600 shrink-0" />
            <h2 className="text-2xl font-bold text-white tracking-tighter font-gemola">Digital Darkroom</h2>
            <span className="text-zinc-600 text-sm font-mono hidden sm:block">— drop an image to develop it</span>
        </div>

        {/* Drop Zone / Tray */}
        <label
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
                relative w-full h-24 rounded-lg border border-dashed transition-all duration-300 cursor-pointer
                flex items-center justify-center gap-3 mb-6 overflow-hidden group
                ${isDragging
                    ? 'border-red-500 bg-red-900/10'
                    : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50'}
            `}
        >
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <div className="absolute inset-0 bg-gradient-to-tr from-red-900/0 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <ArrowUpTrayIcon className={`w-5 h-5 transition-colors ${isDragging ? 'text-red-500' : 'text-zinc-500'}`} />
            <span className="text-zinc-400 font-mono text-xs uppercase tracking-widest">Drop negative here to develop</span>
        </label>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((photo) => (
                <div key={photo.id} className="relative aspect-square bg-white p-2 shadow-xl rotate-1 hover:rotate-0 transition-transform duration-500">
                    <div className="w-full h-full bg-black overflow-hidden relative">
                        <img
                            src={photo.url}
                            alt="Developed"
                            className={`
                                w-full h-full object-cover transition-all duration-[3500ms] ease-in-out
                                ${photo.isDeveloping ? 'blur-xl brightness-0 grayscale' : 'blur-0 brightness-100 grayscale-0'}
                            `}
                        />
                        {photo.isDeveloping && (
                            <div className="absolute inset-0 bg-red-900/20 mix-blend-overlay animate-pulse pointer-events-none" />
                        )}
                    </div>
                    <div className="h-6 bg-white flex items-center justify-center mt-1">
                        <span className="text-black/60 text-[10px] tracking-widest uppercase font-mono">
                            {photo.isDeveloping ? 'Developing...' : 'Developed'}
                        </span>
                    </div>
                </div>
            ))}

            {[1, 2, 3, 4].map((i) => (
                <div key={`static-${i}`} className="group relative aspect-square bg-[#121214] overflow-hidden cursor-crosshair border border-zinc-800/60">
                   <div className={`w-full h-full opacity-50 transition-all duration-700 group-hover:scale-105 group-hover:opacity-80 ${
                       i === 1 ? 'bg-gradient-to-br from-blue-900 to-black' :
                       i === 2 ? 'bg-gradient-to-tr from-purple-900 to-zinc-900' :
                       i === 3 ? 'bg-gradient-to-bl from-emerald-900 to-black' :
                       'bg-gradient-to-tl from-rose-900 to-zinc-900'
                   }`}>
                        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
                   </div>
                   <div className="absolute inset-0 p-3 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                       <div className="text-white text-sm font-gemola tracking-wide">Session 00{i}</div>
                       <div className="text-zinc-300 text-[10px] font-mono">ISO 400 · f/1.8</div>
                   </div>
                </div>
            ))}
        </div>
    </section>
  );
};
