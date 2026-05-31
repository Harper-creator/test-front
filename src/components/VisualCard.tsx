import React from 'react';
import { VisualSpec } from '../lib/types';
import { VISUAL_DNA, MOOD_PALETTES } from '../lib/visualEngine';
import { Sparkles, Calendar, BookOpen, Quote } from 'lucide-react';

interface VisualCardProps {
  spec: VisualSpec;
  mode?: 'full' | 'thumbnail';
  narrativeTitle?: string;
  className?: string;
}

export default function VisualCard({ spec, mode = 'full', narrativeTitle = '断电日志', className = '' }: VisualCardProps) {
  const { layout, decoration, text: rawText, translation: rawTranslation, page, role } = spec;

  // Thorough punctuation stripper for beautiful serene display
  const stripPunctuation = (str: string | undefined): string => {
    if (!str) return '';
    return str
      .replace(/[。，、？！；：——……（）“”‘’《》.?!;:()""'']/g, ' ') // replace standard punctuation with spaces
      .replace(/[ \t]+/g, ' ') // collapse duplicate spaces
      .trim();
  };

  const text = stripPunctuation(rawText);
  const translation = stripPunctuation(rawTranslation);

  // Map typographical role to CSS styles matching the Visual DNA guidelines.
  let fontClass = 'font-serif';
  let trackingClass = 'tracking-normal';
  let weightClass = 'font-normal';

  switch (layout.font_role) {
    case 'display':
      fontClass = 'font-serif';
      trackingClass = 'tracking-wide';
      weightClass = 'font-medium';
      break;
    case 'body':
      fontClass = 'font-serif';
      weightClass = 'font-normal';
      trackingClass = 'tracking-normal';
      break;
    case 'caption':
      fontClass = 'font-sans';
      weightClass = 'font-light';
      trackingClass = 'tracking-widest';
      break;
    case 'label':
      fontClass = 'font-sans';
      weightClass = 'font-medium';
      trackingClass = 'tracking-widest';
      break;
  }

  // Align positioning variables block
  const alignClass = 
    layout.text_align === 'left' ? 'text-left' :
    layout.text_align === 'right' ? 'text-right' : 'text-center';

  const verticalClass =
    layout.vertical_position === 'top' ? 'justify-start' :
    layout.vertical_position === 'bottom' ? 'justify-end' : 'justify-center';

  // Subtitle/translation style
  const transFontSize = mode === 'thumbnail' ? 'text-[7px]' : 'text-xs md:text-sm';

  // Scale calculations for Thumbnail mode mockups
  if (mode === 'thumbnail') {
    return (
      <div
        className={`w-28 h-36 shrink-0 rounded-lg p-2 flex flex-col justify-between relative shadow-sm border transition-all select-none overflow-hidden text-clip ${className}`}
        style={{
          backgroundColor: layout.bg_color,
          color: layout.text_color,
          borderColor: decoration.accent_line ? '#C4B89A' : 'rgba(0,0,0,0.06)'
        }}
      >
        {/* Top watermark small line */}
        <div className="flex justify-between items-center text-[6px] opacity-40 font-mono tracking-tighter">
          <span>{role.slice(0, 8)}</span>
          <span>P.0{page}</span>
        </div>

        {/* Short Text representation */}
        <div className={`flex flex-col gap-1 my-1 flex-grow ${verticalClass} ${alignClass}`}>
          {decoration.accent_line && (
            <div className="w-[1.5px] h-3 bg-amber-600/50 self-center mb-1" />
          )}
          <p 
            className="font-serif leading-snug break-all font-medium text-center" 
            style={{ 
              fontSize: '8px', 
              lineHeight: '1.2' 
            }}
          >
            {text.length > 15 ? text.slice(0, 15) + '...' : text}
          </p>
        </div>

        {/* Thumbnail Bottom Indicator */}
        <div className="flex justify-between items-center text-[5px] opacity-30 font-mono">
          <span>SANCTUARY</span>
          <span>0{page}/08</span>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`visual-card-${page}`}
      className={`w-full max-w-lg aspect-[3/4] rounded-2xl p-8 md:p-12 shadow-md border flex flex-col justify-between relative overflow-hidden transition-all duration-300 select-none ${className}`}
      style={{
        backgroundColor: layout.bg_color,
        color: layout.text_color,
        borderColor: decoration.accent_line ? '#C4B89A' : 'rgba(0,0,0,0.08)',
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)'
      }}
    >
      {/* 2. Background styling grid helper */}
      <div className="absolute inset-0 bg-grid-paper opacity-[0.25] pointer-events-none" />

      {/* Decorative vertical grain paper bar if accent active */}
      {decoration.accent_line && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C4B89A]" />
      )}

      {/* TOP HEADER: Label / Title watermark */}
      <header className="flex justify-between items-start z-10">
        <div className="flex flex-col gap-0.5">
          <span 
            className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest font-mono"
            style={{ color: decoration.invert ? '#C8C4BC' : '#8A8A8A' }}
          >
            {narrativeTitle}
          </span>
          <span 
            className="text-[8px] font-mono opacity-50"
          >
            ROLE // {role.toUpperCase()}
          </span>
        </div>

        {decoration.page_number && (
          <span 
            className="text-xs font-mono font-semibold"
            style={{ color: decoration.invert ? '#C8C4BC' : '#8A8A8A' }}
          >
            PAGE 0{page}
          </span>
        )}
      </header>

      {/* MIDDLE: Text layout rendering container */}
      <div 
        className={`flex-grow flex flex-col z-10 ${verticalClass} ${alignClass}`}
        style={{ marginTop: `${layout.margin_top / 4}px` }}
      >
        {/* Paragraph text with design spacing */}
        <div className="flex flex-col gap-5 max-w-sm mx-auto">
          
          {/* Main poem quote text */}
          <h3 
            className={`${fontClass} ${weightClass} ${trackingClass} leading-relaxed text-zinc-900 whitespace-pre-line`}
            style={{ 
              fontSize: `${layout.font_size > 40 ? layout.font_size * 0.5 : layout.font_size * 0.65}px`,
              lineHeight: layout.line_height,
              color: layout.text_color
            }}
          >
            {text}
          </h3>

          {/* Footnote translation layer */}
          {translation && (
            <p 
              className={`font-serif italic font-light opacity-65 leading-loose border-t border-dashed border-stone-200 pt-3 mt-1 ${transFontSize} whitespace-pre-line`}
              style={{ color: layout.text_color }}
            >
              “ {translation} ”
            </p>
          )}

        </div>
      </div>

      {/* FOOTER: Sanctuary Watermark */}
      <footer className="flex justify-between items-end border-t border-dashed border-stone-100 pt-5 z-10 mt-6">
        <div className="flex items-center gap-1.5">
          {decoration.invert ? (
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          ) : (
            <Quote className="w-3.5 h-3.5 text-stone-300" />
          )}
          <span 
            className="text-[9px] font-mono tracking-wider"
            style={{ color: decoration.invert ? '#C8C4BC' : '#8D8982' }}
          >
            DIGITAL SANCTUARY ✧ 离线保护中
          </span>
        </div>

        <span 
          className="text-[9px] font-mono uppercase tracking-widest opacity-60"
        >
          {page}/8
        </span>
      </footer>
    </div>
  );
}
