import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring
} from 'react-native-reanimated';
import Header from "../../components/ui/Header";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon: string;
  category: 'order' | 'delivery' | 'shipping' | 'payment' | 'account' | 'general';
  tags: string[];
}

// Search Bar Component
const SearchBar = ({ searchQuery, onSearchChange }: { 
  searchQuery: string; 
  onSearchChange: (text: string) => void; 
}) => (
  <View className="mb-6">
    <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3">
      <Ionicons name="search" size={20} color="#6b7280" />
      <TextInput
        className="flex-1 text-base text-gray-700 ml-3"
        placeholder="Search for topics or questions"
        placeholderTextColor="#9ca3af"
        value={searchQuery}
        onChangeText={onSearchChange}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => onSearchChange('')} className="p-1">
          <Ionicons name="close-circle" size={20} color="#6b7280" />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

// Category Filter Component
const CategoryFilter = ({ 
  selectedCategory, 
  onCategoryChange 
}: { 
  selectedCategory: string; 
  onCategoryChange: (category: string) => void; 
}) => {
  const categories = [
    { id: 'all', name: 'All', icon: 'apps-outline' },
    { id: 'order', name: 'Orders', icon: 'bag-handle-outline' },
    { id: 'delivery', name: 'Delivery', icon: 'car-outline' },
    { id: 'shipping', name: 'Shipping', icon: 'airplane-outline' },
    { id: 'payment', name: 'Payment', icon: 'card-outline' },
    { id: 'account', name: 'Account', icon: 'person-outline' }
  ];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="mb-6"
      contentContainerStyle={{ paddingHorizontal: 24 }}
    >
      <View className="flex-row" style={{ gap: 12 }}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => onCategoryChange(category.id)}
            className={`flex-row items-center px-4 py-2 rounded-full border ${
              selectedCategory === category.id
                ? 'bg-primary border-primary'
                : 'bg-white border-gray-200'
            }`}
          >
            <Ionicons 
              name={category.icon as any} 
              size={16} 
              color={selectedCategory === category.id ? 'white' : '#6b7280'} 
            />
            <Text className={`ml-2 text-sm font-medium ${
              selectedCategory === category.id ? 'text-white' : 'text-gray-700'
            }`}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

