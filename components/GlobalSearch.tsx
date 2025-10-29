// components/GlobalSearch.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
} from 'react-native-reanimated';

// Define search result types
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

interface GlobalSearchProps {
    onResultSelect?: (result: SearchResult) => void;
}

export default function GlobalSearch({ onResultSelect }: GlobalSearchProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);

    // Animation values
    const resultsHeight = useSharedValue(0);
    const opacity = useSharedValue(0);

    // All searchable data
    const allData: SearchResult[] = [
        // Products
        {
            id: 'product_1',
            type: 'product',
            title: '8" Tactical Boot',
            subtitle: 'Reebok',
            description: 'Footwear',
            category: 'Footwear',
            image: require('../assets/images/boot.png'),
            navigationParams: { productId: '1' }
        },
        {
            id: 'product_2',
            type: 'product',
            title: 'Combat Gloves',
            subtitle: 'Nike',
            description: 'Accessories',
            category: 'Accessories',
            image: require('../assets/images/boot.png'),
            navigationParams: { productId: '2' }
        },
        {
            id: 'product_3',
            type: 'product',
            title: 'Training Pants',
            subtitle: 'Under Armour',
            description: 'Uniforms',
            category: 'Uniforms',
            image: require('../assets/images/boot.png'),
            navigationParams: { productId: '3' }
        },
        // Services
        {
            id: 'service_1',
            type: 'service',
            title: 'International VFD',
            description: 'Volunteer Fire Department services',
            image: require('../assets/icons/vfd.png'),
            navigationParams: { service: 'International VFD' }
        },
        {
            id: 'service_2',
            type: 'service',
            title: 'Uniforms',
            description: 'Custom uniform solutions',
            image: require('../assets/icons/uniforms.png'),
            navigationParams: { service: 'Uniforms' }
        },
        {
            id: 'service_3',
            type: 'service',
            title: 'Safety Shoes',
            description: 'Professional safety footwear',
            image: require('../assets/icons/safetyshoes.png'),
            navigationParams: { service: 'Safety Shoes' }
        },
        {
            id: 'service_4',
            type: 'service',
            title: 'Embroidery Digitizing',
            description: 'Custom embroidery services',
            image: require('../assets/icons/embrodery.png'),
            navigationParams: { service: 'Embroidery Digitizing' }
        },
        {
            id: 'service_5',
            type: 'service',
            title: 'Alternation & Sewing',
            description: 'Professional alteration services',
            image: require('../assets/icons/sewing.png'),
            navigationParams: { service: 'Alternation & Sewing' }
        },
        // Special Services
        {
            id: 'special_1',
            type: 'special_service',
            title: 'Government Buyers',
            description: 'Specialized procurement solutions for government agencies',
            image: require('../assets/images/government-buyers.png'),
            navigationParams: { specialService: 'Government Buyers' }
        },
        {
            id: 'special_2',
            type: 'special_service',
            title: 'FR Clothing',
            description: 'Premium flame-resistant clothing for industrial safety',
            image: require('../assets/images/fr-clothing.png'),
            navigationParams: { specialService: 'FR Clothing' }
        },
        {
            id: 'special_3',
            type: 'special_service',
            title: 'Blackinton',
            description: 'Premium law enforcement badges and insignia',
            image: require('../assets/images/blackinton.png'),
            navigationParams: { specialService: 'Blackinton' }
        },
        // Categories
        {
            id: 'cat_1',
            type: 'category',
            title: 'Footwear',
            description: 'Browse all footwear products',
            image: require('../assets/icons/footwear.png'),
            navigationParams: { category: 'Footwear' }
        },
        {
            id: 'cat_2',
            type: 'category',
            title: 'Brands',
            description: 'Browse all brand products',
            image: require('../assets/icons/brands.png'),
            navigationParams: { category: 'Brands' }
        },
        {
            id: 'cat_3',
            type: 'category',
            title: 'Clothing',
            description: 'Browse all clothing products',
            image: require('../assets/icons/clothes.png'),
            navigationParams: { category: 'Clothing' }
        },
        {
            id: 'cat_4',
            type: 'category',
            title: 'Accessories',
            description: 'Browse all accessory products',
            image: require('../assets/icons/accessories.png'),
            navigationParams: { category: 'Accessories' }
        }
    ];

    // Search functionality
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            setIsExpanded(false);
            resultsHeight.value = withTiming(0, { duration: 200 });
            opacity.value = withTiming(0, { duration: 200 });
            return;
        }

        // Filter results based on search term
        const filtered = allData.filter(item => 
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setSearchResults(filtered.slice(0, 8)); // Limit to 8 results
        setIsExpanded(filtered.length > 0);
        
        if (filtered.length > 0) {
            resultsHeight.value = withSpring(1, { damping: 15, stiffness: 150 });
            opacity.value = withTiming(1, { duration: 300 });
        } else {
            resultsHeight.value = withTiming(0, { duration: 200 });
            opacity.value = withTiming(0, { duration: 200 });
        }
    }, [searchTerm]);

    const resultsAnimatedStyle = useAnimatedStyle(() => {
        return {
            maxHeight: resultsHeight.value * 400,
            opacity: opacity.value,
        };
    });

    const handleResultPress = (result: SearchResult) => {
        setSearchTerm('');
        setIsExpanded(false);
        
        if (onResultSelect) {
            onResultSelect(result);
        }

        // Navigate based on result type
        switch (result.type) {
            case 'product':
                router.push({
                    pathname: '/product-details',
                    params: result.navigationParams
                });
                break;
            case 'service':
                // Stay on homepage and trigger service modal
                // This would be handled by the parent component
                break;
            case 'special_service':
                // Stay on homepage and trigger special service modal
                // This would be handled by the parent component
                break;
            case 'category':
                router.push({
                    pathname: '/(tabs)/explore',
                    params: { selectedCategory: result.title }
                });
                break;
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        setIsExpanded(false);
    };

    const getResultIcon = (type: string) => {
        switch (type) {
            case 'product': return 'cube-outline';
            case 'service': return 'construct-outline';
            case 'special_service': return 'star-outline';
            case 'category': return 'grid-outline';
            default: return 'search-outline';
        }
    };

    const getResultTypeLabel = (type: string) => {
        switch (type) {
            case 'product': return 'Product';
            case 'service': return 'Service';
            case 'special_service': return 'Special';
            case 'category': return 'Category';
            default: return '';
        }
    };

    const handleViewAllResults = () => {
        router.push({
            pathname: '/(tabs)/explore',
            params: { 
                globalSearch: searchTerm,
                searchType: 'global'
            }
        });
        clearSearch();
    };

    return (
        <View className="px-6 py-4">
            {/* Search Bar */}
            <View className="bg-gray-100 rounded-xl flex-row items-center px-4 py-3">
                <Ionicons name="search" size={20} color="#9CA3AF" />
                <TextInput
                    placeholder="Search products, services, categories..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    className="flex-1 ml-3 text-gray-900"
                    placeholderTextColor="#9CA3AF"
                />
                {searchTerm.length > 0 && (
                    <TouchableOpacity onPress={clearSearch} className="p-1">
                        <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Search Results */}
            <Animated.View 
                style={resultsAnimatedStyle}
                className="bg-white rounded-xl mt-2 border border-gray-200 overflow-hidden"
            >
                <ScrollView 
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    className="max-h-96"
                >
                    {searchResults.map((result) => (
                        <TouchableOpacity
                            key={result.id}
                            onPress={() => handleResultPress(result)}
                            className="flex-row items-center p-4 border-b border-gray-100"
                        >
                            {result.image ? (
                                <Image 
                                    source={result.image} 
                                    className="w-12 h-12 rounded-lg mr-3"
                                    resizeMode="contain"
                                />
                            ) : (
                                <View className="w-12 h-12 bg-gray-200 rounded-lg mr-3 items-center justify-center">
                                    <Ionicons 
                                        name={getResultIcon(result.type)} 
                                        size={20} 
                                        color="#9CA3AF" 
                                    />
                                </View>
                            )}
                            
                            <View className="flex-1">
                                <View className="flex-row items-center">
                                    <Text className="font-semibold text-gray-900 mr-2">
                                        {result.title}
                                    </Text>
                                    <View className="bg-blue-100 px-2 py-1 rounded-full">
                                        <Text className="text-xs text-blue-700">
                                            {getResultTypeLabel(result.type)}
                                        </Text>
                                    </View>
                                </View>
                                {result.subtitle && (
                                    <Text className="text-sm text-gray-600">
                                        {result.subtitle}
                                    </Text>
                                )}
                                <Text className="text-xs text-gray-500">
                                    {result.description}
                                </Text>
                            </View>
                            
                            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                        </TouchableOpacity>
                    ))}
                    
                    {searchResults.length >= 8 && (
                        <TouchableOpacity
                            onPress={handleViewAllResults}
                            className="p-4 bg-gray-50 items-center"
                        >
                            <Text className="text-blue-600 font-medium">
                                View all results for "{searchTerm}"
                            </Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </Animated.View>
        </View>
    );
}