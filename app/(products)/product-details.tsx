// app/product-detail.tsx
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../../contexts/CartContext';

export default function ProductDetail() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { addToCart, getCartItemsCount } = useCart();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Brown");
  const [selectedWidth, setSelectedWidth] = useState("9");
  const [quantity, setQuantity] = useState(1);

  // Use data from navigation params or fallback to default data
  const productData = {
    id: params.productId as string || "1",
    name: params.productName as string || '8" Tactical Boot',
    model: "RB808",
    brand: params.productBrand as string || "Reebok",
    gender: params.productGender as string || "Female",
    features: "Safety, Waterproof",
    price: params.productPrice as string || "$143.00",
    rating: 4.5,
    reviewCount: 128,
    category: params.productCategory as string || "Footwear",
    type: params.productType as string || "Boots",
    color: params.productColor as string || "Brown",
    size: params.productSize as string || "M",
    material: params.productMaterial as string || "Leather",
    availability: params.productAvailability as string || "In Stock",
    description: "This is a small description about this product listed",
    images: [
      require("../../assets/images/boot.png"),
      require("../../assets/images/boot.png"),
      require("../../assets/images/boot.png"),
    ],
    sizes: ["M", "W"],
    colors: ["Brown", "Black"],
    widths: ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5"],
    specifications: {
      "Product name": params.productName as string || '8" Tactical Boot',
      "Model": "RB808",
      "Brand": params.productBrand as string || "Reebok",
      "Gender": params.productGender as string || "Female",
      "Features": "Safety, Waterproof",
      "Description": "This is a small description about this product listed"
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === productData.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? productData.images.length - 1 : prev - 1
    );
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const handleAddToCart = () => {
    try {
      // Parse price to get numeric value
      const numericPrice = parseFloat(productData.price.replace('$', ''));
      
      // Create cart item object
      const cartItem = {
        id: `${productData.id}-${selectedSize}-${selectedColor}-${selectedWidth}`, // Unique ID based on selections
        name: productData.name,
        price: numericPrice,
        image: productData.images[0], // Use first image
        selectedSize,
        selectedColor,
        selectedWidth,
        brand: productData.brand,
      };

      // Add multiple quantities if needed
      for (let i = 0; i < quantity; i++) {
        addToCart(cartItem);
      }

      // Show success alert
      Alert.alert(
        'Added to Cart!',
        `${quantity} x ${productData.name} (${selectedSize}, ${selectedColor}, ${selectedWidth}) added to cart.`,
        [
          {
            text: 'Continue Shopping',
            style: 'default'
          },
          {
            text: 'View Cart',
            style: 'default',
            onPress: () => router.push('/(tabs)/cart')
          }
        ]
      );

      // Reset quantity to 1 after adding to cart
      setQuantity(1);

    } catch (error) {
      Alert.alert('Error', 'Failed to add item to cart. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header with cart count */}
      <View className="flex-row justify-between items-center px-4 py-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Product Details</Text>
        <TouchableOpacity 
          onPress={() => router.push('/(tabs)/cart')}
          className="relative"
        >
          <Ionicons name="cart" size={24} color="#374151" />
          {getCartItemsCount() > 0 && (
            <View className="absolute -top-2 -right-2 bg-primary rounded-full w-5 h-5 justify-center items-center">
              <Text className="text-white text-xs font-bold">{getCartItemsCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Product Card */}
        <View className="bg-white px-4 pt-4">
          {/* Product Header */}
          <View className="border-l-4 border-primary px-4 py-3">
            <Text className="text-xl font-bold text-gray-900">{productData.name}</Text>
            <Text className="text-gray-600 text-sm">{productData.brand} {productData.model}</Text>
          </View>

          {/* Product Image Section */}
          <View className="relative px-4 py-6">
            <View className="items-center">
              <Image
                source={productData.images[currentImageIndex]}
                className="w-64 h-64"
                resizeMode="contain"
              />
              
              {/* Navigation Arrows */}
              <TouchableOpacity 
                onPress={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 border border-primary shadow-sm"
              >
                <Ionicons name="chevron-back" size={16} color="#10B981" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 border border-primary shadow-sm"
              >
                <Ionicons name="chevron-forward" size={16} color="#10B981" />
              </TouchableOpacity>
            </View>

            {/* Thumbnail Images */}
            <View className="flex-row justify-center mt-6 space-x-3">
              {productData.images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setCurrentImageIndex(index)}
                  className={`border-2 rounded-lg p-1 mx-1 ${
                    index === currentImageIndex ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <Image
                    source={image}
                    className="w-12 h-12 rounded"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Product Specifications */}
          <View className="px-4 pb-4">
            {Object.entries(productData.specifications).map(([key, value]) => (
              <View key={key} className="flex-row justify-between py-2 border-b border-gray-100">
                <Text className="text-gray-600 text-sm">{key}</Text>
                <Text className="text-gray-900 text-sm font-medium text-right flex-1 ml-4">{value}</Text>
              </View>
            ))}
          </View>

          {/* Selection Options */}
          <View className="px-4 pb-4">
            {/* Size Selection */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Select size</Text>
              <View className="flex-row space-x-2">
                {productData.sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    onPress={() => setSelectedSize(size)}
                    className={`px-3 py-2 rounded-lg border mr-2 ${
                      selectedSize === size
                        ? 'border-primary bg-green-100'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        selectedSize === size ? 'text-green-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Color Selection */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Select color</Text>
              <View className="flex-row space-x-2">
                {productData.colors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setSelectedColor(color)}
                    className={`px-3 py-2 mr-2 rounded-lg border ${
                      selectedColor === color
                        ? 'border-primary bg-green-100'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        selectedColor === color ? 'text-green-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {color}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Width Selection */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Select width</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row space-x-2">
                  {productData.widths.map((width) => (
                    <TouchableOpacity
                      key={width}
                      onPress={() => setSelectedWidth(width)}
                      className={`px-3 py-2 mr-2 rounded-lg border min-w-[40px] items-center ${
                        selectedWidth === width
                          ? 'border-primary bg-primary'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      <Text
                        className={`text-sm ${
                          selectedWidth === width ? 'text-white font-medium' : 'text-gray-700'
                        }`}
                      >
                        {width}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Price and Quantity */}
            <View className="flex-row items-center justify-between mb-4 mt-6">
              <View>
                <Text className="text-sm text-gray-600 mb-1">Estimated cost</Text>
                <Text className="text-2xl font-bold text-gray-900">{productData.price}</Text>
              </View>
              <View className="flex-row items-center bg-green-100 rounded-lg px-3 py-2">
                <TouchableOpacity
                  onPress={decreaseQuantity}
                  className="w-6 h-6 items-center justify-center"
                >
                  <Ionicons name="remove" size={16} color="#10B981" />
                </TouchableOpacity>
                <Text className="mx-3 text-lg font-semibold text-green-700">{quantity}</Text>
                <TouchableOpacity
                  onPress={increaseQuantity}
                  className="w-6 h-6 items-center justify-center"
                >
                  <Ionicons name="add" size={16} color="#10B981" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Add to Cart Button */}
            <TouchableOpacity 
              onPress={handleAddToCart}
              className="bg-primary py-4 mt-8 rounded-lg items-center justify-center"
            >
              <View className="flex-row items-center">
                <Ionicons name="cart" size={20} color="white" />
                <Text className="ml-2 font-semibold text-white text-base">
                  Add {quantity > 1 ? `${quantity} ` : ''}to Cart
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}