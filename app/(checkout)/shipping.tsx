// app/checkout/shipping.tsx
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, FadeInUp, FadeIn } from 'react-native-reanimated';
import Button from '../../components/ui/Button';
import Header from "../../components/ui/Header";

interface Address {
  fullName: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function ShippingAddress() {
  const [useDefaultAddress, setUseDefaultAddress] = useState(true);
  const [customAddress, setCustomAddress] = useState<Address>({
    fullName: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  // Default address from user profile
  const defaultAddress: Address = {
    fullName: 'John Doe',
    phoneNumber: '+1 (555) 123-4567',
    street: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States'
  };

  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return { opacity: opacity.value };
  });

  const updateCustomAddress = (field: keyof Address, value: string) => {
    setCustomAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    const selectedAddress = useDefaultAddress ? defaultAddress : customAddress;
    
    // Validate required fields
    if (!selectedAddress.fullName || !selectedAddress.phoneNumber || !selectedAddress.street || 
        !selectedAddress.city || !selectedAddress.state || !selectedAddress.zipCode) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    router.push('/(checkout)/payment');
  };

  const navigateToBack = () => {
    router.back();
  };

  const AddressForm = ({ address, onUpdate, editable = true }: { 
    address: Address; 
    onUpdate?: (field: keyof Address, value: string) => void;
    editable?: boolean;
  }) => (
    <View className="space-y-4">
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-2">Full Name *</Text>
        <TextInput
          className={`border border-gray-300 rounded-lg px-4 py-3 text-gray-900 ${!editable ? 'bg-gray-100' : 'bg-white'}`}
          value={address.fullName}
          onChangeText={(text) => onUpdate && onUpdate('fullName', text)}
          placeholder="Enter full name"
          editable={editable}
        />
      </View>
      
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-2 mt-4">Phone Number *</Text>
        <TextInput
          className={`border border-gray-300 rounded-lg px-4 py-3 text-gray-900 ${!editable ? 'bg-gray-100' : 'bg-white'}`}
          value={address.phoneNumber}
          onChangeText={(text) => onUpdate && onUpdate('phoneNumber', text)}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          editable={editable}
        />
      </View>
      
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-2 mt-4">Street Address *</Text>
        <TextInput
          className={`border border-gray-300 rounded-lg px-4 py-3 text-gray-900 ${!editable ? 'bg-gray-100' : 'bg-white'}`}
          value={address.street}
          onChangeText={(text) => onUpdate && onUpdate('street', text)}
          placeholder="Enter street address"
          editable={editable}
        />
      </View>
      
      <View className="flex-row space-x-4 mt-4">
        <View className="flex-1 mr-2">
          <Text className="text-sm font-medium text-gray-700 mb-2">City *</Text>
          <TextInput
            className={`border border-gray-300 rounded-lg px-4 py-3 text-gray-900 ${!editable ? 'bg-gray-100' : 'bg-white'}`}
            value={address.city}
            onChangeText={(text) => onUpdate && onUpdate('city', text)}
            placeholder="City"
            editable={editable}
          />
        </View>
        <View className="flex-1 ml-2">
          <Text className="text-sm font-medium text-gray-700 mb-2">State *</Text>
          <TextInput
            className={`border border-gray-300 rounded-lg px-4 py-3 text-gray-900 ${!editable ? 'bg-gray-100' : 'bg-white'}`}
            value={address.state}
            onChangeText={(text) => onUpdate && onUpdate('state', text)}
            placeholder="State"
            editable={editable}
          />
        </View>
      </View>
      
      <View className="flex-row space-x-4 mt-4">
        <View className="flex-1 mr-2">
          <Text className="text-sm font-medium text-gray-700 mb-2">ZIP Code *</Text>
          <TextInput
            className={`border border-gray-300 rounded-lg px-4 py-3 text-gray-900 ${!editable ? 'bg-gray-100' : 'bg-white'}`}
            value={address.zipCode}
            onChangeText={(text) => onUpdate && onUpdate('zipCode', text)}
            placeholder="ZIP"
            keyboardType="numeric"
            editable={editable}
          />
        </View>
        <View className="flex-1 ml-2">
          <Text className="text-sm font-medium text-gray-700 mb-2">Country</Text>
          <TextInput
            className={`border border-gray-300 rounded-lg px-4 py-3 text-gray-900 ${!editable ? 'bg-gray-100' : 'bg-white'}`}
            value={address.country}
            onChangeText={(text) => onUpdate && onUpdate('country', text)}
            placeholder="Country"
            editable={editable}
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-100">
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-4" onPress={navigateToBack}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900">Shipping Address</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-4">
        <Animated.View style={animatedStyle}>
          {/* Address Selection */}
          <Animated.View 
            entering={FadeInUp.delay(200)}
            className="mb-6"
          >
            {/* Default Address Option */}
            <TouchableOpacity
              onPress={() => setUseDefaultAddress(true)}
              className={`bg-white rounded-xl p-4 mb-4 border-2 ${
                useDefaultAddress ? 'border-primary' : 'border-gray-100'
              }`}
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <View className={`w-5 h-5 rounded-full border-2 mr-3 ${
                    useDefaultAddress ? 'border-primary bg-primary' : 'border-gray-300'
                  }`}>
                    {useDefaultAddress && (
                      <View className="w-full h-full rounded-full bg-primary justify-center items-center">
                        <Ionicons name="checkmark" size={12} color="white" />
                      </View>
                    )}
                  </View>
                  <Text className="text-lg font-semibold text-gray-900">Default Address</Text>
                </View>
                <Ionicons name="home" size={20} color="#6B7280" />
              </View>
              <AddressForm address={defaultAddress} editable={false} />
            </TouchableOpacity>

            {/* Custom Address Option */}
            <TouchableOpacity
              onPress={() => setUseDefaultAddress(false)}
              className={`bg-white rounded-xl p-4 border-2 ${
                !useDefaultAddress ? 'border-primary' : 'border-gray-100'
              }`}
            >
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <View className={`w-5 h-5 rounded-full border-2 mr-3 ${
                    !useDefaultAddress ? 'border-primary bg-primary' : 'border-gray-300'
                  }`}>
                    {!useDefaultAddress && (
                      <View className="w-full h-full rounded-full bg-primary justify-center items-center">
                        <Ionicons name="checkmark" size={12} color="white" />
                      </View>
                    )}
                  </View>
                  <Text className="text-lg font-semibold text-gray-900">Use Different Address</Text>
                </View>
                <Ionicons name="location" size={20} color="#6B7280" />
              </View>
              
              {!useDefaultAddress && (
                <Animated.View entering={FadeIn}>
                  <AddressForm 
                    address={customAddress} 
                    onUpdate={updateCustomAddress}
                    editable={true}
                  />
                </Animated.View>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Continue Button */}
          <Animated.View entering={FadeInUp.delay(600)}>
            <Button
              title="Continue to Payment"
              onPress={handleContinue}
            />
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}