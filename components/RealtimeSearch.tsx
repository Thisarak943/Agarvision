// components/RealtimeSearch.tsx (Updated Version)
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
} from 'react-native-reanimated';

// Define types
interface SearchResults {
    products: string[];
    category: string;
    filters: Record<string, string[]>;
    searchTerm: string;
}

interface FilterData {
    [key: string]: string[];
}

interface RealtimeSearchProps {
    onSearchResults?: (results: SearchResults) => void;
    showFilters: boolean;
    onToggleFilters: () => void;
    onClose?: () => void;
    initialCategory?: string;
    initialSearchTerm?: string;
    mode?: 'explore' | 'homepage'; // New prop to determine behavior
}

// Sample product data organized by categories
const productsData = {
    "Brands": [
        "5.11 Tactical Series", "Ariat WorkHog", "Belleville C320", "Carhartt Duck Active",
        "Dickies 874 Work Pant", "Flying Cross Command", "Alpha M-65", "Sanmar Sport-Tek",
        "Red Kap Industrial", "Horace Small Justice", "Bulwark FR", "Wrangler Riggs",
        "Reebok", "Nike", "Under Armour", "Adidas", "Puma"
    ],
    "Uniforms": [
        "Police Uniform Set", "Security Guard Uniform", "Medical Scrubs", "Chef Uniform",
        "Military Dress Uniform", "School Uniform", "Corporate Uniform", "Hotel Staff Uniform",
        "Airline Pilot Uniform", "Fire Department Dress", "EMT Uniform", "Postal Worker Uniform",
        "Training Pants", "Athletic Tank", "Tactical Jacket"
    ],
    "Footwear": [
        "Safety Steel Toe Boots", "Police Duty Boots", "Military Combat Boots", "Chef Non-Slip Shoes",
        "Medical Comfortable Shoes", "Security Guard Boots", "Hiking Work Boots", "Slip-Resistant Shoes",
        "Waterproof Work Boots", "Insulated Winter Boots", "Tactical Boots", "Dress Shoes",
        '8" Tactical Boot', "Work Boots", "Lightweight Running Shoes"
    ],
    "Accessories": [
        "Duty Belt", "Badge Holder", "Name Tags", "Patches", "Chevrons", "Insignia",
        "Hats and Caps", "Gloves", "Ties", "Belt Buckles", "Shoulder Boards", "Collar Brass",
        "Combat Gloves", "Tactical Cap", "Tactical Vest", "Utility Pouch"
    ]
};

// Filter options for each category
const filterOptions: Record<string, FilterData> = {
    "Brands": {
        "Brand": ["5.11", "Ariat", "Belleville", "Carhartt", "Dickies", "Flying Cross", "Alpha", "Sanmar", "Reebok", "Nike", "Under Armour", "Adidas", "Puma"],
        "Type": ["Tactical", "Workwear", "Uniform", "Casual", "Athletic"],
        "Material": ["Cotton", "Polyester", "Canvas", "Denim", "Ripstop", "Leather", "Waterproof"]
    },
    "Uniforms": {
        "Department": ["Police", "Fire", "Medical", "Security", "Corporate", "Military"],
        "Style": ["Class A", "Class B", "Utility", "Dress", "Tactical", "Athletic"],
        "Type": ["Pants & Shorts", "Tanks", "Outerwear", "Tops", "Bottoms"],
        "Size": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]
    },
    "Footwear": {
        "Type": ["Boots", "Shoes", "Sneakers"],
        "Safety": ["Steel Toe", "Composite Toe", "Slip Resistant", "Waterproof", "Insulated"],
        "Brand": ["Reebok", "Nike", "Ariat", "Belleville", "Timberland Pro", "Cat Footwear"],
        "Material": ["Leather", "Synthetic", "Canvas"],
        "Size": ["M", "L", "XL"]
    },
    "Accessories": {
        "Type": ["Belts", "Badges", "Patches", "Headwear", "Gloves", "Caps", "Pouches", "Plates"],
        "Material": ["Leather", "Nylon", "Metal", "Fabric"],
        "Color": ["Black", "Brown", "Navy", "Gold", "Silver", "Green", "Tan", "Blue", "White"],
        "Size": ["S", "M", "L", "XL"]
    }
};

const categories = ["Brands", "Uniforms", "Footwear", "Accessories"];