// Expandable FAQ Item Component
const FAQItemCard = ({ 
  item, 
  isExpanded, 
  onToggle 
}: { 
  item: FAQItem; 
  isExpanded: boolean; 
  onToggle: () => void; 
}) => {
  const rotateValue = useSharedValue(0);
  const heightValue = useSharedValue(0);

  useEffect(() => {
    rotateValue.value = withSpring(isExpanded ? 180 : 0);
    heightValue.value = withTiming(isExpanded ? 1 : 0, { duration: 300 });
  }, [isExpanded]);

  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotateValue.value}deg` }],
    };
  });

  const expandStyle = useAnimatedStyle(() => {
    return {
      opacity: heightValue.value,
      maxHeight: heightValue.value * 200, // Adjust based on content
    };
  });

  return (
    <TouchableOpacity
      onPress={onToggle}
      className="bg-white border border-gray-200 rounded-xl p-4 mb-3"
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 mr-3">
          <View className="flex-row items-center mb-2">
            <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
              item.category === 'order' ? 'bg-blue-100' :
              item.category === 'delivery' ? 'bg-green-100' :
              item.category === 'shipping' ? 'bg-purple-100' :
              item.category === 'payment' ? 'bg-yellow-100' :
              item.category === 'account' ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              <Ionicons 
                name={item.icon as any} 
                size={16} 
                color={
                  item.category === 'order' ? '#3b82f6' :
                  item.category === 'delivery' ? '#10b981' :
                  item.category === 'shipping' ? '#8b5cf6' :
                  item.category === 'payment' ? '#f59e0b' :
                  item.category === 'account' ? '#ef4444' : '#6b7280'
                } 
              />
            </View>
            <Text className="text-base font-semibold text-gray-900 flex-1">
              {item.question}
            </Text>
          </View>
          
          <Animated.View style={expandStyle} className="overflow-hidden">
            <Text className="text-sm text-gray-600 leading-6 mt-2">
              {item.answer}
            </Text>
          </Animated.View>
        </View>
        
        <Animated.View style={rotateStyle}>
          <Ionicons name="chevron-down" size={20} color="#6b7280" />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

// FAQ Section Component
const FAQSection = ({ 
  faqItems, 
  searchQuery, 
  selectedCategory, 
  expandedItems, 
  onToggleExpand,
  showAll,
  onViewAll
}: { 
  faqItems: FAQItem[];
  searchQuery: string;
  selectedCategory: string;
  expandedItems: string[];
  onToggleExpand: (id: string) => void;
  showAll: boolean;
  onViewAll: () => void;
}) => {
  // Filter FAQs based on search and category
  const filteredFAQs = faqItems.filter((item) => {
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Show only first 3 FAQs if not showing all and not searching
  const displayFAQs = (searchQuery || showAll) ? filteredFAQs : filteredFAQs.slice(0, 3);
  const hasMore = filteredFAQs.length > 3;

  if (filteredFAQs.length === 0) {
    return (
      <View className="bg-white border border-gray-200 rounded-xl p-8 items-center justify-center mb-6">
        <Ionicons name="help-circle-outline" size={48} color="#d1d5db" />
        <Text className="text-lg font-semibold text-gray-500 mt-4 text-center">
          No FAQs found
        </Text>
        <Text className="text-sm text-gray-400 mt-2 text-center">
          Try adjusting your search or category filter
        </Text>
      </View>
    );
  }

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-gray-900">
          {searchQuery ? `Search Results (${filteredFAQs.length})` : 'Frequently Asked'}
        </Text>
        {!searchQuery && hasMore && !showAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text className="text-sm text-primary font-medium">View All</Text>
          </TouchableOpacity>
        )}
        {!searchQuery && showAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text className="text-sm text-gray-600 font-medium">Show Less</Text>
          </TouchableOpacity>
        )}
        {searchQuery && (
          <Text className="text-sm text-gray-500">
            {filteredFAQs.length} found
          </Text>
        )}
      </View>

      {displayFAQs.map((item) => (
        <FAQItemCard
          key={item.id}
          item={item}
          isExpanded={expandedItems.includes(item.id)}
          onToggle={() => onToggleExpand(item.id)}
        />
      ))}

      {!searchQuery && !showAll && hasMore && (
        <TouchableOpacity
          onPress={onViewAll}
          className="bg-white border border-gray-200 rounded-xl p-4 items-center justify-center border-dashed"
        >
          <View className="flex-row items-center">
            <Text className="text-base text-primary font-medium mr-2">
              View {filteredFAQs.length - 3} More Questions
            </Text>
            <Ionicons name="chevron-down" size={16} color="#2563eb" />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Contact Form Component
const ContactForm = ({ 
  subject, 
  description, 
  onSubjectChange, 
  onDescriptionChange, 
  onSendMessage, 
  onCallNow 
}: {
  subject: string;
  description: string;
  onSubjectChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
  onSendMessage: () => void;
  onCallNow: () => void;
}) => (
  <View className="mb-6">
    <Text className="text-lg font-semibold text-gray-900 mb-2">
      Still need help?
    </Text>
    <Text className="text-sm text-gray-600 leading-5 mb-6">
      Can't find what you're looking for? Contact our support team and we'll get back to you within 48 hours.
    </Text>

    <TextInput
      className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-700 mb-4"
      placeholder="Subject of your problem"
      placeholderTextColor="#9ca3af"
      value={subject}
      onChangeText={onSubjectChange}
    />

    <TextInput
      className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-700 mb-5 min-h-[120px]"
      placeholder="Describe your problem in detail"
      placeholderTextColor="#9ca3af"
      value={description}
      onChangeText={onDescriptionChange}
      multiline
      numberOfLines={6}
      textAlignVertical="top"
    />

    <View className="flex-row" style={{ gap: 12 }}>
      <TouchableOpacity
        className="flex-1 bg-primary rounded-lg py-3.5 items-center justify-center"
        onPress={onSendMessage}
      >
        <Text className="text-white text-base font-semibold">Send Message</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-1 bg-primary rounded-lg py-3.5 items-center justify-center flex-row"
        onPress={onCallNow}
      >
        <Ionicons name="call" size={16} color="white" />
        <Text className="text-white text-base font-semibold ml-1.5">Call Support</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// Main Component
export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showAllFAQs, setShowAllFAQs] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
    translateY.value = withTiming(0, { duration: 600 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  // Extended FAQ data with comprehensive questions and answers
  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'How do I cancel an existing order?',
      answer: 'You can cancel your order within 2 hours of placing it. Go to "My Orders" in your profile, find the order you want to cancel, and tap "Cancel Order". If the order has already been processed, you may need to contact support.',
      icon: 'bag-handle-outline',
      category: 'order',
      tags: ['cancel', 'order', 'refund', 'stop']
    },
    {
      id: '2',
      question: 'What are the available delivery options?',
      answer: 'We offer several delivery options: Standard delivery (3-5 business days), Express delivery (1-2 business days), and Same-day delivery (available in select cities). Delivery costs vary based on location and speed.',
      icon: 'car-outline',
      category: 'delivery',
      tags: ['delivery', 'shipping', 'fast', 'same day', 'express']
    },
    {
      id: '3',
      question: 'What shipping methods do you offer?',
      answer: 'We provide multiple shipping options including standard ground shipping, expedited shipping, overnight delivery, and international shipping. Shipping costs are calculated based on weight, dimensions, and destination.',
      icon: 'airplane-outline',
      category: 'shipping',
      tags: ['shipping', 'international', 'overnight', 'ground']
    },
    {
      id: '4',
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. All payments are processed securely through encrypted connections.',
      icon: 'card-outline',
      category: 'payment',
      tags: ['payment', 'credit card', 'paypal', 'apple pay', 'secure']
    },
    {
      id: '5',
      question: 'How do I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email and SMS. You can also track your order in real-time by going to "My Orders" in your account and clicking on the specific order.',
      icon: 'location-outline',
      category: 'order',
      tags: ['track', 'tracking', 'order status', 'delivery status']
    },
    {
      id: '6',
      question: 'How do I return or exchange items?',
      answer: 'Items can be returned within 30 days of delivery. Go to "My Orders", select the item you want to return, and follow the return process. We provide free return shipping for defective items.',
      icon: 'return-up-back-outline',
      category: 'order',
      tags: ['return', 'exchange', 'refund', 'defective', 'warranty']
    },
    {
      id: '7',
      question: 'How do I update my account information?',
      answer: 'To update your account details, go to "Profile" > "Account Settings". You can change your personal information, delivery addresses, payment methods, and notification preferences.',
      icon: 'person-outline',
      category: 'account',
      tags: ['account', 'profile', 'personal info', 'settings', 'address']
    },
    {
      id: '8',
      question: 'What if I received a damaged item?',
      answer: 'If you receive a damaged item, please contact us immediately with photos of the damage. We\'ll arrange for a replacement or full refund, and provide a prepaid return label if needed.',
      icon: 'alert-circle-outline',
      category: 'order',
      tags: ['damaged', 'broken', 'defective', 'replacement', 'quality']
    },
    {
      id: '9',
      question: 'Do you offer international shipping?',
      answer: 'Yes, we ship to over 50 countries worldwide. International shipping costs and delivery times vary by destination. Customers are responsible for any customs duties or taxes.',
      icon: 'globe-outline',
      category: 'shipping',
      tags: ['international', 'worldwide', 'customs', 'duties', 'global']
    },
    {
      id: '10',
      question: 'How can I contact customer support?',
      answer: 'You can reach our customer support team 24/7 through live chat, email (support@company.com), or phone (+1-234-567-8900). We typically respond to emails within 4 hours.',
      icon: 'chatbubble-outline',
      category: 'general',
      tags: ['support', 'contact', 'help', 'chat', 'email', 'phone']
    }
  ];

  const handleToggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleViewAll = () => {
    setShowAllFAQs(!showAllFAQs);
  };

  const handleSendMessage = () => {
    if (!subject.trim() || !description.trim()) {
      Alert.alert('Missing Information', 'Please fill in both subject and description fields.');
      return;
    }

    Alert.alert(
      'Message Sent Successfully',
      'Thank you for contacting us! Our support team will review your message and get back to you within 48 hours.',
      [{
        text: 'OK', 
        onPress: () => {
          setSubject('');
          setDescription('');
        }
      }]
    );
  };

  const handleCallNow = () => {
    const phoneNumber = 'tel:+1234567890';
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneNumber);
        } else {
          Alert.alert('Unable to Call', 'Phone calls are not supported on this device. Please try contacting us through email or chat.');
        }
      })
      .catch((err) => console.error('Error opening phone:', err));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title="Help Center" />
      
      <KeyboardAvoidingView 
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6">
            <Animated.View style={animatedStyle} className="py-6">
              {/* Main Title */}
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                How can we help you?
              </Text>
              <Text className="text-base text-gray-600 mb-6">
                Search our FAQ or contact support for quick assistance
              </Text>

              <SearchBar 
                searchQuery={searchQuery} 
                onSearchChange={setSearchQuery} 
              />

              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />

              <FAQSection 
                faqItems={faqItems}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                expandedItems={expandedItems}
                onToggleExpand={handleToggleExpand}
                showAll={showAllFAQs}
                onViewAll={handleViewAll}
              />

              <ContactForm
                subject={subject}
                description={description}
                onSubjectChange={setSubject}
                onDescriptionChange={setDescription}
                onSendMessage={handleSendMessage}
                onCallNow={handleCallNow}
              />
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}