import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyLog, Food, Meal, UserProfile } from '@/types/food';
import { popularFoods, recentFoods } from '@/mocks/foods';

interface FoodState {
  dailyLogs: DailyLog[];
  currentDate: string;
  userProfile: UserProfile;
  recentFoods: Food[];
  customFoods: Food[];
  
  // Actions
  addFoodToMeal: (food: Food, mealType: Meal['name'], quantity: number) => void;
  removeFoodFromMeal: (foodId: string, mealId: string) => void;
  updateFoodQuantity: (foodId: string, mealId: string, quantity: number) => void;
  clearMeal: (mealId: string) => void;
  setCurrentDate: (date: string) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  addCustomFood: (food: Omit<Food, 'id'>) => void;
  getCurrentDayLog: () => DailyLog | undefined;
}

// Helper to get today's date in ISO format (YYYY-MM-DD)
const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Helper to create a new empty daily log
const createEmptyDailyLog = (date: string): DailyLog => ({
  date,
  meals: [
    { id: `breakfast-${date}`, name: 'breakfast', foods: [], date },
    { id: `lunch-${date}`, name: 'lunch', foods: [], date },
    { id: `dinner-${date}`, name: 'dinner', foods: [], date },
    { id: `snack-${date}`, name: 'snack', foods: [], date },
  ],
  totalCalories: 0,
  totalProtein: 0,
  totalCarbs: 0,
  totalFat: 0,
});

// Calculate totals for a daily log
const calculateDailyTotals = (meals: Meal[]): Pick<DailyLog, 'totalCalories' | 'totalProtein' | 'totalCarbs' | 'totalFat'> => {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  meals.forEach(meal => {
    meal.foods.forEach(({ food, quantity }) => {
      totalCalories += food.calories * quantity;
      totalProtein += food.protein * quantity;
      totalCarbs += food.carbs * quantity;
      totalFat += food.fat * quantity;
    });
  });

  return {
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
  };
};

