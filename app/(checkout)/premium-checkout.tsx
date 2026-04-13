import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { API_BASE } from '../../services/config';
import { getToken } from '../../services/tokenStorage';

const API_BASE_URL = API_BASE;

type CheckoutType = 'free-trial' | 'paid-plan';
type Plan = '7-days' | '1-month' | '1-year';

export default function PremiumCheckout() {
  const router = useRouter();
  const [checkoutType, setCheckoutType] = useState<CheckoutType>('free-trial');
  const [selectedPlan, setSelectedPlan] = useState<Plan>('7-days');
  const [loading, setLoading] = useState(false);

  // Card details state
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');

  const handleFreeTrial = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      if (!token) {
        Alert.alert('Error', 'Not authenticated. Please login again.');
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/subscription/checkout`,
        {
          type: 'free-trial',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000,
        }
      );

      Alert.alert(
        'Success! 🎉',
        'Free trial activated! You have 7 days of access.',
        [
          {
            text: 'Go Back',
            onPress: () => {
              // Go back to explore tab (main services page)
              router.replace('/(tabs)');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Free trial error:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to activate free trial';
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const validateCardDetails = () => {
    if (!cardholderName.trim()) {
      Alert.alert('Error', 'Please enter cardholder name');
      return false;
    }
    if (!cardNumber.trim() || cardNumber.length < 13 || cardNumber.length > 19) {
      Alert.alert('Error', 'Please enter a valid card number (13-19 digits)');
      return false;
    }
    if (!expiryMonth || expiryMonth.length !== 2 || parseInt(expiryMonth) > 12) {
      Alert.alert('Error', 'Please enter valid expiry month (01-12)');
      return false;
    }
    if (!expiryYear || expiryYear.length !== 4) {
      Alert.alert('Error', 'Please enter valid expiry year (YYYY)');
      return false;
    }
    if (!cvv || cvv.length < 3 || cvv.length > 4) {
      Alert.alert('Error', 'Please enter valid CVV (3-4 digits)');
      return false;
    }
    return true;
  };

  const handlePaidCheckout = async () => {
    if (!validateCardDetails()) {
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();

      if (!token) {
        Alert.alert('Error', 'Not authenticated. Please login again.');
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/subscription/checkout`,
        {
          type: 'paid-plan',
          plan: selectedPlan,
          cardDetails: {
            cardholderName,
            cardNumber,
            expiryMonth,
            expiryYear,
            cvv,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000,
        }
      );

      const { subscription } = response.data;
      Alert.alert(
        'Payment Successful! 💳',
        `Your ${selectedPlan} plan is now active!\nPlan expires on ${new Date(
          subscription.expiryDate
        ).toLocaleDateString()}`,
        [
          {
            text: 'Go Back',
            onPress: () => {
              // Clear card details and go back to explore tab
              setCardholderName('');
              setCardNumber('');
              setExpiryMonth('');
              setExpiryYear('');
              setCvv('');
              router.replace('/(tabs)');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Payment error:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Payment failed. Please check your card details and try again.';
      Alert.alert('Payment Failed', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getPlanDetails = () => {
    const plans = {
      '7-days': { price: '$2.99', days: 7 },
      '1-month': { price: '$9.99', days: 30 },
      '1-year': { price: '$79.99', days: 365 },
    };
    return plans[selectedPlan];
  };

  const cardNumberMasked = cardNumber
    ? `•••• •••• •••• ${cardNumber.slice(-4)}`
    : 'Enter card number';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="lock-closed" size={60} color="#4CAF50" />
        <Text style={styles.headerTitle}>Premium Access Required</Text>
        <Text style={styles.headerSubtitle}>
          Unlock all 4 premium services and get exclusive features
        </Text>
      </View>

      {/* Checkout Type Selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Your Option</Text>

        {/* Free Trial Option */}
        <TouchableOpacity
          style={[
            styles.checkoutTypeCard,
            checkoutType === 'free-trial' && styles.checkoutTypeCardActive,
          ]}
          onPress={() => setCheckoutType('free-trial')}
        >
          <View style={styles.checkoutTypeContent}>
            <Ionicons
              name={checkoutType === 'free-trial' ? 'radio-button-on' : 'radio-button-off'}
              size={24}
              color={checkoutType === 'free-trial' ? '#4CAF50' : '#999'}
            />
            <View style={styles.checkoutTypeText}>
              <Text style={styles.checkoutTypeTitle}>🎁 7 Days Free Trial</Text>
              <Text style={styles.checkoutTypeDesc}>No payment required • Auto-expires after 7 days</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Paid Plan Option */}
        <TouchableOpacity
          style={[
            styles.checkoutTypeCard,
            checkoutType === 'paid-plan' && styles.checkoutTypeCardActive,
          ]}
          onPress={() => setCheckoutType('paid-plan')}
        >
          <View style={styles.checkoutTypeContent}>
            <Ionicons
              name={checkoutType === 'paid-plan' ? 'radio-button-on' : 'radio-button-off'}
              size={24}
              color={checkoutType === 'paid-plan' ? '#4CAF50' : '#999'}
            />
            <View style={styles.checkoutTypeText}>
              <Text style={styles.checkoutTypeTitle}>💳 Paid Subscription</Text>
              <Text style={styles.checkoutTypeDesc}>Extended access • Choose your duration</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Free Trial Section */}
      {checkoutType === 'free-trial' && (
        <View style={styles.section}>
          <Text style={styles.benefitsTitle}>Free Trial Benefits:</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>Full access to all 4 premium services</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>No credit card required</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>Cancel anytime before day 7</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.buttonSuccess]}
            onPress={handleFreeTrial}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Start Free Trial</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Paid Plan Section */}
      {checkoutType === 'paid-plan' && (
        <>
          {/* Plan Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Plan Duration</Text>

            {(['7-days', '1-month', '1-year'] as Plan[]).map((plan) => (
              <TouchableOpacity
                key={plan}
                style={[
                  styles.planCard,
                  selectedPlan === plan && styles.planCardActive,
                ]}
                onPress={() => setSelectedPlan(plan)}
              >
                <View style={styles.planRadio}>
                  <Ionicons
                    name={selectedPlan === plan ? 'radio-button-on' : 'radio-button-off'}
                    size={24}
                    color={selectedPlan === plan ? '#4CAF50' : '#999'}
                  />
                </View>
                <View style={styles.planDetails}>
                  <Text style={styles.planName}>
                    {plan === '7-days'
                      ? '7 Days'
                      : plan === '1-month'
                      ? '1 Month'
                      : '1 Year'}
                  </Text>
                  <Text style={styles.planPrice}>
                    {plan === '7-days' ? '$2.99' : plan === '1-month' ? '$9.99' : '$79.99'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Card Details Form */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Details</Text>

            <TextInput
              style={styles.input}
              placeholder="Cardholder Name"
              placeholderTextColor="#999"
              value={cardholderName}
              onChangeText={setCardholderName}
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Card Number (13-19 digits)"
              placeholderTextColor="#999"
              value={cardNumber}
              onChangeText={(text) => setCardNumber(text.replace(/\D/g, ''))}
              keyboardType="numeric"
              maxLength={19}
              editable={!loading}
            />

            <View style={styles.cardDetailsRow}>
              <TextInput
                style={[styles.input, styles.inputSmall]}
                placeholder="MM"
                placeholderTextColor="#999"
                value={expiryMonth}
                onChangeText={(text) => {
                  const num = text.replace(/\D/g, '');
                  if (num.length <= 2) {
                    setExpiryMonth(num);
                  }
                }}
                keyboardType="numeric"
                maxLength={2}
                editable={!loading}
              />

              <TextInput
                style={[styles.input, styles.inputSmall]}
                placeholder="YYYY"
                placeholderTextColor="#999"
                value={expiryYear}
                onChangeText={(text) => {
                  const num = text.replace(/\D/g, '');
                  if (num.length <= 4) {
                    setExpiryYear(num);
                  }
                }}
                keyboardType="numeric"
                maxLength={4}
                editable={!loading}
              />

              <TextInput
                style={[styles.input, styles.inputSmall]}
                placeholder="CVV"
                placeholderTextColor="#999"
                value={cvv}
                onChangeText={(text) => setCvv(text.replace(/\D/g, ''))}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {/* Card Preview */}
            <View style={styles.cardPreview}>
              <Text style={styles.cardPreviewLabel}>Card Preview</Text>
              <View style={styles.cardMock}>
                <Text style={styles.cardNumber}>{cardNumberMasked}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardHolder}>
                    {cardholderName || 'Your Name'}
                  </Text>
                  <Text style={styles.cardExpiry}>
                    {expiryMonth && expiryYear
                      ? `${expiryMonth}/${expiryYear}`
                      : 'MM/YYYY'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Order Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Plan:</Text>
              <Text style={styles.summaryValue}>
                {selectedPlan === '7-days'
                  ? '7 Days'
                  : selectedPlan === '1-month'
                  ? '1 Month'
                  : '1 Year'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Price:</Text>
              <Text style={styles.summaryValue}>
                {selectedPlan === '7-days'
                  ? '$2.99'
                  : selectedPlan === '1-month'
                  ? '$9.99'
                  : '$79.99'}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>
                {selectedPlan === '7-days'
                  ? '$2.99'
                  : selectedPlan === '1-month'
                  ? '$9.99'
                  : '$79.99'}
              </Text>
            </View>
          </View>

          {/* Payment Button */}
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.button, styles.buttonPay]}
              onPress={handlePaidCheckout}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="card" size={20} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Pay Now</Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              💡 We will guarantee a secure and seamless payment experience.
            </Text>
          </View>
        </>
      )}

      {/* Button to go back */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace('/(tabs)')}
        disabled={loading}
      >
        <Text style={styles.backButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 0,
  },
  header: {
    backgroundColor: '#fff',
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  checkoutTypeCard: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  checkoutTypeCardActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#f1f8f4',
  },
  checkoutTypeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkoutTypeText: {
    marginLeft: 12,
    flex: 1,
  },
  checkoutTypeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  checkoutTypeDesc: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  benefitsList: {
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitText: {
    fontSize: 13,
    color: '#555',
    marginLeft: 10,
  },
  planCard: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  planCardActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#f1f8f4',
  },
  planRadio: {
    marginRight: 16,
  },
  planDetails: {
    flex: 1,
  },
  planName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  planPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 13,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputSmall: {
    flex: 1,
    marginRight: 8,
  },
  cardPreview: {
    marginTop: 20,
    marginBottom: 20,
  },
  cardPreviewLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
    fontWeight: '500',
  },
  cardMock: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    background: '#667eea',
    borderRadius: 12,
    padding: 20,
    justifyContent: 'space-between',
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardHolder: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  cardExpiry: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#666',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonSuccess: {
    backgroundColor: '#4CAF50',
  },
  buttonPay: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
  },
  disclaimer: {
    fontSize: 11,
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  backButton: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  backButtonText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
});
