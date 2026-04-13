import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_BASE } from '../services/config';
import { getToken } from '../services/tokenStorage';

const API_BASE_URL = API_BASE;

interface SubStatus {
  hasPremiumAccess: boolean;
  currentPlan: string;
  trialDaysRemaining: number;
  subscriptionDaysRemaining: number;
  trialStartDate: string | null;
  subscriptionExpiryDate: string | null;
  isSpecialUser: boolean;
}

interface UsePremiumAccessReturn {
  hasPremiumAccess: boolean;
  loading: boolean;
  error: string | null;
  status: SubStatus | null;
  checkAccess: () => Promise<void>;
  planDaysRemaining: number;
}

/**
 * Hook to check if user has premium access
 * Use this before allowing access to premium services
 */
export function usePremiumAccess(): UsePremiumAccessReturn {
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<SubStatus | null>(null);
  const [planDaysRemaining, setPlanDaysRemaining] = useState(0);

  const checkAccess = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      console.log('Token retrieved:', token ? 'Yes' : 'No');
      if (!token) {
        setError('Not authenticated');
        setHasPremiumAccess(false);
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/subscription/status`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 15000,
      });

      const data: SubStatus = response.data;
      console.log('Premium access response:', data);
      setStatus(data);
      setHasPremiumAccess(data.hasPremiumAccess);

      // Calculate days remaining
      if (data.hasPremiumAccess) {
        if (data.trialDaysRemaining > 0) {
          setPlanDaysRemaining(data.trialDaysRemaining);
        } else if (data.subscriptionDaysRemaining > 0) {
          setPlanDaysRemaining(data.subscriptionDaysRemaining);
        }
      }
      setLoading(false);
    } catch (err) {
      console.error('Error checking premium access:', err);
      setError('Failed to check access status');
      setHasPremiumAccess(false);
      setLoading(false);
    }
  };

  // Check access on mount
  useEffect(() => {
    checkAccess();
  }, []);

  return {
    hasPremiumAccess,
    loading,
    error,
    status,
    checkAccess,
    planDaysRemaining,
  };
}

/**
 * Check premium access of current user (one-time check)
 */
export async function checkPremiumAccessOnce(): Promise<boolean> {
  try {
    const token = await getToken();
    if (!token) return false;

    const response = await axios.get(`${API_BASE_URL}/subscription/check-premium-access`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 15000,
    });

    return response.data.hasPremiumAccess;
  } catch (err) {
    console.error('Error checking premium access:', err);
    return false;
  }
}

/**
 * Get detailed subscription status
 */
export async function getSubStatus(): Promise<SubStatus | null> {
  try {
    const token = await getToken();
    if (!token) return null;

    const response = await axios.get(`${API_BASE_URL}/subscription/status`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 15000,
    });

    return response.data;
  } catch (err) {
    console.error('Error getting subscription status:', err);
    return null;
  }
}
