import React, { useRef, useState, useEffect } from 'react';
import { ThoughtCard } from '../types';
import { STYLE_PRESETS } from '../data';
import { Download, Check, Sparkles, RefreshCw, Type, AlignLeft, RotateCw } from 'lucide-react';

interface CardExporterProps {
  initialCard: ThoughtCard;
}

type RatioType = '3:4' | '1:1' | '9:16' | '16:9';
type LayoutOrientation = 'vertical' | 'horizontal';

export default function CardExporter({ initialCard }: CardExporterProps) {
  const [text, setText] = useState(initialCard.text);
  const [translation, setTranslation] = useState(initialCard.translation || '');
  const [category, setCategory] = useState(initialCard.category);
  const [meta, setMeta] = useState(initialCard.meta);
  
  // Exporter Controls
  const [ratio, setRatio] = useState<RatioType>('3:4');
  const [orientation, setOrientation] = useState<LayoutOrientation>('vertical');
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof STYLE_PRESETS>(initialCard.stylePreset as any || 'ceiling');
  const [showWatermark, setShowWatermark] = useState(false);
  const [pureTextMode, setPureTextMode] = useState(true);
  const [fontSizeRatio, setFontSizeRatio] = useState<number>(3.5); // Range from 2 to 5
  const [borderStyle, setBorderStyle] = useState<'double' | 'minimal' | 'none'>('none');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [exporting, setExporting] = useState(false);

  // Sync state if initialCard changes
  useEffect(() => {
    setText(initialCard.text);
    setTranslation(initialCard.translation || '');
    setCategory(initialCard.category);
    setMeta(initialCard.meta);
    if (initialCard.stylePreset) {
      setSelectedPreset(initialCard.stylePreset as any);
    }
  }, [initialCard]);

  // Redraw preview whenever settings change
  useEffect(() => {
    drawCardOnCanvas();
  }, [text, translation, category, meta, ratio, orientation, selectedPreset, showWatermark, pureTextMode, fontSizeRatio, borderStyle]);

  const presetMeta = STYLE_PRESETS[selectedPreset];

  const getCanvasDimensions = (): { width: number; height: number } => {
    switch (ratio) {
      case '3:4':
        return { width: 1080, height: 1440 }; // Pristine book portrait zine ratio
      case '9:16':
        return { width: 1080, height: 1920 };
      case '16:9':
        return { width: 1920, height: 1080 };
      case '1:1':
      default:
        return { width: 1200, height: 1200 };
    }
  };

  const drawCardOnCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = getCanvasDimensions();
    canvas.width = width;
    canvas.height = height;

    // Background color
    const config = STYLE_PRESETS[selectedPreset].cardStyle;
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Draw background texture (very soft grain lines / minimalist noise) - Only if NOT in pure text mode
    if (!pureTextMode) {
      ctx.strokeStyle = config.borderColor + '1A'; // 10% opacity line accents
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
    }

    // Outer margin space (e.g., 8% of width)
    const marginX = width * 0.08;
    const marginY = height * 0.08;
    const drawW = width - marginX * 2;
    const drawH = height - marginY * 2;

    // Draw frame border - Only if NOT in pure text mode and borderStyle !== 'none'
    if (!pureTextMode && borderStyle !== 'none') {
      ctx.strokeStyle = config.borderColor;
      if (borderStyle === 'double') {
        // Double-line thin elegant border
        ctx.lineWidth = 2;
        ctx.strokeRect(marginX, marginY, drawW, drawH);
        ctx.lineWidth = 0.5;
        ctx.strokeRect(marginX + 8, marginY + 8, drawW - 16, drawH - 16);
      } else {
        // Minimalist thin border
        ctx.lineWidth = 1;
        ctx.strokeRect(marginX, marginY, drawW, drawH);
      }
    }

    // Watermark/Metadata text on the side - Only if NOT in pure text mode and showWatermark is enabled
    if (!pureTextMode && showWatermark) {
      ctx.fillStyle = config.accentColor;
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      ctx.textBaseline = 'middle';
      
      // Bottom left corner attribution
      ctx.fillText('数字避难所 ✧ DIGITAL SANCTUARY', marginX + 30, height - marginY - 40);
      ctx.font = '11px monospace, Courier New';
      ctx.fillStyle = config.textColor + '80'; // 50% opacity
      ctx.fillText('CRASH SYSTEM RECOVERY - Neuro self-protection space', marginX + 30, height - marginY - 20);

      // Top right category & meta label
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.fillStyle = config.accentColor;
      const metaStr = `${category.toUpperCase()} | ${meta}`;
      const metaWidth = ctx.measureText(metaStr).width;
      ctx.fillText(metaStr, width - marginX - 30 - metaWidth, marginY + 40);
    }

    // Text drawing parameters
    const baseFontSize = (orientation === 'vertical' ? width : height) * 0.01 * fontSizeRatio;
    ctx.fillStyle = config.textColor;

    // Helper to get clean sentences without any punctuation
    const getCleanSentences = (rawStr: string): string[] => {
      // Split by common line/column breaks first
      let items = rawStr.split(/[\n，,；;。、？！.?!:：]+/).map(s => s.trim()).filter(Boolean);
      
      // If only 1 item but it contains space(s), split by space
      if (items.length === 1) {
        const spaceSplit = rawStr.split(/\s+/).map(s => s.trim()).filter(Boolean);
        if (spaceSplit.length > 1) {
          items = spaceSplit;
        }
      }
      
      if (items.length === 0) {
        items = [rawStr];
      }

      // Strip all leftover punctuation from each item so NO punctuation remains
      return items.map(item => 
        item.replace(/[。，、？！；：——……（）“”‘’《》.?!;:()""'']/g, '').trim()
      ).filter(Boolean);
    };

    // Helper to get clean translation without punctuation
    const cleanTranslation = translation 
      ? translation.replace(/[。，、？！；：——……（）“”‘’《》.?!;:()""'']/g, ' ').replace(/[ \t]+/g, ' ').trim()
      : '';

    // Draw Chinese character text
    if (orientation === 'vertical') {
      // -----------------------------------------------------
      // VERTICAL CHINESE LAYOUT
      // -----------------------------------------------------
      
      // Font settings for main poem
      ctx.font = `normal 400 ${baseFontSize}px "STSong", "Songti SC", "PingFang SC", "Georgia", serif`;
      ctx.textBaseline = 'top';

      let sentences = getCleanSentences(text);
      
      // Calculate layout center bounding box
      const colSpacing = baseFontSize * 1.8;
      const charSpacing = baseFontSize * 1.35;
      const totalColumns = sentences.length;
      const totalWidth = totalColumns * colSpacing;
      
      // Starting coordinates (Traditional Chinese vertical is read right-to-left)
      const startX = (width + totalWidth) / 2 - colSpacing / 2;
      
      // Centered starting y or traditional high starting y
      const maxColLength = Math.max(...sentences.map(s => s.length), 1);
      const colHeight = maxColLength * charSpacing;
      const startY = pureTextMode ? (height - colHeight) / 2 : height * 0.22;

      sentences.forEach((sentence, colIndex) => {
        const x = startX - colIndex * colSpacing;
        let y = startY;

        // Draw character by character
        for (let char of sentence) {
          ctx.fillText(char, x, y);
          y += charSpacing;
        }
      });

      // Translation text drawing at the bottom in secondary font
      if (cleanTranslation) {
        ctx.font = `italic 300 ${(baseFontSize * 0.45)}px "Georgia", "Times New Roman", serif`;
        ctx.fillStyle = config.textColor + 'B3'; // 70% opacity
        ctx.textAlign = 'center';
        
        const words = cleanTranslation.split(' ');
        const lines = [];
        let curLine = '';
        const maxTransWidth = drawW * 0.85;

        for (let word of words) {
          const testLine = curLine ? curLine + ' ' + word : word;
          const metric = ctx.measureText(testLine);
          if (metric.width > maxTransWidth) {
            lines.push(curLine);
            curLine = word;
          } else {
            curLine = testLine;
          }
        }
        if (curLine) lines.push(curLine);

        // Draw translation lines centered at the lower-middle zone
        const transStartTextY = pureTextMode ? height * 0.82 : height * 0.72;
        lines.forEach((line, index) => {
          ctx.fillText(line, width / 2, transStartTextY + index * (baseFontSize * 0.65));
        });
      }

    } else {
      // -----------------------------------------------------
      // HORIZONTAL MODERN LAYOUT
      // -----------------------------------------------------
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      let sentences = getCleanSentences(text);
      
      ctx.font = `normal 400 ${baseFontSize}px "STSong", "Songti SC", "Georgia", serif`;
      
      // Calculate vertical space
      const lineSpacing = baseFontSize * 1.8;
      const textBlockHeight = sentences.length * lineSpacing;
      const startY = (height - textBlockHeight) / 2;

      sentences.forEach((sentence, index) => {
        const y = startY + index * lineSpacing;
        ctx.fillText(sentence, width / 2, y);
      });

      // Add horizontal translation subtitle
      if (cleanTranslation) {
        ctx.font = `italic 300 ${(baseFontSize * 0.45)}px "Georgia", serif`;
        ctx.fillStyle = config.textColor + '99'; // 60% opacity
        
        const transY = startY + sentences.length * lineSpacing + (baseFontSize * 0.8);
        
        const words = cleanTranslation.split(' ');
        const lines = [];
        let curLine = '';
        const maxTransWidth = drawW * 0.75;

        for (let word of words) {
          const testLine = curLine ? curLine + ' ' + word : word;
          if (ctx.measureText(testLine).width > maxTransWidth) {
            lines.push(curLine);
            curLine = word;
          } else {
            curLine = testLine;
          }
        }
        if (curLine) lines.push(curLine);

        lines.forEach((line, index) => {
          ctx.fillText(line, width / 2, transY + index * (baseFontSize * 0.6));
        });
      }
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setExporting(true);
    
    setTimeout(() => {
      try {
        const image = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        const filenameText = text.slice(0, 10).replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');
        link.download = `栖息卡片_${filenameText || 'card'}.png`;
        link.href = image;
        link.click();
      } catch (err) {
        console.error('Download failed', err);
      } finally {
        setExporting(false);
      }
    }, 500);
  };

  return (
    <div id="art_card_exporter" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full max-w-7xl mx-auto p-4 md:p-6 bg-[#FAF7F2] rounded-2xl border border-[#ece4d9] shadow-sm">
      
      {/* LEFT: Live Customization Panel */}
      <div id="cfg_pnl" className="lg:col-span-5 flex flex-col gap-6 p-5 md:p-6 bg-[#FFFFFF] rounded-xl border border-[#ede3d5] h-full justify-between">
        
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-[#FAF7F2] pb-3">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h3 className="font-serif text-lg font-semibold text-[#2e2b27]">制卡工坊 / Typographic Studio</h3>
          </div>

          {/* Form edit fields */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-mono font-bold text-[#8c8273]">中文文本 (Main Text)</label>
            <textarea
              id="txt_cn"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full text-sm font-sans p-3 bg-[#FAF7F2] rounded-lg border border-[#e8dfd3] focus:outline-none focus:ring-1 focus:ring-indigo-400 text-zinc-800 leading-relaxed font-medium"
              rows={3}
              placeholder="醒来。允许一切发生..."
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-xs font-mono font-bold text-[#8c8273]">英文译句 (Footnote Subtitle / Translation)</label>
            <textarea
              id="txt_en"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              className="w-full text-xs font-mono p-3 bg-[#FAF7F2] rounded-lg border border-[#e8dfd3] focus:outline-none focus:ring-1 focus:ring-indigo-400 text-zinc-600 leading-relaxed"
              rows={2}
              placeholder="English reflection note..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold text-[#8c8273]">状态标签</label>
              <input
                id="inp_lbl"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#FAF7F2] rounded-lg border border-[#e8dfd3] focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold text-[#8c8273]">时间轴记位</label>
              <input
                id="inp_meta"
                type="text"
                value={meta}
                onChange={(e) => setMeta(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#FAF7F2] rounded-lg border border-[#e8dfd3] focus:outline-none"
              />
            </div>
          </div>

          <hr className="border-[#FAF7F2] my-1" />

          {/* Aesthetic Controls */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-mono font-bold text-[#8c8273]">1. 排版格局 (Orientation)</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn_ornt_v"
                onClick={() => setOrientation('vertical')}
                className={`flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg border transition-all ${
                  orientation === 'vertical'
                    ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700'
                    : 'border-[#ddcfbb] bg-[#FFFFFF] text-[#554e44] hover:bg-[#FAF7F2]'
                }`}
              >
                <Type className="w-3.5 h-3.5 rotate-90" />
                传统直排 (Vertical Poetry)
              </button>
              <button
                id="btn_ornt_h"
                onClick={() => setOrientation('horizontal')}
                className={`flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg border transition-all ${
                  orientation === 'horizontal'
                    ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700'
                    : 'border-[#ddcfbb] bg-[#FFFFFF] text-[#554e44] hover:bg-[#FAF7F2]'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
                现代横排 (Horizontal)
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-xs font-mono font-bold text-[#8c8273]">2. 画幅比例 (Canvas Aspect Ratio)</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['3:4', '1:1', '9:16', '16:9'] as RatioType[]).map((r) => (
                <button
                  key={r}
                  id={`btn_ratio_${r.replace(':', '_')}`}
                  onClick={() => setRatio(r)}
                  className={`py-2 text-[11px] font-mono font-bold rounded-lg border transition-all ${
                    ratio === r
                      ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700'
                      : 'border-[#ddcfbb] bg-[#FFFFFF] text-[#554e44] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {r === '3:4' ? '3:4 诗帖' : r === '1:1' ? '1:1 拍立得' : r === '9:16' ? '9:16 壁纸' : '16:9 横卷'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-xs font-mono font-bold text-[#8c8273]">3. 意境配色主题 (Atmosphere Palette)</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(STYLE_PRESETS).map((key) => {
                const item = STYLE_PRESETS[key as keyof typeof STYLE_PRESETS];
                const active = selectedPreset === key;
                return (
                  <button
                    key={key}
                    id={`btn_preset_${key}`}
                    onClick={() => setSelectedPreset(key as any)}
                    className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg border transition-all text-left ${
                      active
                        ? 'border-indigo-500 ring-1 ring-indigo-400 bg-indigo-50/20'
                        : 'border-[#ddcfbb] bg-white hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: item.cardStyle.backgroundColor }}
                    />
                    <span className="truncate text-zinc-700">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold text-[#8c8273]">字号大小 (Font Scale)</label>
              <input
                id="sld_fnt"
                type="range"
                min="2.0"
                max="5.5"
                step="0.2"
                value={fontSizeRatio}
                onChange={(e) => setFontSizeRatio(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-[#FAF7F2] rounded-lg"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold text-[#8c8273]">边框装裱 (Framing)</label>
              <select
                id="sel_bdr"
                disabled={pureTextMode}
                value={borderStyle}
                onChange={(e: any) => setBorderStyle(e.target.value)}
                className="w-full text-xs p-2 bg-[#FAF7F2] rounded-lg border border-[#e8dfd3] focus:outline-none focus:ring-1 focus:ring-indigo-400 disabled:opacity-55"
              >
                <option value="double">唐风双复框 (Double Frame)</option>
                <option value="minimal">现代细线 (Minimal Rim)</option>
                <option value="none">无边框 (Frameless Minimal)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <input
              id="chk_wtrmrk"
              type="checkbox"
              disabled={pureTextMode}
              checked={showWatermark}
              onChange={(e) => setShowWatermark(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-[#e8dfd3] disabled:opacity-55"
            />
            <label htmlFor="chk_wtrmrk" className="text-xs font-medium text-[#2e2b27] select-none cursor-pointer disabled:opacity-55">
              渲染官方安全防线水印 (Attribution Watermark)
            </label>
          </div>

          {/* Master Pure Text Mode Toggle Box */}
          <div className="flex flex-col gap-1.5 p-3.5 bg-amber-50/30 border border-amber-200/50 rounded-xl mt-1">
            <div className="flex items-center gap-3">
              <input
                id="chk_pure_text"
                type="checkbox"
                checked={pureTextMode}
                onChange={(e) => {
                  setPureTextMode(e.target.checked);
                  if (e.target.checked) {
                    setBorderStyle('none');
                    setShowWatermark(false);
                  }
                }}
                className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-[#e8dfd3]"
              />
              <label htmlFor="chk_pure_text" className="text-xs font-bold text-stone-800 select-none cursor-pointer flex items-center gap-1.5">
                只保留中间的文案 (Pure Text Mode)
                <span className="bg-[#FAF7F2] text-amber-800 border border-amber-200 text-[9px] px-1.5 py-0.5 rounded font-bold tracking-wider font-mono scale-95 origin-left">极简</span>
              </label>
            </div>
            <p className="text-[10px] text-stone-500 pl-7 leading-relaxed">
              去除所有边框、安全防线水印及分类标签，辅以动态诗行竖排和高维留白。
            </p>
          </div>
        </div>

        {/* BOTTOM: Action Button */}
        <button
          id="btn_exp_dwld"
          onClick={handleDownload}
          disabled={exporting}
          className="w-full mt-6 flex items-center justify-center gap-2 px-5 py-3.5 bg-[#2F3130] text-amber-50 hover:bg-zinc-800 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 text-sm font-semibold"
        >
          {exporting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              正在装裱、拼合高透图...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              保存高清卡片到本地 (Download Artwork PNG)
            </>
          )}
        </button>
      </div>

      {/* RIGHT: Live Visual Canvas Rendering View */}
      <div id="art_prev_col" className="lg:col-span-7 flex flex-col justify-center items-center p-4 md:p-6 bg-stone-100 rounded-xl border border-[#ede3d5] overflow-auto min-h-[500px]">
        <div className="text-center mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono font-bold text-stone-500 uppercase tracking-widest">
            高真度高阶排版实时预览区 (Typographic Visual Mockup)
          </span>
        </div>

        {/* Canvas container with correct responsive scale of the real high-res canvas */}
        <div 
          id="art_canvas_wrap"
          className="w-full max-w-md max-h-[600px] flex items-center justify-center shadow-xl border border-stone-200/50 hover:shadow-2xl transition-all duration-300 rounded-lg overflow-hidden bg-white"
          style={{
            aspectRatio: ratio === '3:4' ? '3/4' : ratio === '1:1' ? '1/1' : ratio === '9:16' ? '9/16' : '16/9'
          }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain cursor-zoom-in"
          />
        </div>
        
        <p className="text-center text-[11px] text-stone-400 mt-4 leading-relaxed max-w-sm">
          💡 本预览器基于 1:1 精确实时矢绘，下载后即生成全分辨率 1200~1920px 高保真像素大图，排版和细节和上图保持 100% 同源呈现。
        </p>
      </div>

    </div>
  );
}
