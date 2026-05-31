import { NarrativeType, VisualSpec, VisualLayout, VisualDecoration } from './types';

export const VISUAL_DNA = {
  ratio: "3:4",
  canvas: { w: 1080, h: 1440 },
  palette: {
    bg_primary:   "#F5F3EF",
    bg_dark:      "#1A1A1A",
    text_primary: "#1A1A1A",
    text_muted:   "#8A8A8A",
    text_ghost:   "#C8C4BC",
    accent:       "#C4B89A"
  },
  typography: {
    display:  { family: "serif",  weight: 500, tracking: "wide" },
    body:     { family: "serif",  weight: 400, tracking: "normal" },
    caption:  { family: "sans",   weight: 300, tracking: "ultra" },
    label:    { family: "sans",   weight: 400, tracking: "widest" }
  },
  spacing: {
    margin_x: 72,
    margin_y: 96,
    line_height: 2.0
  }
};

export interface ToneColors {
  bg: string;
  text: string;
  muted: string;
  ghost: string;
  accent: string;
}

export const MOOD_PALETTES: Record<NarrativeType, ToneColors> = {
  burnout: {
    bg: "#F5F3EF",
    text: "#1A1A1A",
    muted: "#8A8A8A",
    ghost: "#C8C4BC",
    accent: "#C4B89A"
  },
  disconnect: {
    bg: "#EEEEF0",
    text: "#1E293B",
    muted: "#64748B",
    ghost: "#94A3B8",
    accent: "#38BDF8"
  },
  loneliness: {
    bg: "#F0EEE8",
    text: "#2E2A25",
    muted: "#78716C",
    ghost: "#A8A29E",
    accent: "#D97706"
  },
  freeze: {
    bg: "#EFEFEF",
    text: "#334155",
    muted: "#475569",
    ghost: "#CBD5E1",
    accent: "#64748B"
  }
};

/**
 * Builds the visual specifications for an 8-page visual zine narrative
 */
export function buildVisualSpecs(
  texts: string[],
  translations: string[] = [],
  narrative: NarrativeType = 'burnout'
): VisualSpec[] {
  const palette = MOOD_PALETTES[narrative] || MOOD_PALETTES.burnout;
  const specs: VisualSpec[] = [];

  // Define layout structures for each of the 8 Page roles
  for (let i = 0; i < 8; i++) {
    const pageNum = i + 1;
    const text = texts[i] || "醒来。让一切自然发生。";
    const translation = translations[i] || "";
    
    let layout: VisualLayout;
    let decoration: VisualDecoration;
    let role = "";

    switch (pageNum) {
      case 1:
        // Page 1: Lens 入口
        role = "lens_enter";
        layout = {
          bg_color: palette.bg,
          text_color: palette.text,
          text_align: "left",
          vertical_position: "center",
          margin_x: 72,
          margin_top: 480, // Keeps text in top/middle third
          font_role: "display",
          font_size: 46,
          line_height: 1.8,
          letter_spacing: "wide"
        };
        decoration = {
          page_number: false,
          accent_line: false,
          invert: false
        };
        break;

      case 2:
        // Page 2: Lens 张力
        role = "lens_tension";
        layout = {
          bg_color: palette.bg,
          text_color: palette.text,
          text_align: "left",
          vertical_position: "bottom",
          margin_x: 72,
          margin_top: 720, // 60% top whitespace
          font_role: "display",
          font_size: 44,
          line_height: 1.8,
          letter_spacing: "wide"
        };
        decoration = {
          page_number: false,
          accent_line: false,
          invert: false
        };
        break;

      case 3:
        // Page 3: 隐藏观察
        role = "hidden_observe";
        layout = {
          bg_color: palette.bg,
          text_color: palette.text,
          text_align: "center",
          vertical_position: "center",
          margin_x: 84,
          margin_top: 400,
          font_role: "body",
          font_size: 30, // Slightly more compact
          line_height: 2.0,
          letter_spacing: "normal"
        };
        decoration = {
          page_number: false,
          accent_line: true, // Left-side accent indicator bar
          invert: false
        };
        break;

      case 4:
        // Page 4: Movement 推进 1
        role = "movement_forward_1";
        layout = {
          bg_color: palette.bg,
          text_color: palette.text,
          text_align: "left",
          vertical_position: "center",
          margin_x: 72,
          margin_top: 380,
          font_role: "body",
          font_size: 32,
          line_height: 1.9,
          letter_spacing: "normal"
        };
        decoration = {
          page_number: true,
          accent_line: false,
          invert: false
        };
        break;

      case 5:
        // Page 5: Movement 推进 2
        role = "movement_forward_2";
        layout = {
          bg_color: palette.bg,
          text_color: palette.text,
          text_align: "left",
          vertical_position: "center",
          margin_x: 72,
          margin_top: 380,
          font_role: "body",
          font_size: 32,
          line_height: 1.9,
          letter_spacing: "normal"
        };
        decoration = {
          page_number: true,
          accent_line: false,
          invert: false
        };
        break;

      case 6:
        // Page 6: 转折点 (Inverted dark background)
        role = "climax_reverse";
        layout = {
          bg_color: VISUAL_DNA.palette.bg_dark,
          text_color: "#FAF7F2", // Clean cream text over black
          text_align: "left",
          vertical_position: "center",
          margin_x: 84,
          margin_top: 420,
          font_role: "display",
          font_size: 38,
          line_height: 1.9,
          letter_spacing: "wide"
        };
        decoration = {
          page_number: true,
          accent_line: false,
          invert: true
        };
        break;

      case 7:
        // Page 7: 深层观察 (Captions/voiceover style)
        role = "deep_observe";
        layout = {
          bg_color: palette.bg,
          text_color: palette.muted,
          text_align: "center",
          vertical_position: "center",
          margin_x: 100,
          margin_top: 480,
          font_role: "caption",
          font_size: 24, // Minimalist small text
          line_height: 2.2,
          letter_spacing: "ultra"
        };
        decoration = {
          page_number: true,
          accent_line: false,
          invert: false
        };
        break;

      case 8:
        // Page 8: Anchor 落点
        role = "anchor_resolve";
        layout = {
          bg_color: palette.bg,
          text_color: palette.muted, // Softer weight
          text_align: "center",
          vertical_position: "bottom",
          margin_x: 84,
          margin_top: 800, // Very low on page, large upper hollow
          font_role: "display",
          font_size: 34,
          line_height: 2.0,
          letter_spacing: "wide"
        };
        decoration = {
          page_number: false,
          accent_line: false,
          invert: false
        };
        break;

      default:
        // Fallback layout just in case
        role = "generic";
        layout = {
          bg_color: palette.bg,
          text_color: palette.text,
          text_align: "center",
          vertical_position: "center",
          margin_x: 72,
          margin_top: 400,
          font_role: "body",
          font_size: 32,
          line_height: 1.8,
          letter_spacing: "normal"
        };
        decoration = {
          page_number: false,
          accent_line: false,
          invert: false
        };
    }

    specs.push({
      page: pageNum,
      role,
      text,
      translation,
      layout,
      decoration
    });
  }

  return specs;
}
