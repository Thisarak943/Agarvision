import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import Header from "../../components/ui/Header";

const { width } = Dimensions.get('window');

interface OrderItem {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: any;
  quantity: number;
  category: string;
  type: string;
  color: string;
  size: string;
}

interface OrderHistoryItem {
  id: string;
  orderNumber: string;
  date: string;
  status: 'delivered';
  totalAmount: string;
  items: OrderItem[];
  deliveryAddress: string;
}

export default function OrderHistory() {
  const router = useRouter(); // <-- replaced routerHook
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 });
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return { opacity: opacity.value };
  });

  const orderHistoryData: OrderHistoryItem[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      date: '2024-12-15',
      status: 'delivered',
      totalAmount: '$249.97',
      deliveryAddress: '123 Main Street, City, State 12345',
      items: [
        {
          id: '1',
          name: '8" Tactical Boot',
          brand: 'Reebok',
          price: '$149.99',
          image: require('../../assets/images/boot.png'),
          quantity: 1,
          category: 'Footwear',
          type: 'Boots',
          color: 'Brown',
          size: 'M'
        },
        {
          id: '2',
          name: 'Combat Gloves',
          brand: 'Nike',
          price: '$79.99',
          image: require('../../assets/images/boot.png'),
          quantity: 1,
          category: 'Accessories',
          type: 'Gloves',
          color: 'Black',
          size: 'L'
        },
        {
          id: '3',
          name: 'Tactical Cap',
          brand: 'Adidas',
          price: '$19.99',
          image: require('../../assets/images/boot.png'),
          quantity: 1,
          category: 'Accessories',
          type: 'Caps',
          color: 'Tan',
          size: 'M'
        }
      ]
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      date: '2024-11-28',
      status: 'delivered',
      totalAmount: '$179.98',
      deliveryAddress: '123 Main Street, City, State 12345',
      items: [
        {
          id: '4',
          name: 'Athletic Tank',
          brand: 'Puma',
          price: '$59.99',
          image: require('../../assets/images/boot.png'),
          quantity: 2,
          category: 'Uniforms',
          type: 'Tanks',
          color: 'Blue',
          size: 'S'
        },
        {
          id: '5',
          name: 'Training Pants',
          brand: 'Under Armour',
          price: '$89.99',
          image: require('../../assets/images/boot.png'),
          quantity: 1,
          category: 'Uniforms',
          type: 'Pants & Shorts',
          color: 'Green',
          size: 'XL'
        }
      ]
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      date: '2024-10-10',
      status: 'delivered',
      totalAmount: '$299.99',
      deliveryAddress: '123 Main Street, City, State 12345',
      items: [
        {
          id: '6',
          name: 'Work Boots',
          brand: 'Ariat',
          price: '$179.99',
          image: require('../../assets/images/boot.png'),
          quantity: 1,
          category: 'Footwear',
          type: 'Boots',
          color: 'Brown',
          size: 'XL'
        },
        {
          id: '7',
          name: 'Tactical Jacket',
          brand: 'Under Armour',
          price: '$119.99',
          image: require('../../assets/images/boot.png'),
          quantity: 1,
          category: 'Uniforms',
          type: 'Outerwear',
          color: 'Black',
          size: 'XL'
        }
      ]
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-004',
      date: '2024-09-22',
      status: 'delivered',
      totalAmount: '$89.98',
      deliveryAddress: '123 Main Street, City, State 12345',
      items: [
        {
          id: '8',
          name: 'Utility Pouch',
          brand: 'Belleville',
          price: '$34.99',
          image: require('../../assets/images/boot.png'),
          quantity: 1,
          category: 'Accessories',
          type: 'Pouches',
          color: 'Green',
          size: 'M'
        },
        {
          id: '9',
          name: 'Tactical Vest',
          brand: '5.11',
          price: '$54.99',
          image: require('../../assets/images/boot.png'),
          quantity: 1,
          category: 'Accessories',
          type: 'Plates',
          color: 'Black',
          size: 'L'
        }
      ]
    }
  ];

  const handleReorder = (order: OrderHistoryItem) => {
    Alert.alert(
      'Reorder Items',
      `Would you like to reorder items from ${order.orderNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reorder',
          onPress: () => {
            console.log('Reordering items from:', order.orderNumber);
            // Add reorder logic here
          }
        }
      ]
    );
  };

  const handleViewDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBack = () => {
    try {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push('/');
      }
    } catch (error) {
      console.log('Navigation error:', error);
      Alert.alert('Navigation Error', 'Unable to navigate back');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title="Order History" />

      {/* Orders List */}
      <ScrollView className="flex-1 px-4 py-3" showsVerticalScrollIndicator={false}>
        <Animated.View style={animatedStyle}>
          {orderHistoryData.length > 0 ? (
            orderHistoryData.map((order, index) => {
              const isExpanded = expandedOrder === order.id;

              return (
                <Animated.View
                  key={order.id}
                  entering={FadeIn.delay(200 + index * 100)}
                  className="bg-white border border-gray-200 rounded-xl p-3 mb-8 shadow-sm"
                >
                  {/* Order Header */}
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-900 mb-1">
                        {order.orderNumber}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {formatDate(order.date)}
                      </Text>
                    </View>
                    <View className="flex-row items-center bg-green-100 px-2 py-1 rounded-xl border border-green-200">
                      <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                      <Text className="text-xs font-semibold text-green-800 ml-1">
                        DELIVERED
                      </Text>
                    </View>
                  </View>

                  {/* Items Preview */}
                  <View className="mb-3">
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      className="flex-grow-0"
                    >
                      {!isExpanded &&
                        <View className="flex-row">
                          {order.items.slice(0, 3).map((item, itemIndex) => (
                            <Animated.View
                              key={item.id}
                              // entering={FadeInRight.delay(300 + itemIndex * 100)}
                              className="bg-gray-50 border border-gray-200 rounded-xl p-3 mr-3"
                              style={{ width: width * 0.4 }}
                            >
                              <View className="rounded-lg mb-2">
                                <Image
                                  source={item.image}
                                  className="w-full h-20"
                                  resizeMode="contain"
                                />
                              </View>
                              <View className="flex-1">
                                <Text className="text-sm font-semibold text-center text-gray-900 mb-1 leading-4" numberOfLines={2}>
                                  {item.name}
                                </Text>
                                {/* <Text className="text-xs text-gray-500 mb-1">
                                  {item.brand}
                                </Text>
                                <Text className="text-sm font-semibold text-gray-900">
                                  {item.price}
                                </Text>
                                {item.quantity > 1 && (
                                  <Text className="text-xs text-gray-500 mt-1">
                                    Qty: {item.quantity}
                                  </Text>
                                )} */}
                              </View>
                            </Animated.View>
                          ))}
                          {order.items.length > 3 && (
                            <View className="justify-center items-center w-20 h-30 bg-gray-50 rounded-xl border-2 border-gray-200 border-dashed">
                              <Ionicons name="ellipsis-horizontal" size={24} color="#6b7280" />
                              <Text className="text-xs font-medium text-gray-500 text-center mt-1">
                                +{order.items.length - 3} more
                              </Text>
                            </View>
                          )}
                        </View>
                      }

                    </ScrollView>
                  </View>

                  {/* Order Footer */}
                  <View className="flex-row justify-between items-center">
                    <Text className="text-lg font-bold text-gray-900">
                      Total: {order.totalAmount}
                    </Text>
                    <View className="flex-row" style={{ gap: 8 }}>
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => handleViewDetails(order.id)}
                        className="flex-row items-center px-3 py-2 rounded-lg bg-gray-100 border border-gray-300"
                      >
                        <Ionicons
                          name={isExpanded ? "chevron-up" : "chevron-down"}
                          size={16}
                          color="#6b7280"
                        />
                        <Text className="text-xs font-medium text-gray-500 ml-1">
                          {isExpanded ? 'Hide' : 'Details'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleReorder(order)}
                        className="flex-row items-center px-3 py-2 rounded-lg bg-green-600"
                      >
                        <Ionicons name="refresh" size={16} color="white" />
                        <Text className="text-xs font-medium text-white ml-1">
                          Reorder
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <Animated.View
                      entering={FadeInUp.duration(300)}
                      className="mt-4 pt-4 border-t border-gray-100"
                    >
                      <Text className="text-base font-semibold text-gray-900 mb-3">
                        All Items:
                      </Text>
                      {order.items.map((item) => (
                        <View key={item.id} className="flex-row bg-gray-50 border border-gray-200 rounded-xl p-3 mb-2">
                          <View className="bg-white rounded-lg p-2 mr-3">
                            <Image
                              source={item.image}
                              className="w-[5rem] h-[5rem]"
                              resizeMode="contain"
                            />
                          </View>
                          <View className="flex-1 justify-between">
                            <Text className="text-sm font-semibold text-gray-900 mb-1">
                              {item.name}
                            </Text>
                            <Text className="text-xs text-gray-500 mb-1">
                              {item.brand}
                            </Text>
                            <View className="flex-row flex-wrap mb-2">
                              <Text className="text-xs text-gray-500 mr-3 mb-1">
                                Color: {item.color}
                              </Text>
                              <Text className="text-xs text-gray-500 mr-3 mb-1">
                                Size: {item.size}
                              </Text>
                              <Text className="text-xs text-gray-500 mr-3 mb-1">
                                Type: {item.type}
                              </Text>
                            </View>
                            <View className="flex-row justify-between items-center">
                              <Text className="text-sm font-semibold text-gray-900">
                                {item.price}
                              </Text>
                              <Text className="text-xs text-gray-500">
                                Qty: {item.quantity}
                              </Text>
                            </View>
                          </View>
                        </View>
                      ))}

                      <View className="flex-row items-start mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
                        <Ionicons name="location" size={18} color="#16a34a" />
                        <View className="flex-1 ml-2">
                          <Text className="text-xs font-medium text-green-800 mb-1">
                            Delivered to:
                          </Text>
                          <Text className="text-sm text-gray-700 leading-5">
                            {order.deliveryAddress}
                          </Text>
                        </View>
                      </View>
                    </Animated.View>
                  )}
                </Animated.View>
              );
            })
          ) : (
            <View className="bg-white rounded-xl border border-gray-200 p-10 items-center mt-10">
              <Ionicons name="bag-handle" size={64} color="#d1d5db" />
              <Text className="text-lg font-semibold text-gray-700 mt-4 mb-2">
                No Delivered Orders
              </Text>
              <Text className="text-sm text-gray-500 text-center leading-5">
                You haven&apos;t received any delivered orders yet.
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
