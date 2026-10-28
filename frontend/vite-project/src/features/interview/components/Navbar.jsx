import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { authContext } from '../../auth/services/auth.context'
import { logout } from '../../auth/services/auth.api'
import './navbar.scss'

const Navbar = () => {
  const { setUser } = useContext(authContext)
  const [loggingOut, setLoggingOut] = useState(false)

  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      setLoggingOut(true)

      await logout()

      setUser(null)
      navigate('/login', { replace: true })
    } catch (err) {
      console.log(err)
      alert('Logout failed. Please try again.')
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        GenAI<span>Report</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/allreports">All Reports</Link>

        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </nav>
  )
}

export default Navbar