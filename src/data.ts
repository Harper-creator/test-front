import { ThoughtCard } from './types';

export const DEFAULT_CARDS: ThoughtCard[] = [
  {
    id: 'ceiling',
    text: '早晨醒来。天花板盯着你。你盯着天花板。',
    translation: 'Waking up. The ceiling stares at you. You stare at the ceiling.',
    category: '觉察 (Awareness)',
    meta: '08:15 AM - 阻滞状态',
    stylePreset: 'ceiling',
    createdAt: '2026-05-31T08:15:00Z',
  },
  {
    id: 'jobless',
    text: '三年没工作。不是不想。是不能。',
    translation: "Three years without a job. Not because I don't want to. But because I am unable.",
    category: '极限 (Boundary)',
    meta: '2023 - 2026 - 静止期',
    stylePreset: 'fog',
    createdAt: '2026-05-31T09:00:00Z',
  },
  {
    id: 'protection',
    text: '长期休息不是逃避。是神经系统的自我保护。',
    translation: 'Long-term rest is not avoidance. It is the nervous system protecting itself.',
    category: '释怀 (Reconciliation)',
    meta: '生理防御机制',
    stylePreset: 'ice',
    createdAt: '2026-05-31T09:10:00Z',
  },
  {
    id: 'social-battery',
    text: '连回复消息都要攒三天力气。门铃响会害怕。',
    translation: 'Replying to messages takes three days of energy. The doorbell ringing triggers panic.',
    category: '超载 (Overload)',
    meta: '社交能量枯竭',
    stylePreset: 'lead',
    createdAt: '2026-05-31T09:20:00Z',
  },
  {
    id: 'numbness',
    text: '从焦虑到麻木。从麻木到空白。空白最安全。',
    translation: 'From anxiety to numbness. From numbness to blankness. Blank is the safest.',
    category: '防御 (Defense)',
    meta: '静音模式',
    stylePreset: 'lead',
    createdAt: '2026-05-31T09:30:00Z',
  },
  {
    id: 'heavy-body',
    text: '身体像灌了铅。脑子像隔了一层雾。',
    translation: 'My body feels filled with lead. My mind feels trapped behind a wall of fog.',
    category: '体感 (Physicality)',
    meta: '重力异常',
    stylePreset: 'fog',
    createdAt: '2026-05-31T09:40:00Z',
  },
  {
    id: 'overloaded',
    text: '系统超载后宕机、恢复期。任何行动都是二次伤害。',
    translation: 'Crash and recovery after system overload. Any forced action causes secondary trauma.',
    category: '警觉 (Warning)',
    meta: '硬性断电保护',
    stylePreset: 'ceiling',
    createdAt: '2026-05-31T09:50:00Z',
  },
  {
    id: 'stay-in-ice',
    text: '不急着动。先允许自己。在冰里待着。',
    translation: 'No rush to move. Grant yourself absolute permission. Just co-exist with the ice.',
    category: '接纳 (Compassion)',
    meta: '深度冷疗中',
    stylePreset: 'ice',
    createdAt: '2026-05-31T10:00:00Z',
  },
];

export const STYLE_PRESETS = {
  ice: {
    name: '冰川冷疗 (Ice Blue)',
    bg: 'bg-emerald-50/70 border-emerald-100/50',
    text: 'text-emerald-950',
    accent: 'border-emerald-200 text-emerald-800',
    meta: 'text-emerald-600/70',
    cardStyle: {
      backgroundColor: '#f0f9f4',
      textColor: '#022c22',
      borderColor: '#a7f3d0',
      accentColor: '#059669',
    }
  },
  fog: {
    name: '迷雾隔热 (Fog Gray)',
    bg: 'bg-slate-100/60 border-slate-200/50',
    text: 'text-slate-800',
    accent: 'border-slate-300 text-slate-700',
    meta: 'text-slate-500/80',
    cardStyle: {
      backgroundColor: '#f1f5f9',
      textColor: '#1e293b',
      borderColor: '#cbd5e1',
      accentColor: '#64748b',
    }
  },
  lead: {
    name: '灌铅重力 (Lead Dark)',
    bg: 'bg-zinc-900 border-zinc-800 text-zinc-100',
    text: 'text-zinc-100',
    accent: 'border-zinc-700 text-zinc-300',
    meta: 'text-zinc-500',
    cardStyle: {
      backgroundColor: '#18181b',
      textColor: '#f4f4f5',
      borderColor: '#3f3f46',
      accentColor: '#a1a1aa',
    }
  },
  ceiling: {
    name: '燕麦天花板 (Oatmeal)',
    bg: 'bg-[#faf6f0] border-[#ece4d9]',
    text: 'text-[#2e2b27]',
    accent: 'border-[#dfd4c4] text-[#554e44]',
    meta: 'text-[#8c8273]',
    cardStyle: {
      backgroundColor: '#faf6f0',
      textColor: '#2e2b27',
      borderColor: '#dfd4c4',
      accentColor: '#8c8273',
    }
  },
};
