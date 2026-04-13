/**
 * Check if a user has access to premium services
 * 
 * Rules:
 * 1. thisara@gmail.com always has access
 * 2. If isPremiumDisabled is true, no access
 * 3. If within 7-day trial period, has access
 * 4. If has active, non-expired subscription, has access
 * 5. Otherwise, no access
 */
function hasPremiumAccess(user) {
  // Special: thisara@gmail.com always has free premium access
  if (user.email === "thisara@gmail.com") {
    return true;
  }

  // If premium is explicitly disabled, no access
  if (user.isPremiumDisabled) {
    return false;
  }

  // Check if user has explicitly started a trial (user chose free trial during checkout)
  if (user.trialStartDate) {
    const trialEndDate = new Date(user.trialStartDate);
    const trialDays = user.trialDaysCount || 7;
    trialEndDate.setDate(trialEndDate.getDate() + trialDays);
    if (new Date() < trialEndDate) {
      return true; // Still in trial
    }
  }

  // Check if has active, non-expired subscription
  if (user.currentPlan && user.currentPlan !== 'none' && user.subscriptionExpiryDate) {
    if (new Date() < new Date(user.subscriptionExpiryDate)) {
      return true; // Active subscription
    }
  }

  // No trial, no active subscription → No access
  return false;
}

/**
 * Calculate subscription expiry date based on plan
 */
function calculateExpiryDate(plan) {
  const now = new Date();
  const expiryDate = new Date(now);

  switch (plan) {
    case '7-days':
      expiryDate.setDate(expiryDate.getDate() + 7);
      break;
    case '1-month':
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      break;
    case '1-year':
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      break;
    default:
      throw new Error('Invalid plan');
  }

  return expiryDate;
}

/**
 * Get days remaining in trial
 * Returns 0 if no trial has been started
 */
function getTrialDaysRemaining(user) {
  // Only calculate if user has explicitly started a trial
  if (!user.trialStartDate) return 0;

  const trialEndDate = new Date(user.trialStartDate);
  const trialDays = user.trialDaysCount || 7;
  trialEndDate.setDate(trialEndDate.getDate() + trialDays);

  const now = new Date();
  const daysRemaining = Math.ceil((trialEndDate - now) / (1000 * 60 * 60 * 24));

  return Math.max(0, daysRemaining);
}

/**
 * Get days remaining in subscription
 */
function getSubscriptionDaysRemaining(user) {
  if (!user.subscriptionExpiryDate) return 0;

  const expiryDate = new Date(user.subscriptionExpiryDate);
  const now = new Date();
  const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

  return Math.max(0, daysRemaining);
}

module.exports = {
  hasPremiumAccess,
  calculateExpiryDate,
  getTrialDaysRemaining,
  getSubscriptionDaysRemaining
};
