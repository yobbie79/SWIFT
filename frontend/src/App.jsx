import { useState } from 'react'
import Welcome from './pages/Welcome'
import RoleSelection from './pages/RoleSelection'
import Login from './pages/Login'
import RetailerDashboard from './pages/RetailerDashboard'
import DispatcherDashboard from './pages/DispatcherDashboard'
import RiderDashboard from './pages/RiderDashboard'

const ROLE_DASHBOARDS = {
  RETAILER: 'retailer-dashboard',
  DISPATCHER: 'dispatcher-dashboard',
  RIDER: 'rider-dashboard',
}

export default function App() {
  const [page, setPage] = useState('welcome')
  const [selectedRole, setSelectedRole] = useState('')
  const [user, setUser] = useState(null)

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setPage('login')
  }

  const handleLogin = (loggedInUser) => {
    if (!loggedInUser) return

    setUser(loggedInUser)

    const targetDashboard = ROLE_DASHBOARDS[loggedInUser.role]
    if (targetDashboard) {
      setPage(targetDashboard)
    }
  }

  const renderPage = () => {
    switch (page) {
      case 'roles':
        return (
          <RoleSelection
            onSelectRole={handleRoleSelect}
            onBack={() => setPage('welcome')}
          />
        )
      case 'login':
        return (
          <Login
            role={selectedRole}
            onLogin={handleLogin}
            onBack={() => setPage('roles')}
          />
        )
      case 'retailer-dashboard':
        return <RetailerDashboard user={user} />
      case 'dispatcher-dashboard':
        return <DispatcherDashboard user={user} />
      case 'rider-dashboard':
        return <RiderDashboard user={user} />
      default:
        return <Welcome onGetStarted={() => setPage('roles')} />
    }
  }

  return renderPage()
}