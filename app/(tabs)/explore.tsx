// app/(tabs)/explore.tsx (Complete Updated Version)
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import RealtimeSearch from '../../components/RealtimeSearch';
import ProductCard from '../../components/ui/ProductCard';

// Define types
interface SearchResults {
  products: string[];
  category: string;
  filters: Record<string, string[]>;
  searchTerm: string;
}

const products = [
  {
    id: "1",
    name: '8" Tactical Boot',
    brand: "Reebok",
    category: "Footwear",
    type: "Boots",
    color: "Brown",
    size: "M",
    gender: "Men",
    material: "Leather",
    price: "$100 - $200",
    rating: "5 Stars",
    availability: "In Stock",
    image: require("../../assets/images/boot.png"),
  },
  {
    id: "2",
    name: "Combat Gloves",
    brand: "Nike",
    category: "Accessories",
    type: "Gloves",
    color: "Black",
    size: "L",
    gender: "Unisex",
    material: "Waterproof",
    price: "$50 - $100",
    rating: "4 Stars",
    availability: "In Stock",
    image: require("../../assets/images/boot.png"),
  },
  {
    id: "3",
    name: "Training Pants",
    brand: "Under Armour",
    category: "Uniforms",
    type: "Pants & Shorts",
    color: "Green",
    size: "XL",
    gender: "Men",
    material: "12 Inch",
    price: "$50 - $100",
    rating: "3 Stars",
    availability: "Pre-Order",
    image: require("../../assets/images/boot.png"),
  },
  {
    id: "4",
    name: "Tactical Cap",
    brand: "Adidas",
    category: "Accessories",
    type: "Caps",
    color: "Tan",
    size: "M",
    gender: "Unisex",
    material: "6 Inch",
    price: "$0 - $50",
    rating: "5 Stars",
    availability: "In Stock",
    image: require("../../assets/images/boot.png"),
  },
  {
    id: "5",
    name: "Athletic Tank",
    brand: "Puma",
    category: "Uniforms",
    type: "Tanks",
    color: "Blue",
    size: "S",
    gender: "Women",
    material: "100% Cotton",
    price: "$50 - $100",
    rating: "4 Stars",
    availability: "In Stock",
    image: require("../../assets/images/boot.png"),
  },
  {
    id: "6",
    name: "Lightweight Running Shoes",
    brand: "Nike",
    category: "Footwear",
    type: "Shoes",
    color: "White",
    size: "L",
    gender: "Unisex",
    material: "11 Inch",
    price: "$100 - $200",
    rating: "5 Stars",
    availability: "Out of Stock",
    image: require("../../assets/images/boot.png"),
  },
  {
    id: "7",
    name: "Tactical Jacket",
    brand: "Under Armour",
    category: "Uniforms",
    type: "Outerwear",
    color: "Black",
    size: "XL",
    gender: "Men",
    material: "10 Inch",
    price: "$200+",
    rating: "5 Stars",
    availability: "In Stock",
    image: require("../../assets/images/boot.png"),
  },
  {
    id: "8",
    name: "Tactical Vest",
    brand: "5.11",
    category: "Accessories",
    type: "Plates",
    color: "Black",
    size: "L",
    gender: "Unisex",
    material: "Waterproof",
    price: "$200+",
    rating: "5 Stars",
    availability: "In Stock",
    image: require("../../assets/images/boot.png"),
  },
  {
    id: "9",
    name: "Work Boots",
    brand: "Ariat",
    category: "Footwear",
    type: "Boots",
    color: "Brown",
    size: "XL",
    gender: "Men",
    material: "Leather",
    price: "$100 - $200",
    rating: "4 Stars",
    availability: "In Stock",
    image: require("../../assets/images/boot.png"),
  },
  {
    id: "10",
    name: "Utility Pouch",
    brand: "Belleville",
    category: "Accessories",
    type: "Pouches",
    color: "Green",
    size: "M",
    gender: "Unisex",
    material: "100% Cotton",
    price: "$0 - $50",
    rating: "4 Stars",
    availability: "In Stock",
    image: require("../../assets/images/boot.png"),
  },
];

