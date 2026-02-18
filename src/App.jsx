import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LenisScroll from "./components/Lenis";
import Home from "./pages/Home";
import Login from "./pages/Login";
// import Register from "./pages/Register";
import Profile from "./pages/Profile";
import PricingPage from "./pages/PricingPage";
import Dashboard from "./pages/Dashboard";
import InterviewPage from "./pages/InterviewPrep";
import AdminPanel from "./pages/AdminPanel";
import AuthCallback from "./pages/Callback";
import CodingPanel from "./pages/codeEditor";

export default function App() {
  const location = useLocation();

 
  const hideLayout = ["/login", "/register","/profile","/dashboard","/interview-prep","/admin","auth/callback","/code-editor"].includes(location.pathname);

  return (
    <>
      
      <LenisScroll />

   
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/interview-prep" element={<InterviewPage />} />
        <Route path="/admin" element={<AdminPanel />}/>
        <Route path="/auth/callback" element={<AuthCallback />}/>
        <Route path="/code-editor" element={<CodingPanel />}/>
      </Routes>

     
      {!hideLayout && <Footer />}
    </>
  );
}