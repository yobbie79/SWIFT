import { useEffect, useState } from 'react'

function DeliveryCard({ delivery, riders, onAssignRider }) {
  const [selectedRiderId, setSelectedRiderId] = useState('')
  const { id, customerName, customerPhone, deliveryAddress, itemDescription, status } = delivery

  const handleAssign = () => {
    if (!selectedRiderId) {
      alert('Please select a rider')
      return
    }
    onAssignRider(id, selectedRiderId)
  }

  return (
    <article style={{ borderBottom: '1px solid #ccc', padding: '1rem 0' }}>
      <p><strong>Customer:</strong> {customerName}</p>
      <p><strong>Phone:</strong> {customerPhone}</p>
      <p><strong>Address:</strong> {deliveryAddress}</p>
      <p><strong>Item:</strong> {itemDescription}</p>
      <p><strong>Status:</strong> {status}</p>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
        <label htmlFor={`rider-select-${id}`}>Assign Rider:</label>
        <select
          id={`rider-select-${id}`}
          value={selectedRiderId}
          onChange={(e) => setSelectedRiderId(e.target.value)}
        >
          <option value="" disabled>Select rider</option>
          {riders.map((rider) => (
            <option key={rider.id} value={rider.id}>
              {rider.name}
            </option>
          ))}
        </select>

        <button type="button" onClick={handleAssign}>
          Assign Rider
        </button>
      </div>
    </article>
  )
}

function RiderCard({ rider }) {
  const { name, email } = rider

  return (
    <article style={{ borderBottom: '1px solid #ccc', padding: '1rem 0' }}>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
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
          fetch('http://localhost:3000/deliveries/riders')
        ])

        if (!deliveriesRes.ok || !ridersRes.ok) {
          throw new Error('Failed to fetch dashboard data')
        }

        const [deliveriesData, ridersData] = await Promise.all([
          deliveriesRes.json(),
          ridersRes.json()
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
      const response = await fetch(`http://localhost:3000/deliveries/${deliveryId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ riderId: Number(riderId) })
      })

      if (!response.ok) throw new Error('Failed to assign rider')

      const updatedDelivery = await response.json()

      setDeliveries((currentDeliveries) =>
        currentDeliveries.map((delivery) =>
          delivery.id === updatedDelivery.id ? updatedDelivery : delivery
        )
      )

      alert('Rider assigned successfully')
    } catch (err) {
      console.error('Error assigning rider:', err)
      alert('Could not assign rider')
    }
  }

  if (isLoading) return <main><p>Loading dashboard...</p></main>
  if (error) return <main><p style={{ color: 'red' }}>Error: {error}</p></main>

  return (
    <main>
      <h1>Dispatcher Dashboard</h1>
      <p>Manage and assign delivery requests.</p>

      <section>
        <h2>Open Delivery Requests</h2>
        {deliveries.length === 0 ? (
          <p>No delivery requests yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {deliveries.map((delivery) => (
              <li key={delivery.id}>
                <DeliveryCard
                  delivery={delivery}
                  riders={riders}
                  onAssignRider={handleAssignRider}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Available Riders</h2>
        {riders.length === 0 ? (
          <p>No riders available yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {riders.map((rider) => (
              <li key={rider.id}>
                <RiderCard rider={rider} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}