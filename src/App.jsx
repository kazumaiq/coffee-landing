import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import AuthModal from './components/AuthModal'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Account from './pages/Account'
import Admin from './pages/Admin'

export default function App(){
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  useEffect(() => {
    const syncUser = () => {
      const u = JSON.parse(localStorage.getItem('user')||'null')
      setUser(u)
    }
    syncUser()
    const onUserUpdated = () => syncUser()
    window.addEventListener('user-updated', onUserUpdated)
    return () => window.removeEventListener('user-updated', onUserUpdated)
  }, [])

  const handleAuthClick = () => {
    setAuthModalOpen(true)
  }

  const handleProfileClick = () => {
    if(user) navigate('/account')
    else setAuthModalOpen(true)
  }

  const handleAuthSuccess = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    setAuthModalOpen(false)
    navigate('/')
  }

  return (
    <div className="app">
      <Header 
        user={user}
        onAuthClick={handleAuthClick}
        onProfileClick={handleProfileClick}
      />
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/account" element={<Account/>} />
        <Route path="/admin" element={<Admin/>} />
      </Routes>
    </div>
  )
}
