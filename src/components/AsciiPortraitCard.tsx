import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Upload, Camera } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { compressImage } from '../utils/imageCompressor';

export default function AsciiPortraitCard() {
  const { state, updatePersonalInfo } = usePortfolio();
  const photoUrl = state.personalInfo.avatarUrl || '/assets/aistudio/image_6021aaae.png';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll-driven fade animation when sliding down the website
  const { scrollY } = useScroll();
  const fadeOpacity = useTransform(scrollY, [0, 500], [1, 0.15]);
  const fadeScale = useTransform(scrollY, [0, 500], [1, 0.95]);
  const fadeY = useTransform(scrollY, [0, 500], [0, 50]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 1200, 1200, 0.88);
        updatePersonalInfo('avatarUrl', compressed);
      } catch (err) {
        console.error('Image upload failed:', err);
        // Fallback to FileReader if compression fails
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          if (uploadEvent.target?.result) {
            updatePersonalInfo('avatarUrl', uploadEvent.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      } finally {
        e.target.value = '';
      }
    }
  };

  return (
    <motion.div 
      style={{
        opacity: fadeOpacity,
        scale: fadeScale,
        y: fadeY
      }}
      className="relative w-full max-w-[500px] lg:max-w-[560px] aspect-[4/5] group flex flex-col items-center justify-center select-none"
    >
      {/* Cinematic Backlight Glow for Page Blending */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-white/5 via-white/10 to-transparent rounded-2xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Main Image Container with Seamless Vignette & Gradient Mask Blending */}
      <div className="relative w-full h-full bg-[#050505] overflow-hidden border border-white/15 shadow-2xl flex items-center justify-center">
        <img
          src={photoUrl}
          alt="Chaitanya Jain"
          className="w-full h-full object-cover filter grayscale contrast-125 brightness-95 transition-transform duration-700 group-hover:scale-105"
          style={{
            maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, #000 70%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, #000 70%, transparent 100%)'
          }}
        />

        {/* Ambient Page Vignette and Bottom Fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#050505]/80 pointer-events-none" />

        {/* Normal Upload Image Bar on Hover (Just Like Before) */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-white text-black font-mono font-semibold text-xs tracking-wider uppercase flex items-center gap-2 hover:bg-[#C0C0C0] transition-colors cursor-pointer shadow-2xl border border-white/20 active:scale-95"
          >
            <Upload className="w-4 h-4 text-black" />
            <span>Upload Your Photo / Change</span>
          </button>

          <span className="text-[11px] font-mono text-zinc-400">
            JPG, PNG or WebP · Auto-optimized
          </span>
        </div>

        {/* Normal Upload Bar along the bottom (always accessible) */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          <div className="px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-400">
            CHAITANYA JAIN // PORTRAIT
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1 bg-black/85 hover:bg-white hover:text-black text-zinc-300 border border-white/20 text-[10px] font-mono transition-all flex items-center gap-1.5 backdrop-blur-md pointer-events-auto cursor-pointer"
            title="Upload image"
          >
            <Camera className="w-3 h-3 text-emerald-400" />
            <span>Upload Image</span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>
    </motion.div>
  );
}
