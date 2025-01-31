import React from 'react';
import './ContactUs.css'; 

const ContactUs = () => {
    return (
      <section className='contact' id='contact'>
        {/* <h1 className='contact__title'>Contact Us</h1> */}
        <div className='contact__container'>
          <div className='contact__info'>
          <h2 className='contact__title'>HOW TO FIND US ?</h2>
          <p className='contact__adress'>Room 8, 95 Ditchling Road, Brighton, BN1 4ST</p>
          <p className='contact__adress'>info@self-made-portraits.com</p>
          <p className='contact__adress'>01273 011626</p>
          {/* <p className='contact__adress'>36</p> */}
          </div>
          <div className='contact__maps'>
          <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10080.296673328663!2d-0.1349094!3d50.8297901!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4875859ce1638ec9%3A0x4d9020301f8d9fd3!2s95%20Shaftesbury%20Rd%2C%20Ditchling%20Rd%2C%20Brighton%20and%20Hove%2C%20Brighton%20BN1%204ST%2C%20UK!5e0!3m2!1sen!2sfr!4v1738317521641!5m2!1sen!2sfr" 
          width="100%" 
          height="100%" 
          style={{border: 0}} 
          allowfullscreen="" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade">
          </iframe>
          </div>
        </div>
        </section>
    );
  };
  

export default ContactUs;