import axios from "axios"

// Create axios instance
export const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
})

// Intercept responses to handle 401 Unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the error is 401 Unauthorized, clear localStorage and redirect to login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Product services
export const productService = {
  getAll: async (page = 0, size = 10, search = "") => {
    const params = { page, size }
    if (search) params.query = search

    return api.get("/api/products", { params })
  },

  getById: async (id) => {
    return api.get(`/api/products/${id}`)
  },

  create: async (product) => {
    return api.post("/api/products", product)
  },

  update: async (id, product) => {
    return api.put(`/api/products/${id}`, product)
  },

  delete: async (id) => {
    return api.delete(`/api/products/${id}`)
  },

  search: async (query) => {
    return api.get(`/api/products/search?query=${query}`)
  },
}

// Order services
export const orderService = {
  getAll: async (page = 0, size = 10) => {
    return api.get("/api/orders", { params: { page, size } })
  },

  getById: async (id) => {
    return api.get(`/api/orders/${id}`)
  },

  create: async (order) => {
    return api.post("/api/orders", order)
  },

  delete: async (id) => {
    return api.delete(`/api/orders/${id}`)
  },
}

// User services
export const userService = {
  getAll: async (page = 0, size = 10) => {
    return api.get("/api/users", { params: { page, size } })
  },

  getById: async (id) => {
    return api.get(`/api/users/${id}`)
  },

  update: async (id, user) => {
    return api.put(`/api/users/${id}`, user)
  },

  delete: async (id) => {
    return api.delete(`/api/users/${id}`)
  },
}

