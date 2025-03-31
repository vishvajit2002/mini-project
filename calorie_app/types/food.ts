export interface Food {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servingSize: string;
    image?: string;
  }
  
  export interface Meal {
    id: string;
    name: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    foods: {
      food: Food;
      quantity: number;
    }[];
    date: string; // ISO string
  }
  
  export interface DailyLog {
    date: string; // ISO string format
    meals: Meal[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  }
  
  export interface UserProfile {
    calorieGoal: number;
    proteinGoal: number;
    carbsGoal: number;
    fatGoal: number;
    weight?: number;
    height?: number;
    age?: number;
    gender?: 'male' | 'female' | 'other';
    activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very active';
  }