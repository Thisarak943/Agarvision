import React from 'react';
import { TouchableOpacity, Text, Image, View } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Easing
} from 'react-native-reanimated';

interface ProductItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  type: string;
  color: string;
  size: string;
  material: string;
  price: number;
  availability: 'In Stock' | 'Pre-Order' | 'Out of Stock';
  gender: string;
  image: any;
}

interface ProductCardProps {
  item: ProductItem;
  onPress?: (item: ProductItem) => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function ProductCard({ item, onPress }: ProductCardProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value }
      ],
    };
  });

  const shadowAnimatedStyle = useAnimatedStyle(() => {
    const shadowOpacity = interpolate(scale.value, [1, 0.96], [0.1, 0.15]);
    const shadowRadius = interpolate(scale.value, [1, 0.96], [3, 8]);
    
    return {
      shadowOpacity,
      shadowRadius,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.96, {
      damping: 15,
      stiffness: 200,
    });
    translateY.value = withTiming(-2, {
      duration: 150,
      easing: Easing.out(Easing.quad)
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 200,
    });
    translateY.value = withTiming(0, {
      duration: 150,
      easing: Easing.out(Easing.quad)
    });
  };

  const handlePress = () => {
    if (onPress) {
      onPress(item);
    } else {
      router.push({
        pathname: '/product-details',
        params: {
          productId: item.id,
          productName: item.name,
          productBrand: item.brand,
          productCategory: item.category,
          productType: item.type,
          productColor: item.color,
          productSize: item.size,
          productMaterial: item.material,
          productPrice: item.price,
          productAvailability: item.availability,
          productGender: item.gender,
        },
      });
    }
  };

  const getAvailabilityStyles = (availability: string) => {
    switch (availability) {
      case 'In Stock':
        return {
          badgeClass: 'bg-green-100',
          textClass: 'text-green-700'
        };
      case 'Pre-Order':
        return {
          badgeClass: 'bg-yellow-100',
          textClass: 'text-yellow-700'
        };
      default:
        return {
          badgeClass: 'bg-red-100',
          textClass: 'text-red-700'
        };
    }
  };

  const availabilityStyles = getAvailabilityStyles(item.availability);

  return (
    <AnimatedTouchableOpacity
      style={[
        cardAnimatedStyle,
        shadowAnimatedStyle,
        {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          elevation: 4,
        }
      ]}
      className="bg-white border border-gray-200 rounded-xl p-3 mb-4 w-[48%] shadow-sm"
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      {/* Product Image Container */}
      <View className="relative">
        <Image
          source={item.image}
          className="w-full h-32 rounded-lg bg-gray-50"
          resizeMode="contain"
        />
        
        {/* Price Badge */}
        <View className="absolute top-2 right-2 bg-primary rounded-full px-2 py-1 shadow-sm">
          <Text className="text-white text-xs font-semibold">
            {item.price}
          </Text>
        </View>
      </View>

      {/* Product Details */}
      <View className="mt-3">
        <Text 
          className="font-semibold text-gray-900 text-base text-center mb-1"
          numberOfLines={2}
        >
          {item.name}
        </Text>
        
        <Text 
          className="text-gray-500 text-sm text-center mb-2"
          numberOfLines={1}
        >
          {item.brand}
        </Text>

        {/* Category and Availability */}
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-gray-400 flex-1" numberOfLines={1}>
            {item.category}
          </Text>
          
          <View className={`px-2 py-1 rounded-full ${availabilityStyles.badgeClass}`}>
            <Text className={`text-xs font-medium ${availabilityStyles.textClass}`}>
              {item.availability}
            </Text>
          </View>
        </View>

        {/* Additional product info (optional) */}
        {/* {(item.material || item.gender) && (
          <View className="flex-row items-center justify-between mt-1">
            {item.material && (
              <Text className="text-xs text-gray-400" numberOfLines={1}>
                {item.material}
              </Text>
            )}
            {item.gender && (
              <Text className="text-xs text-gray-400 capitalize" numberOfLines={1}>
                {item.gender}
              </Text>
            )}
          </View>
        )} */}
      </View>
    </AnimatedTouchableOpacity>
  );
}