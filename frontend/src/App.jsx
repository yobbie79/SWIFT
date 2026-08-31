import { useState } from 'react'
import Welcome from './pages/Welcome'
import RoleSelection from './pages/RoleSelection'
import Login from './pages/Login'
import RetailerDashboard from './pages/RetailerDashboard'
import DispatcherDashboard from './pages/DispatcherDashboard'
import RiderDashboard from './pages/RiderDashboard'

function App() {
  const [page, setPage] = useState('welcome')
  const [role, setRole] = useState('')

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole)
    setPage('login')
  }

  const handleLogin = () => {
    if (role === 'Retailer') {
      setPage('retailer-dashboard')
    } else if (role === 'Dispatcher') {
      setPage('dispatcher-dashboard')
    } else if (role === 'Rider') {
      setPage('rider-dashboard')
    }
  }

  if (page === 'roles') {
    return (
      <RoleSelection
        onSelectRole={handleRoleSelect}
        onBack={() => setPage('welcome')}
      />
    )
  }

  if (page === 'login') {
    return (
      <Login
        role={role}
        onLogin={handleLogin}
        onBack={() => setPage('roles')}
      />
    )
  }

  if (page === 'retailer-dashboard') {
    return <RetailerDashboard />
  }

  if (page === 'dispatcher-dashboard') {
    return <DispatcherDashboard />
  }

  if (page === 'rider-dashboard') {
    return <RiderDashboard />
  }

  return <Welcome onGetStarted={() => setPage('roles')} />
}

export default App