export const useFoodStore = create<FoodState>()(
  persist(
    (set, get) => ({
      dailyLogs: [createEmptyDailyLog(getTodayDateString())],
      currentDate: getTodayDateString(),
      userProfile: {
        calorieGoal: 2000,
        proteinGoal: 150,
        carbsGoal: 200,
        fatGoal: 65,
      },
      recentFoods: recentFoods,
      customFoods: [],

      getCurrentDayLog: () => {
        const { dailyLogs, currentDate } = get();
        return dailyLogs.find(log => log.date === currentDate);
      },

      addFoodToMeal: (food, mealType, quantity) => {
        set(state => {
          const { dailyLogs, currentDate } = state;
          
          // Find or create daily log for current date
          let dayLogIndex = dailyLogs.findIndex(log => log.date === currentDate);
          
          if (dayLogIndex === -1) {
            // Create new log if it doesn't exist
            dailyLogs.push(createEmptyDailyLog(currentDate));
            dayLogIndex = dailyLogs.length - 1;
          }
          
          const updatedLogs = [...dailyLogs];
          const dayLog = updatedLogs[dayLogIndex];
          
          // Find the meal
          const mealIndex = dayLog.meals.findIndex(meal => meal.name === mealType);
          
          if (mealIndex !== -1) {
            // Add food to the meal
            const meal = dayLog.meals[mealIndex];
            const existingFoodIndex = meal.foods.findIndex(item => item.food.id === food.id);
            
            if (existingFoodIndex !== -1) {
              // Update quantity if food already exists
              meal.foods[existingFoodIndex].quantity += quantity;
            } else {
              // Add new food
              meal.foods.push({ food, quantity });
            }
            
            // Update meal in the log
            dayLog.meals[mealIndex] = meal;
            
            // Recalculate totals
            const totals = calculateDailyTotals(dayLog.meals);
            updatedLogs[dayLogIndex] = { ...dayLog, ...totals };
            
            // Add to recent foods if not already there
            const isInRecentFoods = state.recentFoods.some(f => f.id === food.id);
            const isInPopularFoods = popularFoods.some(f => f.id === food.id);
            
            let updatedRecentFoods = [...state.recentFoods];
            if (!isInRecentFoods && !isInPopularFoods) {
              updatedRecentFoods = [food, ...updatedRecentFoods].slice(0, 10); // Keep only 10 recent foods
            }
            
            return { 
              dailyLogs: updatedLogs,
              recentFoods: updatedRecentFoods
            };
          }
          
          return state;
        });
      },

      removeFoodFromMeal: (foodId, mealId) => {
        set(state => {
          const { dailyLogs, currentDate } = state;
          const dayLogIndex = dailyLogs.findIndex(log => log.date === currentDate);
          
          if (dayLogIndex === -1) return state;
          
          const updatedLogs = [...dailyLogs];
          const dayLog = updatedLogs[dayLogIndex];
          
          const mealIndex = dayLog.meals.findIndex(meal => meal.id === mealId);
          if (mealIndex === -1) return state;
          
          // Remove the food
          const meal = dayLog.meals[mealIndex];
          meal.foods = meal.foods.filter(item => item.food.id !== foodId);
          
          // Update meal in the log
          dayLog.meals[mealIndex] = meal;
          
          // Recalculate totals
          const totals = calculateDailyTotals(dayLog.meals);
          updatedLogs[dayLogIndex] = { ...dayLog, ...totals };
          
          return { dailyLogs: updatedLogs };
        });
      },

      updateFoodQuantity: (foodId, mealId, quantity) => {
        set(state => {
          const { dailyLogs, currentDate } = state;
          const dayLogIndex = dailyLogs.findIndex(log => log.date === currentDate);
          
          if (dayLogIndex === -1) return state;
          
          const updatedLogs = [...dailyLogs];
          const dayLog = updatedLogs[dayLogIndex];
          
          const mealIndex = dayLog.meals.findIndex(meal => meal.id === mealId);
          if (mealIndex === -1) return state;
          
          // Update the food quantity
          const meal = dayLog.meals[mealIndex];
          const foodIndex = meal.foods.findIndex(item => item.food.id !== foodId);
          
          if (foodIndex === -1) return state;
          
          if (quantity <= 0) {
            // Remove food if quantity is 0 or negative
            meal.foods = meal.foods.filter(item => item.food.id !== foodId);
          } else {
            // Update quantity
            meal.foods[foodIndex].quantity = quantity;
          }
          
          // Update meal in the log
          dayLog.meals[mealIndex] = meal;
          
          // Recalculate totals
          const totals = calculateDailyTotals(dayLog.meals);
          updatedLogs[dayLogIndex] = { ...dayLog, ...totals };
          
          return { dailyLogs: updatedLogs };
        });
      },

      clearMeal: (mealId) => {
        set(state => {
          const { dailyLogs, currentDate } = state;
          const dayLogIndex = dailyLogs.findIndex(log => log.date === currentDate);
          
          if (dayLogIndex === -1) return state;
          
          const updatedLogs = [...dailyLogs];
          const dayLog = updatedLogs[dayLogIndex];
          
          const mealIndex = dayLog.meals.findIndex(meal => meal.id === mealId);
          if (mealIndex === -1) return state;
          
          // Clear the meal
          dayLog.meals[mealIndex].foods = [];
          
          // Recalculate totals
          const totals = calculateDailyTotals(dayLog.meals);
          updatedLogs[dayLogIndex] = { ...dayLog, ...totals };
          
          return { dailyLogs: updatedLogs };
        });
      },

      setCurrentDate: (date) => {
        set(state => {
          // Check if we have a log for this date, if not create one
          const hasLog = state.dailyLogs.some(log => log.date === date);
          
          if (!hasLog) {
            return {
              currentDate: date,
              dailyLogs: [...state.dailyLogs, createEmptyDailyLog(date)]
            };
          }
          
          return { currentDate: date };
        });
      },

      updateUserProfile: (profile) => {
        set(state => ({
          userProfile: { ...state.userProfile, ...profile }
        }));
      },

      addCustomFood: (foodData) => {
        set(state => {
          const newFood: Food = {
            ...foodData,
            id: `custom-${Date.now()}`
          };
          
          return {
            customFoods: [newFood, ...state.customFoods]
          };
        });
      }
    }),
    {
      name: 'food-store',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);