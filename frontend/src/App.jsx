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

import StudentDashboard from "./pages/StudentDashboard";
import Profile from "./pages/Profile";
import Marks from "./pages/Marks";
import Attendence from "./pages/Attendence";
import DailyProgress from "./pages/DailyProgress/DailyProgress";
import Homework from "./pages/Homework";
import HomeworkSubmission from "./pages/HomeworkSubmission";
import DailyReport from "./pages/DailyReport";

const App = () => {
  return (
    <Routes>

      {/* Authentication Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyLogin />} />

      {/* Public Pages */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Dashboard Pages */}
      <Route element={<Layout />}>
        <Route path="/admin/dashboard" element={<Admindashboard />} />

        {/* Student Dashboard */}
        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />
        <Route path="/attendance" element={<Attendence />} />
        <Route path="/marks" element={<Marks />} />
        <Route path="/daily-progress" element={<DailyProgress />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/homework" element={<Homework />} />
        <Route
          path="/homework-submission"
          element={<HomeworkSubmission />}

        />
        <Route path="/daily-report" element={<DailyReport />} />
      </Route>

    </Routes>
  );
};

export default App;