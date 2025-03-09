// Helper functions for authentication and token handling

// Parse JWT token to get user information
export const parseJwt = (token) => {
    try {
      // Split the token and get the payload part
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      )
  
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error("Error parsing JWT token:", error)
      return null
    }
  }
  
  // Check if token is expired
  export const isTokenExpired = (token) => {
    try {
      const decoded = parseJwt(token)
      if (!decoded || !decoded.exp) return true
  
      // exp is in seconds, Date.now() is in milliseconds
      return decoded.exp * 1000 < Date.now()
    } catch (error) {
      console.error("Error checking token expiration:", error)
      return true
    }
  }
  
  // Extract user info from token
  export const getUserFromToken = (token) => {
    try {
      const decoded = parseJwt(token)
      if (!decoded) return null
  
      // The structure depends on your JWT token payload
      // Adjust these fields based on what your backend includes in the token
      return {
        id: decoded.id || decoded.sub,
        email: decoded.email,
        username: decoded.username || decoded.preferred_username,
        role: decoded.role || decoded.roles || "USER",
      }
    } catch (error) {
      console.error("Error extracting user from token:", error)
      return null
    }
  }
  
  