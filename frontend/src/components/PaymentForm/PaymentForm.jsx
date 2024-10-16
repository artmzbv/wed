import React, { useState, useEffect } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, AddressElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentForm.css';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();

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
    isDigital
  } = location.state || {}; 
  
  const [couponCode, setCouponCode] = useState(''); // State to store the coupon code
  const [discount, setDiscount] = useState(0); // State to store the discount amount
  const [totalPrice, setTotalPrice] = useState(finalPrice); // Use finalPrice from location state or default to 0
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shippingDetails, setShippingDetails] = useState(null); // For physical items

  // Redirect to homepage if essential state data is missing (i.e., user accessed directly)
  useEffect(() => {
    if (!location.state || !selectedDate || !selectedTime || !selectedDuration) {
      navigate('/'); // Redirect to home page if no state is passed
    }
  }, [location.state, selectedDate, selectedTime, selectedDuration, navigate]);

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
      let shippingDetails = {};
  
      // Ensure shipping details are fetched if the coupon is not digital
      if (!isDigital) {
        const addressElement = elements.getElement(AddressElement);
        if (addressElement) {
          const { value: addressValue, error: addressError } = await addressElement.getValue(); 
          if (addressError) {
            setError('Failed to retrieve shipping address. Please try again.');
            setLoading(false);
            return false;
          }
          shippingDetails = addressValue;
        } else {
          setError('Shipping address element is not properly initialized.');
          setLoading(false);
          return false;
        }
      }
  
      for (const selection of userSelections) {
        let generatedCouponCode = '';
  
        // Generate a unique coupon code by checking with the server
        const generateUniqueCouponCode = async () => {
          let isUnique = false;
          
          while (!isUnique) {
            // Generate random coupon code
            generatedCouponCode = `COUPON-${Math.random().toString(36).substring(7).toUpperCase()}`;
  
            // Check if the generated coupon code exists in the database
            const response = await fetch('http://localhost:3000/api/coupons/check-unique', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code: generatedCouponCode })
            });
  
            const { isDuplicate } = await response.json();
            if (!isDuplicate) {
              isUnique = true;
            }
          }
        };
  
        // Ensure the coupon code is unique
        await generateUniqueCouponCode();
  
        // Log the data to be sent to the server
        console.log('Sending the following data to the server:', {
          code: generatedCouponCode,
          discountType: 'fixed',
          discountValue: selection.totalPrice,
          duration: selection.duration,
          quantity: selection.quantity,
          pricePerItem: selection.pricePerItem,
          totalPrice: selection.totalPrice,
          usageLimit: selection.quantity || 1,
          firstName,
          lastName,
          email,
          phone,
          isDigital,
          address: isDigital ? null : shippingDetails.address 
        });
  
        // Send the coupon to the server
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
            totalPrice: selection.totalPrice,
            usageLimit: selection.quantity || 1,
            firstName,
            lastName,
            email,
            phone,
            isDigital,
            address: isDigital ? null : shippingDetails.address
          }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          setError(data.message);
          return false;
        }
      }
  
      return true;
    } catch (error) {
      setError('Failed to create coupons');
      setLoading(false);
      return false;
    }
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    if (!stripe || !elements) {
      setError('Stripe is not properly initialized.');
      setLoading(false);
      return;
    }
  
    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);
  
    const cardNumberValid = cardNumberElement._complete;
    const cardExpiryValid = cardExpiryElement._complete;
    const cardCvcValid = cardCvcElement._complete;
  
    if (!cardNumberValid || !cardExpiryValid || !cardCvcValid) {
      setError('Please complete the card details.');
      setLoading(false);
      return;
    }
  
    // Handle coupon purchase
    if (isCouponPurchase) {
      const couponCreated = await createCoupon();
      if (!couponCreated) {
        setLoading(false);
        return;
      }
    } else {
      // Handle reservation booking
      try {
        // Format date and time for reservation check
        const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : '';  // Move this inside the reservation logic
        const time = selectedTime; // Assuming selectedTime is in "HH:mm" format
        const duration = selectedDuration; // Duration in minutes
  
        // Check if the reservation time is available on the server before proceeding with payment
        const reservationCheckResponse = await fetch('http://localhost:3000/api/reservations/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: formattedDate,  // Ensure this field is sent
            time: time,           // Ensure time is sent (in "HH:mm" format)
            duration: duration,   // Ensure duration is sent (in minutes)
          }),
        });
  
        const reservationCheckData = await reservationCheckResponse.json();
  
        if (!reservationCheckResponse.ok) {
          setError(reservationCheckData.message); // Display error if reservation overlaps
          setLoading(false);
          return;
        }
      } catch (error) {
        setError('Error checking reservation availability.');
        setLoading(false);
        return;
      }
    }
  
    // Proceed with payment intent creation
    try {
      const paymentIntentResponse = await fetch('http://localhost:3000/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice * 100, currency: 'gbp' }),
      });
  
      const { clientSecret } = await paymentIntentResponse.json();
  
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: { name: `${firstName} ${lastName}`, email, phone },
        },
        shipping: !isDigital && shippingDetails
          ? {
              name: `${firstName} ${lastName}`,
              address: {
                line1: shippingDetails.address.line1,
                city: shippingDetails.address.city,
                state: shippingDetails.address.state || '',
                postal_code: shippingDetails.address.postal_code,
                country: shippingDetails.address.country,
              },
            }
          : undefined,
      });
  
      if (paymentResult.error) {
        setError(paymentResult.error.message);
        setLoading(false);
      } else {
        setError('');
        setLoading(false);
  
        if (!isCouponPurchase) {
          // Create reservation after successful payment (if it's not a coupon purchase)
          const reservationResponse = await fetch('http://localhost:3000/api/reservations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              date: selectedDate.toISOString().split('T')[0],   // Use formatted date for reservation
              time: selectedTime,    // Send time field
              duration: selectedDuration,  // Send duration field
              firstName,
              lastName,
              phone,
              email,
              finalPrice: totalPrice,
            }),
          });
  
          if (!reservationResponse.ok) {
            throw new Error(`Error: ${reservationResponse.status} ${reservationResponse.statusText}`);
          }
  
          const reservationData = await reservationResponse.json();
          console.log('Reservation created successfully:', reservationData);
        }
  
        // After successful payment and reservation creation (or coupon creation), navigate to the success page
        navigate('./success');
      }
    } catch (error) {
      setError(`Error processing payment: ${error.message}`);
      setLoading(false);
    }
  };
  
  
  
  
  

  const generateAggregatedSelections = () => {
    return userSelections.reduce((acc, item) => {
      const existing = acc.find(selection => selection.duration === item.duration);
      
      if (existing) {
        existing.quantity += item.quantity;
        existing.totalPrice += item.totalPrice;
      } else {
        acc.push({ ...item });
      }
      
      return acc;
    }, []);
  };

  return (
    <section className='payment'>
      <div className='payment-container'>
        <div className='payment-content'>
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

          <form onSubmit={handleSubmit} className='payment-form'>
            <h2>Payment Details</h2>
            {isCouponPurchase && !isDigital && (
            <div>
              <h3>Shipping Information</h3>
              <AddressElement options={{ mode: 'shipping' }} />
            </div>
          )}
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

            <div className="payment-footer">
              <p>Powered by Stripe</p>
              <div className="terms">
                <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> | 
                <a href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer">Terms of Service</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PaymentForm;
