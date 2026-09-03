import { useCallback, useEffect, useMemo, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function RiderDashboard({ user, onLogout }) {
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [proof, setProof] = useState({})
  const [actionLoading, setActionLoading] = useState({})

  const fetchDeliveries = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_URL}/deliveries`)

      if (!response.ok) {
        throw new Error('Failed to fetch deliveries')
      }

      const data = await response.json()

      const assignedDeliveries = data.filter(
        (delivery) => user?.id && delivery.riderId === user.id
      )

      setDeliveries(assignedDeliveries)
    } catch (err) {
      console.error(err)
      setError('Unable to load deliveries.')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchDeliveries()
  }, [fetchDeliveries])

  const setDeliveryLoading = (id, isLoading) => {
    setActionLoading((prev) => ({ ...prev, [id]: isLoading }))
  }

  const updateStatus = async (deliveryId, status) => {
    try {
      setDeliveryLoading(deliveryId, true)
      const response = await fetch(
        `${API_URL}/deliveries/${deliveryId}/status`,
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
        prev.map((d) => (d.id === deliveryId ? { ...d, ...updatedDelivery, status } : d))
      )
    } catch (err) {
      console.error(err)
      alert('Unable to update delivery status.')
    } finally {
      setDeliveryLoading(deliveryId, false)
    }
  }

  const submitProof = async (deliveryId) => {
    const proofValue = proof[deliveryId]?.trim()

    if (!proofValue) {
      alert('Please enter proof of delivery.')
      return
    }

    try {
      setDeliveryLoading(deliveryId, true)
      const response = await fetch(
        `${API_URL}/deliveries/${deliveryId}/proof`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            proof: proofValue,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to submit proof')
      }

      const updatedDelivery = await response.json()

      setProof((previous) => ({
        ...previous,
        [deliveryId]: '',
      }))

      setDeliveries((prev) =>
        prev.map((d) => (d.id === deliveryId ? { ...d, ...updatedDelivery } : d))
      )
      alert('Proof of delivery submitted successfully.')
    } catch (err) {
      console.error(err)
      alert('Unable to submit proof of delivery.')
    } finally {
      setDeliveryLoading(deliveryId, false)
    }
  }

  const stats = useMemo(() => {
    const total = deliveries.length
    const assigned = deliveries.filter((d) => d.status === 'ASSIGNED').length
    const pickedUp = deliveries.filter((d) => d.status === 'PICKED_UP').length
    const completed = deliveries.filter((d) => d.status === 'DELIVERED').length

    return { total, assigned, pickedUp, completed }
  }, [deliveries])

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Rider Dashboard</h1>
          <p>Welcome, {user?.name || 'Rider'}</p>
        </div>

        <button onClick={onLogout}>Logout</button>
      </header>

      <main className="dashboard-content">
        <section className="stats-summary">
          <div className="stat-card">
            <span>Total Assigned</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="stat-card">
            <span>Ready for Pickup</span>
            <strong>{stats.assigned}</strong>
          </div>
          <div className="stat-card">
            <span>In Transit</span>
            <strong>{stats.pickedUp}</strong>
          </div>
          <div className="stat-card">
            <span>Completed</span>
            <strong>{stats.completed}</strong>
          </div>
        </section>

        <section className="dashboard-card">
          <h2>My Assigned Deliveries</h2>

          {loading && <p>Loading deliveries...</p>}

          {error && <p className="error-message">{error}</p>}

          {!loading && !error && deliveries.length === 0 && (
            <p>No deliveries assigned to you yet.</p>
          )}

          {!loading && !error && deliveries.length > 0 && (
            <div className="delivery-list">
              {deliveries.map((delivery) => {
                const isItemLoading = actionLoading[delivery.id]

                return (
                  <div className="delivery-card" key={delivery.id}>
                    <h3>Delivery #{delivery.id}</h3>

                    <p>
                      <strong>Customer:</strong> {delivery.customerName}
                    </p>

                    <p>
                      <strong>Phone:</strong> {delivery.customerPhone}
                    </p>

                    <p>
                      <strong>Address:</strong> {delivery.deliveryAddress}
                    </p>

                    <p>
                      <strong>Item:</strong> {delivery.itemDescription}
                    </p>

                    <p>
                      <strong>Status:</strong>{' '}
                      <span className={`status-${delivery.status?.toLowerCase()}`}>
                        {delivery.status}
                      </span>
                    </p>

                    {delivery.proof && (
                      <p>
                        <strong>Proof:</strong> {delivery.proof}
                      </p>
                    )}

                    <div className="delivery-actions">
                      {delivery.status === 'ASSIGNED' && (
                        <button
                          disabled={isItemLoading}
                          onClick={() =>
                            updateStatus(delivery.id, 'PICKED_UP')
                          }
                        >
                          {isItemLoading ? 'Updating...' : 'Mark as Picked Up'}
                        </button>
                      )}

                      {delivery.status === 'PICKED_UP' && (
                        <>
                          <button
                            disabled={isItemLoading}
                            onClick={() =>
                              updateStatus(delivery.id, 'DELIVERED')
                            }
                          >
                            {isItemLoading ? 'Updating...' : 'Mark as Delivered'}
                          </button>

                          <div className="proof-section">
                            <input
                              type="text"
                              placeholder="Enter proof of delivery"
                              value={proof[delivery.id] || ''}
                              disabled={isItemLoading}
                              onChange={(event) =>
                                setProof((previous) => ({
                                  ...previous,
                                  [delivery.id]: event.target.value,
                                }))
                              }
                            />

                            <button
                              disabled={isItemLoading}
                              onClick={() => submitProof(delivery.id)}
                            >
                              {isItemLoading ? 'Submitting...' : 'Submit Proof'}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default RiderDashboard