import { useEffect, useState } from 'react'
import './DispatcherDashboard.css'

function DeliveryCard({ delivery, riders, onAssignRider }) {
  const [selectedRiderId, setSelectedRiderId] = useState('')

  const {
    id,
    customerName,
    customerPhone,
    deliveryAddress,
    itemDescription,
    status,
  } = delivery

  const handleAssign = () => {
    if (!selectedRiderId) {
      alert('Please select a rider')
      return
    }

    onAssignRider(id, selectedRiderId)
  }

  return (
    <article className="delivery-card">
      <div className="delivery-card-header">
        <div>
          <span className="delivery-label">DELIVERY REQUEST</span>
          <h3>{customerName}</h3>
        </div>

        <span className={`dispatcher-status status-${status?.toLowerCase()}`}>
          {status}
        </span>
      </div>

      <div className="delivery-details">
        <div className="detail-item">
          <span className="detail-icon">📞</span>
          <div>
            <small>Phone</small>
            <strong>{customerPhone}</strong>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon">📍</span>
          <div>
            <small>Delivery Address</small>
            <strong>{deliveryAddress}</strong>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon">📦</span>
          <div>
            <small>Item</small>
            <strong>{itemDescription}</strong>
          </div>
        </div>
      </div>

      <div className="assignment-area">
        <div>
          <label htmlFor={`rider-select-${id}`}>
            Assign Rider
          </label>

          <select
            id={`rider-select-${id}`}
            value={selectedRiderId}
            onChange={(e) => setSelectedRiderId(e.target.value)}
          >
            <option value="" disabled>
              Select a rider
            </option>

            {riders.map((rider) => (
              <option key={rider.id} value={rider.id}>
                {rider.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="assign-button"
          onClick={handleAssign}
        >
          Assign Rider
        </button>
      </div>
    </article>
  )
}

function RiderCard({ rider }) {
  const { name, email } = rider

  return (
    <article className="rider-card">
      <div className="rider-avatar">
        {name.charAt(0).toUpperCase()}
      </div>

      <div className="rider-info">
        <h3>{name}</h3>
        <p>{email}</p>
      </div>

      <span className="rider-available">
        Available
      </span>
    </article>
  )
}

export default function DispatcherDashboard() {
  const [deliveries, setDeliveries] = useState([])
  const [riders, setRiders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [deliveriesRes, ridersRes] = await Promise.all([
          fetch('http://localhost:3000/deliveries'),
          fetch('http://localhost:3000/deliveries/riders'),
        ])

        if (!deliveriesRes.ok || !ridersRes.ok) {
          throw new Error('Failed to fetch dashboard data')
        }

        const [deliveriesData, ridersData] = await Promise.all([
          deliveriesRes.json(),
          ridersRes.json(),
        ])

        setDeliveries(deliveriesData)
        setRiders(ridersData)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleAssignRider = async (deliveryId, riderId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/deliveries/${deliveryId}/assign`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            riderId: Number(riderId),
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to assign rider')
      }

      const updatedDelivery = await response.json()

      setDeliveries((currentDeliveries) =>
        currentDeliveries.map((delivery) =>
          delivery.id === updatedDelivery.id
            ? updatedDelivery
            : delivery
        )
      )

      alert('Rider assigned successfully')
    } catch (err) {
      console.error('Error assigning rider:', err)
      alert('Could not assign rider')
    }
  }

  if (isLoading) {
    return (
      <main className="dispatcher-page loading-page">
        <div className="loading-card">
          <div className="loading-icon">🚚</div>
          <h2>Loading Dashboard</h2>
          <p>Getting deliveries and riders...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="dispatcher-page loading-page">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <h2>Unable to load dashboard</h2>
          <p>{error}</p>
        </div>
      </main>
    )
  }

  const pendingDeliveries = deliveries.filter(
    (delivery) => delivery.status === 'PENDING'
  ).length

  const assignedDeliveries = deliveries.filter(
    (delivery) => delivery.riderId
  ).length

  const deliveredDeliveries = deliveries.filter(
    (delivery) => delivery.status === 'DELIVERED'
  ).length

  return (
    <main className="dispatcher-page">
      <header className="dispatcher-header">
        <div>
          <p className="dispatcher-brand">SWIFT</p>
          <h1>Dispatcher Dashboard</h1>
          <p className="dispatcher-subtitle">
            Coordinate deliveries and assign riders efficiently.
          </p>
        </div>

        <div className="dispatcher-status">
          <span className="online-dot"></span>
          Operations Online
        </div>
      </header>

      <section className="dispatcher-stats">
        <div className="dispatcher-stat-card">
          <div className="dispatcher-stat-icon">📋</div>
          <div>
            <span>Total Deliveries</span>
            <strong>{deliveries.length}</strong>
          </div>
        </div>

        <div className="dispatcher-stat-card">
          <div className="dispatcher-stat-icon">⏳</div>
          <div>
            <span>Pending</span>
            <strong>{pendingDeliveries}</strong>
          </div>
        </div>

        <div className="dispatcher-stat-card">
          <div className="dispatcher-stat-icon">🚴</div>
          <div>
            <span>Assigned</span>
            <strong>{assignedDeliveries}</strong>
          </div>
        </div>

        <div className="dispatcher-stat-card">
          <div className="dispatcher-stat-icon">✓</div>
          <div>
            <span>Delivered</span>
            <strong>{deliveredDeliveries}</strong>
          </div>
        </div>
      </section>

      <div className="dispatcher-layout">
        <section className="deliveries-panel">
          <div className="panel-heading">
            <div>
              <h2>Open Delivery Requests</h2>
              <p>Assign available riders to delivery requests.</p>
            </div>

            <span className="panel-count">
              {deliveries.length}
            </span>
          </div>

          {deliveries.length === 0 ? (
            <div className="empty-dispatcher">
              <div>📭</div>
              <h3>No delivery requests</h3>
              <p>
                New retailer requests will appear here.
              </p>
            </div>
          ) : (
            <div className="delivery-list">
              {deliveries.map((delivery) => (
                <DeliveryCard
                  key={delivery.id}
                  delivery={delivery}
                  riders={riders}
                  onAssignRider={handleAssignRider}
                />
              ))}
            </div>
          )}
        </section>

        <aside className="riders-panel">
          <div className="panel-heading">
            <div>
              <h2>Available Riders</h2>
              <p>Riders ready for assignment.</p>
            </div>

            <span className="panel-count">
              {riders.length}
            </span>
          </div>

          {riders.length === 0 ? (
            <div className="empty-dispatcher">
              <div>🚴</div>
              <h3>No riders available</h3>
              <p>
                Registered riders will appear here.
              </p>
            </div>
          ) : (
            <div className="rider-list">
              {riders.map((rider) => (
                <RiderCard
                  key={rider.id}
                  rider={rider}
                />
              ))}
            </div>
          )}
        </aside>
      </div>
    </main>
  )
}