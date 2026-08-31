import './RoleSelection.css'

function RoleSelection({ onSelectRole, onBack }) {
  return (
    <main className="role-page">
      <div className="role-content">
        <h1>Choose Your Role</h1>
        <p>Select how you will use SWIFT.</p>

        <div className="role-list">
          <button type="button" onClick={() => onSelectRole('Retailer')}>
            Retailer
          </button>

          <button type="button" onClick={() => onSelectRole('Dispatcher')}>
            Dispatcher
          </button>

          <button type="button" onClick={() => onSelectRole('Rider')}>
            Rider
          </button>
        </div>

        <button type="button" className="back-button" onClick={onBack}>
          Back
        </button>
      </div>
    </main>
  )
}

export default RoleSelection