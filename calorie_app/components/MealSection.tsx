import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Meal } from '@/types/food';
import { Plus, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useFoodStore } from '@/store/food-store';
import { useRouter } from 'expo-router';

interface MealSectionProps {
  meal: Meal;
}

const MealSection: React.FC<MealSectionProps> = ({ meal }) => {
  const router = useRouter();
  const { removeFoodFromMeal, clearMeal } = useFoodStore();
  
  const getTotalCalories = () => {
    return meal.foods.reduce((total, item) => {
      return total + (item.food.calories * item.quantity);
    }, 0);
  };
  
  const handleAddFood = () => {
    router.push({
      pathname: '/food-search',
      params: { mealType: meal.name }
    });
  };
  
  const handleClearMeal = () => {
    clearMeal(meal.id);
  };
  
  const handleRemoveFood = (foodId: string) => {
    removeFoodFromMeal(foodId, meal.id);
  };
  
  const getMealTitle = () => {
    switch (meal.name) {
      case 'breakfast': return 'Breakfast';
      case 'lunch': return 'Lunch';
      case 'dinner': return 'Dinner';
      case 'snack': return 'Snacks';
      default: return meal.name;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{getMealTitle()}</Text>
        <Text style={styles.calories}>{getTotalCalories()} cal</Text>
      </View>
      
      {meal.foods.length > 0 ? (
        <>
          {meal.foods.map((item) => (
            <View key={item.food.id} style={styles.foodItem}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{item.food.name}</Text>
                <Text style={styles.foodServing}>
                  {item.quantity > 1 ? `${item.quantity} × ` : ''}{item.food.servingSize}
                </Text>
              </View>
              <View style={styles.foodActions}>
                <Text style={styles.foodCalories}>
                  {Math.round(item.food.calories * item.quantity)} cal
                </Text>
                <TouchableOpacity 
                  onPress={() => handleRemoveFood(item.food.id)}
                  style={styles.removeButton}
                >
                  <Trash2 size={16} color={Colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={handleClearMeal}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddFood}
            >
              <Plus size={16} color={Colors.white} />
              <Text style={styles.addButtonText}>Add Food</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <TouchableOpacity 
          style={styles.emptyContainer}
          onPress={handleAddFood}
        >
          <Plus size={20} color={Colors.primary} />
          <Text style={styles.emptyText}>Add food to {meal.name}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  calories: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
  },
  foodServing: {
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 2,
  },
  foodActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodCalories: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginRight: 12,
  },
  removeButton: {
    padding: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  emptyText: {
    marginLeft: 8,
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '500',
  },
});

export default MealSection;