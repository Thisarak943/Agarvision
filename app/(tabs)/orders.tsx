import { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Order {
  id: string;
  status: string;
  amount: string;
  date: string;
  items?: string[];
  shippingAddress?: string;
  trackingNumber?: string;
  complaintReason?: string;
  complaintDate?: string;
}

export default function Orders() {
  const [activeTab, setActiveTab] = useState<'ongoing' | 'completed' | 'complaints'>('ongoing');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return { opacity: opacity.value };
  });

  const ongoingOrders: Order[] = [
    {
      id: 'ORD002',
      status: 'Processing',
      amount: '$149.50',
      date: '2025-08-18',
      items: ['Wireless Headphones', 'Phone Case'],
      shippingAddress: '123 Main St, City, State 12345'
    },
    {
      id: 'ORD003',
      status: 'Shipped',
      amount: '$89.99',
      date: '2025-08-17',
      items: ['Bluetooth Speaker'],
      shippingAddress: '456 Oak Ave, City, State 12345',
      trackingNumber: 'TR123456789'
    }
  ];

  const completedOrders: Order[] = [
    {
      id: 'ORD001',
      status: 'Delivered',
      amount: '$299.99',
      date: '2025-08-15',
      items: ['Laptop Stand', 'USB Hub', 'Wireless Mouse'],
      shippingAddress: '123 Main St, City, State 12345'
    }
  ];

  const complaints: Order[] = [
    {
      id: 'ORD004',
      status: 'Complaint Filed',
      amount: '$79.99',
      date: '2025-08-10',
      items: ['Damaged Phone Screen Protector'],
      complaintReason: 'Product arrived damaged',
      complaintDate: '2025-08-12'
    }
  ];

  const getCurrentOrders = () => {
    switch (activeTab) {
      case 'ongoing':
        return ongoingOrders;
      case 'completed':
        return completedOrders;
      case 'complaints':
        return complaints;
      default:
        return [];
    }
  };

  const handleCancelOrder = (orderId: string) => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes', onPress: () => {
            console.log('Order cancelled:', orderId);
            // Add your cancel logic here
          }
        }
      ]
    );
  };

  const handleComplaint = (orderId: string) => {
    Alert.alert(
      'File Complaint',
      'Would you like to file a complaint for this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes', onPress: () => {
            console.log('Filing complaint for:', orderId);
            // Add your complaint logic here
          }
        }
      ]
    );
  };

  const handleOpenEmail = () => {
    try {
      const email = 'support@example.com';
      const subject = 'Order Complaint Follow-up';
      const body = 'Hello, I would like to follow up on my complaint...';

      Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    } catch (error) {
      Alert.alert('Error', 'Could not open email client');
    }
  };

  const toggleExpanded = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100';
      case 'Shipped':
        return 'bg-blue-100';
      case 'Processing':
        return 'bg-yellow-100';
      case 'Complaint Filed':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getStatusTextClasses = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-800';
      case 'Shipped':
        return 'text-blue-800';
      case 'Processing':
        return 'text-yellow-800';
      case 'Complaint Filed':
        return 'text-red-800';
      default:
        return 'text-gray-800';
    }
  };

  const handleTabPress = (tab: 'ongoing' | 'completed' | 'complaints') => {
    setActiveTab(tab);
    setExpandedOrder(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 py-3 bg-white border-b border-gray-100">
        <Text className="text-xl font-bold text-center text-gray-900">
          Orders
        </Text>
      </View>

      <View className="mx-6 my-3">
        <View className="flex-row bg-gray-100 rounded-lg p-1">
          <TouchableOpacity
            onPress={() => handleTabPress('ongoing')}
            className={`flex-1 py-2 px-2 rounded-md ${activeTab === 'ongoing' ? 'bg-primary' : ''}`}
          >
            <Text className={`text-center font-medium ${activeTab === 'ongoing' ? 'text-white' : 'text-gray-600'}`}>
              Ongoing
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTabPress('completed')}
            className={`flex-1 py-2 px-2 rounded-md ${activeTab === 'completed' ? 'bg-primary' : ''}`}
          >
            <Text className={`text-center font-medium ${activeTab === 'completed' ? 'text-white' : 'text-gray-600'}`}>
              Completed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTabPress('complaints')}
            className={`flex-1 py-2 px-2 rounded-md ${activeTab === 'complaints' ? 'bg-primary' : ''}`}
          >
            <Text className={`text-center font-medium ${activeTab === 'complaints' ? 'text-white' : 'text-gray-600'}`}>
              Complaints
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-4">
        <Animated.View style={animatedStyle}>
          {getCurrentOrders().length > 0 ? (
            getCurrentOrders().map((order, index) => {
              const isExpanded = expandedOrder === order.id;

              return (
                <Animated.View
                  key={order.id}
                  entering={FadeIn.delay(200 + index * 100)}
                  className="bg-white rounded-xl p-4 mb-4 border border-gray-100"
                >
                  <TouchableOpacity onPress={() => toggleExpanded(order.id)}>
                    <View className="flex-row justify-between items-start mb-2">
                      <Text className="font-semibold text-gray-900">{order.id}</Text>
                      <View className={`px-3 py-1 rounded-full ${getStatusClasses(order.status)}`}>
                        <Text className={`text-xs font-medium ${getStatusTextClasses(order.status)}`}>
                          {order.status}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-gray-600 text-sm mb-1">Amount: {order.amount}</Text>
                    <Text className="text-gray-400 text-xs mb-2">Date: {order.date}</Text>
                    <Text className="text-green-500 text-xs">
                      {isExpanded ? 'Tap to collapse' : 'Tap to expand'}
                    </Text>
                  </TouchableOpacity>

                  {isExpanded && (
                    <Animated.View
                      entering={FadeIn.duration(300)}
                      className="mt-4 pt-4 border-t border-gray-100"
                    >
                      {order.items && (
                        <View className="mb-3">
                          <Text className="font-medium text-gray-900 mb-1">Items:</Text>
                          {order.items.map((item, idx) => (
                            <Text key={idx} className="text-gray-600 text-sm ml-2">• {item}</Text>
                          ))}
                        </View>
                      )}

                      {order.shippingAddress && (
                        <View className="mb-3">
                          <Text className="font-medium text-gray-900 mb-1">Shipping Address:</Text>
                          <Text className="text-gray-600 text-sm">{order.shippingAddress}</Text>
                        </View>
                      )}

                      {order.trackingNumber && (
                        <View className="mb-3">
                          <Text className="font-medium text-gray-900 mb-1">Tracking Number:</Text>
                          <Text className="text-gray-600 text-sm">{order.trackingNumber}</Text>
                        </View>
                      )}

                      {order.complaintReason && (
                        <View className="mb-3">
                          <Text className="font-medium text-gray-900 mb-1">Complaint Reason:</Text>
                          <Text className="text-gray-600 text-sm">{order.complaintReason}</Text>
                          {order.complaintDate && (
                            <Text className="text-gray-400 text-xs mt-1">Filed on: {order.complaintDate}</Text>
                          )}
                        </View>
                      )}

                      <View className="flex-row gap-2 mt-4">
                        {activeTab === 'ongoing' && (
                          <>
                            <TouchableOpacity
                              onPress={() => handleCancelOrder(order.id)}
                              className="flex-1 bg-red-500 py-2 px-4 rounded-lg"
                            >
                              <Text className="text-white text-center font-medium">Cancel Order</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleComplaint(order.id)}
                              className="flex-1 bg-orange-400 py-2 px-4 rounded-lg"
                            >
                              <Text className="text-white text-center font-medium">File Complaint</Text>
                            </TouchableOpacity>
                          </>
                        )}

                        {activeTab === 'completed' && (
                          <TouchableOpacity
                            onPress={() => handleComplaint(order.id)}
                            className="flex-1 bg-orange-400 py-2 px-4 rounded-lg"
                          >
                            <Text className="text-white text-center font-medium">File Complaint</Text>
                          </TouchableOpacity>
                        )}

                        {activeTab === 'complaints' && (
                          <TouchableOpacity
                            onPress={handleOpenEmail}
                            className="flex-1 bg-blue-500 py-2 px-4 rounded-lg"
                          >
                            <Text className="text-white text-center font-medium">Open Email</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </Animated.View>
                  )}
                </Animated.View>
              );
            })
          ) : (
            <View className="bg-white rounded-xl p-8 border border-gray-100">
              <Text className="text-center text-gray-600 text-lg">
                No {activeTab} orders found
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}