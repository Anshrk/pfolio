export interface Profile {
  id: number;
  name: string;
  handle: string;
  hostname: string;
  title: string;
  tagline: string;
  bio?: string;
  location: string;
  email: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  avatar_url?: string;
  resume_url?: string;
  fastfetch_ascii?: string;
  fastfetch_specs?: Record<string, string>;
  updated_at?: string;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  tagline?: string;
  description: string;
  tech_stack: string[];
  tags: string[];
  github_url?: string;
  demo_url?: string;
  image_url?: string;
  featured: boolean;
  stars: number;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  id: number;
  category: string;
  name: string;
  icon?: string;
  proficiency: number;
  level: string;
  sort_order: number;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  company_url?: string;
  location: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
  sort_order: number;
}

export interface VirtualFile {
  id: number;
  path: string;
  filename: string;
  parent_dir: string;
  is_directory: boolean;
  content: string;
  file_type: string;
  permissions: string;
  size_bytes: number;
  updated_at?: string;
}

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  created_at?: string;
}

export interface PortfolioPayload {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  virtual_files: VirtualFile[];
}

export type ThemeName =
  | 'tokyo-night'
  | 'dracula'
  | 'matrix'
  | 'cyberpunk'
  | 'apple-retro'
  | 'monokai'
  | 'catppuccin'
  | 'nord'
  | 'synthwave';

export interface ThemeConfig {
  id: ThemeName;
  name: string;
  bg: string;
  windowBg: string;
  windowHeaderBg: string;
  text: string;
  accent: string;
  secondary: string;
  border: string;
  promptUser: string;
  promptHost: string;
  promptPath: string;
  promptSymbol: string;
  selection: string;
  cursorColor: string;
}

export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'fastfetch' | 'projects' | 'skills' | 'custom-html';
  command?: string;
  content?: string;
  dir?: string;
  htmlContent?: string;
  timestamp?: number;
}

export interface TabInfo {
  id: string;
  title: string;
  active: boolean;
  dir: string;
}
