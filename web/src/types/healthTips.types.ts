import { ReactNode } from 'react';

export interface RelatedTip {
  id: string | number;
  title: string;
  description: string;
}

export interface HealthTip {
  id: string | number;
  category: string;
  title: string;
  description: string;
  longDescription?: string;
  type: string;
  imageUrl?: string;
  imageAlt?: string;
  url?: string;
  date?: string | Date;
  tips?: string[];
  relatedTips?: RelatedTip[];
}

export interface FeaturedTip {
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  category?: string;
}

export interface CategoryType {
  id: string;
  label: string;
  icon: ReactNode;
  color?: string;
}

export interface SortOption {
  id: string;
  label: string;
}

export interface TimeFilter {
  id: string;
  label: string;
}
