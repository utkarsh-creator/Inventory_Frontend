"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { productService, orderService } from "../services/api"
import Alert from "../components/common/Alert"

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    lowStockProducts: 0,
  })
  const [recentProducts, setRecentProducts] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch products
        const productsResponse = await productService.getAll(0, 5)
        setRecentProducts(productsResponse.data.content || [])

        // Calculate low stock products (assuming products have a 'stock' field)
        const lowStockCount =
          productsResponse.data.content?.filter((product) => product.stock && product.stock < 10).length || 0

        // Fetch orders
        const ordersResponse = await orderService.getAll(0, 5)
        setRecentOrders(ordersResponse.data.content || [])

        // Set statistics
        setStats({
          totalProducts: productsResponse.data.totalElements || 0,
          totalOrders: ordersResponse.data.totalElements || 0,
          lowStockProducts: lowStockCount,
        })
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="container">
        <div className="text-center my-5">
          <h2>Loading dashboard...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card-header">
        <h1 className="card-title">Dashboard</h1>
      </div>

      {error && <Alert message={error} type="danger" />}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Products</h3>
          <div className="stat-value">{stats.totalProducts}</div>
        </div>

        <div className="stat-card">
          <h3>Total Orders</h3>
          <div className="stat-value">{stats.totalOrders}</div>
        </div>

        <div className="stat-card">
          <h3>Low Stock Products</h3>
          <div className="stat-value">{stats.lowStockProducts}</div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Products</h2>
              <Link to="/products" className="btn btn-primary">
                View All
              </Link>
            </div>
            <div className="table-container">
              {recentProducts.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>${product.price?.toFixed(2)}</td>
                        <td>
                          <Link to={`/products/${product.id}`} className="btn btn-sm btn-primary mr-2">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center my-3">No products found</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Orders</h2>
              <Link to="/orders" className="btn btn-primary">
                View All
              </Link>
            </div>
            <div className="table-container">
              {recentOrders.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Link to={`/orders/${order.id}`} className="btn btn-sm btn-primary mr-2">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center my-3">No orders found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

