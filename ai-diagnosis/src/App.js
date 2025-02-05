import React from "react";
import "./fonts.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/genuinecompo/homepage/home";
import SignUp from "./pages/signup";
import SignIn from "./pages/signin";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AIDiagnosis from "./pages/aidiagnosis"; // AI Diagnosis main page
import AiDiagnosesResult from "./pages/ai_diagnoses_result"; // Import the AI Diagnosis Result page
import FitnessDashboard from "./pages/fitness";
import NeurifyBot from "./pages/neurify/NeurifyBot";

const App = () => {
  return (
    <Router>
      <nav className="mb-4 mt-3 place-content-center flex">
        <Link to="/" className="mr-16 text-black font-varelaround">
          Home
        </Link>
        <Link to="/signup" className="mr-16 text-black font-varelaround">
          Sign Up
        </Link>
        <Link to="/signin" className="mr-16 text-black font-varelaround">
          Sign In
        </Link>
        <Link to="/aidiagnosis" className="mr-16 text-black font-varelaround">
          AI Diagnosis
        </Link>
        {/* Add link to AI Diagnosis Result page */}
        <Link
          to="/ai-diagnosis-result"
          className="mr-16 text-black font-varelaround"
        >
          AI Diagnosis Result
        </Link>

        <Link to="/fitnessdata" className="text-black font-varelaround mr-16">
          FitnessData
        </Link>

        <Link
          to="http://127.0.0.1:5050"
          className="mr-16 text-black font-varelaround"
        >
          Neurify
        </Link>

        <Link to="http://127.0.0.1:5500/mood.html" className="mr-16 text-black font-varelaround">Emotion Game</Link>
      </nav>

      <Routes>
        {/* Home page */}
        <Route path="/" element={<Home />} />

        {/* Sign Up page */}
        <Route path="/signup" element={<SignUp />} />

        {/* Sign In page */}
        <Route path="/signin" element={<SignIn />} />

        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* AI Diagnosis page (also protected) */}
        <Route
          path="/aidiagnosis"
          element={
            <ProtectedRoute>
              <AIDiagnosis />
            </ProtectedRoute>
          }
        />

        {/* AI Diagnosis Result page (also protected) */}
        <Route
          path="/ai-diagnosis-result"
          element={
            <ProtectedRoute>
              <AiDiagnosesResult />
            </ProtectedRoute>
          }
        />

        {/*Health fetch*/}
        <Route
          path="/fitnessdata"
          element={
            <ProtectedRoute>
              <FitnessDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/neurify"
          element={
            <ProtectedRoute>
              <NeurifyBot />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
