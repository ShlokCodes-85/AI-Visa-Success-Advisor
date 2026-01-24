import { Routes, Route } from 'react-router-dom'
import Navbar from "./components/NavBar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import OAuthSuccess from "./pages/OAuthSuccess";
import ApplicationForm from "./pages/ApplicationForm/ApplicationForm";


function App() {
  return (
    <Routes>
      <Route path="/oauth/success" element={<OAuthSuccess />} />
      <Route path="/application" element={<ApplicationForm />} />
      <Route
        path="/"
        element={
          <div className="w-full bg-gray-50 text-black">
            <Navbar />
            <Hero />
            <Features />
            <Footer />
          </div>
        }
      />
    </Routes>
  );
}

export default App;
