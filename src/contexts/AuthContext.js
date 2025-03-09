"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { api } from "../services/api"
import { isTokenExpired, getUserFromToken } from "../utils/authUtils"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = async () => {
    try {
      // This is a mock implementation since we don't have a specific endpoint for getting current user
      // In a real app, you would have an endpoint to get the current user's profile
      const response = await api.get("/api/users/me")
      setUser(response.data)
    } catch (error) {
      console.error("Error fetching user profile:", error)
      logout()
    }
  }

  // Check if user is already logged in (token in localStorage)
  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      // Check if token is expired
      if (isTokenExpired(token)) {
        console.log("Token is expired, logging out")
        logout()
        setLoading(false)
        return
      }

      // Set token in API headers
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      // Extract user info from token
      const userInfo = getUserFromToken(token)
      if (userInfo) {
        setUser(userInfo)
      } else {
        // If we can't extract user info, try to fetch it
        fetchUserProfile()
      }
    }

    setLoading(false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Updated to use username instead of email for login
  const login = async (username, password) => {
    try {
      console.log("Sending login request with username:", username)

      const response = await api.post("/api/auth/login", { username, password })

      // Check if the token is in the response
      const { token } = response.data

      if (!token) {
        console.error("No token received from server")
        return {
          success: false,
          message: "Authentication failed. No token received.",
        }
      }

      // Save token to localStorage
      localStorage.setItem("token", token)

      // Set token in API headers
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      // Extract user info from token
      const userInfo = getUserFromToken(token)
      if (userInfo) {
        setUser(userInfo)
        return { success: true }
      }

      try {
        // If we can't extract user info from token, try to fetch it
        await fetchUserProfile()
        return { success: true }
      } catch (error) {
        console.error("Error validating token:", error)
        logout()
        return {
          success: false,
          message: "Authentication succeeded but token validation failed.",
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      // Provide more detailed error message based on the response
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Invalid credentials"

      return {
        success: false,
        message: errorMessage,
      }
    }
  }

  const register = async (username, email, password) => {
    try {
      await api.post("/api/auth/register", { username, email, password })
      return { success: true }
    } catch (error) {
      console.error("Registration error:", error)
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Registration failed"

      return {
        success: false,
        message: errorMessage,
      }
    }
  }

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token")

    // Remove token from API headers
    delete api.defaults.headers.common["Authorization"]

    // Clear user state
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

