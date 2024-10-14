
import {React} from "react";
import { Link } from "react-router-dom";
import './PaymentSuccess.css';

export default function PaymentSuccess () {
    return (
      <section className="payment-success">
            <div className="payment-success">
            <h2>Payment Successful!</h2>
            <p>Thank you for your payment.</p>
            <p>Your reservation has been created successfully!</p>
            </div>
        <Link to="/portraits">
            <button className="payment-success__button">
            <p className="payment-success__text">Go to the Homepage</p>
            </button>
        </Link>
      </section>
    )
  }