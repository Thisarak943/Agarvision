import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { usePremiumAccess } from '../hooks/usePremiumAccess';

interface PremiumServiceGuardProps {
  children: React.ReactNode;
  serviceName: string;
}

/**
 * This component wraps premium services
 * If user doesn't have premium access, shows alert and redirects to checkout
 */
export function PremiumServiceGuard({
  children,
  serviceName,
}: PremiumServiceGuardProps) {
  const router = useRouter();
  const { hasPremiumAccess, loading, checkAccess } = usePremiumAccess();
  const alertShownRef = useRef(false);
  const isInitialRef = useRef(true);

  // Re-check access when returning from checkout (not on initial load)
  useFocusEffect(
    useCallback(() => {
      console.log('Screen focused');
      if (!isInitialRef.current) {
        // Only recheck if this is NOT the first time (returning from checkout)
        console.log('Screen focused (not initial), re-checking access...');
        checkAccess();
      }
      isInitialRef.current = false;
    }, [checkAccess])
  );

  // Reset alert flag ONLY when user gains access (after successful payment/trial)
  useEffect(() => {
    if (hasPremiumAccess) {
      alertShownRef.current = false; // Reset so alert can show again if access expires
    }
  }, [hasPremiumAccess]);

  useEffect(() => {
    console.log('Access state changed:', { hasPremiumAccess, loading, alertShown: alertShownRef.current });
    // Show alert once when loading completes and user has no access
    if (!loading && !hasPremiumAccess && !alertShownRef.current) {
      alertShownRef.current = true;
      console.log('Showing access locked alert');

      Alert.alert(
        'Access Locked 🔒',
        `${serviceName} is a premium service. Choose a plan to continue.`,
        [
          {
            text: 'Cancel',
            onPress: () => {
              alertShownRef.current = false;
              router.replace('/(tabs)');
            },
            style: 'cancel',
          },
          {
            text: 'Go to Payment',
            onPress: () => {
              router.push('/(checkout)/premium-checkout');
            },
          },
        ],
        { cancelable: false }
      );
    }
  }, [loading, hasPremiumAccess, serviceName, router]);

  // Show loading only if we DON'T have access yet AND it's still loading
  if (loading && !hasPremiumAccess) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  // If user has premium access, show the service (don't care if we're loading in background)
  if (hasPremiumAccess) {
    return <>{children}</>;
  }

  // No access and not loading - probably showing alert or waiting
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#4CAF50" />
    </View>
  );
}

export default PremiumServiceGuard;
