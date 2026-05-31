export type NarrativeType = 'burnout' | 'disconnect' | 'loneliness' | 'freeze';

export interface VisualLayout {
  bg_color: string;
  text_color: string;
  text_align: 'left' | 'center' | 'right';
  vertical_position: 'top' | 'center' | 'bottom';
  margin_x: number;
  margin_top: number;
  font_role: 'display' | 'body' | 'caption' | 'label';
  font_size: number;
  line_height: number;
  letter_spacing: 'wide' | 'normal' | 'ultra' | 'widest';
}

export interface VisualDecoration {
  page_number: boolean;
  accent_line: boolean;
  invert: boolean;
}

export interface VisualSpec {
  page: number;
  role: string;
  text: string;
  translation?: string;
  layout: VisualLayout;
  decoration: VisualDecoration;
}

export interface GenerateResponse {
  title: string;
  cover_text: string;
  pages: string[];
  hashtags: string[];
  narrative_type: NarrativeType;
}

export interface ThoughtCard {
  id: string;
  text: string;
  translation?: string;
  category: string;
  meta: string;
  stylePreset: 'ice' | 'fog' | 'lead' | 'ceiling' | 'custom';
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  isCustom?: boolean;
  createdAt: string;
  // Visual Engine dynamic specification
  narrativeType?: NarrativeType;
  customVisualSpecs?: VisualSpec[];
}

export type LayoutMode = 'mindscape' | 'zine' | 'breathing' | 'exporter';
