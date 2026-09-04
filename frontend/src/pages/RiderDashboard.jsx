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
    setActionLoading((prev) => ({
      ...prev,
      [id]: isLoading,
    }))
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
        const message = await response.text()
        console.error('Status update error:', message)
        throw new Error('Failed to update status')
      }

      const updatedDelivery = await response.json()

      setDeliveries((prev) =>
        prev.map((delivery) =>
          delivery.id === deliveryId
            ? { ...delivery, ...updatedDelivery }
            : delivery
        )
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
            proofOfDelivery: proofValue,
          }),
        }
      )

      if (!response.ok) {
        const message = await response.text()
        console.error('Proof submission error:', message)
        throw new Error('Failed to submit proof')
      }

      const updatedDelivery = await response.json()

      setProof((previous) => ({
        ...previous,
        [deliveryId]: '',
      }))

      setDeliveries((prev) =>
        prev.map((delivery) =>
          delivery.id === deliveryId
            ? { ...delivery, ...updatedDelivery }
            : delivery
        )
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
    const assigned = deliveries.filter(
      (delivery) => delivery.status === 'ASSIGNED'
    ).length
    const pickedUp = deliveries.filter(
      (delivery) => delivery.status === 'PICKED_UP'
    ).length
    const completed = deliveries.filter(
      (delivery) => delivery.status === 'DELIVERED'
    ).length

    return {
      total,
      assigned,
      pickedUp,
      completed,
    }
  }, [deliveries])

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ASSIGNED':
        return 'Assigned'
      case 'PICKED_UP':
        return 'Picked Up'
      case 'DELIVERED':
        return 'Delivered'
      case 'PENDING':
        return 'Pending'
      default:
        return status || 'Unknown'
    }
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <div style={styles.brand}>SWIFT</div>
          <h1 style={styles.title}>Rider Dashboard</h1>
          <p style={styles.welcome}>
            Welcome back, {user?.name || 'Rider'}
          </p>
        </div>

        <button style={styles.logoutButton} onClick={onLogout}>
          Logout
        </button>
      </header>

      <main style={styles.content}>
        <section style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Total Deliveries</span>
            <strong style={styles.statNumber}>{stats.total}</strong>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statLabel}>Assigned</span>
            <strong style={styles.statNumber}>{stats.assigned}</strong>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statLabel}>In Transit</span>
            <strong style={styles.statNumber}>{stats.pickedUp}</strong>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statLabel}>Completed</span>
            <strong style={styles.statNumber}>{stats.completed}</strong>
          </div>
        </section>

        <section style={styles.mainCard}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>My Assigned Deliveries</h2>
              <p style={styles.sectionSubtitle}>
                Manage your assigned deliveries and submit proof of delivery.
              </p>
            </div>

            <button
              style={styles.refreshButton}
              onClick={fetchDeliveries}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {loading && (
            <div style={styles.messageBox}>
              Loading your deliveries...
            </div>
          )}

          {error && (
            <div style={styles.errorBox}>
              {error}
            </div>
          )}

          {!loading && !error && deliveries.length === 0 && (
            <div style={styles.emptyBox}>
              <div style={styles.emptyIcon}>📦</div>
              <h3 style={styles.emptyTitle}>No deliveries assigned</h3>
              <p style={styles.emptyText}>
                New deliveries assigned to you by the dispatcher will appear
                here.
              </p>
            </div>
          )}

          {!loading && !error && deliveries.length > 0 && (
            <div style={styles.deliveryList}>
              {deliveries.map((delivery) => {
                const isItemLoading = actionLoading[delivery.id]
                const status = delivery.status

                return (
                  <article style={styles.deliveryCard} key={delivery.id}>
                    <div style={styles.deliveryTop}>
                      <div>
                        <span style={styles.deliveryNumber}>
                          DELIVERY #{delivery.id}
                        </span>
                        <h3 style={styles.customerName}>
                          {delivery.customerName}
                        </h3>
                      </div>

                      <span
                        style={{
                          ...styles.statusBadge,
                          ...(status === 'ASSIGNED'
                            ? styles.assignedBadge
                            : status === 'PICKED_UP'
                              ? styles.pickedUpBadge
                              : status === 'DELIVERED'
                                ? styles.deliveredBadge
                                : styles.pendingBadge),
                        }}
                      >
                        {getStatusLabel(status)}
                      </span>
                    </div>

                    <div style={styles.detailsGrid}>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Phone</span>
                        <span style={styles.detailValue}>
                          {delivery.customerPhone}
                        </span>
                      </div>

                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Address</span>
                        <span style={styles.detailValue}>
                          {delivery.deliveryAddress}
                        </span>
                      </div>

                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Item</span>
                        <span style={styles.detailValue}>
                          {delivery.itemDescription}
                        </span>
                      </div>

                      {delivery.proofOfDelivery && (
                        <div style={styles.detailItem}>
                          <span style={styles.detailLabel}>Proof</span>
                          <span style={styles.detailValue}>
                            {delivery.proofOfDelivery}
                          </span>
                        </div>
                      )}
                    </div>

                    <div style={styles.actionArea}>
                      {status === 'ASSIGNED' && (
                        <button
                          style={styles.primaryButton}
                          disabled={isItemLoading}
                          onClick={() =>
                            updateStatus(delivery.id, 'PICKED_UP')
                          }
                        >
                          {isItemLoading
                            ? 'Updating...'
                            : 'Mark as Picked Up'}
                        </button>
                      )}

                      {status === 'PICKED_UP' && (
                        <div style={styles.proofContainer}>
                          <div>
                            <h4 style={styles.proofTitle}>
                              Proof of Delivery
                            </h4>
                            <p style={styles.proofDescription}>
                              Enter the QR code or proof provided after
                              delivering the package.
                            </p>
                          </div>

                          <div style={styles.proofForm}>
                            <input
                              type="text"
                              placeholder="e.g. QR-DELIVERY-001"
                              value={proof[delivery.id] || ''}
                              disabled={isItemLoading}
                              onChange={(event) =>
                                setProof((previous) => ({
                                  ...previous,
                                  [delivery.id]: event.target.value,
                                }))
                              }
                              style={styles.proofInput}
                            />

                            <button
                              style={styles.successButton}
                              disabled={isItemLoading}
                              onClick={() => submitProof(delivery.id)}
                            >
                              {isItemLoading
                                ? 'Submitting...'
                                : 'Submit Proof & Complete'}
                            </button>
                          </div>
                        </div>
                      )}

                      {status === 'DELIVERED' && (
                        <div style={styles.completedBox}>
                          <strong>✓ Delivery Completed</strong>
                          <span>
                            Proof of delivery has been submitted successfully.
                          </span>
                        </div>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f4f7fb',
    color: '#172033',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  header: {
    background: '#ffffff',
    borderBottom: '1px solid #e4e9f0',
    padding: '24px 6%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
  },

  brand: {
    fontSize: '14px',
    fontWeight: '800',
    letterSpacing: '3px',
    marginBottom: '8px',
  },

  title: {
    margin: '0',
    fontSize: '28px',
    fontWeight: '800',
  },

  welcome: {
    margin: '6px 0 0',
    color: '#667085',
    fontSize: '15px',
  },

  logoutButton: {
    border: '1px solid #d9dee7',
    background: '#ffffff',
    color: '#344054',
    padding: '10px 18px',
    borderRadius: '9px',
    fontWeight: '700',
    cursor: 'pointer',
  },

  content: {
    width: '90%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 0 60px',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '18px',
    marginBottom: '28px',
  },

  statCard: {
    background: '#ffffff',
    border: '1px solid #e4e9f0',
    borderRadius: '14px',
    padding: '22px',
    boxShadow: '0 3px 12px rgba(16, 24, 40, 0.04)',
  },

  statLabel: {
    display: 'block',
    color: '#667085',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '10px',
  },

  statNumber: {
    display: 'block',
    fontSize: '30px',
    fontWeight: '800',
  },

  mainCard: {
    background: '#ffffff',
    border: '1px solid #e4e9f0',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 4px 16px rgba(16, 24, 40, 0.05)',
  },

  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '24px',
  },

  sectionTitle: {
    margin: '0',
    fontSize: '21px',
    fontWeight: '800',
  },

  sectionSubtitle: {
    margin: '7px 0 0',
    color: '#667085',
    fontSize: '14px',
  },

  refreshButton: {
    border: '1px solid #d9dee7',
    background: '#ffffff',
    padding: '9px 15px',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
  },

  deliveryList: {
    display: 'grid',
    gap: '18px',
  },

  deliveryCard: {
    border: '1px solid #e4e9f0',
    borderRadius: '14px',
    padding: '22px',
    background: '#fbfcfe',
  },

  deliveryTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    marginBottom: '20px',
  },

  deliveryNumber: {
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '1.2px',
    color: '#667085',
  },

  customerName: {
    margin: '6px 0 0',
    fontSize: '20px',
    fontWeight: '800',
  },

  statusBadge: {
    padding: '7px 12px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '800',
    whiteSpace: 'nowrap',
  },

  assignedBadge: {
    background: '#eef4ff',
    color: '#175cd3',
  },

  pickedUpBadge: {
    background: '#fff6ed',
    color: '#c4320a',
  },

  deliveredBadge: {
    background: '#ecfdf3',
    color: '#027a48',
  },

  pendingBadge: {
    background: '#f2f4f7',
    color: '#475467',
  },

  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    padding: '18px 0',
    borderTop: '1px solid #e4e9f0',
    borderBottom: '1px solid #e4e9f0',
  },

  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },

  detailLabel: {
    fontSize: '11px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.7px',
    color: '#98a2b3',
  },

  detailValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#344054',
  },

  actionArea: {
    paddingTop: '18px',
  },

  primaryButton: {
    border: 'none',
    background: '#172033',
    color: '#ffffff',
    padding: '12px 18px',
    borderRadius: '9px',
    fontWeight: '700',
    cursor: 'pointer',
  },

  proofContainer: {
    background: '#ffffff',
    border: '1px solid #e4e9f0',
    borderRadius: '12px',
    padding: '18px',
  },

  proofTitle: {
    margin: '0',
    fontSize: '16px',
    fontWeight: '800',
  },

  proofDescription: {
    margin: '6px 0 16px',
    color: '#667085',
    fontSize: '13px',
  },

  proofForm: {
    display: 'flex',
    gap: '10px',
  },

  proofInput: {
    flex: '1',
    minWidth: '0',
    border: '1px solid #d0d5dd',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '14px',
    outline: 'none',
  },

  successButton: {
    border: 'none',
    background: '#027a48',
    color: '#ffffff',
    padding: '12px 18px',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
  },

  completedBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    background: '#ecfdf3',
    border: '1px solid #abefc6',
    color: '#027a48',
    borderRadius: '10px',
    padding: '14px 16px',
    fontSize: '14px',
  },

  messageBox: {
    padding: '35px',
    textAlign: 'center',
    color: '#667085',
  },

  errorBox: {
    padding: '15px',
    borderRadius: '9px',
    background: '#fef3f2',
    color: '#b42318',
    marginBottom: '20px',
  },

  emptyBox: {
    textAlign: 'center',
    padding: '55px 20px',
    border: '1px dashed #d0d5dd',
    borderRadius: '12px',
    background: '#fbfcfe',
  },

  emptyIcon: {
    fontSize: '36px',
    marginBottom: '10px',
  },

  emptyTitle: {
    margin: '0 0 7px',
    fontSize: '18px',
  },

  emptyText: {
    margin: '0',
    color: '#667085',
    fontSize: '14px',
  },
}

export default RiderDashboard