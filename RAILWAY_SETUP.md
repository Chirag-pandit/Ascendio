# Railway Backend Setup - Quick Guide

## Railway URL Kaise Nikale:

1. Railway Dashboard mein jao: https://railway.app
2. Apne project ko open karo
3. **Settings** tab click karo
4. **Networking** section mein scroll karo
5. **"Generate Domain"** ya **"Public Domain"** button click karo
6. Apko ek URL milega jaise: `https://ascendio-production.up.railway.app`
7. **Yeh URL copy karo!**

## Ab Kya Karna Hai:

### Step 1: `src/utils/api.ts` Update Karo

File open karo: `src/utils/api.ts`

Line 18 pe jao aur Railway URL paste karo:

```typescript
return 'https://your-actual-railway-url.up.railway.app' // YAHAN APNA URL PASTE KARO
```

### Step 2: Vercel Environment Variable

1. Vercel Dashboard → Your Project
2. **Settings** → **Environment Variables**
3. **Add New:**
   - **Key:** `VITE_API_URL`
   - **Value:** Railway ka URL (same jo upar paste kiya)
   - **Environments:** Production, Preview, Development (sab select karo)
4. **Save** karo
5. **Redeploy** karo (automatic ho sakta hai)

### Step 3: Railway CORS Update (Optional)

Agar CORS error aaye, toh `server.cjs` mein Vercel URL add karo:

Line 20-25 pe jao aur apna Vercel URL add karo:

```javascript
const allowedOrigins = [
  'https://your-app.vercel.app', // YAHAN APNA VERCEL URL
  'https://*.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);
```

## Testing:

1. Vercel URL open karo
2. `/admin` pe jao
3. Login karo (admin/admin123)
4. Agar kaam kare toh perfect! ✅

## Common Issues:

### ❌ "Failed to connect to server"
- Railway URL sahi hai ya nahi check karo
- Railway service running hai ya nahi (Railway Dashboard → Logs check karo)

### ❌ CORS Error
- `server.cjs` mein CORS configuration check karo
- Vercel URL ko allowed origins mein add karo

### ❌ Admin Panel Load Nahi Ho Raha
- Browser console check karo (F12)
- Network tab mein API calls check karo
- Railway logs check karo

## Railway URL Format:

Railway URL usually yeh format mein hota hai:
```
https://[project-name]-[random-id].up.railway.app
```

Ya:
```
https://[custom-name].railway.app
```

## Important:

- ✅ Railway URL mein `https://` zaroor hona chahiye
- ✅ Railway URL ke end mein `/` nahi hona chahiye
- ✅ Vercel Environment Variable name exactly `VITE_API_URL` hona chahiye
- ✅ Environment Variable add karne ke baad redeploy zaroori hai

