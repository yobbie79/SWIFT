import { useState } from 'react'
import './Login.css'

export default function Login({ role, onLogin, onBack }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password')
      }

      localStorage.setItem('user', JSON.stringify(data))
      onLogin(data)
    } catch (err) {
      console.error('Login error:', err)
      setError(
        err.message === 'Failed to fetch'
          ? 'Unable to connect to the server. Please check your connection.'
          : err.message
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-container">
      <div className="login-card">
        <h1>{role} Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <button type="button" className="back-button" onClick={onBack}>
          Back to Roles
        </button>
      </div>
    </main>
  )
}