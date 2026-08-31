import { useEffect, useState } from 'react'

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

  return (
    <main>
      <h1>Retailer Dashboard</h1>
      <p>Manage your delivery requests.</p>

      <section>
        <h2>Create Delivery Request</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="customerName"
            type="text"
            placeholder="Customer name"
            value={formData.customerName}
            onChange={handleChange}
            required
          />

          <input
            name="customerPhone"
            type="tel"
            placeholder="Customer phone"
            value={formData.customerPhone}
            onChange={handleChange}
            required
          />

          <input
            name="deliveryAddress"
            type="text"
            placeholder="Delivery address"
            value={formData.deliveryAddress}
            onChange={handleChange}
            required
          />

          <input
            name="itemDescription"
            type="text"
            placeholder="Item description"
            value={formData.itemDescription}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Request'}
          </button>
        </form>

        {message && <p>{message}</p>}
        {error && <p>{error}</p>}
      </section>

      <section>
        <h2>Recent Delivery Requests</h2>

        {deliveries.length === 0 ? (
          <p>No delivery requests yet.</p>
        ) : (
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
                  <td>{delivery.customerName}</td>
                  <td>{delivery.customerPhone}</td>
                  <td>{delivery.deliveryAddress}</td>
                  <td>{delivery.itemDescription}</td>
                  <td>{delivery.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  )
}

export default RetailerDashboard