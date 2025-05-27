export interface FormData {
  age: string | number;
  weight: string | number;
  height: string | number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  goal: 'lose' | 'maintain' | 'gain';
}

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface IdealWeight {
  min: number;
  max: number;
}

export interface Metrics {
  bmr: number;
  tdee: number;
  macros: Macros;
  idealWeight: IdealWeight;
}

export interface MetricsData {
  bmr: number;
  tdee: number;
  macros: Macros | null;
  idealWeight: IdealWeight | null;
}

export interface MetricHistory {
  id: string;
  Age: number;
  Weight: number;
  Height: number;
  Gender: string;
  ActivityLevel: string;
  Goal: string;
  BMR: number;
  TDEE: number;
  CreatedAt: string;
  [key: string]: any;
}
