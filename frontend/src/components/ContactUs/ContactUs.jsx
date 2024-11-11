import React from 'react';
import './ContactUs.css'; 

const ContactUs = () => {
    return (
      <section className='contact' id='contact'>
        {/* <h1 className='contact__title'>Contact Us</h1> */}
        <div className='contact__container'>
          <div className='contact__info'>
          <h2 className='contact__title'>HOW TO FIND US ?</h2>
          <p className='contact__adress'>95 Ditchling Road, Brighton, BN1 4ST</p>
          <p className='contact__adress'>info@self-made-portraits.com</p>
          {/* <p className='contact__adress'>36</p> */}
          </div>
          <div className='contact__maps'>
          <iframe
            title="google-map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2527.8980921590935!2d-0.13777758425029094!3d50.83403197953061!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4875854fd14c92e1%3A0x4010a0cddc4fd0f!2s95%20Ditchling%20Rd%2C%20Brighton%20BN1%204ST%2C%20UK!5e0!3m2!1sen!2sus!4v1633223079147!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
          </div>
        </div>
        </section>
    );
  };
  

export default ContactUs;