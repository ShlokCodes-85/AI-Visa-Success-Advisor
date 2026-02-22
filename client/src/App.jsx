import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/NavBar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import FAQ from "./components/FAQ";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import OAuthSuccess from "./pages/OAuthSuccess";
import ResetPassword from "./pages/ResetPassword";
import ApplicationForm from "./pages/FormMode/ApplicationForm";
import { ApplicationProvider } from "./contexts/ApplicationContext";

function OAuthQueryHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (error) {
      alert("OAuth authentication failed. Please try again.");
      navigate("/", { replace: true });
      return;
    }

    if (token) {
      localStorage.setItem("token", token);
      navigate("/application", { replace: true });
    }
  }, [location.search, navigate]);

  return null;
}


function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <ApplicationProvider>
      <OAuthQueryHandler />
      <Routes>
        <Route path="/oauth/success" element={<OAuthSuccess />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/application"
          element={
            <ProtectedRoute>
              <ApplicationForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <div className="w-full bg-gray-50 dark:bg-gray-900 text-black dark:text-gray-100">
              <Navbar />
              <Hero />
              <Features />
              <HowItWorks />
              <Testimonials />
              <FAQ />
              <Footer />
            </div>
          }
        />
      </Routes>
    </ApplicationProvider>
  );
}

export default App;
