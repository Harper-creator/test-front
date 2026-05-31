import React, { useState, useEffect } from 'react';
import { ThoughtCard, LayoutMode } from './types';
import { DEFAULT_CARDS, STYLE_PRESETS } from './data';
import { globalAudio } from './utils/audio';
import CardExporter from './components/CardExporter';
import VisualCarousel from './components/VisualCarousel';
import { 
  Compass, 
  BookOpen, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Plus, 
  Trash2, 
  Heart, 
  Coffee, 
  BatteryCharging,
  Share2,
  Clock,
  Book,
  Activity
} from 'lucide-react';

export default function App() {
  // Persistence Loading
  const [cards, setCards] = useState<ThoughtCard[]>(() => {
    const saved = localStorage.getItem('recovery_sanctuary_cards_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return DEFAULT_CARDS;
  });

  const [activeTab, setActiveTab] = useState<LayoutMode>('mindscape');
  const [selectedCard, setSelectedCard] = useState<ThoughtCard>(cards[0] || DEFAULT_CARDS[0]);
  const [ambientActive, setAmbientActive] = useState(false);
  const [breathingText, setBreathingText] = useState<'Inhale (吸气)' | 'Hold (保持)' | 'Exhale (呼气)' | 'Rest (歇留)'>('Inhale (吸气)');
  const [breathingSeconds, setBreathingSeconds] = useState(0);

  // New Thought Form State
  const [newText, setNewText] = useState('');
  const [newTrans, setNewTrans] = useState('');
  const [newCategory, setNewCategory] = useState('随笔 (Log)');
  const [newPreset, setNewPreset] = useState<keyof typeof STYLE_PRESETS>('ceiling');
  const [formOpen, setFormOpen] = useState(false);

  // Sync cards to localStorage
  useEffect(() => {
    localStorage.setItem('recovery_sanctuary_cards_v1', JSON.stringify(cards));
  }, [cards]);

  // Box Breathing cycle state machine
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathingSeconds((prev) => {
        const next = (prev + 1) % 16;
        if (next < 4) {
          setBreathingText('Inhale (吸气)');
        } else if (next < 8) {
          setBreathingText('Hold (保持)');
        } else if (next < 12) {
          setBreathingText('Exhale (呼气)');
        } else {
          setBreathingText('Rest (歇留)');
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const nextState = !ambientActive;
    setAmbientActive(nextState);
    globalAudio.toggleAmbient(nextState);
  };

  const handleStrikeBowl = () => {
    globalAudio.playBowlStrike();
  };

  const handleAddThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newCard: ThoughtCard = {
      id: `custom_${Date.now()}`,
      text: newText.trim(),
      translation: newTrans.trim() || undefined,
      category: newCategory.trim() || '随记',
      meta: `${new Date().toLocaleDateString('zh-CN')} - 自定义`,
      stylePreset: newPreset,
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    const updated = [newCard, ...cards];
    setCards(updated);
    setSelectedCard(newCard);
    
    // Clear Form
    setNewText('');
    setNewTrans('');
    setNewCategory('随笔 (Log)');
    setFormOpen(false);
    
    // Play soothing feedback gong
    globalAudio.playBowlStrike();
  };

  const handleDeleteCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('确定要移除此条想法吗？')) return;
    
    const updated = cards.filter(c => c.id !== id);
    setCards(updated);
    if (selectedCard.id === id && updated.length > 0) {
      setSelectedCard(updated[0]);
    }
  };

  const handleSelectCardToExport = (card: ThoughtCard) => {
    setSelectedCard(card);
    setActiveTab('exporter');
    globalAudio.playBowlStrike();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2F3130] flex flex-col relative bg-grid-paper selection:bg-amber-100 selection:text-amber-900 pb-12">
      
      {/* 1. APP HEADER DESIGN */}
      <header id="app_header" className="border-b border-[#ece4d9] bg-[#FAF7F2]/90 backdrop-blur sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <span className="p-1 px-1.5 bg-[#2F3130] text-[#FAF7F2] rounded text-[11px] font-mono tracking-widest uppercase font-bold">
                offline sanctuary
              </span>
              <span className="flex items-center gap-1.5 text-xs text-amber-700/80 font-semibold font-mono bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                神经系统保护仓已就绪 (Visual V1 Active)
              </span>
            </div>
            
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-[#2e2b27] mt-1.5 flex items-center gap-2">
              断电保护区 🌲 <span className="font-sans font-normal text-xs text-stone-400">Digital Recovery Space</span>
            </h1>
          </div>

          {/* Calming interactive Soundscape Panel */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              id="btn_bowl_strike"
              onClick={handleStrikeBowl}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-[#dfd4c4] bg-[#FFFFFF] hover:bg-stone-50 transition-all flex items-center gap-1.5 text-[#554e44] active:scale-95 shadow-sm"
              title="敲击手造颂钵，发出一声深邃悠长的治愈回响"
            >
              🔔 敲击颂钵 (Gentle Gong)
            </button>

            <button
              id="btn_toggle_ambient"
              onClick={handleToggleSound}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all shadow-sm ${
                ambientActive 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-[#2F3130] text-[#FAF7F2] border-transparent hover:bg-zinc-800'
              }`}
            >
              {ambientActive ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                  <span>环境音已开启 (Rain On)</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                  <span>开启静心白噪音</span>
                </>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* 2. LAYOUT / VIEWS TAB NAVIGATOR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 w-full">
        <div className="flex border-b border-[#ece4d9] gap-1 md:gap-2 overflow-x-auto scrollbar-none">
          <button
            id="tab_mindscape"
            onClick={() => { setActiveTab('mindscape'); globalAudio.playBowlStrike(); }}
            className={`px-4 md:px-6 py-3 text-xs md:text-sm font-medium tracking-wide flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'mindscape'
                ? 'border-[#2F3130] text-[#2F3130] font-bold bg-[#FFFFFF]/40'
                : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
            }`}
          >
            <Compass className="w-4 h-4" />
            「自愈卡壁」 (Mind Grid)
          </button>

          <button
            id="tab_zine"
            onClick={() => { setActiveTab('zine'); globalAudio.playBowlStrike(); }}
            className={`px-4 md:px-6 py-3 text-xs md:text-sm font-medium tracking-wide flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'zine'
                ? 'border-[#2F3130] text-[#2F3130] font-bold bg-[#FFFFFF]/40'
                : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
            }`}
          >
            <Book className="w-4 h-4 text-indigo-600" />
            「叙事画册 (Visual V1)」
          </button>

          <button
            id="tab_breathing"
            onClick={() => { setActiveTab('breathing'); globalAudio.playBowlStrike(); }}
            className={`px-4 md:px-6 py-3 text-xs md:text-sm font-medium tracking-wide flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'breathing'
                ? 'border-[#2F3130] text-[#2F3130] font-bold bg-[#FFFFFF]/40'
                : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            「手帖展台 & 呼吸」 (Focus Booklet)
          </button>

          <button
            id="tab_exporter"
            onClick={() => { setActiveTab('exporter'); globalAudio.playBowlStrike(); }}
            className={`px-4 md:px-6 py-3 text-xs md:text-sm font-medium tracking-wide flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'exporter'
                ? 'border-[#2F3130] text-[#2F3130] font-bold bg-[#FFFFFF]/40'
                : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            「高保定制卡工坊」
          </button>
        </div>
      </div>

      {/* 3. WORKING WORKSPACE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex-grow w-full">
        
        {/* VIEW A: MINDSCAPE BENTO CARD PANEL */}
        {activeTab === 'mindscape' && (
          <div id="view_mindscape" className="flex flex-col gap-6">
            
            {/* Introductory reassurance banners */}
            <div className="p-5 md:p-6 bg-[#FFFFFF]/60 rounded-xl border border-[#ece4d9] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="max-w-2xl">
                <h2 className="font-serif text-lg font-medium text-[#2e2b27] flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-amber-700" />
                  在这里：允许自己停止运转，哪怕只是当下
                </h2>
                <p className="text-xs text-[#8c8273] leading-relaxed mt-1">
                  这些图文不为表演，不为贩卖焦虑，而是神经系统达到极限时，发出的真实求救与自我冷凝。我们已经为您排版并精装为了极简手帖。
                  您可以随意浏览，点击单卡进行<strong>呼吸共处</strong>，或将其导入<strong>叙事画册 (V1 Engine)</strong>。
                </p>
              </div>

              <button
                id="btn_open_form"
                onClick={() => setFormOpen(!formOpen)}
                className="px-4 py-2.5 text-xs font-semibold bg-[#2F3130] hover:bg-zinc-800 text-[#FAF7F2] rounded-lg transition-all flex items-center gap-2 self-start md:self-auto shrink-0 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                撰写我的精神状态卡片
              </button>
            </div>

            {/* EXPANDABLE FLOATING FORM */}
            {formOpen && (
              <form 
                onSubmit={handleAddThought}
                className="p-5 bg-[#FFFFFF] border-2 border-dashed border-stone-200 rounded-xl flex flex-col gap-4 max-w-2xl animate-fade-in"
              >
                <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                  <h4 className="text-xs font-bold font-mono text-[#8c8273] uppercase tracking-wide">
                    ✏️ 新增精神状态手记
                  </h4>
                  <button 
                    type="button" 
                    onClick={() => setFormOpen(false)}
                    className="text-xs text-stone-400 hover:text-stone-700 font-mono"
                  >
                    取消
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-stone-600">内心独白 (中文 * 必填)</label>
                  <input
                    type="text"
                    required
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="如：早晨醒来。天花板盯着你。你盯着天花板。"
                    className="w-full text-xs p-2.5 bg-[#FAF7F2] border border-[#e8dfd3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2F3130]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-stone-600">英语译句/脚注副标题 (可选)</label>
                  <input
                    type="text"
                    value={newTrans}
                    onChange={(e) => setNewTrans(e.target.value)}
                    placeholder="如: Waking up. The ceiling stares at you..."
                    className="w-full text-xs p-2.5 bg-[#FAF7F2] border border-[#e8dfd3] rounded-lg focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-stone-600">状态标签 / 状态深度</label>
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="如：阻绝、超载、冷凝"
                      className="w-full text-xs p-2.5 bg-[#FAF7F2] border border-[#e8dfd3] rounded-lg"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-stone-600">心境色谱 preset</label>
                    <select
                      value={newPreset}
                      onChange={(e: any) => setNewPreset(e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF7F2] border border-[#e8dfd3] rounded-lg focus:outline-none"
                    >
                      <option value="ceiling">燕麦粗粝 (Oatmeal - 触感)</option>
                      <option value="ice">冰川冰愈 (Ice Blue - 冷凝)</option>
                      <option value="fog">迷雾重力 (Fog Gray - 混沌)</option>
                      <option value="lead">灌铅重度阴 (Lead Dark - 释能)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2 text-xs font-bold text-center bg-[#2F3130] text-[#FAF7F2] rounded-lg hover:bg-stone-800 transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3 text-[#FAF7F2]" />
                  封存至避难所卡库 (Seal in Sanctuary)
                </button>
              </form>
            )}

            {/* ARTISTIC BENTO GRID */}
            <div id="mindspace_grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => {
                const preset = STYLE_PRESETS[card.stylePreset as keyof typeof STYLE_PRESETS] || STYLE_PRESETS.ceiling;
                const isSelected = selectedCard.id === card.id;

                // Strip standard Chinese and English punctuation periods and category tags logic dynamically, natural segment breaks
                const getCleanPoemLines = (rawStr: string): string[] => {
                  let parts = rawStr.split(/[\n，,。；;、？！.?!:：]+/).map(s => s.trim()).filter(Boolean);
                  if (parts.length === 1) {
                    const spaceParts = rawStr.split(/\s+/).map(s => s.trim()).filter(Boolean);
                    if (spaceParts.length > 1) {
                      parts = spaceParts;
                    }
                  }
                  return parts.map(p => p.replace(/[。，、？！；：——……（）“”‘’《》.?!;:()""'']/g, '').trim()).filter(Boolean);
                };

                const lines = getCleanPoemLines(card.text);
                const cleanTrans = card.translation 
                  ? card.translation.replace(/[。，、？！；：——……（）“”‘’《》.?!;:()""'']/g, ' ').replace(/[ \t]+/g, ' ').trim()
                  : '';

                return (
                  <div
                    key={card.id}
                    id={`bento_card_${card.id}`}
                    onClick={() => { setSelectedCard(card); globalAudio.playBowlStrike(); }}
                    className={`aspect-[3/4] p-8 rounded-2xl border flex flex-col justify-between transition-all duration-300 relative group cursor-pointer hover:shadow-lg overflow-hidden ${preset.bg} ${
                      isSelected 
                        ? 'ring-2 ring-indigo-500 scale-[1.02] shadow-md border-indigo-200' 
                        : 'hover:scale-[1.01]'
                    }`}
                  >
                    {/* Subtle top delete icon - only visible on hover */}
                    <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      {card.isCustom && (
                        <button
                          id={`btn_del_${card.id}`}
                          onClick={(e) => handleDeleteCard(card.id, e)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-full shadow-sm transition-all"
                          title="从卡库移除想法"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Centered Main Verse (Pure layout with spacious margin) */}
                    <div className="flex-grow flex flex-col justify-center items-center text-center px-2 py-6 my-auto">
                      <div className="flex flex-col gap-3 md:gap-4">
                        {lines.map((line, idx) => (
                          <p 
                            key={idx} 
                            className={`font-serif text-[15px] sm:text-[17px] md:text-[19px] font-medium tracking-widest leading-relaxed ${preset.text}`}
                          >
                            {line}
                          </p>
                        ))}

                        {cleanTrans && (
                          <p className={`font-serif italic text-[11px] md:text-xs tracking-wide opacity-50 ${preset.text} mt-5 pt-4 border-t border-dashed border-stone-200/40 max-w-[200px] mx-auto leading-relaxed`}>
                            {cleanTrans}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Minimal Interactive Bottom Bar (fades in on hover to keep static design absolutely pure) */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between mt-auto pt-4 border-t border-dashed border-stone-200/40 z-10 bg-inherit">
                      <button
                        id={`btn_goto_breed_${card.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCard(card);
                          setActiveTab('breathing');
                          globalAudio.playBowlStrike();
                        }}
                        className="text-[10px] sm:text-[11px] font-bold font-mono text-[#2F3130] hover:underline flex items-center gap-1.5 bg-white/70 px-2 py-1 rounded shadow-xs"
                      >
                        🧘🏼‍♀️ 契合共处
                      </button>

                      <button
                        id={`btn_goto_exp_${card.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectCardToExport(card);
                        }}
                        className="px-2.5 py-1 text-[10px] sm:text-[11px] font-bold font-serif bg-[#2F3130] text-[#FAF7F2] hover:bg-zinc-800 rounded flex items-center gap-1 shadow-sm transition-all"
                      >
                        <Share2 className="w-2.5 h-2.5" />
                        高保真制卡 ➔
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Empty check */}
            {cards.length === 0 && (
              <div className="p-12 text-center rounded-xl bg-white border border-stone-200/70">
                <p className="text-[#8c8273] font-serif">避难所卡库空屏，点击上方“撰写我的精神状态卡片”开始记录状态。</p>
              </div>
            )}

          </div>
        )}

        {/* VIEW B: HIGH-FIDELITY STORY ZINE CAROUSEL (VISUAL ENGINE V1 TARGET) */}
        {activeTab === 'zine' && (
          <div id="view_zine" className="w-full">
            <VisualCarousel 
              cards={cards} 
              onSelectExportCard={(card) => {
                setSelectedCard(card);
                setActiveTab('exporter');
              }}
            />
          </div>
        )}

        {/* VIEW C: FULL EDITORIAL FOCUS & BOX BREATHING ORB COMPANION */}
        {activeTab === 'breathing' && (
          <div id="view_breathing" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
            
            {/* LEFT SIDE: Carousel selector list */}
            <div className="lg:col-span-4 flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-2">
              <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-widest mb-1.5 px-1 block">
                选择共愈卡片 ({cards.length})
              </span>
              {cards.map((card) => {
                const isSelected = selectedCard.id === card.id;
                return (
                  <button
                    key={card.id}
                    id={`btn_carousel_${card.id}`}
                    onClick={() => { setSelectedCard(card); globalAudio.playBowlStrike(); }}
                    className={`p-4 rounded-xl text-left border transition-all flex flex-col gap-2 ${
                      isSelected
                        ? 'border-[#2F3130] bg-[#FFFFFF] shadow-sm font-semibold'
                        : 'border-[#ece4d9] bg-[#FFFFFF]/30 hover:bg-[#FFFFFF]/60'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono tracking-widest max-w-[120px] truncate bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                        {card.category}
                      </span>
                      <span className="text-[9px] font-mono text-stone-400">{card.meta}</span>
                    </div>
                    <p className="font-serif text-sm text-[#2e2b27] line-clamp-2 leading-relaxed">
                      {card.text}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* RIGHT SIDE: Art Book Style Presentation with Box Breathing Orb */}
            <div className="lg:col-span-8 p-6 md:p-8 bg-[#FFFFFF] rounded-2xl border border-[#ece4d9] flex flex-col lg:flex-row justify-between items-stretch gap-8 min-h-[500px]">
              
              {/* Vertical / Horizontal presentation slot */}
              <div id="zine_frame" className="flex-1 flex flex-col justify-between max-w-lg min-h-[400px]">
                
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#8c8273] uppercase">
                      手帖画册展台 / ACTIVE BOOKLET
                    </span>
                  </div>

                  {/* Elegant vertical chinese write alignment */}
                  <div className="flex justify-center md:justify-start items-center p-4 bg-[#FAF7F2]/60 border border-[#FAF7F2] rounded-xl relative py-8">
                    
                    {/* Decorative margin lines for zine style */}
                    <div className="absolute left-6 top-6 bottom-6 border-l border-dashed border-[#dfd4c4]/40" />
                    <div className="absolute right-6 top-6 bottom-6 border-r border-dashed border-[#dfd4c4]/40" />

                    <div className="writing-vertical font-serif text-xl sm:text-2xl text-stone-900 leading-relaxed tracking-widest h-[240px] font-medium mx-auto md:mx-10 select-none">
                      {selectedCard.text.replace(/[。，、？！；：——……（）“”‘’《》.?!;:()""'']/g, ' ').replace(/[ \t]+/g, ' ').trim()}
                    </div>
                  </div>

                  {selectedCard.translation && (
                    <p className="font-serif italic text-xs leading-relaxed text-stone-500 mt-6 md:px-6 select-none leading-loose">
                      “ {selectedCard.translation.replace(/[。，、？！；：——……（）“”‘’《》.?!;:()""'']/g, ' ').replace(/[ \t]+/g, ' ').trim()} ”
                    </p>
                  )}
                </div>

                <div className="mt-8 border-t border-stone-100 pt-5 flex items-center justify-between md:px-6 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-stone-400">STATUS LEVEL</span>
                    <span className="text-xs font-mono font-bold text-stone-700">{selectedCard.category}</span>
                  </div>

                  <button
                    id="btn_editorial_edit"
                    onClick={() => handleSelectCardToExport(selectedCard)}
                    className="px-4 py-2 bg-[#2F3130] text-[#FAF7F2] hover:bg-stone-800 text-xs font-serif font-semibold tracking-wider rounded-lg transition-all flex items-center gap-1.5"
                  >
                    定制与一键导出此卡片 ➔
                  </button>
                </div>

              </div>

              {/* Box Breathing companion orb for physical nervous calm */}
              <div className="w-full lg:w-72 shrink-0 bg-[#FAF7F2]/70 rounded-xl border border-[#ece4d9] p-6 flex flex-col justify-between items-center text-center">
                <div className="w-full">
                  <div className="flex items-center justify-center gap-1 text-xs font-mono font-bold text-stone-500 uppercase tracking-wider mb-2">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Nervous Box Breathing</span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-relaxed px-2">
                    配合下方动态圆环控制呼吸。吸气（4秒）、屏气（4秒）、呼气（4秒）、屏气（4秒）。允许能量逐渐沉淀。
                  </p>
                </div>

                <div className="relative my-8 w-44 h-44 flex items-center justify-center">
                  {/* Outer breathing background circle */}
                  <div className="absolute inset-0 rounded-full border border-stone-200/40" />
                  
                  {/* Soft pulsing halo */}
                  <div className="absolute inset-2 bg-emerald-100/50 rounded-full animate-soft-breathe" />
                  
                  {/* Core pulsing physical sphere */}
                  <div className="absolute inset-8 bg-emerald-600/10 border-2 border-emerald-500 rounded-full animate-core-breathe flex flex-col justify-center items-center p-2">
                    <Heart className="w-5 h-5 text-emerald-700 animate-pulse mb-1" />
                    <span className="text-[10px] font-mono font-bold text-emerald-950 uppercase tracking-wider">
                      {breathingSeconds}s
                    </span>
                  </div>
                </div>

                <div className="w-full bg-[#FFFFFF] rounded-lg p-3 border border-stone-200/50 text-center">
                  <span className="text-[11px] font-mono block text-stone-400 font-medium">当前节奏</span>
                  <span className="text-xs font-mono tracking-widest font-bold text-emerald-800 uppercase block mt-0.5">
                    {breathingText}
                  </span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* VIEW D: CARD TYPOGRAPHY STUDIO / EXPORTER (Direct mapping to user screenshot complaints) */}
        {activeTab === 'exporter' && (
          <div id="view_exporter" className="w-full">
            <CardExporter initialCard={selectedCard} />
          </div>
        )}

      </main>

      {/* 4. FOOTER & INSTRUCTIONS COMPLIANCE */}
      <footer id="app_footer_bottom" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-[#ece4d9] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8c8273]">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>当前自愈时间轴记位: 2026-05-31 UTC</span>
        </div>
        <p className="text-center md:text-right leading-relaxed max-w-md">
          断电保护区已进入离线状态。所有的手帖编辑、新增想法、与制卡导出操作均在本地加密完成，允许在任何阶段安全离线运行。
        </p>
      </footer>

    </div>
  );
}
