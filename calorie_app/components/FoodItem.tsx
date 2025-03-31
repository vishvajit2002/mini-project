import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Food } from '@/types/food';
import { Plus } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface FoodItemProps {
  food: Food;
  onPress: (food: Food) => void;
}

const FoodItem: React.FC<FoodItemProps> = ({ food, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(food)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {food.image ? (
          <Image source={{ uri: food.image }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholderImage]} />
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{food.name}</Text>
        <Text style={styles.servingSize}>{food.servingSize}</Text>
        <View style={styles.macrosContainer}>
          <Text style={styles.macros}>P: {food.protein}g</Text>
          <Text style={styles.macros}>C: {food.carbs}g</Text>
          <Text style={styles.macros}>F: {food.fat}g</Text>
        </View>
      </View>
      
      <View style={styles.caloriesContainer}>
        <Text style={styles.calories}>{food.calories}</Text>
        <Text style={styles.caloriesLabel}>cal</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => onPress(food)}
        >
          <Plus size={16} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    marginRight: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  placeholderImage: {
    backgroundColor: Colors.border,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  servingSize: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 4,
  },
  macrosContainer: {
    flexDirection: 'row',
  },
  macros: {
    fontSize: 12,
    color: Colors.textLight,
    marginRight: 8,
  },
  caloriesContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
  },
  calories: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  caloriesLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 4,
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FoodItem;