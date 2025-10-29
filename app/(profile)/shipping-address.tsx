import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Header from "../../components/ui/Header";

export default function ShippingAddress() {
  const [formData, setFormData] = useState({
    addressLine1: '123 Main Street',
    addressLine2: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States'
  });

  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

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

    if (!formData.zipCode.trim() || !formData.country.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update original data to reflect saved state
      setOriginalData({ ...formData });

      Alert.alert(
        'Success',
        'Shipping address updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update shipping address. Please try again.');
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

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <Header title="Shipping Address" />

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

              {/* Address Information Section */}
              <View className="mb-6">
                <View className="space-y-4">
                  <Input
                    label="Address Line 1 *"
                    placeholder="Street address, P.O. box"
                    value={formData.addressLine1}
                    onChangeText={(text) => updateFormData('addressLine1', text)}
                  />

                  <Input
                    label="Address Line 2"
                    placeholder="Apartment, suite, unit, building, floor, etc."
                    value={formData.addressLine2}
                    onChangeText={(text) => updateFormData('addressLine2', text)}
                  />

                  {/* FIXED: City and State row */}
                  <View className="flex-row" style={{ gap: 12 }}>
                    <View className="flex-1">
                      <Input
                        label="City *"
                        placeholder="City"
                        value={formData.city}
                        onChangeText={(text) => updateFormData('city', text)}
                        autoCapitalize="words"
                      />
                    </View>

                    <View className="flex-1">
                      <Input
                        label="State/Province"
                        placeholder="State"
                        value={formData.state}
                        onChangeText={(text) => updateFormData('state', text)}
                        autoCapitalize="characters"
                      />
                    </View>
                  </View>

                  {/* FIXED: ZIP and Country row */}
                  <View className="flex-row" style={{ gap: 12 }}>
                    <View className="flex-1">
                      <Input
                        label="ZIP/Postal Code *"
                        placeholder="ZIP Code"
                        value={formData.zipCode}
                        onChangeText={(text) => updateFormData('zipCode', text)}
                        keyboardType="number-pad"
                      />
                    </View>

                    <View className="flex-1">
                      <Input
                        label="Country *"
                        placeholder="Country"
                        value={formData.country}
                        onChangeText={(text) => updateFormData('country', text)}
                        autoCapitalize="words"
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* FIXED: Action Buttons */}
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

              {/* Additional Options */}
              <View className="border-t border-gray-200 pt-6">
                <TouchableOpacity
                  className="flex-row items-center justify-between p-4 bg-white border border-gray-200 rounded-lg mb-3"
                  onPress={() => {
                    // Add functionality for multiple addresses
                    Alert.alert('Coming Soon', 'Multiple addresses feature will be available soon');
                  }}
                >
                  <View className="flex-row items-center">
                    <Ionicons name="location" size={20} color="#6B7280" />
                    <Text className="ml-3 text-gray-800 font-medium">
                      Add Another Address
                    </Text>
                  </View>
                  <Ionicons name="add" size={20} color="#6B7280" />
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
                  onPress={() => {
                    // Add functionality for address book
                    Alert.alert('Coming Soon', 'Address book feature will be available soon');
                  }}
                >
                  <View className="flex-row items-center">
                    <Ionicons name="book" size={20} color="#6B7280" />
                    <Text className="ml-3 text-gray-800 font-medium">
                      Address Book
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}