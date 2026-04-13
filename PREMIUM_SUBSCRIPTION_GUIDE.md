# Premium Subscription Integration Guide

## Overview
This guide shows how to add the premium subscription system to your existing premium services.

## Implementation Summary

### Backend Endpoints Created:
- ✅ `POST /api/subscription/checkout` - Handle free trial or paid plan checkout
- ✅ `GET /api/subscription/status` - Get user's subscription status
- ✅ `GET /api/subscription/check-premium-access` - Quick access check
- ✅ `POST /api/subscription/migrate-existing-user` - Initialize existing users

### Frontend Files Created:

1. **`app/(checkout)/premium-checkout.tsx`**
   - Full checkout screen with:
     - Free trial option (7 days, no payment)
     - Paid plans (7 days, 1 month, 1 year)
     - Card details form

2. **`hooks/usePremiumAccess.ts`**
   - `usePremiumAccess()` - React hook to check access status
   - `checkPremiumAccessOnce()` - One-time check
   - `getSubStatus()` - Get detailed status

3. **`components/PremiumServiceGuard.tsx`**
   - Wraps premium service routes
   - Auto-redirects to checkout if no access

---

## How to Integrate with Your Premium Services

### Step 1: Wrap Premium Service Routes

For each of your 4 premium services (e.g., Disease Detection, Resin Grading, etc.):

```tsx
import { PremiumServiceGuard } from '@/components/PremiumServiceGuard';

export default function DiseaseDetection() {
  return (
    <PremiumServiceGuard serviceName="Disease Detection">
      {/* Your existing service UI here */}
    </PremiumServiceGuard>
  );
}
```

### Step 2: Update Backend Config (if needed)

Change the `API_BASE_URL` in these files to your backend IP:

- `app/(checkout)/premium-checkout.tsx` - Line 7
- `hooks/usePremiumAccess.ts` - Line 5

Default: `http://192.168.1.100:5000/api`

### Step 3: (Optional) Manual Check in Components

If you want more control, use the hook directly:

```tsx
import { usePremiumAccess } from '@/hooks/usePremiumAccess';

export default function MyService() {
  const { hasPremiumAccess, loading } = usePremiumAccess();

  if (loading) return <LoadingSpinner />;

  if (!hasPremiumAccess) {
    return <TouchableOpacity onPress={() => router.push('/premium-checkout')} />;
  }

  return <YourServiceUI />;
}
```

---

## User Flow

### New User (Just Registered):
1. Gets **7-day free trial** automatically on registration ✅
2. Can access all 4 premium services for 7 days
3. After 7 days, sees "Access Locked" → Redirect to checkout
4. Can choose:
   - 7-day **free trial** (again? or shows expired message)
   - Or **pay** for 7 days/$9.99/1 year plans
5. After payment, access restored

### Existing User (Created Before System):
1. `thisara@gmail.com` → **Always has free access** ✅
2. Other existing users → Trial already expired, must pay

### Special User (thisara@gmail.com):
- Email hardcoded as always premium
- Cannot be blocked
- No payment screen shown

---

## API Endpoints Reference

### Check Access Status
```bash
GET /api/subscription/status
Header: Authorization: Bearer {token}
Response:
{
  "hasPremiumAccess": true/false,
  "currentPlan": "7-days" | "1-month" | "1-year" | "none" | "free-trial",
  "trialDaysRemaining": 5,
  "subscriptionDaysRemaining": 20,
  "isSpecialUser": false
}
```

### Process Checkout - Free Trial
```bash
POST /api/subscription/checkout
Header: Authorization: Bearer {token}
Body: {
  "type": "free-trial"
}
Response:
{
  "message": "Free trial activated successfully",
  "hasPremiumAccess": true,
  "subscription": {
    "plan": "free-trial",
    "daysRemaining": 7
  }
}
```

### Process Checkout - Paid Plan
```bash
POST /api/subscription/checkout
Header: Authorization: Bearer {token}
Body: {
  "type": "paid-plan",
  "plan": "7-days" | "1-month" | "1-year",
  "cardDetails": {
    "cardholderName": "John Doe",
    "cardNumber": "4111111111111111",
    "expiryMonth": "12",
    "expiryYear": "2028",
    "cvv": "123"
  }
}
Response:
{
  "message": "Payment successful",
  "hasPremiumAccess": true,
  "subscription": {
    "plan": "7-days",
    "amount": "US$2.99",
    "expiryDate": "2026-04-20T..."
  }
}
```

---

## Testing Checklist

- [ ] New user registers → gets 7-day free trial
- [ ] New user after 7 days → cannot access premium (must pay)
- [ ] User tries checkout → sees free trial + paid options
- [ ] User selects free trial → access granted (no card details needed)
- [ ] User selects paid plan → asks for card details
- [ ] Invalid card → shows error message
- [ ] Valid card → payment successful, access granted
- [ ] `thisara@gmail.com` → always shows "Unlimited Access", no checkout
- [ ] Subscription expires → user blocked again, needs to pay

---

## Database Models

### User Schema (Updated)
```javascript
{
  ...existing fields...,
  trialStartDate: Date,           // When trial started
  trialDaysCount: Number,         // Trial duration (7)
  currentPlan: String,            // 'none', '7-days', '1-month', '1-year', 'free-trial'
  subscriptionExpiryDate: Date,   // When current plan expires
  isPremiumDisabled: Boolean      // Manual disable flag
}
```

### Subscription Schema (New)
```javascript
{
  userId: ObjectId,               // Reference to User
  plan: String,                   // '7-days', '1-month', '1-year', 'free-trial'
  startDate: Date,                // When plan started
  expiryDate: Date,               // When plan expires
  status: String,                 // 'active' or 'expired'
  transactionId: String,          // Fake payment reference
  createdAt: Date,
  updatedAt: Date
}
```

---

## Notes

- All card validation is **fake** - any card format that passes regex will work
- Trial/subscription dates are stored in MongoDB
- System uses `createdAt` as fallback for old users
- Expiry dates are checked on every premium access call
- No real payment gateway integrated (yet)

---

## Next Steps (Optional)

1. **Add real payment gateway** (Stripe, PayPal, etc.) - replace fake card validation
2. **Email notifications** - send to user when trial ending/subscription expiring
3. **Subscription management** - let users renew before expiry
4. **Admin dashboard** - view subscriptions, manage users
5. **Webhook handling** - for real payment confirmations

---

## Files Modified/Created

- ✅ `backend/src/models/User.js` - Updated with subscription fields
- ✅ `backend/src/models/Subscription.js` - New subscription tracking
- ✅ `backend/src/utils/premiumAccess.js` - Premium logic
- ✅ `backend/src/routes/subscription.js` - All subscription endpoints
- ✅ `backend/src/server.js` - Registered routes
- ✅ `app/(checkout)/premium-checkout.tsx` - Checkout UI
- ✅ `hooks/usePremiumAccess.ts` - Access checking hook
- ✅ `components/PremiumServiceGuard.tsx` - Route guard

---

**Ready to integrate!** 🚀
