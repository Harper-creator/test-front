import React, { useState, useEffect } from 'react';
import { ThoughtCard, NarrativeType, VisualSpec } from '../lib/types';
import { buildVisualSpecs, MOOD_PALETTES } from '../lib/visualEngine';
import VisualCard from './VisualCard';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Compass, 
  Activity, 
  ArrowRightLeft,
  Tv,
  CheckCircle,
  Dribbble,
  Layers,
  Award
} from 'lucide-react';

interface VisualCarouselProps {
  cards: ThoughtCard[];
  onSelectExportCard: (card: ThoughtCard) => void;
}

export default function VisualCarousel({ cards, onSelectExportCard }: VisualCarouselProps) {
  // 1. Core State
  const [narrativeType, setNarrativeType] = useState<NarrativeType>('burnout');
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Take the first 8 cards (or fill up to 8 if fewer are created by user)
  const paddedCards = [...cards];
  while (paddedCards.length < 8) {
    paddedCards.push({
      id: `pad_${paddedCards.length}`,
      text: `第 ${paddedCards.length + 1} 页：安静停留，等待系统自发重建。`,
      translation: `Page ${paddedCards.length + 1}: Stay silent, waiting for automatic renewal.`,
      category: '觉警',
      meta: '系统补位',
      stylePreset: 'ice',
      createdAt: new Date().toISOString()
    });
  }
  const displayCards = paddedCards.slice(0, 8);

  const texts = displayCards.map(c => c.text);
  const translations = displayCards.map(c => c.translation || '');

  // 2. Compile specs live through frontend Visual Engine!
  const specs = buildVisualSpecs(texts, translations, narrativeType);
  const currentSpec = specs[currentPageIndex] || specs[0];

  // 3. Auto play slideshow interval timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentPageIndex((prev) => (prev + 1) % 8);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleNext = () => {
    setCurrentPageIndex((prev) => (prev + 1) % 8);
    setIsPlaying(false);
  };

  const handlePrev = () => {
    setCurrentPageIndex((prev) => (prev - 1 + 8) % 8);
    setIsPlaying(false);
  };

  const currentThemePalette = MOOD_PALETTES[narrativeType];

  return (
    <div id="visual_carousel_root" className="w-full flex flex-col gap-8 max-w-7xl mx-auto p-4 md:p-6 bg-[#FAF7F2] rounded-2xl border border-[#ece4d9] shadow-sm">
      
      {/* SECTION 1: Narrative Tone Selection controller */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-white rounded-xl border border-[#ede3d5] gap-4">
        
        <div>
          <span className="text-[10px] uppercase font-bold text-amber-800 tracking-widest font-mono bg-amber-50 px-2.5 py-1 rounded border border-amber-100">
            Sprint 2: Visual Engine V1 Active
          </span>
          <h3 className="font-serif text-lg font-bold text-[#2e2b27] mt-2 flex items-center gap-1.5">
            <Layers className="w-4.5 h-4.5 text-zinc-700" />
            色谱情感投射 (Mood Tone Projection)
          </h3>
          <p className="text-xs text-[#8c8273] mt-1 leading-relaxed">
            切换不同的内心叙事类型，Visual Engine 将实时重新绘制这 8 个页面的排版比重、空白率、背景意境色谱与字体规格。
          </p>
        </div>

        {/* Narrative theme button tabs */}
        <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full md:w-auto">
          {(['burnout', 'disconnect', 'loneliness', 'freeze'] as NarrativeType[]).map((type) => {
            const label = 
              type === 'burnout' ? '🔥 疲惫感 (Burnout)' :
              type === 'disconnect' ? '🫧 疏离感 (Disconnect)' :
              type === 'loneliness' ? '⏳ 孤独感 (Loneliness)' : '❄️ 凝固期 (Freeze)';
            
            const active = narrativeType === type;
            const itemColor = MOOD_PALETTES[type];

            return (
              <button
                key={type}
                id={`btn_mood_tab_${type}`}
                onClick={() => setNarrativeType(type)}
                className={`px-4 py-2.5 rounded-lg text-xs font-semibold border transition-all text-left md:text-center ${
                  active
                    ? 'border-indigo-600 bg-indigo-50/20 text-indigo-950 font-bold shadow-xs'
                    : 'bg-white border-zinc-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-1.5 justify-center">
                  <div className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: itemColor.bg }} />
                  <span>{label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Split interactive workspace views */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Master Visual Card Simulator Window */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center p-4 md:p-8 bg-zinc-100 rounded-2xl border border-[#ede3d5] relative group">
          
          <div className="text-center mb-4 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-stone-50 tracking-widest uppercase bg-stone-700/80 px-2 py-0.5 rounded">
              ZINE PAGE 0{currentPageIndex + 1} OF 8 MOCKUP
            </span>
          </div>

          <VisualCard 
            spec={currentSpec} 
            narrativeTitle={
              narrativeType === 'burnout' ? 'BURNOUT // 生理硬切断' :
              narrativeType === 'disconnect' ? 'DISCONNECT // 物理防御机制' :
              narrativeType === 'loneliness' ? 'LONELINESS // 暮色余晖' : 'FREEZE // 凝块生存'
            }
          />

          {/* Player controls */}
          <div className="flex items-center gap-3 mt-6">
            <button
              id="btn_slide_prev"
              onClick={handlePrev}
              className="p-2 bg-white text-stone-700 border border-zinc-200 hover:bg-stone-50 rounded-lg active:scale-95 transition-all shadow-sm"
              title="上一页 (Previous Slide)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              id="btn_slide_play"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 shadow-sm ${
                isPlaying
                  ? 'bg-amber-100 border-amber-300 text-amber-800'
                  : 'bg-white border-zinc-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  暂停播音 (Pause Play)
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                  播放画册幻灯片 (Play Slideshow)
                </>
              )}
            </button>

            <button
              id="btn_slide_next"
              onClick={handleNext}
              className="p-2 bg-white text-stone-700 border border-zinc-200 hover:bg-stone-50 rounded-lg active:scale-95 transition-all shadow-sm"
              title="下一页 (Next Slide)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* RIGHT: Page Layout Guide / Step breakdowns */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 md:p-6 bg-white rounded-xl border border-[#ede3d5] h-full min-h-[460px]">
          
          <div className="flex flex-col gap-4">
            <div className="border-b border-stone-100 pb-3">
              <h4 className="text-xs font-mono font-bold text-stone-400 tracking-wider">PAGE ROLE SPECIFICATIONS ／ 页面意境规则</h4>
              <p className="text-sm font-serif font-bold text-[#2e2b27] mt-1 text-slate-800">
                第 {currentPageIndex + 1} 页：角色代号：<code className="text-indigo-600 font-mono text-xs">{currentSpec.role}</code>
              </p>
            </div>

            {/* Explains page rule */}
            <div className="bg-stone-50/50 rounded-lg p-4 border border-stone-200/40 text-xs text-[#554e44] leading-relaxed flex flex-col gap-2.5">
              
              {currentPageIndex === 0 && (
                <>
                  <p className="font-bold text-slate-800">📖 Role: lens_enter 入口仪式页</p>
                  <span><strong>排版布局：</strong>极致大留白，display 宣泄型排版。文本居前/左，占地约 1/3。抛弃页码，打造极强的第一张力进入体验。</span>
                </>
              )}
              {currentPageIndex === 1 && (
                <>
                  <p className="font-bold text-slate-800">📖 Role: lens_tension 张力递进页</p>
                  <span><strong>排版布局：</strong>将文本有意大幅度隔热偏移到了画面下半部分。上方留下高达 60% 的空洞。静立留白引发思考。</span>
                </>
              )}
              {currentPageIndex === 2 && (
                <>
                  <p className="font-bold text-slate-800">📖 Role: hidden_observe 洞察垂直线页</p>
                  <span><strong>排版布局：</strong>整体采用中轴线对称设计，字体较平时略小。但在左侧加设 1px 细长的装裱色竖条，给予物理性的指引。</span>
                </>
              )}
              {(currentPageIndex === 3 || currentPageIndex === 4) && (
                <>
                  <p className="font-bold text-slate-800">📖 Role: movement_forward 主体推进页</p>
                  <span><strong>排版布局：</strong>文本向左对齐，开启了系统官方的页码指示器「P.04/P.05」，展示日志连贯性，给人提供陪伴与接纳的安全防线。</span>
                </>
              )}
              {currentPageIndex === 5 && (
                <>
                  <p className="font-bold text-slate-800">📖 Role: climax_reverse 极限暗夜反转页</p>
                  <span><strong>排版布局：</strong>极强的视觉反转。抛弃温和的米白，转为纯黑色夜空背景（bg_dark），辅以亮米白衬线大字。给麻木状态带来震撼和破局点。</span>
                </>
              )}
              {currentPageIndex === 6 && (
                <>
                  <p className="font-bold text-slate-800">📖 Role: deep_observe 旁白电影字幕页</p>
                  <span><strong>排版布局：</strong>中轴对称，超轻纤细 Sans 字体。用极轻极短的词组充当大片独白字幕，仿佛深夜的耳边低语。</span>
                </>
              )}
              {currentPageIndex === 7 && (
                <>
                  <p className="font-bold text-slate-800">📖 Role: anchor_resolve 锚点回音落点页</p>
                  <span><strong>排版布局：</strong>最终篇。文字静静地伏在最底部，上半截天地大留白。去掉句号，代表着未完的治愈与漫长的神经恢复期。</span>
                </>
              )}

              <div className="mt-2 border-t border-stone-200/60 pt-3 flex flex-col gap-1 text-[11px] text-stone-500 font-mono">
                <div>🎨 BACKGROUND: <span className="text-zinc-800">{currentSpec.layout.bg_color}</span></div>
                <div>✒️ FONT SCALE: <span className="text-indigo-600">{currentSpec.layout.font_size}px ({currentSpec.layout.font_role})</span></div>
                <div>📐 MOCKUP RATIO: <span className="text-zinc-800">1080 × 1440 (3:4 Ratio Book)</span></div>
              </div>
            </div>

            {/* Direct fine tuning mapping */}
            <div className="mt-2">
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block mb-2">手记和英语译句原文</span>
              <p className="text-sm font-sans font-semibold text-stone-800 leading-relaxed bg-[#FAF7F2] p-3 rounded-lg border border-stone-200/30">
                {currentSpec.text}
              </p>
            </div>

          </div>

          <div className="flex flex-col gap-2.5 pt-6 border-t border-stone-100">
            <button
              id={`btn_promote_export_p${currentPageIndex}`}
              onClick={() => onSelectExportCard(displayCards[currentPageIndex])}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2F3130] text-amber-50 hover:bg-zinc-800 rounded-lg active:scale-[0.98] transition-all text-xs font-bold shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              将第 0{currentPageIndex + 1} 页载入「高真度制卡工坊」 Fine-tune & 导出
            </button>
          </div>

        </div>

      </div>

      {/* SECTION 3: Movie Film Horizontal Strip */}
      <div className="flex flex-col gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-200/50">
        <span className="text-[10px] font-mono font-bold text-stone-400 tracking-widest uppercase block">
          📺 八屏叙事多视图胶片索引条 (8-Page Cinematic Story Roll)
        </span>
        
        <div id="cine_roll" className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
          {specs.map((item, index) => {
            const isCurrent = currentPageIndex === index;
            return (
              <div
                key={item.page}
                id={`strip_card_item_${item.page}`}
                onClick={() => setCurrentPageIndex(index)}
                className={`relative flex-shrink-0 cursor-pointer rounded-xl transition-all ${
                  isCurrent 
                    ? 'ring-2 ring-indigo-500 scale-95 shadow-md' 
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <VisualCard spec={item} mode="thumbnail" />
                
                {/* Numeric indicator badge */}
                <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-black border tracking-tighter ${
                  isCurrent
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow'
                    : 'bg-white text-stone-600 border-zinc-300'
                }`}>
                  0{item.page}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
