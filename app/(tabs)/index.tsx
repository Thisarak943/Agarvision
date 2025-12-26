// app/(tabs)/index.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUser } from '../../contexts/UserContext';
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import NotificationSlideView from '../views/NotificationSlideView';
import SettingsSlideView from '../views/SettingsSlideView';

import GlobalSearch from '../../components/GlobalSearch';
import CategoryCard from '../../components/ui/CategoryCard';
import ServiceCard from '../../components/ui/ServiceCard';
import SpecialServiceCard from '../../components/ui/SpecialServiceCard';

import SpecialServiceModal from '../../components/modals/SpecialServiceModal';

// NEW: real article content
import MarketPricesArticle from '../../components/articles/MarketPricesArticle';
import TreeDiseasesArticle from '../../components/articles/TreeDiseasesArticle';
import ResinQualityArticle from '../../components/articles/ResinQualityArticle';

// ----- Types -----
interface SearchResult {
  id: string;
  type: 'product' | 'service' | 'special_service' | 'category';
  title: string;
  subtitle?: string;
  description?: string;
  image?: any;
  category?: string;
  navigationParams?: any;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  read?: boolean;
}

type SectionKey = 'products' | 'services' | 'articles';

// ----- Component -----
export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  // Read ?section=products|services|articles
  const params = useLocalSearchParams<{ section?: string | string[] }>();
  const section = useMemo(() => {
    const raw = Array.isArray(params.section) ? params.section[0] : params.section;
    if (raw === 'products' || raw === 'services' || raw === 'articles') return raw as SectionKey;
    return undefined;
  }, [params.section]);

  const [activeSSModal, setActiveSSModal] = useState<string | null>(null);
  const openSSModal = (service: string) => setActiveSSModal(service);
  const closeSSModal = () => setActiveSSModal(null);

  const [showNotificationSlide, setShowNotificationSlide] = useState(false);
  const [showSettingsSlide, setShowSettingsSlide] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Prediction Completed',
      message: 'Your agarwood scan result is ready. Tap to view the result.',
      type: 'success',
      read: false,
    },
    {
      id: 2,
      title: 'Grade Detected: Premium',
      message: 'High resin density detected. Export-ready quality indicated.',
      type: 'info',
      read: false,
    },
    {
      id: 3,
      title: 'Export Readiness Warning',
      message: 'Moisture seems high. Drying recommended before packaging.',
      type: 'warning',
      read: false,
    },
    {
      id: 4,
      title: 'Capture Tip',
      message: 'Use natural light + plain background for best accuracy.',
      type: 'info',
      read: true,
    },
  ]);

  // Animations
  const headerOpacity = useSharedValue(0);
  const searchOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
    searchOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value }));
  const searchAnimatedStyle = useAnimatedStyle(() => ({ opacity: searchOpacity.value }));

  // ----- Scroll-to-section plumbing -----
  const scrollRef = useRef<ScrollView>(null);
  const [contentReady, setContentReady] = useState(false);
  const yOffsets = useRef<{ products?: number; services?: number; articles?: number }>({});

  const onProductsLayout = (e: any) => { yOffsets.current.products = e.nativeEvent.layout.y; };
  const onServicesLayout = (e: any) => { yOffsets.current.services = e.nativeEvent.layout.y; };
  const onArticlesLayout = (e: any) => { yOffsets.current.articles = e.nativeEvent.layout.y; };

  const onContentSizeChange = () => { if (!contentReady) setContentReady(true); };

  const scrollToSection = (key?: SectionKey) => {
    if (!key) return;
    const y = yOffsets.current[key] ?? 0;
    scrollRef.current?.scrollTo({ y, animated: true });
  };

  useEffect(() => {
    if (contentReady) scrollToSection(section);
  }, [contentReady, section]);

  // ----- Data -----
  const categories = [
    { title: 'Chips', icon: require('../../assets/icons/chips.png') },
    { title: 'Oud Oil', icon: require('../../assets/icons/oil.png') },
    { title: 'Perfumes', icon: require('../../assets/icons/perfume.png') },
    { title: 'Incence', icon: require('../../assets/icons/incence.png') },
  ];

  // ✅ SERVICES NOW HAVE ROUTES (REDIRECT)
  const services = [
    {
      title: 'Chips & Resin Grading',
      description: 'Efficient, reliable drives',
      icon: require('../../assets/icons/good.png'),
      route: '/(services)/resin-grading',
    },
    {
      title: 'Disease Detection',
      description: 'Durable workwear solutions',
      icon: require('../../assets/icons/leda.png'),
      route: '/(services)/disease-detection',
    },
    {
      title: 'Market Price Forecasting',
      description: 'Protection with comfort',
      icon: require('../../assets/icons/mprice.png'),
      route: '/(services)/market-price',
    },
    {
      title: 'Stage Classification',
      description: 'Sharp, precise stitching',
      icon: require('../../assets/icons/data.png'),
      route: '/(services)/stage-classification',
    },
  ];

  // (Articles)
  const specialServices = [
    {
      title: 'Global Agarwood Market Prices on the Rise',
      description: 'Latest trends and price shifts worldwide.',
      image: require('../../assets/images/market.jpg'),
      images: [
        require('../../assets/images/marketp1.jpg'),
        require('../../assets/images/globalp3.jpg'),
        require('../../assets/images/marketp2.jpg'),
      ],
      specifications: [
        { label: 'Coverage', value: 'Global' },
        { label: 'Focus', value: 'Price indices, trade flows' },
        { label: 'Updated', value: 'Monthly snapshot' },
      ],
    },
    {
      title: 'Common Agarwood Tree Diseases and Prevention Tips',
      description: 'Identify and protect trees from infections.',
      image: require('../../assets/images/diesease.jpg'),
      images: [
        require('../../assets/images/des2.jpg'),
        require('../../assets/images/des3.jpg'),
        require('../../assets/images/des1.jpg'),
      ],
      specifications: [
        { label: 'Scope', value: 'Cultivation & smallholders' },
        { label: 'Focus', value: 'Symptoms, prevention, treatment' },
        { label: 'Seasonality', value: 'Monsoon risk alerts' },
      ],
    },
    {
      title: 'Resin Quality Boost Through New Cultivation Methods',
      description: 'Research shows improved resin yield naturally.',
      image: require('../../assets/images/quality.jpg'),
      images: [
        require('../../assets/images/res3.jpg'),
        require('../../assets/images/res2.jpg'),
        require('../../assets/images/res1.jpg'),
      ],
      specifications: [
        { label: 'Method', value: 'Low-stress induction' },
        { label: 'Trial Length', value: '18–24 months' },
        { label: 'Outcome', value: 'Higher density, cleaner smoke' },
      ],
    },
  ];

  const displayUser = user || { firstname: 'Test', lastname: 'User' };

  // Map category titles -> slugs for (products)/[category]
  const titleToSlug: Record<string, string> = {
    Chips: 'chips',
    'Oud Oil': 'oud-oil',
    Perfumes: 'perfumes',
    Incence: 'incence',
  };

  // ✅ Search selection updated: when selecting a service, redirect
  const handleSearchResultSelect = (result: SearchResult) => {
    switch (result.type) {
      case 'service': {
        const found = services.find((s) => s.title === result.title);
        if (found?.route) router.push(found.route as any);
        break;
      }
      case 'special_service':
        openSSModal(result.title);
        break;
      case 'category':
        scrollToSection('products');
        break;
      default:
        break;
    }
  };

  // Helper to render the correct Article body in the modal
  const renderArticleBody = () => {
    switch (activeSSModal) {
      case 'Global Agarwood Market Prices on the Rise':
        return <MarketPricesArticle />;
      case 'Common Agarwood Tree Diseases and Prevention Tips':
        return <TreeDiseasesArticle />;
      case 'Resin Quality Boost Through New Cultivation Methods':
        return <ResinQualityArticle />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <Animated.View style={headerAnimatedStyle} className="px-6 py-4 bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-primary rounded-full justify-center items-center mr-3">
              <Ionicons name="person" size={20} color="white" />
            </View>
            <Text className="text-lg font-semibold text-gray-900">
              Hello {displayUser?.firstname} {displayUser?.lastname}!
            </Text>
          </View>
          <View className="flex-row">
            <TouchableOpacity onPress={() => setShowNotificationSlide(true)} className="mr-4">
              <Ionicons name="notifications" size={24} color="#10B981" />
              {notifications.filter(n => !n.read).length > 0 && (
                <View className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSettingsSlide(true)}>
              <Ionicons name="settings" size={24} color="#10B981" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        ref={scrollRef}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onContentSizeChange={onContentSizeChange}
      >
        {/* Global Search */}
        <Animated.View style={searchAnimatedStyle}>
          <GlobalSearch onResultSelect={handleSearchResultSelect} />
        </Animated.View>

        {/* ===== PRODUCTS ===== */}
        <View className="px-6 mb-6" onLayout={onProductsLayout}>
          <Text className="text-2xl font-bold text-primary mb-4">Agarwood Products</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16, paddingLeft: 2, paddingBottom: 2, paddingTop: 2 }}
          >
            {categories.map((category, index) => (
              <Animated.View
                key={category.title}
                entering={FadeIn.delay(300 + index * 100)}
                className="mr-3 shadow-sm"
              >
                <CategoryCard
                  title={category.title}
                  icon={category.icon}
                  onPress={() => {
                    const slug = titleToSlug[category.title];
                    if (slug) {
                      router.push({ pathname: '/(products)/[category]', params: { category: slug } });
                    }
                  }}
                  gradient={['#BDF9E5', '#FFFFFF']}
                />
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* ===== SERVICES ===== */}
        <View className="px-6 mb-6 mt-3" onLayout={onServicesLayout}>
          <Text className="text-2xl font-bold text-primary mb-4">Main Services</Text>

          {services.map((service) => (
            <Animated.View key={service.title} entering={FadeInUp.delay(500)}>
              <ServiceCard
                title={service.title}
                description={service.description}
                icon={service.icon}
                // ✅ REDIRECT HERE
                onPress={() => router.push(service.route as any)}
                accentColor="#10B981"
                overlayIcon="camera-outline"
                gradient={['#E8E8E8', '#FFFFFF']}
              />
            </Animated.View>
          ))}
        </View>

        {/* ===== ARTICLES ===== */}
        <View className="px-6 mb-6 mt-3" onLayout={onArticlesLayout}>
          <Text className="text-2xl font-bold text-primary mb-4">Articles</Text>
          {specialServices.map((item, index) => (
            <Animated.View key={item.title} entering={FadeInUp.delay(500 + index * 200)}>
              <SpecialServiceCard
                title={item.title}
                description={item.description}
                image={item.image}
                badge="Article"
                featured={true}
                onPress={() => openSSModal(item.title)}
              />
            </Animated.View>
          ))}
        </View>

        {/* Article Modal */}
        {activeSSModal && (
          <SpecialServiceModal
            visible={true}
            onClose={closeSSModal}
            title={activeSSModal}
            images={
              activeSSModal === 'Global Agarwood Market Prices on the Rise' ? specialServices[0].images
              : activeSSModal === 'Common Agarwood Tree Diseases and Prevention Tips' ? specialServices[1].images
              : specialServices[2].images
            }
            specifications={
              activeSSModal === 'Global Agarwood Market Prices on the Rise' ? specialServices[0].specifications
              : activeSSModal === 'Common Agarwood Tree Diseases and Prevention Tips' ? specialServices[1].specifications
              : specialServices[2].specifications
            }
            content={renderArticleBody()}
          />
        )}

        <View className="h-20" />
      </ScrollView>

      {/* Notifications & Settings */}
      <NotificationSlideView
        visible={showNotificationSlide}
        onClose={() => setShowNotificationSlide(false)}
        notifications={notifications as any}
        onNotificationRead={(id) =>
          setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)))
        }
        onNotificationAction={(id, action) => {
          if (action === 'view') Alert.alert('Action', `Viewing details for notification ${id}`);
        }}
        onClearAll={() => setNotifications([])}
      />

      <SettingsSlideView
        visible={showSettingsSlide}
        onClose={() => setShowSettingsSlide(false)}
        onNavigate={(screen) => router.push(screen)}
        onLogout={() => {
          Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: () => router.replace('/(auth)/welcome') },
          ]);
        }}
        userInfo={{ name: 'Thisara Kandage', email: 'thisara@gmail.com' }}
      />
    </SafeAreaView>
  );
}
