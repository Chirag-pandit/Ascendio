// API Configuration
// Production mein Railway URL use hoga, development mein localhost

const getApiUrl = () => {
  // Vercel pe VITE_API_URL environment variable set karein
  // Railway ka public URL yahan set karein
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // Development mein empty string = vite proxy use hoga
  if (import.meta.env.DEV) {
    return '' // Empty = same origin, vite proxy handle karega
  }
  
  // Production fallback - Railway URL yahan set karein
  // Railway se milne wala public URL yahan paste karein
  return 'https://your-railway-app.up.railway.app'
}

export const API_BASE_URL = getApiUrl()

// API call helper function
export const apiCall = async (endpoint: string, options?: RequestInit) => {
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
    return response
  } catch (error) {
    console.error('API call error:', error)
    throw error
  }
}

