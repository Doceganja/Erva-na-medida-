export interface Strain {
  id: number;
  name: string;
  type: 'Sativa' | 'Indica' | 'Hybrid';
  thc: number;
  cbd: number;
  terpenes: string[];
  effects: string[];
  notes?: string;
}

export interface Recipe {
  id: number;
  name: string;
  ingredients: { name: string; amount: number; unit: string }[];
  cannabisAmount: number; // in grams
  cannabisThc: number; // percentage
  servings: number;
  decarbEfficiency: number; // 0-1
  extractionEfficiency: number; // 0-1
}

export interface UserProfile {
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  weight: number;
  tolerance: number; // 1-10
  goals: string[];
}

export interface ConsumptionLog {
  id: number;
  timestamp: string;
  amount: number;
  thc: number;
  cbd: number;
  method: string;
  effectRating: number;
}
