import React, { useState } from "react";
import { Routes, Route} from "react-router-dom";
import './App.css';
import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import Main from "../Main/Main"
import TimeBooking from "../TimeBooking/TimeBooking"
import GiftBooking from "../GiftBooking/GiftBooking"
import PaymentForm from "../PaymentForm/PaymentForm"
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
// import GiftBookingDigital from "GiftBookingDigital/GiftBookingDigital"
// import GiftBookingPhysical from "GiftBookingPhysical/GiftBookingPhysical"

const stripePromise = loadStripe('pk_test_51PDMRwBywd3FX45Qm3j2qWBrf4c19Y9QWHev4gTvvWlpbJBAC9SN3TB4O62jqey4eK0YebxShcxptqo1LtEl9uJe00nUVpOy0Z');
function App() {
  const [activeSection, setActiveSection] = useState("1");

  return (
    <div className="App">
      <Header activeSection={activeSection} setActiveSection={setActiveSection}/>
      <Routes>
      <Route
          path="/payment"
          element={
            <Elements stripe={stripePromise}>
              <PaymentForm/>
            </Elements>
          } />
      <Route exact path="/portraits" element={<Main activeSection={activeSection} setActiveSection={setActiveSection} />}/>
      <Route exact path="/book/time" element={<TimeBooking/>} />
      <Route exact path="/book/gift" element={<GiftBooking/>} />
      <Route path="/book/gift/physical" element={<GiftBooking />} />
      <Route path="/book/gift/digital" element={<GiftBooking />} />
      {/* <Route exact path="/book/gift/digital" element={<GiftBookingDigital/>} />
      <Route exact path="/book/gift/physical" element={<GiftBookingPhysical/>} /> */}
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
