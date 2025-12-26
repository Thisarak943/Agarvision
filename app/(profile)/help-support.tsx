import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import Header from '../../components/ui/Header';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon: string;
  category: 'scan' | 'quality' | 'export' | 'account' | 'technical' | 'general';
  tags: string[];
}

/* ---------------------------
   Search Bar
---------------------------- */
const SearchBar = ({
  searchQuery,
  onSearchChange,
}: {
  searchQuery: string;
  onSearchChange: (text: string) => void;
}) => (
  <View className="mb-5">
    <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3">
      <Ionicons name="search" size={20} color="#6b7280" />
      <TextInput
        className="flex-1 text-base text-gray-700 ml-3"
        placeholder="Search (e.g., grade, scan, export, camera)"
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

/* ---------------------------
   Category Filter
---------------------------- */
const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
}: {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}) => {
  const categories = [
    { id: 'all', name: 'All', icon: 'apps-outline' },
    { id: 'scan', name: 'Scan', icon: 'camera-outline' },
    { id: 'quality', name: 'Quality', icon: 'ribbon-outline' },
    { id: 'export', name: 'Export', icon: 'globe-outline' },
    { id: 'technical', name: 'Technical', icon: 'construct-outline' },
    { id: 'account', name: 'Account', icon: 'person-outline' },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-5"
      contentContainerStyle={{ paddingHorizontal: 24 }}
    >
      <View className="flex-row" style={{ gap: 12 }}>
        {categories.map((c) => (
          <TouchableOpacity
            key={c.id}
            onPress={() => onCategoryChange(c.id)}
            className={`flex-row items-center px-4 py-2 rounded-full border ${
              selectedCategory === c.id
                ? 'bg-primary border-primary'
                : 'bg-white border-gray-200'
            }`}
          >
            <Ionicons
              name={c.icon as any}
              size={16}
              color={selectedCategory === c.id ? 'white' : '#6b7280'}
            />
            <Text
              className={`ml-2 text-sm font-medium ${
                selectedCategory === c.id ? 'text-white' : 'text-gray-700'
              }`}
            >
              {c.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

/* ---------------------------
   Expandable FAQ card
---------------------------- */
const FAQItemCard = ({
  item,
  isExpanded,
  onToggle,
}: {
  item: FAQItem;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const rotateValue = useSharedValue(0);
  const heightValue = useSharedValue(0);

  useEffect(() => {
    rotateValue.value = withSpring(isExpanded ? 180 : 0);
    heightValue.value = withTiming(isExpanded ? 1 : 0, { duration: 260 });
  }, [isExpanded]);

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateValue.value}deg` }],
  }));

  const expandStyle = useAnimatedStyle(() => ({
    opacity: heightValue.value,
    maxHeight: heightValue.value * 220,
  }));

  const badgeBg =
    item.category === 'scan'
      ? 'bg-blue-100'
      : item.category === 'quality'
      ? 'bg-green-100'
      : item.category === 'export'
      ? 'bg-purple-100'
      : item.category === 'technical'
      ? 'bg-yellow-100'
      : item.category === 'account'
      ? 'bg-red-100'
      : 'bg-gray-100';

  const badgeColor =
    item.category === 'scan'
      ? '#3b82f6'
      : item.category === 'quality'
      ? '#10b981'
      : item.category === 'export'
      ? '#8b5cf6'
      : item.category === 'technical'
      ? '#f59e0b'
      : item.category === 'account'
      ? '#ef4444'
      : '#6b7280';

  return (
    <TouchableOpacity
      onPress={onToggle}
      className="bg-white border border-gray-200 rounded-xl p-4 mb-3"
      activeOpacity={0.9}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 mr-3">
          <View className="flex-row items-center mb-2">
            <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${badgeBg}`}>
              <Ionicons name={item.icon as any} size={16} color={badgeColor} />
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

/* ---------------------------
   FAQ Section
---------------------------- */
const FAQSection = ({
  faqItems,
  searchQuery,
  selectedCategory,
  expandedItems,
  onToggleExpand,
  showAll,
  onViewAll,
}: {
  faqItems: FAQItem[];
  searchQuery: string;
  selectedCategory: string;
  expandedItems: string[];
  onToggleExpand: (id: string) => void;
  showAll: boolean;
  onViewAll: () => void;
}) => {
  const filtered = faqItems.filter((item) => {
    const q = searchQuery.toLowerCase().trim();

    const matchesSearch =
      q === '' ||
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q));

    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const display = searchQuery || showAll ? filtered : filtered.slice(0, 4);
  const hasMore = filtered.length > 4;

  if (filtered.length === 0) {
    return (
      <View className="bg-white border border-gray-200 rounded-xl p-8 items-center justify-center mb-6">
        <Ionicons name="help-circle-outline" size={48} color="#d1d5db" />
        <Text className="text-lg font-semibold text-gray-500 mt-4 text-center">
          No results found
        </Text>
        <Text className="text-sm text-gray-400 mt-2 text-center">
          Try a different keyword or category
        </Text>
      </View>
    );
  }

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-gray-900">
          {searchQuery ? `Results (${filtered.length})` : 'Frequently Asked'}
        </Text>

        {!searchQuery && hasMore && (
          <TouchableOpacity onPress={onViewAll}>
            <Text className="text-sm text-primary font-medium">
              {showAll ? 'Show Less' : 'View All'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {display.map((item) => (
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
              View {filtered.length - 4} More
            </Text>
            <Ionicons name="chevron-down" size={16} color="#2563eb" />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

/* ---------------------------
   Contact Section
---------------------------- */
const ContactSection = ({
  subject,
  description,
  onSubjectChange,
  onDescriptionChange,
  onSend,
  onCall,
  onEmail,
}: {
  subject: string;
  description: string;
  onSubjectChange: (t: string) => void;
  onDescriptionChange: (t: string) => void;
  onSend: () => void;
  onCall: () => void;
  onEmail: () => void;
}) => (
  <View className="mb-8">
    <Text className="text-lg font-semibold text-gray-900 mb-2">Need more help?</Text>
    <Text className="text-sm text-gray-600 leading-5 mb-5">
      Send a message or contact our support team.
    </Text>

    <TextInput
      className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-700 mb-4"
      placeholder="Subject (e.g., wrong grade / camera issue)"
      placeholderTextColor="#9ca3af"
      value={subject}
      onChangeText={onSubjectChange}
    />

    <TextInput
      className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-700 mb-5 min-h-[120px]"
      placeholder="Describe the issue (include resin type, lighting, phone model if needed)"
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
        onPress={onSend}
      >
        <Text className="text-white text-base font-semibold">Send Message</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-1 bg-white border border-gray-200 rounded-lg py-3.5 items-center justify-center flex-row"
        onPress={onEmail}
      >
        <Ionicons name="mail-outline" size={16} color="#111827" />
        <Text className="text-gray-900 text-base font-semibold ml-1.5">Email</Text>
      </TouchableOpacity>
    </View>

    <TouchableOpacity
      className="mt-3 bg-white border border-gray-200 rounded-lg py-3.5 items-center justify-center flex-row"
      onPress={onCall}
    >
      <Ionicons name="call-outline" size={16} color="#111827" />
      <Text className="text-gray-900 text-base font-semibold ml-1.5">Call Support</Text>
    </TouchableOpacity>
  </View>
);

/* ---------------------------
   Main Screen
---------------------------- */
export default function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showAllFAQs, setShowAllFAQs] = useState(false);

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(22);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 550 });
    translateY.value = withTiming(0, { duration: 550 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const faqItems: FAQItem[] = useMemo(
    () => [
      {
        id: '1',
        question: 'How do I scan resin/chips correctly for best accuracy?',
        answer:
          'Use bright natural light, keep the sample in focus, and fill the frame (avoid background clutter). Hold the phone steady and take 1–3 clear shots.',
        icon: 'camera-outline',
        category: 'scan',
        tags: ['scan', 'camera', 'image', 'accuracy', 'lighting'],
      },
      {
        id: '2',
        question: 'What do Premium / Grade A / Grade B mean?',
        answer:
          'These grades indicate predicted quality based on the model’s learned patterns. Premium is highest, then Grade A, then Grade B. Always verify with expert checks if exporting.',
        icon: 'ribbon-outline',
        category: 'quality',
        tags: ['premium', 'grade a', 'grade b', 'quality', 'grading'],
      },
      {
        id: '3',
        question: 'Why is my result low confidence?',
        answer:
          'Low confidence can happen due to blur, poor lighting, mixed samples, or unusual resin types. Try retaking the photo with better lighting and a clean background.',
        icon: 'alert-circle-outline',
        category: 'scan',
        tags: ['confidence', 'low', 'blur', 'lighting', 'retake'],
      },
      {
        id: '4',
        question: 'What is export readiness in the app?',
        answer:
          'Export readiness is a guidance score/label that combines quality prediction with practical checks (consistency, moisture/cleanliness, packaging readiness). It is not a legal certification.',
        icon: 'globe-outline',
        category: 'export',
        tags: ['export', 'readiness', 'packaging', 'moisture', 'checklist'],
      },
      {
        id: '5',
        question: 'The app shows wrong grade sometimes. What should I do?',
        answer:
          'Try better lighting, closer framing, and scan from multiple angles. If still wrong, submit a report via support with your photo + details so we can improve the dataset.',
        icon: 'bug-outline',
        category: 'technical',
        tags: ['wrong', 'grade', 'bug', 'report', 'improve'],
      },
      {
        id: '6',
        question: 'Can I use the app without creating an account?',
        answer:
          'Some features may work without an account, but saving history, exporting reports, and personalized settings usually require login.',
        icon: 'person-outline',
        category: 'account',
        tags: ['account', 'login', 'history', 'settings'],
      },
      {
        id: '7',
        question: 'Camera not opening / black screen issue',
        answer:
          'Check permissions (Camera access), restart the app, and try again. If you use Android, also check battery optimization restrictions for the app.',
        icon: 'construct-outline',
        category: 'technical',
        tags: ['camera', 'permission', 'black screen', 'android', 'ios'],
      },
      {
        id: '8',
        question: 'How do I contact AgarVision support?',
        answer:
          'You can email support or call directly from this page. Include your issue, screenshots, and phone model for faster help.',
        icon: 'chatbubble-ellipses-outline',
        category: 'general',
        tags: ['support', 'contact', 'email', 'call'],
      },
    ],
    []
  );

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSend = () => {
    if (!subject.trim() || !description.trim()) {
      Alert.alert('Missing Information', 'Please fill Subject and Description.');
      return;
    }
    Alert.alert(
      'Submitted',
      'Thanks! Our team will review your message and respond soon.',
      [
        {
          text: 'OK',
          onPress: () => {
            setSubject('');
            setDescription('');
          },
        },
      ]
    );
  };

  const SUPPORT_PHONE = 'tel:+1234567890';
  const SUPPORT_EMAIL = 'mailto:support@agarvision.com';

  const handleCall = () => {
    Linking.openURL(SUPPORT_PHONE).catch(() =>
      Alert.alert('Error', 'Unable to make phone call')
    );
  };

  const handleEmail = () => {
    Linking.openURL(SUPPORT_EMAIL).catch(() =>
      Alert.alert('Error', 'Unable to open email app')
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title="Help & Support" />

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
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                How can we help?
              </Text>
              <Text className="text-base text-gray-600 mb-6">
                Search FAQs or contact AgarVision support.
              </Text>

              <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={(c) => {
                  setSelectedCategory(c);
                  setShowAllFAQs(false);
                }}
              />

              <FAQSection
                faqItems={faqItems}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                expandedItems={expandedItems}
                onToggleExpand={toggleExpand}
                showAll={showAllFAQs}
                onViewAll={() => setShowAllFAQs((p) => !p)}
              />

              <ContactSection
                subject={subject}
                description={description}
                onSubjectChange={setSubject}
                onDescriptionChange={setDescription}
                onSend={handleSend}
                onCall={handleCall}
                onEmail={handleEmail}
              />
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