export default function RealtimeSearch({
    onSearchResults,
    showFilters,
    onToggleFilters,
    onClose,
    initialCategory,
    initialSearchTerm = "",
    mode = "explore"
}: RealtimeSearchProps) {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory || "");
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
    const [filteredProducts, setFilteredProducts] = useState<string[]>([]);

    // Animation values
    const containerOpacity = useSharedValue(0);
    const filtersHeight = useSharedValue(0);

    useEffect(() => {
        containerOpacity.value = withTiming(1, { duration: 300 });
    }, []);

    // Update selectedCategory when initialCategory changes
    useEffect(() => {
        if (initialCategory && initialCategory !== selectedCategory) {
            setSelectedCategory(initialCategory);
            // Clear filters when category changes from outside
            setSelectedFilters({});
        }
    }, [initialCategory]);

    // Update searchTerm when initialSearchTerm changes
    useEffect(() => {
        if (initialSearchTerm !== searchTerm) {
            setSearchTerm(initialSearchTerm);
        }
    }, [initialSearchTerm]);

    // Animate filters height - hide when user has typed something (not just while typing)
    useEffect(() => {
        const shouldShowFilters = mode === 'homepage' ? showFilters : (showFilters && searchTerm.trim().length === 0);
        
        if (shouldShowFilters) {
            filtersHeight.value = withSpring(1, {
                damping: 15,
                stiffness: 150,
                mass: 1,
            });
        } else {
            filtersHeight.value = withSpring(0, {
                damping: 15,
                stiffness: 150,
                mass: 1,
            });
        }
    }, [showFilters, searchTerm, mode]);

    // Real-time search functionality
    useEffect(() => {
        let filtered: string[] = [];

        // If no category is selected, search all products
        if (!selectedCategory) {
            // Get all products from all categories
            const allProducts = Object.values(productsData).flat();
            filtered = allProducts;
        } else {
            // Get products from selected category
            const categoryProducts = productsData[selectedCategory as keyof typeof productsData] || [];
            filtered = categoryProducts;
        }

        // Apply search term filter
        if (searchTerm !== "") {
            filtered = filtered.filter(product =>
                product.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply selected filters
        Object.entries(selectedFilters).forEach(([filterCategory, filterValues]) => {
            if (filterValues.length > 0) {
                filtered = filtered.filter(product => {
                    return filterValues.some(value =>
                        product.toLowerCase().includes(value.toLowerCase())
                    );
                });
            }
        });

        setFilteredProducts(filtered);

        // Trigger search results when there are changes
        if (onSearchResults) {
            onSearchResults({
                products: filtered,
                category: selectedCategory,
                filters: selectedFilters,
                searchTerm
            });
        }
    }, [searchTerm, selectedCategory, selectedFilters, onSearchResults]);

    const containerAnimatedStyle = useAnimatedStyle(() => {
        return { opacity: containerOpacity.value };
    });

    const filtersAnimatedStyle = useAnimatedStyle(() => {
        return {
            maxHeight: filtersHeight.value * 600,
            opacity: filtersHeight.value,
            transform: [
                {
                    scaleY: filtersHeight.value,
                }
            ],
        };
    });

    const handleFilterToggle = (filterCategory: string, filterValue: string) => {
        setSelectedFilters(prev => {
            const categoryFilters = prev[filterCategory] || [];
            if (categoryFilters.includes(filterValue)) {
                return {
                    ...prev,
                    [filterCategory]: categoryFilters.filter(f => f !== filterValue)
                };
            } else {
                return {
                    ...prev,
                    [filterCategory]: [...categoryFilters, filterValue]
                };
            }
        });
    };

    const clearAllFilters = () => {
        setSelectedFilters({});
        setSearchTerm("");
    };

    const getSelectedFiltersCount = () => {
        return Object.values(selectedFilters).reduce((total, filters) => total + filters.length, 0);
    };

    const handleCategoryChange = (category: string) => {
        // Allow toggling - if same category is clicked, unselect it
        if (selectedCategory === category) {
            setSelectedCategory("");
        } else {
            setSelectedCategory(category);
        }
        // Clear filters when changing category
        setSelectedFilters({});
    };

    const clearSearch = () => {
        setSearchTerm("");
    };

    // Different placeholder text based on mode and selection
    const getPlaceholder = () => {
        if (mode === 'homepage') {
            return "Quick search products...";
        }
        return selectedCategory 
            ? `Search ${selectedCategory.toLowerCase()}...`
            : "Search all products...";
    };

    // Check if filter icon should be green (category selected OR filters applied)
    const isFilterActive = selectedCategory !== "" || getSelectedFiltersCount() > 0;

    return (
        <Animated.View style={containerAnimatedStyle} className="bg-white">
            {/* Search Bar - Always Visible */}
            <View className="px-6 py-4">
                <View className="bg-gray-100 rounded-xl flex-row items-center px-4 py-3">
                    <Ionicons name="search" size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder={getPlaceholder()}
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
                    {mode === 'explore' && (
                        <TouchableOpacity
                            onPress={onToggleFilters}
                            className={`p-2 rounded-lg ml-2 ${isFilterActive ? 'bg-green-100 border border-green-300' : ''}`}
                        >
                            <Ionicons
                                name="options"
                                size={20}
                                color={isFilterActive ? "#10B981" : "#9CA3AF"}
                            />
                            {getSelectedFiltersCount() > 0 && (
                                <View className="absolute -top-1 -right-1 bg-green-500 rounded-full w-5 h-5 items-center justify-center">
                                    <Text className="text-white text-xs font-bold">
                                        {getSelectedFiltersCount()}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
                
                {/* Show message when filters are hidden due to search */}
                {mode === 'explore' && searchTerm.length > 0 && showFilters && (
                    <View className="mt-2 px-4">
                        <Text className="text-sm text-gray-500">
                            Filters hidden while searching. Clear search to show filters.
                        </Text>
                    </View>
                )}
            </View>

            {/* Filters Section - Only show in explore mode when no search term */}
            {mode === 'explore' && (
                <Animated.View
                    style={filtersAnimatedStyle}
                    className="bg-white border-b border-gray-100 overflow-hidden"
                >
                    <View className="px-2">
                        {/* Category Tabs */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="px-5 mr-4"
                            contentContainerStyle={{ paddingRight: 20 }}
                        >
                            {categories.map((category) => (
                                <TouchableOpacity
                                    key={category}
                                    onPress={() => handleCategoryChange(category)}
                                    className={`px-4 py-2 mr-3 h-9 mb-4 rounded-full ${selectedCategory === category
                                        ? 'bg-green-100 border border-green-300'
                                        : 'bg-gray-200'
                                        }`}
                                >
                                    <Text className={`text-sm font-medium ${selectedCategory === category
                                        ? 'text-green-700'
                                        : 'text-gray-600'
                                        }`}>
                                        {category}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <ScrollView className="px-5 py-4" nestedScrollEnabled={true}>
                            <View className="flex-row items-center justify-between mb-4">
                                {(getSelectedFiltersCount() > 0) && (
                                    <TouchableOpacity
                                        onPress={clearAllFilters}
                                        className="bg-primary px-3 py-1 rounded-full"
                                    >
                                        <Text className="text-sm text-white">Clear All</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Show filters only if a category is selected */}
                            {selectedCategory && Object.entries(filterOptions[selectedCategory] || {}).map(([filterCategory, options]) => (
                                <View key={filterCategory} className="mb-4">
                                    <Text className="font-semibold text-gray-800 mb-2">{filterCategory}</Text>
                                    <View className="flex-row flex-wrap">
                                        {options.map((option) => (
                                            <TouchableOpacity
                                                key={option}
                                                onPress={() => handleFilterToggle(filterCategory, option)}
                                                className={`px-3 py-2 mr-2 mb-2 rounded-full border ${(selectedFilters[filterCategory] || []).includes(option)
                                                    ? 'bg-green-100 border-green-300'
                                                    : 'bg-gray-100 border-gray-300'
                                                    }`}
                                            >
                                                <Text className={`text-sm ${(selectedFilters[filterCategory] || []).includes(option)
                                                    ? 'text-green-700 font-medium'
                                                    : 'text-gray-600'
                                                    }`}>
                                                    {option}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            ))}

                            {/* Show message when no category is selected */}
                            {!selectedCategory && (
                                <View className="py-8 items-center">
                                    <Ionicons name="apps" size={48} color="#D1D5DB" />
                                    <Text className="text-gray-500 text-center mt-2 font-medium">
                                        Select a category above to see filters
                                    </Text>
                                    <Text className="text-gray-400 text-center text-sm mt-1">
                                        Or search all products using the search bar
                                    </Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </Animated.View>
            )}

            {/* Results Count - only show if searchTerm is not empty or filters applied */}
            {(searchTerm.length > 0 || getSelectedFiltersCount() > 0) && mode === 'explore' && (
                <View className="bg-white px-4 py-2 border-t border-gray-100">
                    <Text className="text-sm text-gray-600">
                        {filteredProducts.length} {selectedCategory ? selectedCategory.toLowerCase() : 'products'} found
                        {getSelectedFiltersCount() > 0 && ` (${getSelectedFiltersCount()} filters applied)`}
                        {!selectedCategory && searchTerm.length > 0 && ' across all categories'}
                    </Text>
                </View>
            )}
        </Animated.View>
    );
}