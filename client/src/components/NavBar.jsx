import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { FiLogOut, FiSearch } from 'react-icons/fi'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Create', to: '/create-pin' },
  { label: 'Profile', to: '/profile' },
]

const NavBar = () => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-slate-900/90 backdrop-blur fixed top-0 inset-x-0 z-50 border-b border-slate-700/50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-white text-lg font-semibold">
          <FiSearch className="h-6 w-6" />
          <span>PinVault</span>
        </Link>

        <nav className="hidden md:flex items-center gap-4 text-sm text-slate-200">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 transition ${
                  isActive ? 'bg-slate-700 text-white' : 'hover:bg-slate-800/80'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <button
                onClick={logout}
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-100 transition hover:bg-slate-700"
              >
                <FiLogOut /> Logout
              </button>
              <Link to="/profile" className="rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 transition hover:bg-slate-700">
                {user.name}
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-100 transition hover:bg-slate-700"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default NavBar
