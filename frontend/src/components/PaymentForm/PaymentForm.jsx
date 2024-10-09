import React, { useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useLocation } from 'react-router-dom';
import './PaymentForm.css';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();

  // Destructure the booking details from the location state
  const { selectedDate, selectedTime, selectedDuration, firstName, lastName, phone, email, finalPrice } = location.state || {};

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);

    const response = await fetch('http://localhost:3000/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: finalPrice * 100, currency: 'usd' }), // Amount in cents
    });

    const { clientSecret } = await response.json();

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
    }
  };

  return (
    <section className='payment'>
    <div className='payment-container'>
      {success ? (
        <div className="payment-success">
        <h2>Payment Successful!</h2>
        <p>Thank you for your payment.</p>
        <p>A confirmation email has been sent to your provided email address.</p>
      </div>
      ) : (
        <div className='payment-content'>
          {/* Left Column: Booking Details */}
          <div className='payment-details'>
            <h2>Booking Details</h2>
            <p><strong>Date:</strong> {selectedDate?.toLocaleDateString()}</p>
            <p><strong>Time:</strong> {selectedTime}</p>
            <p><strong>Duration:</strong> {selectedDuration} minutes</p>
            <p><strong>First Name:</strong> {firstName}</p>
            <p><strong>Last Name:</strong> {lastName}</p>
            <p><strong>Phone:</strong> {phone}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Total Price:</strong> £{finalPrice}</p>
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
              {loading ? 'Processing...' : `Pay £${finalPrice}`}
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
