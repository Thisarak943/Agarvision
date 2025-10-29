// app/(profile)/my-coupons.tsx
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Header from "../../components/ui/Header";

interface Coupon {
  id: string;
  title: string;
  discount: string;
  description: string;
  expiryDate: string;
  code: string;
  isUsed: boolean;
  category: 'percentage' | 'fixed' | 'shipping';
}

export default function MyCoupons() {
  const coupons: Coupon[] = [
    {
      id: '1',
      title: 'Welcome Discount',
      discount: '20% OFF',
      description: 'Get 20% off on your first order',
      expiryDate: '2024-12-31',
      code: 'WELCOME20',
      isUsed: false,
      category: 'percentage'
    },
    {
      id: '2',
      title: 'Free Shipping',
      discount: 'FREE SHIPPING',
      description: 'Free shipping on orders above $50',
      expiryDate: '2024-11-30',
      code: 'FREESHIP50',
      isUsed: false,
      category: 'shipping'
    },
    {
      id: '3',
      title: 'Summer Sale',
      discount: '$15 OFF',
      description: 'Fixed discount of $15 on any order',
      expiryDate: '2024-10-15',
      code: 'SUMMER15',
      isUsed: true,
      category: 'fixed'
    },
    {
      id: '4',
      title: 'Bulk Order',
      discount: '30% OFF',
      description: 'Special discount for bulk orders above $200',
      expiryDate: '2025-01-15',
      code: 'BULK30',
      isUsed: false,
      category: 'percentage'
    }
  ];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'percentage':
      return 'pricetag-outline'; // changed from "percent-outline"
    case 'fixed':
      return 'cash-outline';
    case 'shipping':
      return 'car-outline';
    default:
      return 'pricetag-outline';
  }
};


  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'percentage':
        return '#10B981';
      case 'fixed':
        return '#F59E0B';
      case 'shipping':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const handleCopyCoupon = (code: string) => {
    // In a real app, you'd copy to clipboard
    Alert.alert('Copied!', `Coupon code "${code}" copied to clipboard`);
  };

  const activeCoupons = coupons.filter(coupon => !coupon.isUsed);
  const usedCoupons = coupons.filter(coupon => coupon.isUsed);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title="My Coupons" />

      <ScrollView className="flex-1 px-6 py-4">
        {/* Active Coupons */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Active Coupons ({activeCoupons.length})
          </Text>
          {activeCoupons.map((coupon, index) => (
            <Animated.View
              key={coupon.id}
              entering={FadeInUp.delay(index * 100)}
              className="bg-white rounded-xl p-4 mb-4 border border-gray-200"
            >
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <Ionicons
                      name={getCategoryIcon(coupon.category) as any}
                      size={20}
                      color={getCategoryColor(coupon.category)}
                    />
                    <Text className="text-lg font-bold text-gray-900 ml-2">
                      {coupon.discount}
                    </Text>
                  </View>
                  <Text className="text-md font-semibold text-gray-800 mb-1">
                    {coupon.title}
                  </Text>
                  <Text className="text-sm text-gray-600 mb-2">
                    {coupon.description}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    Expires: {coupon.expiryDate}
                  </Text>
                </View>
              </View>
              
              <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
                  <Text className="font-mono text-sm font-semibold text-gray-800">
                    {coupon.code}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleCopyCoupon(coupon.code)}
                  className="bg-primary rounded-lg px-4 py-2 active:bg-primary/80"
                >
                  <Text className="text-white text-sm font-medium">Copy Code</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Used Coupons */}
        {usedCoupons.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Used Coupons ({usedCoupons.length})
            </Text>
            {usedCoupons.map((coupon, index) => (
              <Animated.View
                key={coupon.id}
                entering={FadeInUp.delay((activeCoupons.length + index) * 100)}
                className="bg-gray-100 rounded-xl p-4 mb-4 opacity-60 border border-gray-200"
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      <Ionicons
                        name={getCategoryIcon(coupon.category) as any}
                        size={20}
                        color="#9CA3AF"
                      />
                      <Text className="text-lg font-bold text-gray-600 ml-2">
                        {coupon.discount}
                      </Text>
                      <View className="bg-red-100 rounded-full px-2 py-1 ml-2">
                        <Text className="text-xs text-red-600 font-medium">USED</Text>
                      </View>
                    </View>
                    <Text className="text-md font-semibold text-gray-600 mb-1">
                      {coupon.title}
                    </Text>
                    <Text className="text-sm text-gray-500 mb-2">
                      {coupon.description}
                    </Text>
                  </View>
                </View>
                
                <View className="flex-row items-center pt-3 border-t border-gray-200">
                  <View className="flex-row items-center bg-gray-200 rounded-lg px-3 py-2">
                    <Text className="font-mono text-sm font-semibold text-gray-600">
                      {coupon.code}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {coupons.length === 0 && (
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="pricetag-outline" size={64} color="#D1D5DB" />
            <Text className="text-lg font-medium text-gray-600 mt-4 mb-2">
              No Coupons Available
            </Text>
            <Text className="text-sm text-gray-500 text-center">
              Check back later for exclusive deals and discounts
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}