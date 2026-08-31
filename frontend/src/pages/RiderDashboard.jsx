import { useEffect, useState } from 'react'

function DeliveryCard({ delivery, onUpdateStatus, onSubmitProof }) {
  const [proofInput, setProofInput] = useState('')
  const { id, customerName, customerPhone, deliveryAddress, itemDescription, status, proofOfDelivery } = delivery

  const handleProofSubmit = (e) => {
    e.preventDefault()
    if (!proofInput.trim()) {
      alert('Please enter proof of delivery')
      return
    }
    onSubmitProof(id, proofInput)
    setProofInput('')
  }

  return (
    <article style={{ borderBottom: '1px solid #ccc', padding: '1rem 0' }}>
      <p><strong>Customer:</strong> {customerName}</p>
      <p><strong>Phone:</strong> {customerPhone}</p>
      <p><strong>Address:</strong> {deliveryAddress}</p>
      <p><strong>Item:</strong> {itemDescription}</p>
      <p><strong>Status:</strong> {status}</p>

      {status === 'ASSIGNED' && (
        <button type="button" onClick={() => onUpdateStatus(id, 'PICKED_UP')}>
          Mark as Picked Up
        </button>
      )}

      {status === 'PICKED_UP' && (
        <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button type="button" onClick={() => onUpdateStatus(id, 'DELIVERED')}>
            Mark as Delivered
          </button>

          <form onSubmit={handleProofSubmit} style={{ marginTop: '0.5rem' }}>
            <label htmlFor={`proof-${id}`} style={{ display: 'block', fontWeight: 'bold' }}>
              Proof of Delivery
            </label>
            <input
              id={`proof-${id}`}
              type="text"
              placeholder="Enter proof or QR value"
              value={proofInput}
              onChange={(e) => setProofInput(e.target.value)}
              style={{ marginRight: '0.5rem' }}
            />
            <button type="submit">Submit Proof</button>
          </form>
        </div>
      )}

      {status === 'DELIVERED' && (
        <p><strong>Proof of delivery:</strong> {proofOfDelivery || 'N/A'}</p>
      )}
    </article>
  )
}

export default function RiderDashboard({ currentRiderId = 3 }) {
  const [deliveries, setDeliveries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAssignedDeliveries = async () => {
      try {
        const response = await fetch('http://localhost:3000/deliveries')
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`)

        const data = await response.json()
        const riderDeliveries = data.filter((delivery) => delivery.riderId === currentRiderId)

        setDeliveries(riderDeliveries)
      } catch (err) {
        console.error('Error loading deliveries:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssignedDeliveries()
  }, [currentRiderId])

  const handleUpdateStatus = async (deliveryId, status) => {
    try {
      const response = await fetch(`http://localhost:3000/deliveries/${deliveryId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (!response.ok) throw new Error('Failed to update status')

      const updatedDelivery = await response.json()
      setDeliveries((prev) => prev.map((d) => (d.id === updatedDelivery.id ? updatedDelivery : d)))
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Could not update status')
    }
  }

  const handleSubmitProof = async (deliveryId, proofValue) => {
    try {
      const response = await fetch(`http://localhost:3000/deliveries/${deliveryId}/proof`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proofOfDelivery: proofValue })
      })

      if (!response.ok) throw new Error('Failed to submit proof')

      const updatedDelivery = await response.json()
      setDeliveries((prev) => prev.map((d) => (d.id === updatedDelivery.id ? updatedDelivery : d)))
      alert('Proof submitted successfully')
    } catch (err) {
      console.error('Error submitting proof:', err)
      alert('Could not submit proof of delivery')
    }
  }

  return (
    <main>
      <h1>Rider Dashboard</h1>
      <p>View your assigned deliveries and update their status.</p>

      <section>
        <h2>My Deliveries</h2>

        {isLoading && <p>Loading assigned deliveries...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {!isLoading && !error && (
          deliveries.length === 0 ? (
            <p>No deliveries assigned yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {deliveries.map((delivery) => (
                <li key={delivery.id}>
                  <DeliveryCard
                    delivery={delivery}
                    onUpdateStatus={handleUpdateStatus}
                    onSubmitProof={handleSubmitProof}
                  />
                </li>
              ))}
            </ul>
          )
        )}
      </section>
    </main>
  )
}