export default function Explore() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [initialSearchTerm, setInitialSearchTerm] = useState<string>('');
  const [initialCategory, setInitialCategory] = useState<string>('');

  // Extract the specific params to avoid object recreation
  const {
    searchResults: searchResultsParam,
    selectedCategory: selectedCategoryParam,
    searchTerm,
    globalSearch,
    searchType
  } = params;

  // Handle search results from the RealtimeSearch component
  const handleSearchResults = useCallback((results: SearchResults) => {
    setSearchResults(results);

    // Filter products based on search results
    let filtered = products;

    // Apply search term filter (more flexible matching)
    if (results.searchTerm && results.searchTerm.trim() !== '') {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(results.searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(results.searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(results.searchTerm.toLowerCase()) ||
        product.type.toLowerCase().includes(results.searchTerm.toLowerCase()) ||
        product.material.toLowerCase().includes(results.searchTerm.toLowerCase()) ||
        product.color.toLowerCase().includes(results.searchTerm.toLowerCase())
      );
    }

    // Apply category filter (map category names properly) - only if category is selected
    if (results.category && results.category !== 'Brands' && results.category !== '') {
      const categoryMap: Record<string, string> = {
        'Footwear': 'Footwear',
        'Uniforms': 'Uniforms',
        'Accessories': 'Accessories'
      };

      const mappedCategory = categoryMap[results.category];
      if (mappedCategory) {
        filtered = filtered.filter(product =>
          product.category.toLowerCase() === mappedCategory.toLowerCase()
        );
      }
    }

    // Apply additional filters
    Object.entries(results.filters).forEach(([filterCategory, filterValues]) => {
      if (filterValues.length > 0) {
        filtered = filtered.filter(product => {
          return filterValues.some(value => {
            const lowerValue = value.toLowerCase();
            return (
              product.brand.toLowerCase().includes(lowerValue) ||
              product.type.toLowerCase().includes(lowerValue) ||
              product.material.toLowerCase().includes(lowerValue) ||
              product.color.toLowerCase().includes(lowerValue) ||
              product.size.toLowerCase().includes(lowerValue) ||
              product.name.toLowerCase().includes(lowerValue)
            );
          });
        });
      }
    });

    setFilteredProducts(filtered);
  }, []);

  // Handle category filtering from homepage navigation
  const handleCategoryFilter = useCallback((categoryTitle: string) => {
    let filtered = products;

    // Map category titles to product categories
    const categoryMap: Record<string, string> = {
      'Footwear': 'Footwear',
      'Clothing': 'Uniforms',
      'Accesories': 'Accessories', // Note: keeping the typo from original
      'Brands': '' // Show all for brands
    };

    const productCategory = categoryMap[categoryTitle];

    if (productCategory) {
      filtered = products.filter(product =>
        product.category.toLowerCase() === productCategory.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
    setSelectedCategory(categoryTitle);
  }, []);

  // Handle global search from homepage
  const handleGlobalSearch = useCallback((searchTerm: string) => {
    let filtered = products;

    if (searchTerm && searchTerm.trim() !== '') {
      filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.color.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
    setSearchResults({
      products: filtered.map(p => p.name),
      category: '',
      filters: {},
      searchTerm: searchTerm
    });
  }, []);

  // Handle incoming navigation parameters
  useEffect(() => {
    // Handle search results from homepage (legacy support)
    if (searchResultsParam && typeof searchResultsParam === 'string') {
      try {
        const results = JSON.parse(searchResultsParam);
        setSearchResults(results);
        handleSearchResults(results);
      } catch (error) {
        console.error('Error parsing search results:', error);
      }
    }
  }, [searchResultsParam, handleSearchResults]);

  useEffect(() => {
    // Handle category selection from homepage
    if (selectedCategoryParam && typeof selectedCategoryParam === 'string') {
      const category = selectedCategoryParam;

      // Map homepage categories to search component categories
      const categoryMap: Record<string, string> = {
        'Footwear': 'Footwear',
        'Clothing': 'Uniforms',
        'Accesories': 'Accessories',
        'Brands': 'Brands'
      };

      const mappedCategory = categoryMap[category] || category;

      // Set the initial category for the search component
      setInitialCategory(mappedCategory);
      setSelectedCategory(category);

      // Filter products but don't show filters initially
      handleCategoryFilter(category);
      // setShowFilters(true); // Removed - filters only show when icon is clicked
    }
  }, [selectedCategoryParam, handleCategoryFilter]);

  useEffect(() => {
    // Handle global search from homepage
    if (globalSearch && typeof globalSearch === 'string' && searchType === 'global') {
      setInitialSearchTerm(globalSearch);
      handleGlobalSearch(globalSearch);
      // setShowFilters(true); // Removed - filters only show when icon is clicked
    }
  }, [globalSearch, searchType, handleGlobalSearch]);

  useEffect(() => {
    // Handle direct navigation with search term (legacy)
    if (searchTerm === 'search_applied') {
      setShowFilters(true);
    }
  }, [searchTerm]);

  // Toggle filters visibility
  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Clear search results
  const handleClearResults = () => {
    setSearchResults(null);
    setSelectedCategory('');
    setInitialCategory('');
    setInitialSearchTerm('');
    setFilteredProducts(products);
    setShowFilters(false); // Also hide filters when clearing
  };

  // Get search type for display
  const getSearchType = () => {
    if (searchType === 'global') return 'Global Search';
    if (selectedCategory) return `Category: ${selectedCategory}`;
    if (searchResults?.category) return `Category: ${searchResults.category}`;
    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 py-3 bg-white border-b border-gray-100">
        <Text className="text-xl font-bold text-center text-gray-900">
          Explore
        </Text>
      </View>

      {/* Integrated RealtimeSearch Component */}
      <RealtimeSearch
        onSearchResults={handleSearchResults}
        showFilters={showFilters}
        onToggleFilters={handleToggleFilters}
        initialCategory={initialCategory}
        initialSearchTerm={initialSearchTerm}
        mode="explore"
      />

      {/* Show search results summary */}
      {(searchResults || selectedCategory) && (
        <Animated.View entering={FadeIn} className="px-4 mb-4">
          <View className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="font-bold text-blue-900 mb-1">
                  {getSearchType() || 'Search Results'}
                </Text>
                <Text className="text-blue-800 text-sm">
                  Found {filteredProducts.length} products
                  {searchResults?.searchTerm && ` for "${searchResults.searchTerm}"`}
                  {searchResults?.category && ` in ${searchResults.category}`}
                </Text>
                {Object.keys(searchResults?.filters || {}).length > 0 && (
                  <Text className="text-blue-700 text-xs mt-1">
                    {Object.values(searchResults?.filters || {}).flat().length} filters applied
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={handleClearResults}
                className="bg-blue-100 px-3 py-1 rounded-full"
              >
                <Text className="text-blue-700 text-sm font-medium">Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      )}

      {/* Results count */}
      <View className="px-4 py-2">
        <Text className="text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </Text>
      </View>

      {/* Product grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard item={item} />
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="search" size={64} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg font-medium mt-4">No products found</Text>
            <Text className="text-gray-400 text-sm mt-2 text-center">
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}