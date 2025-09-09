import { useMemo } from 'react';

export interface UiProject {
  id: number;
  title: string;
  category: string;
  type: string;
  description: string;
  technologies: string[];
  image: string;
  github: string;
  live: string;
  highlight?: string;
  stats: Record<string, string | undefined>;
  subtitle?: string | null;
  long_description?: string | null;
  timeline?: string | null;
  team?: string | null;
  role?: string | null;
  budget?: string | null;
  client?: string | null;
  images?: any[];
  features?: any[];
  roadmap?: any[];
  testimonials?: any[];
  metrics?: any[];
  skills?: any[];
  technologies_detailed?: Array<{
    name: string;
    category: string;
    level: string;
    icon: string;
    levelPercent?: number;
    level_percent?: number;
    level_label?: string;
    proficiency?: number;
    score?: number;
    level_min?: number;
    level_max?: number;
  }>;
}

export const mapBackendProjectToUi = (p: any): UiProject => {
  const statsObject: Record<string, string | undefined> = Array.isArray(p?.stats)
    ? p.stats.reduce((acc: Record<string, string | undefined>, s: any) => {
        if (s && s.key) acc[s.key] = s.value;
        return acc;
      }, {})
    : {};

  const technologiesNames: string[] = Array.isArray(p?.technologies_names) ? p.technologies_names : [];
  const technologiesDetailed = Array.isArray(p?.technologies)
    ? p.technologies.map((t: any) => ({
        name: t.name,
        category: t.category,
        level: t.level,
        icon: t.icon,
        levelPercent: t.levelPercent,
        level_percent: t.level_percent,
        level_label: t.level_label,
        proficiency: t.proficiency,
        score: t.score,
        level_min: t.level_min,
        level_max: t.level_max,
      }))
    : [];

  const imageUrl = p?.cover_image_url
    || (Array.isArray(p?.images) && p.images.length > 0 ? p.images[0]?.url || '' : '')
    || '';

  const links = p?.links || {};

  return {
    id: Number(p?.id),
    title: p?.title || '',
    category: p?.category || 'it',
    type: p?.type || '',
    description: p?.description || '',
    technologies: technologiesNames,
    image: imageUrl,
    github: links.github || '',
    live: links.live || links.demo || '',
    highlight: p?.highlight || undefined,
    stats: statsObject,
    subtitle: p?.subtitle ?? null,
    long_description: p?.long_description ?? null,
    timeline: p?.timeline ?? null,
    team: p?.team ?? null,
    role: p?.role ?? null,
    budget: p?.budget ?? null,
    client: p?.client ?? null,
    images: Array.isArray(p?.images) ? p.images : [],
    features: Array.isArray(p?.features) ? p.features : [],
    roadmap: Array.isArray(p?.roadmap) ? p.roadmap : [],
    testimonials: Array.isArray(p?.testimonials) ? p.testimonials : [],
    metrics: Array.isArray(p?.metrics) ? p.metrics : [],
    skills: Array.isArray(p?.skills) ? p.skills : [],
    technologies_detailed: technologiesDetailed.length ? technologiesDetailed : undefined,
  };
};

export const useApiBaseUrl = () => useMemo(() => (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/$/, ''), []);


