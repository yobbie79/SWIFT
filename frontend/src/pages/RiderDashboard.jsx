import { useEffect, useState } from 'react'
import './RiderDashboard.css'

function DeliveryCard({ delivery, onUpdateStatus, onSubmitProof }) {
  const [proofInput, setProofInput] = useState('')

  const {
    id,
    customerName,
    customerPhone,
    deliveryAddress,
    itemDescription,
    status,
    proofOfDelivery,
  } = delivery

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
    <article className="rider-delivery-card">
      <div className="rider-delivery-header">
        <div>
          <span className="rider-delivery-label">DELIVERY</span>
          <h3>{customerName}</h3>
        </div>

        <span className={`rider-status status-${status?.toLowerCase()}`}>
          {status}
        </span>
      </div>

      <div className="rider-delivery-details">
        <div className="rider-detail">
          <span className="rider-detail-icon">📞</span>
          <div>
            <small>Customer Phone</small>
            <strong>{customerPhone}</strong>
          </div>
        </div>

        <div className="rider-detail">
          <span className="rider-detail-icon">📍</span>
          <div>
            <small>Delivery Address</small>
            <strong>{deliveryAddress}</strong>
          </div>
        </div>

        <div className="rider-detail">
          <span className="rider-detail-icon">📦</span>
          <div>
            <small>Item</small>
            <strong>{itemDescription}</strong>
          </div>
        </div>
      </div>

      <div className="rider-actions">
        {status === 'ASSIGNED' && (
          <button
            type="button"
            className="primary-rider-button"
            onClick={() => onUpdateStatus(id, 'PICKED_UP')}
          >
            🚚 Mark as Picked Up
          </button>
        )}

        {status === 'PICKED_UP' && (
          <div className="delivery-completion">
            <button
              type="button"
              className="delivered-button"
              onClick={() => onUpdateStatus(id, 'DELIVERED')}
            >
              ✓ Mark as Delivered
            </button>

            <form
              onSubmit={handleProofSubmit}
              className="proof-form"
            >
              <label htmlFor={`proof-${id}`}>
                Proof of Delivery
              </label>

              <div className="proof-input-row">
                <input
                  id={`proof-${id}`}
                  type="text"
                  placeholder="Enter proof or QR value"
                  value={proofInput}
                  onChange={(e) => setProofInput(e.target.value)}
                />

                <button type="submit">
                  Submit Proof
                </button>
              </div>
            </form>
          </div>
        )}

        {status === 'DELIVERED' && (
          <div className="proof-complete">
            <span className="proof-check">✓</span>
            <div>
              <small>Proof of Delivery</small>
              <strong>{proofOfDelivery || 'N/A'}</strong>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

export default function RiderDashboard({ user }) {
  const [deliveries, setDeliveries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAssignedDeliveries = async () => {
      if (!user?.id) {
        setError('No logged-in rider found')
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('http://localhost:3000/deliveries')

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }

        const data = await response.json()

        const riderDeliveries = data.filter(
          (delivery) => delivery.riderId === user.id
        )

        setDeliveries(riderDeliveries)
      } catch (err) {
        console.error('Error loading deliveries:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssignedDeliveries()
  }, [user])

  const handleUpdateStatus = async (deliveryId, status) => {
    try {
      const response = await fetch(
        `http://localhost:3000/deliveries/${deliveryId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      const updatedDelivery = await response.json()

      setDeliveries((prev) =>
        prev.map((delivery) =>
          delivery.id === updatedDelivery.id
            ? updatedDelivery
            : delivery
        )
      )
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Could not update status')
    }
  }

  const handleSubmitProof = async (deliveryId, proofValue) => {
    try {
      const response = await fetch(
        `http://localhost:3000/deliveries/${deliveryId}/proof`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            proofOfDelivery: proofValue,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to submit proof')
      }

      const updatedDelivery = await response.json()

      setDeliveries((prev) =>
        prev.map((delivery) =>
          delivery.id === updatedDelivery.id
            ? updatedDelivery
            : delivery
        )
      )

      alert('Proof submitted successfully')
    } catch (err) {
      console.error('Error submitting proof:', err)
      alert('Could not submit proof of delivery')
    }
  }

  const assignedCount = deliveries.length

  const pickedUpCount = deliveries.filter(
    (delivery) => delivery.status === 'PICKED_UP'
  ).length

  const deliveredCount = deliveries.filter(
    (delivery) => delivery.status === 'DELIVERED'
  ).length

  return (
    <main className="rider-page">
      <header className="rider-header">
        <div>
          <p className="rider-brand">SWIFT</p>
          <h1>Rider Dashboard</h1>
          <p className="rider-subtitle">
            Manage your assigned deliveries and update their progress.
          </p>
        </div>

        <div className="rider-online-status">
          <span className="rider-online-dot"></span>
          Rider Online
        </div>
      </header>

      <section className="rider-stats">
        <div className="rider-stat-card">
          <div className="rider-stat-icon">📦</div>
          <div>
            <span>My Deliveries</span>
            <strong>{assignedCount}</strong>
          </div>
        </div>

        <div className="rider-stat-card">
          <div className="rider-stat-icon">🚚</div>
          <div>
            <span>Picked Up</span>
            <strong>{pickedUpCount}</strong>
          </div>
        </div>

        <div className="rider-stat-card">
          <div className="rider-stat-icon">✓</div>
          <div>
            <span>Delivered</span>
            <strong>{deliveredCount}</strong>
          </div>
        </div>
      </section>

      <section className="my-deliveries-card">
        <div className="rider-section-heading">
          <div>
            <h2>My Deliveries</h2>
            <p>
              View your assigned deliveries and update their status.
            </p>
          </div>

          <span className="rider-count">
            {deliveries.length}{' '}
            {deliveries.length === 1 ? 'Delivery' : 'Deliveries'}
          </span>
        </div>

        {isLoading && (
          <div className="rider-message">
            <div className="message-icon">🚚</div>
            <h3>Loading deliveries...</h3>
            <p>Getting your assigned deliveries.</p>
          </div>
        )}

        {error && (
          <div className="rider-error">
            <div>⚠️</div>
            <h3>Unable to load deliveries</h3>
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          deliveries.length === 0 ? (
            <div className="rider-message">
              <div className="message-icon">📭</div>
              <h3>No deliveries assigned yet</h3>
              <p>
                Your assigned deliveries will appear here.
              </p>
            </div>
          ) : (
            <div className="rider-delivery-list">
              {deliveries.map((delivery) => (
                <DeliveryCard
                  key={delivery.id}
                  delivery={delivery}
                  onUpdateStatus={handleUpdateStatus}
                  onSubmitProof={handleSubmitProof}
                />
              ))}
            </div>
          )
        )}
      </section>
    </main>
  )
}