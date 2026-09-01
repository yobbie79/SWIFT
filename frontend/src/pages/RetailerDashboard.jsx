import { useEffect, useState } from 'react'
import './RetailerDashboard.css'

function RetailerDashboard() {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    itemDescription: '',
  })

  const [deliveries, setDeliveries] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const loadDeliveries = async () => {
    try {
      const response = await fetch('http://localhost:3000/deliveries')

      if (!response.ok) {
        throw new Error('Failed to load deliveries')
      }

      const data = await response.json()
      setDeliveries(data)
    } catch (err) {
      console.error(err)
      setError('Could not load delivery requests.')
    }
  }

  useEffect(() => {
    loadDeliveries()
  }, [])

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

    try {
      const response = await fetch('http://localhost:3000/deliveries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create delivery request')
      }

      const delivery = await response.json()

      setMessage('Delivery request created successfully!')

      setFormData({
        customerName: '',
        customerPhone: '',
        deliveryAddress: '',
        itemDescription: '',
      })

      setDeliveries((current) => [delivery, ...current])
    } catch (err) {
      console.error(err)
      setError('Could not create delivery request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const totalRequests = deliveries.length
  const pendingRequests = deliveries.filter(
    (delivery) => delivery.status === 'PENDING'
  ).length
  const inTransitRequests = deliveries.filter(
    (delivery) => delivery.status === 'IN_TRANSIT'
  ).length
  const deliveredRequests = deliveries.filter(
    (delivery) => delivery.status === 'DELIVERED'
  ).length

  return (
    <main className="retailer-page">
      <header className="retailer-header">
        <div>
          <p className="retailer-brand">SWIFT</p>
          <h1>Retailer Dashboard</h1>
          <p className="retailer-subtitle">
            Manage your delivery requests in one place.
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
            <strong>{totalRequests}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">⏳</span>
          <div>
            <p>Pending</p>
            <strong>{pendingRequests}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🚚</span>
          <div>
            <p>In Transit</p>
            <strong>{inTransitRequests}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">✓</span>
          <div>
            <p>Delivered</p>
            <strong>{deliveredRequests}</strong>
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

        {deliveries.length === 0 ? (
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

export default RetailerDashboard