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
<<<<<<< HEAD
  return 'https://ascendio-production.up.railway.app/admin'
=======
  return 'https://ascendio-production.up.railway.app'
>>>>>>> 7d9d4547d3bf580ea06c7468449479121c000d3f
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

