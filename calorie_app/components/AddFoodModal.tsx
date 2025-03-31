import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  Image,
  TextInput
} from 'react-native';
import { Food, Meal } from '@/types/food';
import { X, Minus, Plus } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useFoodStore } from '@/store/food-store';

interface AddFoodModalProps {
  visible: boolean;
  food: Food | null;
  mealType: Meal['name'];
  onClose: () => void;
}

const AddFoodModal: React.FC<AddFoodModalProps> = ({ 
  visible, 
  food, 
  mealType,
  onClose 
}) => {
  const [quantity, setQuantity] = useState(1);
  const { addFoodToMeal } = useFoodStore();
  
  if (!food) return null;
  
  const handleDecreaseQuantity = () => {
    if (quantity > 0.5) {
      setQuantity(prev => Math.max(prev - 0.5, 0.5));
    }
  };
  
  const handleIncreaseQuantity = () => {
    setQuantity(prev => prev + 0.5);
  };
  
  const handleQuantityChange = (text: string) => {
    const value = parseFloat(text);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };
  
  const handleAddFood = () => {
    addFoodToMeal(food, mealType, quantity);
    onClose();
  };
  
  const getTotalCalories = () => {
    return Math.round(food.calories * quantity);
  };
  
  const getTotalNutrient = (value: number) => {
    return (value * quantity).toFixed(1);
  };
  
  const getMealName = () => {
    switch (mealType) {
      case 'breakfast': return 'Breakfast';
      case 'lunch': return 'Lunch';
      case 'dinner': return 'Dinner';
      case 'snack': return 'Snacks';
      default: return mealType;
    }
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Add to {getMealName()}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.foodInfoContainer}>
                <View style={styles.imageContainer}>
                  {food.image ? (
                    <Image source={{ uri: food.image }} style={styles.image} />
                  ) : (
                    <View style={[styles.image, styles.placeholderImage]} />
                  )}
                </View>
                
                <View style={styles.foodDetails}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.servingSize}>{food.servingSize}</Text>
                  <Text style={styles.calories}>{food.calories} calories</Text>
                </View>
              </View>
              
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityLabel}>Quantity</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity 
                    onPress={handleDecreaseQuantity}
                    style={styles.quantityButton}
                  >
                    <Minus size={20} color={Colors.text} />
                  </TouchableOpacity>
                  
                  <TextInput
                    style={styles.quantityInput}
                    value={quantity.toString()}
                    onChangeText={handleQuantityChange}
                    keyboardType="numeric"
                    selectTextOnFocus
                  />
                  
                  <TouchableOpacity 
                    onPress={handleIncreaseQuantity}
                    style={styles.quantityButton}
                  >
                    <Plus size={20} color={Colors.text} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.nutritionContainer}>
                <Text style={styles.nutritionTitle}>Nutrition Information</Text>
                
                <View style={styles.nutritionRow}>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{getTotalCalories()}</Text>
                    <Text style={styles.nutritionLabel}>Calories</Text>
                  </View>
                  
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{getTotalNutrient(food.protein)}g</Text>
                    <Text style={styles.nutritionLabel}>Protein</Text>
                  </View>
                  
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{getTotalNutrient(food.carbs)}g</Text>
                    <Text style={styles.nutritionLabel}>Carbs</Text>
                  </View>
                  
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{getTotalNutrient(food.fat)}g</Text>
                    <Text style={styles.nutritionLabel}>Fat</Text>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddFood}
              >
                <Text style={styles.addButtonText}>Add to {getMealName()}</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  foodInfoContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  imageContainer: {
    marginRight: 16,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  placeholderImage: {
    backgroundColor: Colors.border,
  },
  foodDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  foodName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  servingSize: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  calories: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
  },
  quantityContainer: {
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityInput: {
    width: 60,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginHorizontal: 16,
  },
  nutritionContainer: {
    marginBottom: 20,
  },
  nutritionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 12,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  nutritionLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddFoodModal;