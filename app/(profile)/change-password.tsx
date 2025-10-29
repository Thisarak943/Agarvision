import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from "../../components/ui/Header";

export default function ChangePassword() {

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChangePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters long');
      return;
    }

    // Simulate password change
    Alert.alert(
      'Success',
      'Password changed successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            setPasswordForm({
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
            });
          }
        }
      ]
    );
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title="Change Password" />

      <ScrollView className="flex-1">
        <View className="px-6 py-6">
          {/* Current Password */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Current Password</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
              <TextInput
                className="flex-1 text-base"
                placeholder="Enter current password"
                value={passwordForm.currentPassword}
                onChangeText={(text) => setPasswordForm({ ...passwordForm, currentPassword: text })}
                secureTextEntry={!showPasswords.current}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => togglePasswordVisibility('current')}>
                <Ionicons
                  name={showPasswords.current ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#10B981"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* New Password */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">New Password</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
              <TextInput
                className="flex-1 text-base"
                placeholder="Enter new password"
                value={passwordForm.newPassword}
                onChangeText={(text) => setPasswordForm({ ...passwordForm, newPassword: text })}
                secureTextEntry={!showPasswords.new}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => togglePasswordVisibility('new')}>
                <Ionicons
                  name={showPasswords.new ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#10B981"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm New Password */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">Re-enter New Password</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
              <TextInput
                className="flex-1 text-base"
                placeholder="Re-enter new password"
                value={passwordForm.confirmPassword}
                onChangeText={(text) => setPasswordForm({ ...passwordForm, confirmPassword: text })}
                secureTextEntry={!showPasswords.confirm}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => togglePasswordVisibility('confirm')}>
                <Ionicons
                  name={showPasswords.confirm ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#10B981"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            className="bg-green-600 rounded-lg py-4 mt-4"
            onPress={handleChangePassword}
          >
            <Text className="text-white text-center text-base font-semibold">Confirm</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}