// app/(tabs)/cart.tsx
import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, FadeIn, FadeInUp, FadeInDown } from 'react-native-reanimated';
import Button from '../../components/ui/Button';
import { useCart } from '../../contexts/CartContext';

export default function Cart() {
  const { cartItems, updateQuantity, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
 
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return { opacity: opacity.value };
  });

  const applyCoupon = () => {
    // Sample coupon codes
    const validCoupons = {
      'SAVE10': 0.10,
      'WELCOME20': 0.20,
      'SAFETY15': 0.15
    };
    
    if (validCoupons[couponCode.toUpperCase()]) {
      setDiscount(validCoupons[couponCode.toUpperCase()]);
      Alert.alert('Success!', `Coupon applied! ${(validCoupons[couponCode.toUpperCase()] * 100)}% discount`);
    } else if (couponCode) {
      Alert.alert('Invalid Coupon', 'Please enter a valid coupon code');
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = total * discount;
  const subtotal = total - discountAmount;
  const tax = subtotal * 0.005;
  const deliveryFee = subtotal * 0.008;
  const finalTotal = subtotal + tax + deliveryFee;

  const handleCheckout = () => {
    // Validate cart is not empty
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout');
      return;
    }
    router.push('/(checkout)/shipping');
  };

    const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearCart();
            setDiscount(0);
            setCouponCode('');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 py-3 bg-white border-b border-gray-100 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-xl font-bold text-center text-gray-900">
            Cart ({cartItems.length})
          </Text>
        </View>
        {cartItems.length > 0 && (
          <TouchableOpacity 
            onPress={handleClearCart}
            className="absolute right-4 p-2"
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView className="flex-1 px-6 py-4">
        <Animated.View style={animatedStyle}>
          {cartItems.length > 0 ? (
            <>
              {cartItems.map((item, index) => (
                <Animated.View 
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${item.selectedWidth}`}
                  entering={FadeInUp.delay(200 + index * 100)}
                  className="bg-white rounded-xl p-4 mb-4 border border-gray-200"
                >
                  <View className="flex-row items-center">
                    <View className="rounded-xl justify-center items-center mr-4">
                      <Image source={item.image} className="w-16 h-16 rounded-lg" resizeMode="contain" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-900 mb-1">{item.name}</Text>
                      <Text className="text-primary font-bold">${item.price}</Text>
                      {/* Display selected options */}
                      <View className="flex-row flex-wrap mt-1">
                        {item.selectedSize && (
                          <Text className="text-xs text-gray-600 mr-2">Size: {item.selectedSize}</Text>
                        )}
                        {item.selectedColor && (
                          <Text className="text-xs text-gray-600 mr-2">Color: {item.selectedColor}</Text>
                        )}
                        {item.selectedWidth && (
                          <Text className="text-xs text-gray-600">Width: {item.selectedWidth}</Text>
                        )}
                      </View>
                    </View>
                    <View className="flex-row items-center">
                      <TouchableOpacity 
                        onPress={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 bg-gray-200 rounded-lg justify-center items-center shadow-sm"
                      >
                        <Ionicons name="remove" size={16} color="#6B7280" />
                      </TouchableOpacity>
                      <Text className="mx-4 font-semibold text-gray-900">{item.quantity}</Text>
                      <TouchableOpacity 
                        onPress={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 bg-primary rounded-lg justify-center items-center shadow-sm"
                      >
                        <Ionicons name="add" size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              ))}
              
              <Animated.View 
                entering={FadeInDown.delay(600)}
                className="bg-white rounded-2xl p-6 px-14 mt-8 -ml-5 -mr-5 shadow-lg border-t border-b-0 border-gray-100"
              >
                {/* Coupon Code Section */}
                <View className="mb-8">
                  <Text className="text-base text-gray-700 mb-3 text-center">Have a coupon code ? Enter here</Text>
                  <View className="border-2 border-dashed border-green-400 rounded-lg p-3 flex-row items-center">
                    <Ionicons name="pricetag" size={20} color="#10B981" />
                    <TextInput
                      className="flex-1 ml-3 text-gray-900"
                      placeholder="Enter Your Offer Code"
                      placeholderTextColor="#9CA3AF"
                      value={couponCode}
                      onChangeText={setCouponCode}
                      autoCapitalize="characters"
                    />
                    <TouchableOpacity onPress={applyCoupon}>
                      <Ionicons name="chevron-forward" size={20} color="#10B981" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Price Breakdown */}
                <View className="mb-4">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-gray-700">Price :</Text>
                    <Text className="text-gray-900 font-medium">${total.toFixed(2)}</Text>
                  </View>
                  {discount > 0 && (
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-green-600">Discount ({(discount * 100)}%) :</Text>
                      <Text className="text-green-600 font-medium">-${discountAmount.toFixed(2)}</Text>
                    </View>
                  )}
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-gray-700">Tax :</Text>
                    <Text className="text-gray-900 font-medium">${tax.toFixed(2)}</Text>
                  </View>
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-gray-700">Delivery Fee :</Text>
                    <Text className="text-gray-900 font-medium">${deliveryFee.toFixed(2)}</Text>
                  </View>
                  
                  {/* Dotted line separator */}
                  <View className="border-b border-dashed border-gray-300 mb-4" />
                  
                  <View className="flex-row justify-between items-center mb-8">
                    <Text className="text-lg font-bold text-gray-900">Total :</Text>
                    <Text className="text-2xl font-bold text-gray-900">${finalTotal.toFixed(2)}</Text>
                  </View>
                </View>

                <Button
                  title="Proceed to Checkout"
                  onPress={handleCheckout}
                />
                <View className="h-20" />
              </Animated.View>
            </>
          ) : (
            <Animated.View 
              entering={FadeIn.delay(300)}
              className="flex-1 justify-center items-center py-20"
            >
              <Text className="text-6xl mb-4">🛒</Text>
              <Text className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</Text>
              <Text className="text-gray-600 text-center">Add some items to get started</Text>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}