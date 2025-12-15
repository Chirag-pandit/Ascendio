# Deployment Guide - Railway + Vercel

## Railway Backend Setup

### Step 1: Railway pe Backend Deploy

1. **Railway Account:**
   - Railway.com pe account banao
   - New Project create karo
   - "Deploy from GitHub repo" select karo ya "Empty Project"

2. **Backend Deploy:**
   - `server.cjs` file ko Railway pe upload karo
   - Ya GitHub repo connect karo

3. **Railway Settings:**
   - **Start Command:** `node server.cjs`
   - **Port:** Railway automatically PORT environment variable provide karta hai
   - **Root Directory:** Project root

4. **Railway Public URL:**
   - Railway dashboard mein "Settings" → "Networking" section mein jao
   - "Generate Domain" button click karo
   - Apko ek public URL milega jaise: `https://your-app-name.up.railway.app`
   - **Yeh URL copy karo - yeh important hai!**

### Step 2: Railway Port Configuration

`server.cjs` mein port configuration update karo:

```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

## Vercel Frontend Setup

### Step 1: Vercel pe Deploy

1. **Vercel Account:**
   - Vercel.com pe account banao
   - GitHub repo connect karo

2. **Environment Variables Set Karein:**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Add karo:
     ```
     VITE_API_URL = https://your-railway-app.up.railway.app
     ```
   - **Important:** Railway se milne wala actual URL yahan paste karo

3. **Build Settings:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Step 2: API URL Update

`src/utils/api.ts` file mein Railway URL update karo:

```typescript
// Production fallback - Railway URL yahan set karein
return 'https://your-railway-app.up.railway.app' // YAHAN APNA RAILWAY URL PASTE KAREIN
```

## Important Steps

### 1. Railway URL Kaise Nikale:

1. Railway Dashboard mein jao
2. Apne project ko open karo
3. "Settings" tab mein jao
4. "Networking" section mein
5. "Generate Domain" click karo
6. URL copy karo (format: `https://xxx.up.railway.app`)

### 2. Vercel Environment Variable:

1. Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add New:
   - **Name:** `VITE_API_URL`
   - **Value:** Railway ka public URL (jaise: `https://your-app.up.railway.app`)
   - **Environment:** Production, Preview, Development (sab mein add karo)

### 3. Railway CORS Update:

`server.cjs` mein Vercel URL add karo:

```javascript
const allowedOrigins = [
  'https://your-app.vercel.app', // Apna Vercel URL
  'https://*.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);
```

### 4. Redeploy:

- Vercel: Environment variable add karne ke baad automatically redeploy hoga
- Railway: Code push karne pe auto-deploy hoga

## Testing

### Local Testing:
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run dev
```

### Production Testing:
1. Vercel URL open karo
2. `/admin` pe jao
3. Login karo (admin/admin123)
4. Check karo ki API calls kaam kar rahe hain

## Troubleshooting

### Problem: Admin Panel Access Nahi Ho Raha

**Solutions:**
1. ✅ Railway URL sahi hai ya nahi check karo
2. ✅ Vercel Environment Variable set hai ya nahi
3. ✅ Browser console mein error check karo (F12)
4. ✅ Network tab mein API calls check karo
5. ✅ Railway logs check karo (Railway Dashboard → Deployments → View Logs)

### Problem: CORS Error

**Solution:**
- `server.cjs` mein CORS configuration check karo
- Vercel URL ko allowed origins mein add karo

### Problem: API Calls Fail Ho Rahe Hain

**Solutions:**
1. Railway URL sahi format mein hai ya nahi (https://)
2. Railway service running hai ya nahi
3. Railway logs check karo
4. `src/utils/api.ts` mein URL sahi hai ya nahi

## Quick Checklist

- [ ] Railway pe backend deploy ho gaya
- [ ] Railway public URL mil gaya
- [ ] `src/utils/api.ts` mein Railway URL update kiya
- [ ] Vercel pe frontend deploy kiya
- [ ] Vercel Environment Variable (`VITE_API_URL`) set kiya
- [ ] `server.cjs` mein CORS properly configured
- [ ] Railway port configuration sahi hai
- [ ] Test kiya - Admin panel access ho raha hai

## Railway URL Format

Railway URL usually yeh format mein hota hai:
```
https://your-app-name.up.railway.app
```

Ya custom domain:
```
https://api.yourdomain.com
```

## Support

Agar koi issue ho:
1. Railway logs check karo
2. Vercel build logs check karo
3. Browser console mein errors check karo
4. Network tab mein API requests check karo

