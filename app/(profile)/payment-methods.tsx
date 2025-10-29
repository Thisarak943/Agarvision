
import { useState } from 'react';
import { router } from 'expo-router';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from "../../components/ui/Header";

export default function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: '1',
      type: 'card',
      name: 'Visa ending in 4242',
      details: '•••• •••• •••• 4242',
      isDefault: true,
    },
    {
      id: '2',
      type: 'paypal',
      name: 'PayPal',
      details: 'user@example.com',
      isDefault: false,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState('');
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });
  const [paypalForm, setPaypalForm] = useState({
    email: '',
  });

  const setDefaultPaymentMethod = (id) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const addPaymentMethod = (type) => {
    setAddModalType(type.toLowerCase());
    setShowAddModal(true);
  };

  const removePaymentMethod = (id) => {
    Alert.alert(
      'Remove Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(methods => methods.filter(method => method.id !== id));
          },
        },
      ]
    );
  };

  const handleAddCard = () => {
    if (!cardForm.cardNumber || !cardForm.expiryDate || !cardForm.cvv || !cardForm.cardholderName) {
      Alert.alert('Error', 'Please fill in all card details');
      return;
    }

    const newCard = {
      id: Date.now().toString(),
      type: 'card',
      name: `Card ending in ${cardForm.cardNumber.slice(-4)}`,
      details: `•••• •••• •••• ${cardForm.cardNumber.slice(-4)}`,
      isDefault: paymentMethods.length === 0,
    };

    setPaymentMethods([...paymentMethods, newCard]);
    setCardForm({ cardNumber: '', expiryDate: '', cvv: '', cardholderName: '' });
    setShowAddModal(false);
    Alert.alert('Success', 'Card added successfully!');
  };

  const handleAddPayPal = () => {
    if (!paypalForm.email) {
      Alert.alert('Error', 'Please enter your PayPal email');
      return;
    }

    const newPayPal = {
      id: Date.now().toString(),
      type: 'paypal',
      name: 'PayPal',
      details: paypalForm.email,
      isDefault: paymentMethods.length === 0,
    };

    setPaymentMethods([...paymentMethods, newPayPal]);
    setPaypalForm({ email: '' });
    setShowAddModal(false);
    Alert.alert('Success', 'PayPal account added successfully!');
  };

  const handleAddApplePay = () => {
    // Simulate Apple Pay setup
    Alert.alert(
      'Apple Pay',
      'Set up Apple Pay with Touch ID or Face ID?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Set Up',
          onPress: () => {
            const newApplePay = {
              id: Date.now().toString(),
              type: 'applepay',
              name: 'Apple Pay',
              details: 'Touch ID / Face ID',
              isDefault: paymentMethods.length === 0,
            };
            setPaymentMethods([...paymentMethods, newApplePay]);
            setShowAddModal(false);
            Alert.alert('Success', 'Apple Pay added successfully!');
          },
        },
      ]
    );
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ');
    return formatted.trim();
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const getPaymentIcon = (type) => {
    switch (type) {
      case 'card':
        return 'card-outline';
      case 'paypal':
        return 'logo-paypal';
      case 'applepay':
        return 'logo-apple';
      default:
        return 'card-outline';
    }
  };

  const renderAddModal = () => {
    return (
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <SafeAreaView className="flex-1 bg-white">
            {/* Modal Header */}
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                className="p-2 -ml-2"
              >
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>

              <Text className="text-xl font-semibold text-gray-900">
                Add {addModalType === 'card' ? 'Card' : addModalType === 'paypal' ? 'PayPal' : 'Apple Pay'}
              </Text>

              <View className="w-8" />
            </View>

            <ScrollView className="flex-1 px-6 py-6">
              {addModalType === 'card' && (
                <View className="space-y-4">
                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-2">Card Number</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                      placeholder="1234 5678 9012 3456"
                      value={formatCardNumber(cardForm.cardNumber)}
                      onChangeText={(text) => setCardForm({...cardForm, cardNumber: text.replace(/\s/g, '')})}
                      keyboardType="numeric"
                      maxLength={19}
                    />
                  </View>

                  <View className="flex-row space-x-4 mt-4">
                    <View className="flex-1 mr-2">
                      <Text className="text-sm font-medium text-gray-700 mb-2">Expiry Date</Text>
                      <TextInput
                        className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                        placeholder="MM/YY"
                        value={formatExpiryDate(cardForm.expiryDate)}
                        onChangeText={(text) => setCardForm({...cardForm, expiryDate: text.replace(/\D/g, '')})}
                        keyboardType="numeric"
                        maxLength={5}
                      />
                    </View>

                    <View className="flex-1 ml-2">
                      <Text className="text-sm font-medium text-gray-700 mb-2">CVV</Text>
                      <TextInput
                        className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                        placeholder="123"
                        value={cardForm.cvv}
                        onChangeText={(text) => setCardForm({...cardForm, cvv: text})}
                        keyboardType="numeric"
                        maxLength={4}
                        secureTextEntry
                      />
                    </View>
                  </View>

                  <View className='mt-4'>
                    <Text className="text-sm font-medium text-gray-700 mb-2">Cardholder Name</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                      placeholder="John Doe"
                      value={cardForm.cardholderName}
                      onChangeText={(text) => setCardForm({...cardForm, cardholderName: text})}
                      autoCapitalize="words"
                    />
                  </View>

                  <TouchableOpacity
                    className="bg-primary rounded-lg py-4 mt-12"
                    onPress={handleAddCard}
                  >
                    <Text className="text-white text-center text-base font-semibold">Add Card</Text>
                  </TouchableOpacity>
                </View>
              )}

              {addModalType === 'paypal' && (
                <View className="space-y-4">
                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-2">PayPal Email</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                      placeholder="your.email@example.com"
                      value={paypalForm.email}
                      onChangeText={(text) => setPaypalForm({...paypalForm, email: text})}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <TouchableOpacity
                    className="bg-primary rounded-lg py-4 mt-6"
                    onPress={handleAddPayPal}
                  >
                    <Text className="text-white text-center text-base font-semibold">Add PayPal</Text>
                  </TouchableOpacity>
                </View>
              )}

              {addModalType === 'applepay' && (
                <View className="space-y-4">
                  <View className="items-center py-8">
                    <Ionicons name="logo-apple" size={80} color="#000" />
                    <Text className="text-lg font-semibold text-gray-900 mt-4 mb-2">Apple Pay</Text>
                    <Text className="text-sm text-gray-600 text-center">
                      Use Touch ID or Face ID to make secure payments
                    </Text>
                  </View>

                  <TouchableOpacity
                    className="bg-black rounded-lg py-4 mt-6"
                    onPress={handleAddApplePay}
                  >
                    <Text className="text-white text-center text-base font-semibold">Set Up Apple Pay</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title="Payment Methods" />

      <ScrollView className="flex-1">
        <View className="px-4 py-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Your Payment Methods</Text>
          
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              className={`bg-white rounded-xl p-4 mb-3 border ${method.isDefault ? 'border-primary' : 'border-gray-200'}`}
              onPress={() => setDefaultPaymentMethod(method.id)}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  {/* Radio Button */}
                  <View className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-4 ${method.isDefault ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                    {method.isDefault && (
                      <Ionicons name="checkmark" size={14} color="white" />
                    )}
                  </View>
                  
                  <Ionicons name={getPaymentIcon(method.type)} size={24} color="#374151" className="mr-4" />
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900 mb-1">{method.name}</Text>
                    <Text className="text-sm text-gray-600">{method.details}</Text>
                  </View>
                </View>
                
                {/* Trash Icon */}
                <TouchableOpacity
                  onPress={() => removePaymentMethod(method.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}

          {/* Add New Payment Method */}
          <View className="mt-8">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Add New Payment Method</Text>
            
            <TouchableOpacity
              className="w-full bg-white rounded-xl p-4 mb-3 border border-gray-200 flex-row items-center"
              onPress={() => addPaymentMethod('Card')}
            >
              <Ionicons name="card-outline" size={24} color="#374151" className="mr-4" />
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">Credit or Debit Card</Text>
                <Text className="text-sm text-gray-600">Visa, Mastercard, American Express</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#10B981" />
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full bg-white rounded-xl p-4 mb-3  border border-gray-200 flex-row items-center"
              onPress={() => addPaymentMethod('PayPal')}
            >
              <Ionicons name="logo-paypal" size={24} color="#374151" className="mr-4" />
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">PayPal</Text>
                <Text className="text-sm text-gray-600">Pay with your PayPal account</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#10B981" />
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full bg-white rounded-xl p-4 mb-3 border border-gray-200 flex-row items-center"
              onPress={() => addPaymentMethod('Apple Pay')}
            >
              <Ionicons name="logo-apple" size={24} color="#374151" className="mr-4" />
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">Apple Pay</Text>
                <Text className="text-sm text-gray-600">Pay with Touch ID or Face ID</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#10B981" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {renderAddModal()}
    </SafeAreaView>
  );
}