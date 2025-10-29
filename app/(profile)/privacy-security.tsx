import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from "../../components/ui/Header";

export default function PrivacySecurity() {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    passwordRecoveryMethod: 'Email',
    googleAccountSigned: true,
    biometricLogin: true,
    autoLogout: false,
    loginAlerts: true,
    dataSharing: false,
    locationTracking: true,
    cookiePreferences: 'Essential Only',
    adPersonalization: false,
    analyticsOptOut: false
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  const handlePasswordRecoveryMethod = () => {
    Alert.alert(
      'Password Recovery Method',
      'Choose your preferred recovery method',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Email', 
          onPress: () => setSecuritySettings(prev => ({...prev, passwordRecoveryMethod: 'Email'}))
        },
        { 
          text: 'SMS', 
          onPress: () => setSecuritySettings(prev => ({...prev, passwordRecoveryMethod: 'SMS'}))
        },
        { 
          text: 'Security Questions', 
          onPress: () => setSecuritySettings(prev => ({...prev, passwordRecoveryMethod: 'Security Questions'}))
        },
      ]
    );
  };

  const handleCookiePreferences = () => {
    Alert.alert(
      'Cookie Preferences',
      'Choose your cookie preferences',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Essential Only', 
          onPress: () => setSecuritySettings(prev => ({...prev, cookiePreferences: 'Essential Only'}))
        },
        { 
          text: 'Performance', 
          onPress: () => setSecuritySettings(prev => ({...prev, cookiePreferences: 'Performance'}))
        },
        { 
          text: 'All Cookies', 
          onPress: () => setSecuritySettings(prev => ({...prev, cookiePreferences: 'All Cookies'}))
        },
      ]
    );
  };

  const handleToggle2FA = () => {
    if (securitySettings.twoFactorEnabled) {
      Alert.alert(
        'Disable Two-Factor Authentication',
        'This will make your account less secure. Are you sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Disable', 
            style: 'destructive',
            onPress: () => setSecuritySettings(prev => ({...prev, twoFactorEnabled: false}))
          }
        ]
      );
    } else {
      // Navigate to 2FA setup
      Alert.alert('Setup Two-Factor Authentication', 'You will be redirected to setup 2FA');
      setSecuritySettings(prev => ({...prev, twoFactorEnabled: true}));
    }
  };

  const handleChangePassword = () => {
    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }

    // Simulate password change
    Alert.alert('Success', 'Password changed successfully');
    setShowPasswordModal(false);
    setNewPassword('');
    setConfirmPassword('');
    setCurrentPassword('');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Account', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deletion', 'Please contact support to delete your account');
          }
        }
      ]
    );
  };

  const handleDataExport = () => {
    Alert.alert(
      'Export Data',
      'Your data export will be emailed to you within 24 hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Request Export', onPress: () => console.log('Data export requested') }
      ]
    );
  };

  const renderToggleItem = (title, subtitle, value, onToggle, important = false, disabled = false) => (
    <View className={`bg-white rounded-xl p-4 mb-3 border border-gray-200 ${disabled ? 'opacity-50' : ''}`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <View className="flex-row items-center">
            <Text className="text-base font-medium text-gray-900">
              {title}
            </Text>
            {important && (
              <View className="ml-2 bg-red-100 px-2 py-1 rounded-full">
                <Text className="text-xs text-red-600 font-medium">
                  Important
                </Text>
              </View>
            )}
          </View>
          <Text className="text-sm text-gray-600 mt-1">
            {subtitle}
          </Text>
        </View>
        
        <Switch
          value={value}
          onValueChange={onToggle}
          disabled={disabled}
          trackColor={{ false: '#F3F4F6', true: '#10B981' }}
          thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
          className="transform scale-x-75 scale-y-75"
        />
      </View>
    </View>
  );

  const renderActionItem = (title, subtitle, action, icon = "chevron-forward", color = "#9CA3AF", dangerous = false) => (
    <TouchableOpacity 
      className={`bg-white rounded-xl p-4 mb-3 border ${dangerous ? 'border-red-200' : 'border-gray-200'} active:bg-gray-50`}
      onPress={action}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className={`text-base font-medium ${dangerous ? 'text-red-600' : 'text-gray-900'} mb-1`}>
            {title}
          </Text>
          <Text className="text-sm text-gray-600">
            {subtitle}
          </Text>
        </View>
        <Ionicons name={icon} size={20} color={dangerous ? '#DC2626' : color} />
      </View>
    </TouchableOpacity>
  );

  const renderStatusItem = (title, subtitle, status, action, statusColor = "green") => (
    <TouchableOpacity 
      className="bg-white rounded-xl p-4 mb-3 border border-gray-200 active:bg-gray-50"
      onPress={action}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-base font-medium text-gray-900 mb-1">{title}</Text>
          <Text className="text-sm text-gray-600">{subtitle}</Text>
        </View>
        <View className="flex-row items-center">
          <View className={`bg-${statusColor}-100 px-3 py-1 rounded-full border border-${statusColor}-200 mr-2`}>
            <Text className={`text-xs font-semibold text-${statusColor}-800`}>
              {status}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = (title, subtitle = null) => (
    <View className="mb-4">
      <Text className="text-lg font-semibold text-gray-900 mb-1">{title}</Text>
      {subtitle && (
        <Text className="text-sm text-gray-500">{subtitle}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title="Privacy & Security" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-6">
          {/* Account Security Section */}
          <View className="mb-8">
            {renderSectionHeader('Account Security', 'Protect your account with these security features')}
            
            {renderStatusItem(
              'Google Account',
              'Sync your account with Google services',
              securitySettings.googleAccountSigned ? 'Connected' : 'Not Connected',
              () => {
                Alert.alert('Google Account', 'Manage Google account connection');
              },
              securitySettings.googleAccountSigned ? 'green' : 'gray'
            )}

            {renderStatusItem(
              'Two-Factor Authentication',
              'Add an extra layer of security to your account',
              securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled',
              handleToggle2FA,
              securitySettings.twoFactorEnabled ? 'green' : 'red'
            )}

            {renderStatusItem(
              'Password Recovery Method',
              'How you\'ll recover your account if locked out',
              securitySettings.passwordRecoveryMethod,
              handlePasswordRecoveryMethod
            )}

            {renderActionItem(
              'Change Password',
              'Update your account password',
              () => setShowPasswordModal(true),
              'key-outline'
            )}

            {renderToggleItem(
              'Biometric Login',
              'Use fingerprint or face recognition to log in',
              securitySettings.biometricLogin,
              (value) => setSecuritySettings(prev => ({...prev, biometricLogin: value})),
              false
            )}

            {renderToggleItem(
              'Login Alerts',
              'Get notified when someone logs into your account',
              securitySettings.loginAlerts,
              (value) => setSecuritySettings(prev => ({...prev, loginAlerts: value})),
              true
            )}

            {renderToggleItem(
              'Auto Logout',
              'Automatically log out after 30 minutes of inactivity',
              securitySettings.autoLogout,
              (value) => setSecuritySettings(prev => ({...prev, autoLogout: value}))
            )}
          </View>

          {/* Privacy Settings Section */}
          <View className="mb-8">
            {renderSectionHeader('Privacy Settings', 'Control how your data is used and shared')}
            
            {renderToggleItem(
              'Data Sharing',
              'Share anonymized data to improve our services',
              securitySettings.dataSharing,
              (value) => setSecuritySettings(prev => ({...prev, dataSharing: value}))
            )}

            {renderToggleItem(
              'Location Tracking',
              'Allow the app to access your location for better experience',
              securitySettings.locationTracking,
              (value) => setSecuritySettings(prev => ({...prev, locationTracking: value}))
            )}

            {renderToggleItem(
              'Ad Personalization',
              'Show personalized ads based on your activity',
              securitySettings.adPersonalization,
              (value) => setSecuritySettings(prev => ({...prev, adPersonalization: value}))
            )}

            {renderToggleItem(
              'Analytics Opt-out',
              'Opt out of analytics and usage data collection',
              securitySettings.analyticsOptOut,
              (value) => setSecuritySettings(prev => ({...prev, analyticsOptOut: value}))
            )}

            {renderStatusItem(
              'Cookie Preferences',
              'Manage your cookie and tracking preferences',
              securitySettings.cookiePreferences,
              handleCookiePreferences
            )}
          </View>

          {/* Data Management Section */}
          <View className="mb-8">
            {renderSectionHeader('Data Management', 'Manage your personal data')}
            
            {renderActionItem(
              'Download My Data',
              'Export all your account data',
              handleDataExport,
              'download-outline'
            )}

            {renderActionItem(
              'Privacy Policy',
              'Read our privacy policy and terms',
              () => Alert.alert('Privacy Policy', 'Opening privacy policy...'),
              'document-text-outline'
            )}

            {renderActionItem(
              'Data Retention Settings',
              'Control how long we keep your data',
              () => Alert.alert('Data Retention', 'Configure data retention settings'),
              'time-outline'
            )}
          </View>

          {/* Danger Zone */}
          <View className="mb-8">
            {renderSectionHeader('Danger Zone', 'Irreversible and destructive actions')}
            
            {renderActionItem(
              'Delete Account',
              'Permanently delete your account and all data',
              handleDeleteAccount,
              'trash-outline',
              '#DC2626',
              true
            )}
          </View>
        </View>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal
        visible={showPasswordModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl px-6 py-8">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-semibold text-gray-900">Change Password</Text>
              <TouchableOpacity
                onPress={() => setShowPasswordModal(false)}
                className="p-2"
              >
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Current Password</Text>
                <TextInput
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  placeholder="Enter current password"
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">New Password</Text>
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholder="Enter new password"
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Confirm New Password</Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholder="Confirm new password"
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                />
              </View>

              <View className="flex-row space-x-3 mt-6">
                <TouchableOpacity
                  onPress={() => setShowPasswordModal(false)}
                  className="flex-1 bg-gray-100 rounded-lg py-3"
                >
                  <Text className="text-center text-gray-700 font-medium">Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={handleChangePassword}
                  className="flex-1 bg-primary rounded-lg py-3"
                >
                  <Text className="text-center text-white font-medium">Change Password</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}