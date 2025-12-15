# Railway Public URL Kaise Nikale

## Step-by-Step Guide:

### Method 1: Railway Dashboard Se

1. **Railway Dashboard mein jao:**
   - Apne project ko open karo
   - Service (backend) ko click karo

2. **Settings Tab:**
   - Service ke andar **"Settings"** tab click karo
   - Ya **"Networking"** section mein jao

3. **Generate Public Domain:**
   - **"Generate Domain"** button click karo
   - Ya **"Public Domain"** section mein dekho
   - Apko ek URL milega jaise:
     ```
     https://ascendio-production.up.railway.app
     ```
     Ya
     ```
     https://ascendio-production-xxxx.up.railway.app
     ```

4. **URL Copy Karo:**
   - Yeh URL copy karo
   - Format: `https://[something].up.railway.app`

### Method 2: Railway CLI Se

```bash
railway domain
```

### Method 3: Railway Dashboard - Service Overview

1. Service page pe jao
2. Top pe **"Networking"** section dekho
3. **"Public Domain"** ya **"Generate Domain"** option dikhega
4. Click karo aur URL copy karo

## URL Format:

Railway public domain usually yeh format mein hota hai:
- `https://[service-name]-[random-id].up.railway.app`
- `https://[project-name].up.railway.app`
- Custom domain agar set kiya ho

## Important:

- ✅ URL mein `https://` zaroor hona chahiye
- ✅ URL ke end mein `/` nahi hona chahiye
- ✅ Example: `https://ascendio-backend.up.railway.app` ✅
- ❌ Example: `https://ascendio-backend.up.railway.app/` ❌

## Ab Kya Karna Hai:

1. Railway URL copy karo
2. `src/utils/api.ts` file mein line 18 pe paste karo
3. Vercel pe Environment Variable set karo
4. Redeploy karo

