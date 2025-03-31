import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useFoodStore } from '@/store/food-store';
import Colors from '@/constants/colors';
import CalorieRing from '@/components/CalorieRing';
import NutritionProgressBar from '@/components/NutritionProgressBar';
import MealSection from '@/components/MealSection';
import DateSelector from '@/components/DateSelector';

export default function TodayScreen() {
  const { 
    currentDate, 
    setCurrentDate, 
    userProfile,
    getCurrentDayLog
  } = useFoodStore();
  
  useEffect(() => {
    // Set to today's date when component mounts
    const today = new Date().toISOString().split('T')[0];
    setCurrentDate(today);
  }, []);
  
  const dayLog = getCurrentDayLog();
  
  if (!dayLog) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calorie Tracker</Text>
      </View>
      
      <DateSelector 
        currentDate={currentDate}
        onDateChange={setCurrentDate}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryContainer}>
          <CalorieRing 
            calories={dayLog.totalCalories}
            calorieGoal={userProfile.calorieGoal}
          />
          
          <View style={styles.nutritionContainer}>
            <NutritionProgressBar
              label="Protein"
              current={dayLog.totalProtein}
              goal={userProfile.proteinGoal}
              color={Colors.primary}
            />
            <NutritionProgressBar
              label="Carbs"
              current={dayLog.totalCarbs}
              goal={userProfile.carbsGoal}
              color={Colors.secondary}
            />
            <NutritionProgressBar
              label="Fat"
              current={dayLog.totalFat}
              goal={userProfile.fatGoal}
              color="#FFA726"
            />
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Meals</Text>
        
        {dayLog.meals.map((meal) => (
          <MealSection key={meal.id} meal={meal} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  summaryContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nutritionContainer: {
    width: '100%',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
});