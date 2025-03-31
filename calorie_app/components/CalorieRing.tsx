import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Colors from '@/constants/colors';

interface CalorieRingProps {
  calories: number;
  calorieGoal: number;
  size?: number;
  strokeWidth?: number;
}

const CalorieRing: React.FC<CalorieRingProps> = ({
  calories,
  calorieGoal,
  size = 180,
  strokeWidth = 12,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(calories / calorieGoal, 1);
  const strokeDashoffset = circumference * (1 - progress);
  
  const remaining = Math.max(calorieGoal - calories, 0);
  const percentage = Math.round((calories / calorieGoal) * 100);
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.border}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={calories > calorieGoal ? Colors.error : Colors.primary}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>
      
      <View style={styles.textContainer}>
        <Text style={styles.caloriesText}>{calories}</Text>
        <Text style={styles.label}>calories</Text>
        <View style={styles.remainingContainer}>
          <Text style={styles.remainingText}>
            {calories <= calorieGoal 
              ? `${remaining} left` 
              : `${calories - calorieGoal} over`}
          </Text>
          <Text style={styles.percentageText}>{percentage}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  caloriesText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
  },
  label: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: -4,
  },
  remainingContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  remainingText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  percentageText: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
});

export default CalorieRing;