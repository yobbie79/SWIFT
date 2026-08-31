import './Login.css'

function Login({ role, onLogin, onBack }) {
  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin()
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <h1>{role} Login</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" placeholder="Enter your name" required />

          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Enter your email" required />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            required
          />

          <button type="submit">Login</button>
        </form>

        <button type="button" className="back-button" onClick={onBack}>
          Back to Roles
        </button>
      </div>
    </main>
  )
}

export default Login