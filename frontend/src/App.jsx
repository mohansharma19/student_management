
import { Routes, Route } from "react-router-dom";

// Layout
import Layout from "./components/Layout";

// Authentication
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyLogin from "./pages/VerifyLogin";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Features from "./pages/Features";

// Dashboard Pages
import Admindashboard from "./pages/Admindashboard";
import Studentdashborad from "./pages/Studentdashborad";
import Profile from "./pages/Profile";
import Marks from "./pages/Marks";
import Attendence from "./pages/Attendence";
import DailyProgress from "./pages/DailyProgress/DailyProgress";

const App = () => {
  return (
    <Routes>

      {/* Authentication Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyLogin />} />

      {/* Public Pages - Navbar + Sidebar nahi */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Dashboard Pages - Navbar + Sidebar */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Admindashboard />} />
        <Route path="/students" element={<Studentdashborad />} />
        <Route path="/attendance" element={<Attendence />} />
        <Route path="/marks" element={<Marks />} />
        <Route path="/daily-progress" element={<DailyProgress />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

    </Routes>
  );
};

export default App;
