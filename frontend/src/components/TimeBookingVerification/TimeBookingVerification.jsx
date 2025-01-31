import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { URL } from '../../utils/constants/constants';
import { formatTime, transactionTimer } from '../../utils/constants/constants';
import './TimeBookingVerification.css';

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
  willComeWithPets,
  setWillBeRaw,
  willBeRaw,
  handleBackStep,
  activeStep,
  setActiveStep,
}) => {
  // const [remainingTime, setRemainingTime] = useState(600); // Timer state for countdown (in seconds)
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState(''); // State to handle coupon errors
  const [couponSuccess, setCouponSuccess] = useState(''); // For displaying coupon success messages
  const [paymentSuccess, setPaymentSuccess] = useState(''); // State to track payment success message
  const navigate = useNavigate(); // Initialize useNavigate

  // console.log(willComeWithPets)
  // console.log(willBeRaw)
  const originalPrice = (() => {
    let basePrice;
    switch (selectedDuration) {
      // case 15:
      //   basePrice = 30;
      //   break;
      case 30:
        basePrice = 40;
        break;
      case 45:
        basePrice = 60;
        break;
      case 60:
        basePrice = 75;
        break;
      default:
        basePrice = 0;
    }
    return basePrice + (willComeWithPets === "Yes" ? 10 : 0) + (willBeRaw === "Yes" ? 10 : 0); // Add £10 if pets are coming
  })();

  const finalPrice = Math.max(0, originalPrice - discount);

  // Calculate remaining balance if discount is more than the original price
  const remainingBalance = discount > originalPrice ? discount - originalPrice : 0;

  // Handle applying a coupon code (verifying against MongoDB)
  const handleApplyCoupon = async () => {
    if (!coupon) {
      setCouponError('Please enter a coupon code');
      setCouponSuccess(''); // Clear success message
      return;
    }

    try {
      const response = await fetch(`${URL}/api/coupons/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ couponCode: coupon }),
      });

      const data = await response.json();

      if (response.ok) {
        setDiscount(data.discount); // Apply the discount from the server response
        setCouponError(""); // Clear any previous errors
        setCouponSuccess(`Coupon applied successfully! £${data.discount} off your total.`); // Show success message
      } else {
        setCouponError(data.message); // Display error message if coupon is invalid
        setCouponSuccess(''); // Clear success message
      }
    } catch (error) {
      setCouponError('Failed to apply coupon. Please try again.');
      setCouponSuccess(''); // Clear success message
    }
  };
  // Function to reset form data (optional)
  const resetFormData = () => {
    setSelectedDate(null);
    setSelectedDuration(null);
    setSelectedTime(null);
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setWillComeWithPets(null);
    setWillBeRaw(null);
    setCoupon('');
    setDiscount(0);
  };

  // Handle Timer for Step 3
  // useEffect(() => {
  //   const cleanup = transactionTimer(activeStep, setActiveStep, setRemainingTime);
  //   return cleanup;
  // }, [activeStep]);

  // Function to handle "Confirm Payment" when finalPrice is 0
  const handleConfirmPayment = async () => {
    try {
      const response = await fetch(`${URL}/api/coupons/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ couponCode: coupon }), // Send couponCode in body
      });

      if (response.ok) {
        setPaymentSuccess('Payment successful! Your reservation has been created.'); // Show success message
        resetFormData(); // Optionally reset form data
      } else {
        const data = await response.json();
        console.error('Failed to delete coupon:', data.message);
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };

  // Function to handle navigation to the PaymentForm when finalPrice > 0
  const handleProceedToPayment = () => {
    navigate('/payment', {
      state: {
        fromTime: true,
        selectedDate,
        selectedTime,
        selectedDuration,
        firstName,
        lastName,
        phone,
        email,
        finalPrice,
        willComeWithPets: willComeWithPets, 
        willBeRaw: willBeRaw, 
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
        {/* <p className='time__timer'>
          <strong>Time Remaining: {formatTime(remainingTime)}</strong>
        </p> */}
        <p className='time__confirmation-final-text'>
          <strong>Date:</strong> {selectedDate?.toLocaleDateString()} <br />
          <strong>Time:</strong> {selectedTime} <br />
          <strong>Duration:</strong> {selectedDuration} minutes <br />
          <strong>First Name:</strong> {firstName} <br />
          <strong>Last Name:</strong> {lastName} <br />
          <strong>Phone:</strong> {phone} <br />
          <strong>Email:</strong> {email} <br />
          <strong>With Pets:</strong> {willComeWithPets} <br />
          <strong>With RAW format:</strong> {willBeRaw} <br />
          <strong>Total Price:</strong> £{finalPrice}
        </p>

        {/* Coupon Input Section */}
        <div className='time__coupon'>
          <div className='time__coupon-container'>
          <p className='time__enter-text'>Enter coupon code</p>
          <input
            type='text'
            className='time__coupon-input'
            placeholder='COUPON-XXXXX'
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <button type='button' className='time__coupon-button' onClick={handleApplyCoupon}>
            Apply Coupon
          </button>
          </div>
          {couponError && <p className="time__error-message">{couponError}</p>} {/* Display coupon error if present */}
                 {/* Success Message for Payment */}
          {couponSuccess && <p className="time__success-message">{couponSuccess}</p>} {/* Display payment success if present */}

          {/* Display remaining balance if discount is more than price */}
          {remainingBalance > 0 && (
            <p className="time__remaining-balance">
              You have £{remainingBalance} left in discount. You may choose a longer duration or proceed with this time.
            </p>
          )}
        </div>
        {/* Confirm Payment Button */}
        <button
          type='button'
          className='time__final-step-button time__final-step-button_active'
          onClick={finalPrice === 0 ? handleConfirmPayment : handleProceedToPayment}
          // disabled={remainingTime === 0}
        >
          {finalPrice === 0 ? 'Confirm Payment' : 'Proceed to Payment'}
        </button>
      </div>
    </>
  );
};

export default TimeBookingVerification;
