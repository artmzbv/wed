// TimeBookingVerification.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatTime, transactionTimer } from '../../utils/constants';
import './TimeBookingVerification.css';
// TimeBookingVerification.jsx



const TimeBookingVerification = ({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  selectedDuration,
  setSelectedDuration,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  phone,
  setPhone,
  email,
  setEmail,
  setWillComeWithPets,
  handleBackStep,
  activeStep,
  setActiveStep
}) => {

const [remainingTime, setRemainingTime] = useState(600); // Timer state for countdown (in seconds)
const [coupon, setCoupon] = useState("");
const [discount, setDiscount] = useState(0);
// Calculate the final price based on the duration
const navigate = useNavigate(); // Initialize useNavigate

const finalPrice = (() => {
  switch (selectedDuration) {
    case 15:
      return 30 - discount; // 30 pounds for 15 minutes
    case 30:
      return 40 - discount; // 40 pounds for 30 minutes
    case 45:
      return 60 - discount; // 60 pounds for 45 minutes
    case 60:
      return 75 - discount; // 75 pounds for 60 minutes
    default:
      return 0; // Fallback in case no duration is selected
  }
})();


  // Handle applying a coupon code
  const handleApplyCoupon = () => {
    if (coupon.toLowerCase() === "discount10") {
      setDiscount(10); // Apply a £10 discount for a specific coupon code
      alert("Coupon applied successfully! £10 off your total.");
    } else {
      alert("Invalid coupon code. Please try again.");
    }
  };

    // Function to reset form data (optional)
    const resetFormData = () => {
        setSelectedDate(null);
        setSelectedDuration(null);
        setSelectedTime(null);
        setFirstName("");
        setLastName("");
        setPhone("");
        setEmail("");
        setWillComeWithPets(null);
        setCoupon("");
        setDiscount(0);
      };

    // Handle Timer for Step 3

    useEffect(() => {
      const cleanup = transactionTimer(activeStep, setActiveStep, setRemainingTime)
  
      // Cleanup interval on component unmount or activeStep change
      return cleanup;
    }, [activeStep]);

      // Function to handle navigation to the PaymentForm
      const handleProceedToPayment = () => {
        navigate('/payment', {
          state: {
            selectedDate,
            selectedTime,
            selectedDuration,
            firstName,
            lastName,
            phone,
            email,
            finalPrice,
          },
        });
      };

  return (
    <>
    <div className='time__confirmation'>
      <button type='button' className='time__back-button' onClick={handleBackStep}>
        Back
      </button>
      <h2 className='time__confirmation-subtitle'>Booking Confirmation</h2>
    </div>
    <div className='time__confirmation-final'>
      {/* Display the Timer */}
      <p className='time__timer'>
        <strong>Time Remaining: {formatTime(remainingTime)}</strong>
      </p>
      <p className='time__confirmation-final-text'>
        <strong>Date:</strong> {selectedDate?.toLocaleDateString()} <br />
        <strong>Time:</strong> {selectedTime} <br />
        <strong>Duration:</strong> {selectedDuration} minutes <br />
        <strong>First Name:</strong> {firstName} <br />
        <strong>Last Name:</strong> {lastName} <br />
        <strong>Phone:</strong> {phone} <br />
        <strong>Email:</strong> {email} <br />
        <strong>Total Price:</strong> £{finalPrice}
      </p>

      {/* Coupon Input Section */}
      <div className='time__coupon'>
        <input
          type='text'
          className='time__coupon-input'
          placeholder='Enter coupon code'
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
        />
        <button
          type='button'
          className='time__coupon-button'
          onClick={handleApplyCoupon}
        >
          Apply Coupon
        </button>
      </div>

      {/* Proceed to Payment Button */}
      <button
      type='button'
      className='time__final-step-button time__final-step-button_active'
      onClick={handleProceedToPayment} // Navigate to step 3 for payment
      disabled={remainingTime === 0} // Disable if the timer reaches 0
    >
      Proceed to Payment
    </button>
    </div>
  </>
  );
};

export default TimeBookingVerification;

