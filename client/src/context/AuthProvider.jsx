import {   useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import API from '../services/api'
import AuthContext from './AuthContext.jsx'


export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('userInfo')
    return stored ? JSON.parse(stored) : null
  })

  const setSession = (data) => {
    const userData = { ...data }
    localStorage.setItem('userInfo', JSON.stringify(userData))
    localStorage.setItem('userToken', data.token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('userInfo')
    localStorage.removeItem('userToken')
    setUser(null)
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const login = async (credentials) => {
    const response = await API.post('/auth/login', credentials)
    setSession(response.data)
    toast.success(`Welcome back, ${response.data.name}`)
    navigate('/')
  }

  const register = async (payload) => {
    const response = await API.post('/auth/register', payload)
    setSession(response.data)
    toast.success('Account created successfully')
    navigate('/')
  }

  const updateUser = async (id, payload) => {
    const response = await API.patch(`/users/${id}`, payload)
    const updatedUser = { ...user, ...response.data }
    localStorage.setItem('userInfo', JSON.stringify(updatedUser))
    setUser(updatedUser)
    return response.data
  }

//   useEffect(() => {
//     const stored = localStorage.getItem('userInfo')
//     if (stored && !user) {
//       setUser(JSON.parse(stored))
//     }
//   }, [user])

 



  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// export const useAuth = () => useContext(AuthContext)
