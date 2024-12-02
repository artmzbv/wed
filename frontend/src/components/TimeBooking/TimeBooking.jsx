import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import './TimeBooking.css';
import TimeBookingDate from '../TimeBookingDate/TimeBookingDate';
import TimeBookingForm from '../TimeBookingForm/TimeBookingForm';
import TimeBookingVerification from '../TimeBookingVerification/TimeBookingVerification';
import BookingNavigation from '../BookingNavigation/BookingNavigation';
import logo from "../../images/logo/logo.png"

const TimeBooking = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [willComeWithPets, setWillComeWithPets] = useState(null);
  const [errors, setErrors] = useState({});
console.log(willComeWithPets)
  // Scroll to the top every time the active step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeStep]);

  const handleBackStep = () => {
    setActiveStep(activeStep - 1);
    setErrors({}); // Reset errors when moving back
  };

  const renderError = (fieldName) => (
    errors[fieldName] ? <div className="time__form-error">{errors[fieldName]}</div> : null
  );
  const steps = [
    { number: 1, label: 'Session' },
    { number: 2, label: 'Details' },
    { number: 3, label: 'Done' }
  ];

  return (
    <>
      <Helmet>
      <title>Self Made Portraits</title>
      <meta name="description" content="Create your own masterpiece in our secure, private studio! Whether it’s a solo fashion shoot, capturing memories with family, friends, or pets, our space allows you to take professional-quality photos without the need for third-party intervention. Perfect for those who want control over their photos from start to finish.
  ✨ No photographer? No problem! Just Click & Shoot" />
      <meta property="og:url" content={`https://self-made-portraits.com/`} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Self Made Portraits" />
      <meta property="og:description" content="" />
      <meta property="og:image" content={logo} />
      <link rel="canonical" href="https://self-made-portraits.com/"></link>
      {/* <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script> */}
    </Helmet>
    <section className='time' id="time">
      <h1 className='time__title'>RESERVATION</h1>
      {/* Use StepNavigation component */}
      <BookingNavigation steps={steps} activeStep={activeStep} setActiveStep={setActiveStep} />
      {/* Step 1: Session Selection */}
      {activeStep === 0 && (
        <TimeBookingDate
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          setActiveStep={setActiveStep}
          setErrors={setErrors}
        />
      )}

      {/* Step 2: Form Details */}
      {activeStep === 1 && (
        <TimeBookingForm
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          phone={phone}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          renderError={renderError}
          setPhone={setPhone}
          email={email}
          setEmail={setEmail}
          willComeWithPets={willComeWithPets}
          setWillComeWithPets={setWillComeWithPets}
          handleBackStep={handleBackStep}
          errors={errors}
          setErrors={setErrors}
          setActiveStep={setActiveStep}
        />
      )}

      {/* Step 3: Final Confirmation */}
      {activeStep === 2 && (
        <TimeBookingVerification
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          phone={phone}
          setPhone={setPhone}
          email={email}
          setEmail={setEmail}
          setWillComeWithPets={setWillComeWithPets}
          willComeWithPets={willComeWithPets} 
          handleBackStep={handleBackStep}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
      )}
    </section>
    </>
  );
};

export default TimeBooking;

