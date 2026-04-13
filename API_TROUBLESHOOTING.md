# API Configuration Troubleshooting Guide

## Problem: "Axios Timeout Exceeded" or API Connection Errors

### Step 1: Verify Backend is Running

**Terminal Check (Backend):**
```bash
cd backend
npm run dev
```

You should see: `✅ Server running on http://0.0.0.0:5000`

### Step 2: Find Your Machine's Local IP

**On Windows:**
```powershell
ipconfig
# Look for "IPv4 Address" under your network adapter
# Example: 192.168.x.xxx
```

**On Mac/Linux:**
```bash
ifconfig
# Look for inet address under your network interface
```

Example output: `192.168.1.105`

### Step 3: Update config.ts with Your IP

**File:** `services/config.ts`

```typescript
export const PC_IP = Platform.OS === "web" ? "localhost" : "YOUR_IP_HERE";
```

Replace `YOUR_IP_HERE` with your actual machine IP (e.g., `192.168.1.105`)

**Currently configured IP:** `192.168.1.103`

### Step 4: Test Connection from Phone/Expo

**Before running the app:**
1. Make sure your phone/emulator is on the **same WiFi network** as your PC
2. Update PC_IP in config.ts
3. Restart Expo (^C and `npm start`)

## Common Issues

### ❌ Timeout Error
- **Cause:** Backend not running or wrong IP
- **Fix:** 
  - Run `npm run dev` in backend folder
  - Verify IP with `ipconfig` / `ifconfig`
  - Check firewall isn't blocking port 5000

### ❌ Connection Refused
- **Cause:** Backend not listening or wrong port
- **Fix:**
  - Ensure backend is running on port 5000
  - Check `backend/src/server.js` PORT setting

### ❌ "Undefined" API Response
- **Cause:** Endpoint not found or typo in path
- **Fix:**
  - Verify endpoint exists in `backend/src/server.js`
  - Check path spelling matches exactly

## Quick Test

Once you've updated the IP, test the free trial:

1. Login as `rahul@gmail.com` (or any user)
2. Click a premium service
3. See "Access Locked" popup ✅
4. Click "Go to Payment"
5. Choose "Free Trial" → "Start Free Trial"
6. Should see: "Free trial activated!" + navigate to home ✅

## Endpoints Being Used

- `GET /api/subscription/status` - Check access
- `POST /api/subscription/checkout` - Process free trial or paid plan
- `GET /api/subscription/check-premium-access` - Quick access check

All require Token (Bearer token from login)

---

**Next Steps:**
1. Verify backend is running (`npm run dev` in backend folder)
2. Find your machine IP
3. Update `PC_IP` in `services/config.ts`
4. Test free trial flow again
