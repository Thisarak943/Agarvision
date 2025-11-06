// components/GlobalSearch.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

// Match the shape your index.tsx expects
interface SearchResult {
  id: string;
  type: 'product' | 'service' | 'special_service' | 'category';
  title: string;
  subtitle?: string;
  description?: string;
  image?: any;            // kept for compatibility; we won't use it
  category?: string;
  navigationParams?: any; // e.g., { category: 'chips' }
}

interface GlobalSearchProps {
  onResultSelect?: (result: SearchResult) => void;
}

const CATEGORY_TO_SLUG: Record<string, string> = {
  'Chips': 'chips',
  'Oud Oil': 'oud-oil',
  'Perfumes': 'perfumes',
  'Incence': 'incence',
};

export default function GlobalSearch({ onResultSelect }: GlobalSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // animation
  const resultsHeight = useSharedValue(0);
  const opacity = useSharedValue(0);

  // ---------- single source of searchable items ----------
  // (no images here to avoid asset path issues)
  const allData: SearchResult[] = [
    // === Agarwood Products (categories) ===
    {
      id: 'cat_chips',
      type: 'category',
      title: 'Chips',
      subtitle: 'Agarwood Products',
      description: 'Resin-dense wood pieces, graded by quality',
      navigationParams: { category: CATEGORY_TO_SLUG['Chips'] },
    },
    {
      id: 'cat_oil',
      type: 'category',
      title: 'Oud Oil',
      subtitle: 'Agarwood Products',
      description: 'Single-origin oud oils and blends',
      navigationParams: { category: CATEGORY_TO_SLUG['Oud Oil'] },
    },
    {
      id: 'cat_perfumes',
      type: 'category',
      title: 'Perfumes',
      subtitle: 'Agarwood Products',
      description: 'Fragrances crafted with oud accords',
      navigationParams: { category: CATEGORY_TO_SLUG['Perfumes'] },
    },
    {
      id: 'cat_incence',
      type: 'category',
      title: 'Incence',
      subtitle: 'Agarwood Products',
      description: 'Incense / bakhour made from agarwood',
      navigationParams: { category: CATEGORY_TO_SLUG['Incence'] },
    },

    // === Main Services === (titles must match exactly what index.tsx expects)
    {
      id: 'srv_grade',
      type: 'service',
      title: 'Chips & Resin Grading',
      subtitle: 'Main Services',
      description: 'Objective grading for chip batches and resin yield',
    },
    {
      id: 'srv_disease',
      type: 'service',
      title: 'Disease Detection',
      subtitle: 'Main Services',
      description: 'Tree health diagnostics and field guidance',
    },
    {
      id: 'srv_market',
      type: 'service',
      title: 'Market Price Forecasting',
      subtitle: 'Main Services',
      description: 'Short-term and seasonal price outlooks',
    },
    {
      id: 'srv_stage',
      type: 'service',
      title: 'Stage Classification',
      subtitle: 'Main Services',
      description: 'Standardized stage assessment & reporting',
    },

    // === Articles (special_service) === (titles must match your modals)
    {
      id: 'art_prices',
      type: 'special_service',
      title: 'Global Agarwood Market Prices on the Rise',
      subtitle: 'Articles',
      description: 'Quarterly movement across grades and regions',
    },
    {
      id: 'art_disease',
      type: 'special_service',
      title: 'Common Agarwood Tree Diseases and Prevention Tips',
      subtitle: 'Articles',
      description: 'Seasonal disease pressure and prevention steps',
    },
    {
      id: 'art_resin',
      type: 'special_service',
      title: 'Resin Quality Boost Through New Cultivation Methods',
      subtitle: 'Articles',
      description: 'Low-stress induction trials & curing discipline',
    },
  ];

  // tiny tokenizer
  const norm = (s: string) =>
    s.toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}\s]/gu, ' ');

  // search
  useEffect(() => {
    const q = searchTerm.trim();
    if (!q) {
      setSearchResults([]);
      setIsExpanded(false);
      resultsHeight.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
      return;
    }

    const qTokens = norm(q).split(/\s+/).filter(Boolean);

    const filtered = allData.filter((item) => {
      const hay = norm(
        `${item.title} ${item.subtitle ?? ''} ${item.description ?? ''} ${item.category ?? ''}`
      );
      // simple AND match
      return qTokens.every((t) => hay.includes(t));
    });

    setSearchResults(filtered.slice(0, 8));
    const hasResults = filtered.length > 0;

    setIsExpanded(hasResults);
    resultsHeight.value = hasResults ? withSpring(1, { damping: 15, stiffness: 150 }) : withTiming(0, { duration: 200 });
    opacity.value = hasResults ? withTiming(1, { duration: 300 }) : withTiming(0, { duration: 200 });
  }, [searchTerm]);

  const resultsAnimatedStyle = useAnimatedStyle(() => ({
    maxHeight: resultsHeight.value * 400,
    opacity: opacity.value,
  }));

  const clearSearch = () => {
    setSearchTerm('');
    setIsExpanded(false);
    Keyboard.dismiss();
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'category': return 'pricetags-outline';
      case 'service': return 'construct-outline';
      case 'special_service': return 'newspaper-outline';
      case 'product': return 'cube-outline';
      default: return 'search-outline';
    }
  };

  const getResultTypeLabel = (type: string) => {
    switch (type) {
      case 'category': return 'Product';
      case 'service': return 'Service';
      case 'special_service': return 'Article';
      case 'product': return 'Product';
      default: return '';
    }
  };

  const handleResultPress = (result: SearchResult) => {
    clearSearch();
    // let the parent (index.tsx) decide what to do:
    // - category: navigate to /products/[category] or scroll to Products
    // - service: open ServiceModal
    // - special_service: open Article modal
    onResultSelect?.(result);
  };

  return (
    <View className="px-6 py-4">
      {/* search bar */}
      <View className="bg-gray-100 rounded-xl flex-row items-center px-4 py-3">
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput
          placeholder="Search products, services, or articles…"
          value={searchTerm}
          onChangeText={setSearchTerm}
          className="flex-1 ml-3 text-gray-900"
          placeholderTextColor="#9CA3AF"
          returnKeyType="search"
          onSubmitEditing={() => {
            if (searchResults.length === 1) handleResultPress(searchResults[0]);
          }}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={clearSearch} className="p-1">
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* results */}
      <Animated.View
        style={resultsAnimatedStyle}
        className="bg-white rounded-xl mt-2 border border-gray-200 overflow-hidden"
      >
        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} className="max-h-96">
          {searchResults.map((result) => (
            <TouchableOpacity
              key={result.id}
              onPress={() => handleResultPress(result)}
              className="flex-row items-center p-4 border-b border-gray-100"
            >
              <View className="w-12 h-12 bg-gray-100 rounded-lg mr-3 items-center justify-center">
                <Ionicons name={getResultIcon(result.type)} size={20} color="#10B981" />
              </View>

              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="font-semibold text-gray-900 mr-2">{result.title}</Text>
                  <View className="bg-emerald-50 px-2 py-1 rounded-full">
                    <Text className="text-xs text-emerald-700">{getResultTypeLabel(result.type)}</Text>
                  </View>
                </View>
                {result.subtitle && <Text className="text-sm text-gray-600">{result.subtitle}</Text>}
                {result.description && <Text className="text-xs text-gray-500">{result.description}</Text>}
              </View>

              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          ))}

          {searchResults.length === 0 && !!searchTerm.trim() && (
            <View className="p-4">
              <Text className="text-sm text-gray-600">No matches. Try “chips”, “market price”, or “disease”.</Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}
