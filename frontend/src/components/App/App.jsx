import React, { useState } from "react";
import { Routes, Route} from "react-router-dom";
import './App.css';
import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import Main from "../Main/Main"
import TimeBooking from "../TimeBooking/TimeBooking"
import GiftBooking from "../GiftBooking/GiftBooking"
import PaymentForm from "../PaymentForm/PaymentForm"
import AdminRegister from "../AdminRegister/AdminRegister"
import AdminDashboard from "../AdminDashboard/AdminDashboard"
import PageNotFound from "../PageNotFound/PageNotFound"
import PaymentSuccess from "../PaymentSuccess/PaymentSuccess"
import CookieConsent from "../CookieConsent/CookieConsent";
import PrivacyPolicy from "../PrivacyPolicy/PrivacyPolicy";
import CookiePolicy from "../CookiePolicy/CookiePolicy";
import TermsOfUse from "../TermsOfUse/TermsOfUse";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { usePageTracking } from "../../utils/tracking";
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'; 

const stripePromise = loadStripe('pk_test_51QFvDQGSMfY1zPhDCHBX0QpMZosKduI2EDkwV3SId4qUKqwiEEpB15TnbjyU0zqK987IlEFTaAF74ft3m0UoTXt000chVUytMn');

function App() {
  const [activeSection, setActiveSection] = useState("1");
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');

  usePageTracking()
  
  return (
    <div className="App">
      <CookieConsent />
      <Header activeSection={activeSection} setActiveSection={setActiveSection}/>
      <Routes>
      <Route exact path="/" element={<Main activeSection={activeSection} setActiveSection={setActiveSection} />}/>
      <Route exact path="/book/time" element={<TimeBooking/>} />
      <Route exact path="/book/gift" element={<GiftBooking/>} />
      <Route path="/book/gift/physical" element={<GiftBooking />} />
      <Route path="/book/gift/digital" element={<GiftBooking />} />
      <Route path="/admin" element={<AdminRegister setToken={setToken} />} />
      <Route path="/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/payment" element={<Elements stripe={stripePromise}><PaymentForm/></Elements>} />
      <Route path="/payment/success" element={<PaymentSuccess />}/>
      <Route path="*" element={<PageNotFound />} />
      <Route path="/cookie-policy" element={<CookiePolicy />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-use" element={<TermsOfUse />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
