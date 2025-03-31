import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { useFoodStore } from '@/store/food-store';
import { DailyLog } from '@/types/food';
import Colors from '@/constants/colors';
import { Calendar, ChevronRight } from 'lucide-react-native';

export default function HistoryScreen() {
  const { dailyLogs, setCurrentDate } = useFoodStore();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Filter logs by selected month and year
  const filteredLogs = dailyLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getMonth() === selectedMonth && logDate.getFullYear() === selectedYear;
  });
  
  // Sort logs by date (newest first)
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  const handleViewDay = (date: string) => {
    setCurrentDate(date);
  };
  
  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };
  
  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const renderLogItem = ({ item }: { item: DailyLog }) => (
    <TouchableOpacity 
      style={styles.logItem}
      onPress={() => handleViewDay(item.date)}
    >
      <View style={styles.logDate}>
        <Calendar size={16} color={Colors.textLight} style={styles.calendarIcon} />
        <Text style={styles.dateText}>{formatDate(item.date)}</Text>
      </View>
      
      <View style={styles.logDetails}>
        <View style={styles.calorieContainer}>
          <Text style={styles.calorieValue}>{item.totalCalories}</Text>
          <Text style={styles.calorieLabel}>calories</Text>
        </View>
        
        <View style={styles.macrosContainer}>
          <Text style={styles.macroText}>P: {item.totalProtein.toFixed(1)}g</Text>
          <Text style={styles.macroText}>C: {item.totalCarbs.toFixed(1)}g</Text>
          <Text style={styles.macroText}>F: {item.totalFat.toFixed(1)}g</Text>
        </View>
      </View>
      
      <ChevronRight size={20} color={Colors.textLight} />
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
      </View>
      
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={handlePreviousMonth} style={styles.monthButton}>
          <Text style={styles.monthButtonText}>←</Text>
        </TouchableOpacity>
        
        <Text style={styles.monthYearText}>
          {getMonthName(selectedMonth)} {selectedYear}
        </Text>
        
        <TouchableOpacity onPress={handleNextMonth} style={styles.monthButton}>
          <Text style={styles.monthButtonText}>→</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={sortedLogs}
        renderItem={renderLogItem}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No logs for this month</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  monthButton: {
    padding: 8,
  },
  monthButtonText: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '600',
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  listContent: {
    padding: 16,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logDate: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
  },
  calendarIcon: {
    marginRight: 6,
  },
  dateText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  logDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 8,
    marginRight: 8,
  },
  calorieContainer: {
    alignItems: 'center',
  },
  calorieValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  calorieLabel: {
    fontSize: 12,
    color: Colors.textLight,
  },
  macrosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  macroText: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 8,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
  },
});