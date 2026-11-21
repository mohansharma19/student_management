import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Register from './pages/Register'
import Admindashboard from './pages/Admindashboard'
import Studentdashborad from './pages/Studentdashborad'
import Profile from './pages/Profile'
import Marks from './pages/Marks'
import Attendence from './pages/Attendence'
import ProgressReport from './pages/ProgressReport'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Features from './pages/Features'
import DailyProgress from './pages/DailyProgress/DailyProgress'

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin-dashboard" element={<Admindashboard />} />
      <Route path="/students" element={<Studentdashborad />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/marks" element={<Marks />} />
      <Route path="/attendance" element={<Attendence />} />
      <Route path="/progress-report" element={<ProgressReport />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/features" element={<Features />} />
      <Route path="/daily-progress" element={<DailyProgress />} />



      <Route
        path="/"
        element={
          <>

            <Navbar />
            <Sidebar />
          </>
        }
      />
    </Routes>
  )
}

export default App