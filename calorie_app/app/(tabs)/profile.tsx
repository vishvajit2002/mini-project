import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Switch,
  SafeAreaView,
  Alert
} from 'react-native';
import { useFoodStore } from '@/store/food-store';
import Colors from '@/constants/colors';
import { 
  User, 
  Settings, 
  Target, 
  Weight, 
  Ruler, 
  Calendar, 
  Activity,
  ChevronRight,
  Save
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { userProfile, updateUserProfile } = useFoodStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...userProfile });
  
  const handleSaveProfile = () => {
    // Validate inputs
    const calorieGoal = Number(editedProfile.calorieGoal);
    const proteinGoal = Number(editedProfile.proteinGoal);
    const carbsGoal = Number(editedProfile.carbsGoal);
    const fatGoal = Number(editedProfile.fatGoal);
    
    if (isNaN(calorieGoal) || calorieGoal <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid calorie goal');
      return;
    }
    
    if (isNaN(proteinGoal) || proteinGoal <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid protein goal');
      return;
    }
    
    if (isNaN(carbsGoal) || carbsGoal <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid carbs goal');
      return;
    }
    
    if (isNaN(fatGoal) || fatGoal <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid fat goal');
      return;
    }
    
    // Save changes
    updateUserProfile({
      calorieGoal,
      proteinGoal,
      carbsGoal,
      fatGoal,
      weight: editedProfile.weight,
      height: editedProfile.height,
      age: editedProfile.age,
      gender: editedProfile.gender,
      activityLevel: editedProfile.activityLevel,
    });
    
    setIsEditing(false);
  };
  
  const handleCancelEdit = () => {
    setEditedProfile({ ...userProfile });
    setIsEditing(false);
  };
  
  const renderEditableField = (
    label: string, 
    value: string | number | undefined, 
    field: keyof typeof editedProfile,
    unit: string = '',
    keyboardType: 'default' | 'numeric' = 'default'
  ) => {
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {isEditing ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={value?.toString() || ''}
              onChangeText={(text) => setEditedProfile({ ...editedProfile, [field]: text })}
              keyboardType={keyboardType}
              selectTextOnFocus
            />
            {unit ? <Text style={styles.unitText}>{unit}</Text> : null}
          </View>
        ) : (
          <Text style={styles.fieldValue}>
            {value || '-'} {unit}
          </Text>
        )}
      </View>
    );
  };
  
  const renderSelectableField = (
    label: string,
    value: string | undefined,
    options: { value: string; label: string }[],
    field: keyof typeof editedProfile
  ) => {
    const selectedOption = options.find(option => option.value === value);
    
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {isEditing ? (
          <View style={styles.selectContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.selectOption,
                  editedProfile[field] === option.value && styles.selectedOption
                ]}
                onPress={() => setEditedProfile({ 
                  ...editedProfile, 
                  [field]: option.value 
                })}
              >
                <Text style={[
                  styles.selectOptionText,
                  editedProfile[field] === option.value && styles.selectedOptionText
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.fieldValue}>
            {selectedOption?.label || '-'}
          </Text>
        )}
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        {!isEditing ? (
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.editActions}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancelEdit}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveProfile}
            >
              <Save size={16} color={Colors.white} />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Target size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Nutrition Goals</Text>
          </View>
          
          {renderEditableField('Calorie Goal', editedProfile.calorieGoal, 'calorieGoal', 'cal', 'numeric')}
          {renderEditableField('Protein Goal', editedProfile.proteinGoal, 'proteinGoal', 'g', 'numeric')}
          {renderEditableField('Carbs Goal', editedProfile.carbsGoal, 'carbsGoal', 'g', 'numeric')}
          {renderEditableField('Fat Goal', editedProfile.fatGoal, 'fatGoal', 'g', 'numeric')}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>
          
          {renderSelectableField('Gender', editedProfile.gender, [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' }
          ], 'gender')}
          
          {renderEditableField('Age', editedProfile.age, 'age', 'years', 'numeric')}
          {renderEditableField('Weight', editedProfile.weight, 'weight', 'kg', 'numeric')}
          {renderEditableField('Height', editedProfile.height, 'height', 'cm', 'numeric')}
          
          {renderSelectableField('Activity Level', editedProfile.activityLevel, [
            { value: 'sedentary', label: 'Sedentary' },
            { value: 'light', label: 'Lightly Active' },
            { value: 'moderate', label: 'Moderately Active' },
            { value: 'active', label: 'Very Active' },
            { value: 'very active', label: 'Extremely Active' }
          ], 'activityLevel')}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Settings size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>App Settings</Text>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
              value={false}
              disabled={true}
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Clear All Data</Text>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>About</Text>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  editButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
  editActions: {
    flexDirection: 'row',
  },
  cancelButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  cancelButtonText: {
    color: Colors.textLight,
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  saveButtonText: {
    color: Colors.white,
    fontWeight: '600',
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: Colors.text,
  },
  unitText: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 4,
  },
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  selectOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: Colors.card,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: Colors.primary,
  },
  selectOptionText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedOptionText: {
    color: Colors.white,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.text,
  },
});