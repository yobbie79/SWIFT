import { useCallback, useEffect, useMemo, useState } from 'react'
import './RetailerDashboard.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const INITIAL_FORM_DATA = {
  customerName: '',
  customerPhone: '',
  deliveryAddress: '',
  itemDescription: '',
}

export default function RetailerDashboard({ user }) {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [deliveries, setDeliveries] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  const loadDeliveries = useCallback(async () => {
    try {
      setError('')
      const response = await fetch(`${API_URL}/deliveries`)

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }

      const data = await response.json()
      // Filter by logged-in retailer if retailerId exists on entity
      const retailerDeliveries = user?.id
        ? data.filter((item) => !item.retailerId || item.retailerId === user.id)
        : data

      setDeliveries(retailerDeliveries)
    } catch (err) {
      console.error('Error fetching deliveries:', err)
      setError('Could not load delivery requests.')
    } finally {
      setIsFetching(false)
    }
  }, [user?.id])

  useEffect(() => {
    loadDeliveries()
  }, [loadDeliveries])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)

    const payload = {
      ...formData,
      ...(user?.id && { retailerId: user.id }),
    }

    try {
      const response = await fetch(`${API_URL}/deliveries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to create delivery request')
      }

      const delivery = await response.json()

      setMessage('Delivery request created successfully!')
      setFormData(INITIAL_FORM_DATA)
      setDeliveries((current) => [delivery, ...current])
    } catch (err) {
      console.error('Error creating delivery:', err)
      setError(err.message || 'Could not create delivery request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => {
    const total = deliveries.length
    const pending = deliveries.filter((d) => d.status === 'PENDING').length
    const inTransit = deliveries.filter(
      (d) => d.status === 'IN_TRANSIT' || d.status === 'PICKED_UP'
    ).length
    const delivered = deliveries.filter((d) => d.status === 'DELIVERED').length

    return { total, pending, inTransit, delivered }
  }, [deliveries])

  return (
    <main className="retailer-page">
      <header className="retailer-header">
        <div>
          <p className="retailer-brand">SWIFT</p>
          <h1>Retailer Dashboard</h1>
          <p className="retailer-subtitle">
            {user?.name ? `Welcome back, ${user.name}. ` : ''}Manage your delivery requests in one place.
          </p>
        </div>

        <div className="retailer-status">
          <span className="status-dot"></span>
          System Online
        </div>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">📦</span>
          <div>
            <p>Total Requests</p>
            <strong>{stats.total}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">⏳</span>
          <div>
            <p>Pending</p>
            <strong>{stats.pending}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🚚</span>
          <div>
            <p>In Transit</p>
            <strong>{stats.inTransit}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">✓</span>
          <div>
            <p>Delivered</p>
            <strong>{stats.delivered}</strong>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="request-card">
          <div className="section-heading">
            <div>
              <h2>Create Delivery Request</h2>
              <p>Enter the customer's delivery details below.</p>
            </div>
            <span className="heading-icon">＋</span>
          </div>

          <form onSubmit={handleSubmit} className="delivery-form">
            <div className="form-group">
              <label htmlFor="customerName">Customer Name</label>
              <input
                id="customerName"
                name="customerName"
                type="text"
                placeholder="Enter customer name"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="customerPhone">Customer Phone</label>
              <input
                id="customerPhone"
                name="customerPhone"
                type="tel"
                placeholder="e.g. 0712 345 678"
                value={formData.customerPhone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="deliveryAddress">Delivery Address</label>
              <input
                id="deliveryAddress"
                name="deliveryAddress"
                type="text"
                placeholder="Enter delivery address"
                value={formData.deliveryAddress}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="itemDescription">Item Description</label>
              <input
                id="itemDescription"
                name="itemDescription"
                type="text"
                placeholder="What is being delivered?"
                value={formData.itemDescription}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="create-button"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Delivery Request'}
            </button>
          </form>

          {message && <div className="success-message">✓ {message}</div>}
          {error && <div className="error-message">⚠ {error}</div>}
        </div>

        <div className="info-card">
          <div className="info-icon">🚀</div>
          <h2>Deliver with SWIFT</h2>
          <p>
            Create a request and let your dispatcher coordinate the delivery
            with an available rider.
          </p>

          <div className="info-steps">
            <div>
              <span>1</span>
              <p>Create request</p>
            </div>

            <div>
              <span>2</span>
              <p>Rider assigned</p>
            </div>

            <div>
              <span>3</span>
              <p>Track delivery</p>
            </div>
          </div>
        </div>
      </section>

      <section className="recent-card">
        <div className="section-heading">
          <div>
            <h2>Recent Delivery Requests</h2>
            <p>Overview of your latest delivery activity.</p>
          </div>

          <span className="request-count">
            {deliveries.length} {deliveries.length === 1 ? 'Request' : 'Requests'}
          </span>
        </div>

        {isFetching ? (
          <p className="loading-state">Loading delivery requests...</p>
        ) : deliveries.length === 0 ? (
          <div className="empty-state">
            <div>📭</div>
            <h3>No delivery requests yet</h3>
            <p>Create your first delivery request using the form above.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Item</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {deliveries.map((delivery) => (
                  <tr key={delivery.id}>
                    <td className="customer-cell">
                      {delivery.customerName}
                    </td>
                    <td>{delivery.customerPhone}</td>
                    <td>{delivery.deliveryAddress}</td>
                    <td>{delivery.itemDescription}</td>
                    <td>
                      <span
                        className={`delivery-status status-${delivery.status?.toLowerCase()}`}
                      >
                        {delivery.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}