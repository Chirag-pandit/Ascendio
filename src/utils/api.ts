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
  return 'https://railway.com/project/529ca8d0-47bb-4067-8869-fe16b5b5ca4e/service/32c5dc71-1eb6-4605-bd29-c572ec4b6f54?environmentId=dd15a82d-ec38-4fb5-a01c-1e42d5f62481&id=e584956a-2829-45d9-9bd6-3d1ac855735d'
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

