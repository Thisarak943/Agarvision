// app/checkout/payment.tsx
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, FadeInUp, FadeIn } from 'react-native-reanimated';
import Button from '../../components/ui/Button';
import Header from "../../components/ui/Header";

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay';
  title: string;
  icon: string;
  details?: string;
}

interface CardDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export default function PaymentDetails() {
  const [selectedMethod, setSelectedMethod] = useState<string>('saved_card');
  const [useNewCard, setUseNewCard] = useState(false);
  const [newCardDetails, setNewCardDetails] = useState<CardDetails>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return { opacity: opacity.value };
  });

  // Saved payment methods
  const savedMethods: PaymentMethod[] = [
    {
      id: 'saved_card',
      type: 'card',
      title: 'Visa ending in 1234',
      icon: 'card',
      details: 'Expires 12/26'
    }
  ];

  // Additional payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'new_card',
      type: 'card',
      title: 'Add New Card',
      icon: 'card-outline'
    },
    {
      id: 'paypal',
      type: 'paypal',
      title: 'PayPal',
      icon: 'logo-paypal'
    },
    {
      id: 'apple_pay',
      type: 'apple_pay',
      title: 'Apple Pay',
      icon: 'logo-apple'
    }
  ];

  const updateCardDetails = (field: keyof CardDetails, value: string) => {
    let formattedValue = value;
    
    // Format card number
    if (field === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return; // Limit to 16 digits + spaces
    }
    
    // Format expiry date
    if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
      if (formattedValue.length > 5) return; // Limit to MM/YY
    }
    
    // Format CVV
    if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 3) return; // Limit to 3 digits
    }

    setNewCardDetails(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handlePayment = () => {
    if (selectedMethod === 'new_card' || useNewCard) {
      // Validate new card details
      if (!newCardDetails.cardNumber || !newCardDetails.cardHolder || 
          !newCardDetails.expiryDate || !newCardDetails.cvv) {
        Alert.alert('Missing Information', 'Please fill in all card details');
        return;
      }
      
      // Basic card number validation
      const cardNumberClean = newCardDetails.cardNumber.replace(/\s/g, '');
      if (cardNumberClean.length < 16) {
        Alert.alert('Invalid Card', 'Please enter a valid card number');
        return;
      }
    }

    Alert.alert('Payment Successful!', 'Your order has been placed successfully');
  };

    const navigateToBack = () => {
      router.back();
    };

  const CardForm = () => (
    <Animated.View entering={FadeIn} className="mt-4 space-y-4">
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-2">Card Number *</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white"
          value={newCardDetails.cardNumber}
          onChangeText={(text) => updateCardDetails('cardNumber', text)}
          placeholder="1234 5678 9012 3456"
          keyboardType="numeric"
          maxLength={19}
        />
      </View>
      
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-2">Card Holder Name *</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white"
          value={newCardDetails.cardHolder}
          onChangeText={(text) => updateCardDetails('cardHolder', text)}
          placeholder="John Doe"
          autoCapitalize="words"
        />
      </View>
      
      <View className="flex-row space-x-4">
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-700 mb-2">Expiry Date *</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white"
            value={newCardDetails.expiryDate}
            onChangeText={(text) => updateCardDetails('expiryDate', text)}
            placeholder="MM/YY"
            keyboardType="numeric"
            maxLength={5}
          />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-700 mb-2">CVV *</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white"
            value={newCardDetails.cvv}
            onChangeText={(text) => updateCardDetails('cvv', text)}
            placeholder="123"
            keyboardType="numeric"
            maxLength={3}
            secureTextEntry
          />
        </View>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-100">
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-4" onPress={navigateToBack}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900">Payment Details</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-4">
        <Animated.View style={animatedStyle}>
          {/* Order Summary */}
          <Animated.View 
            entering={FadeInUp.delay(200)}
            className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100"
          >
            <Text className="text-lg font-bold text-gray-900 mb-3">Order Summary</Text>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-600">Subtotal</Text>
              <Text className="text-gray-900">$165.97</Text>
            </View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-600">Tax</Text>
              <Text className="text-gray-900">$0.83</Text>
            </View>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-600">Delivery</Text>
              <Text className="text-gray-900">$1.33</Text>
            </View>
            <View className="border-t border-gray-200 pt-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-gray-900">Total</Text>
                <Text className="text-xl font-bold text-primary">$168.13</Text>
              </View>
            </View>
          </Animated.View>

          {/* Saved Payment Methods */}
          {savedMethods.length > 0 && (
            <Animated.View entering={FadeInUp.delay(300)} className="mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-4">Saved Payment Methods</Text>
              {savedMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => {
                    setSelectedMethod(method.id);
                    setUseNewCard(false);
                  }}
                  className={`bg-white rounded-xl p-4 mb-3 border-2 ${
                    selectedMethod === method.id ? 'border-primary' : 'border-gray-100'
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View className={`w-5 h-5 rounded-full border-2 mr-3 ${
                        selectedMethod === method.id ? 'border-primary bg-primary' : 'border-gray-300'
                      }`}>
                        {selectedMethod === method.id && (
                          <View className="w-full h-full rounded-full bg-primary justify-center items-center">
                            <Ionicons name="checkmark" size={12} color="white" />
                          </View>
                        )}
                      </View>
                      <View className="mr-3">
                        <Ionicons name={method.icon as any} size={24} color="#374151" />
                      </View>
                      <View>
                        <Text className="font-semibold text-gray-900">{method.title}</Text>
                        {method.details && (
                          <Text className="text-sm text-gray-600">{method.details}</Text>
                        )}
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}

          {/* Payment Methods */}
          <Animated.View entering={FadeInUp.delay(400)} className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">Payment Methods</Text>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => {
                  setSelectedMethod(method.id);
                  if (method.id === 'new_card') {
                    setUseNewCard(true);
                  } else {
                    setUseNewCard(false);
                  }
                }}
                className={`bg-white rounded-xl p-4 mb-3 border-2 ${
                  selectedMethod === method.id ? 'border-primary' : 'border-gray-100'
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className={`w-5 h-5 rounded-full border-2 mr-3 ${
                      selectedMethod === method.id ? 'border-primary bg-primary' : 'border-gray-300'
                    }`}>
                      {selectedMethod === method.id && (
                        <View className="w-full h-full rounded-full bg-primary justify-center items-center">
                          <Ionicons name="checkmark" size={12} color="white" />
                        </View>
                      )}
                    </View>
                    <View className="mr-3">
                      <Ionicons name={method.icon as any} size={24} color="#374151" />
                    </View>
                    <Text className="font-semibold text-gray-900">{method.title}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </View>
                
                {/* Show card form for new card */}
                {selectedMethod === 'new_card' && method.id === 'new_card' && (
                  <CardForm />
                )}
              </TouchableOpacity>
            ))}
          </Animated.View>

          {/* Security Info */}
          <Animated.View 
            entering={FadeInUp.delay(500)}
            className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200"
          >
            <View className="flex-row items-center">
              <Ionicons name="shield-checkmark" size={24} color="#3B82F6" />
              <View className="ml-3 flex-1">
                <Text className="font-semibold text-blue-900">Secure Payment</Text>
                <Text className="text-sm text-blue-700">Your payment information is encrypted and secure</Text>
              </View>
            </View>
          </Animated.View>

          {/* Complete Payment Button */}
          <Animated.View entering={FadeInUp.delay(600)}>
            <Button
              title="Complete Payment"
              onPress={handlePayment}
            />
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}