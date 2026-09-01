import './Welcome.css'

export default function Welcome({ onGetStarted }) {
  return (
    <main className="welcome-page">
      <div className="welcome-content">
        <h1>SWIFT</h1>
        <p>Smart delivery coordination for growing businesses.</p>

        <button type="button" onClick={onGetStarted}>
          Get Started
        </button>
      </div>
    </main>
  )
}