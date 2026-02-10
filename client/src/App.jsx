import { useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import GetStarted from './page/GetStarted'
import { Routes, Route } from "react-router-dom"
import AuthPage from './page/AuthPage'
import Dashboard from './page/Dashboard'
import Jobs from './page/Jobs'
import AuthCallback from './page/AuthCallback'
import { useAuth } from './context/AuthContext'
import { useLocation } from 'react-router-dom'

function App() {

  const { user, loading, setUser } = useAuth();

  const { pathname } = useLocation();

  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="h-12 w-12 rounded-full border-4 border-gray-700 border-t-green-500 animate-spin"></div>
    </div>
  }
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={user ? <Dashboard /> : <GetStarted />} />
        <Route path='/login' element={<AuthPage setUser={setUser} />} />
        <Route path='/jobs' element={<Jobs />} />
        <Route path='/auth/callback' element={<AuthCallback />} />
      </Routes>
    </>
  )
}

export default App
