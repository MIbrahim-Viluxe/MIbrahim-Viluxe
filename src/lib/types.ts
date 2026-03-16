export interface PortfolioItem {
  title_ar: string;
  title_en: string;
  category: string;
  image: string;
  description_ar?: string;
  description_en?: string;
  body_ar?: string;
  body_en?: string;
  date?: string;
  slug: string;
  video_url?: string;
  video?: string;
  video_type?: string;
  duration?: string;
  videos_count?: number;
  aspect_ratio?: 'landscape' | 'portrait';
  gallery?: string[];
}
