import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Header from "../../components/ui/Header";

export default function EditProfile() {
  // Initialize with mock user data - in real app, this would come from your user context/API
  const [formData, setFormData] = useState({
    firstName: 'Thisara',
    lastName: 'Kandage',
    email: 'thisara@gmail.com',
    mobile: '+1234567890',
    username: 'ThisaraK'
  });

  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/120x120/4F46E5/FFFFFF?text=JD');

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    // Store original data for comparison
    setOriginalData({ ...formData });

    // Animate in
    opacity.value = withTiming(1, { duration: 600 });
    translateY.value = withTiming(0, { duration: 600 });
  }, []);

  useEffect(() => {
    // Check if there are any changes
    const changed = Object.keys(formData).some(
      key => formData[key] !== originalData[key]
    );
    setHasChanges(changed);
  }, [formData, originalData]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!formData.username.trim()) {
      Alert.alert('Error', 'Username is required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update original data to reflect saved state
      setOriginalData({ ...formData });
      setIsPasswordEditing(false);

      Alert.alert(
        'Success',
        'Profile updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to go back?',
        [
          {
            text: 'Stay',
            style: 'cancel'
          },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => router.back()
          }
        ]
      );
    } else {
      router.back();
    }
  };

  const handleImagePicker = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => pickImage('camera')
        },
        {
          text: 'Gallery',
          onPress: () => pickImage('gallery')
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const pickImage = async (source: 'camera' | 'gallery') => {
    try {
      let result;

      if (source === 'camera') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Permission needed', 'Camera permission is required');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Permission needed', 'Gallery permission is required');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <Header title="Edit Profile" />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6">
            {hasChanges && (
              <Text className="text-sm text-orange-600 text-center mt-4">
                You have unsaved changes
              </Text>
            )}

            <Animated.View style={animatedStyle} className="py-6">
              {/* Profile Picture Section */}
              <View className="items-center py-6">
                <TouchableOpacity onPress={handleImagePicker} className="relative">
                  <Image
                    source={{ uri: profileImage }}
                    className="w-24 h-24 rounded-full bg-gray-300"
                  />
                  <View className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2">
                    <Ionicons name="camera" size={16} color="white" />
                  </View>
                </TouchableOpacity>
                <Text className="text-sm text-gray-600 mt-2">Tap to change picture</Text>
              </View>

              {/* Personal Information Section */}
              <View className="mb-6">
                <View className="space-y-4">
                  <Input
                    label="First Name *"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChangeText={(text) => updateFormData('firstName', text)}
                    autoCapitalize="words"
                  />

                  <Input
                    label="Last Name *"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChangeText={(text) => updateFormData('lastName', text)}
                    autoCapitalize="words"
                  />

                  <Input
                    label="Email *"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChangeText={(text) => updateFormData('email', text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />

                  <Input
                    label="Mobile"
                    placeholder="Enter your mobile number"
                    value={formData.mobile}
                    onChangeText={(text) => updateFormData('mobile', text)}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Action Buttons - FIXED LAYOUT */}
              <View className="mb-6">
                <View className="flex-row" style={{ gap: 12 }}>
                  <View className="flex-1">
                    <Button
                      title="Save Changes"
                      onPress={handleSave}
                      loading={loading}
                      disabled={!hasChanges}
                      className={!hasChanges ? "opacity-60" : ""}
                    />
                  </View>
                  <View className="flex-1">
                    <Button
                      title="Cancel"
                      onPress={handleCancel}
                      variant="outline"
                    />
                  </View>
                </View>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}