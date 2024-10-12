import React, { useState, useEffect } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useLocation } from 'react-router-dom';
import './PaymentForm.css';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  
  // Destructure the booking details from the location state
  const { 
    selectedDate, 
    selectedTime, 
    selectedDuration, 
    userSelections = [],
    firstName, 
    lastName, 
    phone, 
    email, 
    finalPrice = 0, // Default value if finalPrice is undefined
    isCouponPurchase = false, // Add a flag to indicate if it's a coupon purchase
    // recipientFirstName, 
    // recipientLastName,
    isDigital
  } = location.state || {}; 
  
  const [couponCode, setCouponCode] = useState(''); // State to store the coupon code
  const [discount, setDiscount] = useState(0); // State to store the discount amount
  const [totalPrice, setTotalPrice] = useState(finalPrice); // Use finalPrice from location state or default to 0
  // const [expirationDate, setExpirationDate] = useState(''); // State to store expiration date

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Calculate the total price based on userSelections if it's a coupon purchase
  useEffect(() => {
    if (isCouponPurchase && userSelections?.length > 0) {
      const calculatedTotalPrice = userSelections.reduce((total, item) => total + item.totalPrice, 0);
      setTotalPrice(calculatedTotalPrice); // Set the total price
    } else {
      setTotalPrice(finalPrice); // For booking, set finalPrice directly
    }
  }, [userSelections, isCouponPurchase, finalPrice]);

  // Function to create a coupon
  const createCoupon = async () => {  
    if (totalPrice <= 0) {
      setError('A valid total price is required to generate a coupon');
      return false;
    }
  
    try {
      // Loop through each userSelection and create a coupon for each selection
      for (const selection of userSelections) {
        const generatedCouponCode = `COUPON-${Math.random().toString(36).substring(7).toUpperCase()}`; // Generate a random coupon code
  
        // Log all the data before sending it to the server
        console.log('Sending the following data to the server:', {
          code: generatedCouponCode,  
          discountType: 'fixed', 
          discountValue: selection.totalPrice, 
          duration: selection.duration, 
          quantity: selection.quantity, 
          pricePerItem: selection.pricePerItem, 
          expirationDate: '2024-12-31',  
          totalPrice: selection.totalPrice,  // Make sure totalPrice is included
          usageLimit: selection.quantity || 1, // Set usageLimit, fallback to quantity or 1
          firstName,  // From state
          lastName,   // From state
          // recipientFirstName,  // From state
          // recipientLastName,   // From state
          email,  // From state
          phone,  // From state
        });
  
        // Send a request to create a coupon for each selection
        const response = await fetch('http://localhost:3000/api/coupons/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            code: generatedCouponCode,  
            discountType: 'fixed', 
            discountValue: selection.totalPrice, 
            duration: selection.duration, 
            quantity: selection.quantity, 
            pricePerItem: selection.pricePerItem, 
            expirationDate: '2024-12-31',  
            totalPrice: selection.totalPrice,  
            usageLimit: selection.quantity || 1,  // Set usageLimit, default to quantity or 1
            firstName,  // From state
            lastName,   // From state
            // recipientFirstName,  // From state
            // recipientLastName,   // From state
            email,  // From state
            phone,  // From state
            isDigital
          }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Log success for each coupon creation
          setCouponCode((prev) => [...prev, generatedCouponCode]);  // Store each coupon code in an array
          console.log(`Coupon ${generatedCouponCode} created successfully for ${selection.duration}`);
        } else {
          setError(data.message);
          return false;
        }
      }
  
      setSuccess(true);
      return true;
  
    } catch (error) {
      setError('Failed to create coupons');
      return false;
    }
  };
  

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    if (!stripe || !elements) {
      return;
    }

    // If it's a coupon purchase, first apply the coupon
    if (isCouponPurchase) {
      const couponCreated = await createCoupon();
      if (!couponCreated) {
        setLoading(false); // Stop loading if coupon creation fails
        return; // Exit if the coupon creation failed
      }
    }
  
    try {
      const cardElement = elements.getElement(CardNumberElement);
  
      // Create Payment Intent
      const response = await fetch('http://localhost:3000/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice * 100, currency: 'usd' }), // Use totalPrice after applying coupon
      });
  
      const { clientSecret } = await response.json();
  
      // Confirm the payment
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: `${firstName} ${lastName}` },
        },
      });
  
      if (paymentResult.error) {
        setError(paymentResult.error.message);
        setLoading(false);
      } else {
        setError('');
        setLoading(false);
        setSuccess(true);

        // Format date safely
        const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : ''; 

        console.log("Formatted Date:", formattedDate);  
        console.log("Sending Data:", {
          date: formattedDate,
          time: selectedTime,
          duration: selectedDuration,
          firstName,
          lastName,
          phone,
          email,
          finalPrice: totalPrice, // Use totalPrice after applying the discount
        });

        const reservationResponse = await fetch(`http://localhost:3000/api/reservations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: formattedDate,
            time: selectedTime,
            duration: selectedDuration,
            firstName,
            lastName,
            phone,
            email,
            finalPrice: totalPrice, // Ensure correct total price is used
          }),
        });

        if (!reservationResponse.ok) {
          throw new Error(`Error: ${reservationResponse.status} ${reservationResponse.statusText}`);
        }

        const reservationData = await reservationResponse.json();
        console.log("Reservation created successfully:", reservationData);
      }
    } catch (error) {
      setError(`Error processing payment or reservation: ${error.message}`);
      setLoading(false);
    }
  };

  const generateAggregatedSelections = () => {
    return userSelections.reduce((acc, item) => {
      const existing = acc.find(selection => selection.duration === item.duration);
      
      if (existing) {
        // If a selection with the same duration exists, aggregate quantities and total prices
        existing.quantity += item.quantity;
        existing.totalPrice += item.totalPrice;
      } else {
        // If it's the first entry for this duration, add it to the accumulator
        acc.push({ ...item });
      }
      
      return acc;
    }, []);
  };
  

  const totalCards = userSelections.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section className='payment'>
      <div className='payment-container'>
        {success ? (
          <div className="payment-success">
            <h2>Payment Successful!</h2>
            <p>Thank you for your payment.</p>
            <p>Your reservation has been created successfully!</p>
          </div>
        ) : (
          <div className='payment-content'>
            {/* Left Column: Booking/Coupon Details */}
            <div className='payment-details'>
              <h2>{isCouponPurchase ? 'Coupon Details' : 'Booking Details'}</h2>
              {isCouponPurchase ? (
                <>
                  {generateAggregatedSelections().map((item, index) => (
                    <div key={index}>
                      <p><strong>
                        {isDigital ? 
                          (item.quantity > 1 ? 'Digital Cards' : 'Digital Card') :
                          (item.quantity > 1 ? 'Physical Cards' : 'Physical Card')
                        }
                      </strong></p>
                      <p><strong>Duration:</strong> {item.duration}</p>
                      <p><strong>Quantity:</strong> {item.quantity}</p>
                      <p><strong>Price per Item:</strong> £{item.pricePerItem}</p>
                      <p><strong>Total Price for this Duration:</strong> £{item.totalPrice}</p>
                    </div>
                  ))}
                  <p><strong>First Name:</strong> {firstName}</p>
                  <p><strong>Last Name:</strong> {lastName}</p>
                  <p><strong>Phone:</strong> {phone}</p>
                  <p><strong>Email:</strong> {email}</p>
                  {/* <p><strong>Recipient First Name:</strong> {recipientFirstName}</p>
                  <p><strong>Recipient Last Name:</strong> {recipientLastName}</p> */}
                  <p><strong>Total Price:</strong> £{totalPrice}</p>
                </>
              ) : (
                <>
                  <p><strong>Date:</strong> {selectedDate?.toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {selectedTime}</p>
                  <p><strong>Duration:</strong> {selectedDuration} minutes</p>
                  <p><strong>First Name:</strong> {firstName}</p>
                  <p><strong>Last Name:</strong> {lastName}</p>
                  <p><strong>Phone:</strong> {phone}</p>
                  <p><strong>Email:</strong> {email}</p>
                  <p><strong>Total Price:</strong> £{totalPrice}</p>
                </>
              )}
            </div>

            {/* Right Column: Payment Form */}
            <form onSubmit={handleSubmit} className='payment-form'>
              <h2>Payment Details</h2>
              <label htmlFor='card-number' className='payment-label'>Card Number</label>
              <CardNumberElement className='StripeElement' id='card-number' />

              <div className='payment-row'>
                <div className='payment-field'>
                  <label htmlFor='card-expiry' className='payment-label'>Expiration Date</label>
                  <CardExpiryElement className='StripeElement' id='card-expiry' />
                </div>
                <div className='payment-field'>
                  <label htmlFor='card-cvc' className='payment-label'>CVC</label>
                  <CardCvcElement className='StripeElement' id='card-cvc' />
                </div>
              </div>
              
              <button type='submit' disabled={!stripe || loading} className='payment-button'>
                {loading ? 'Processing...' : `Pay £${totalPrice}`}
              </button>
              {error && <div className='error-message'>{error}</div>}
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default PaymentForm;
