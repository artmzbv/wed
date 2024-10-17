import React from 'react';
import './ContactUs.css'; 

const ContactUs = () => {
    return (
      <section className='contact' id='contact'>
        {/* <h1 className='contact__title'>Contact Us</h1> */}
        <div className='contact__container'>
          <div className='contact__info'>
          <h2 className='contact__title'>HOW TO FIND US ?</h2>
          <p className='contact__adress'>Brighton, UK</p>
          <p className='contact__adress'>info@self-made-portraits.com</p>
          {/* <p className='contact__adress'>36</p> */}
          </div>
          <div className='contact__maps'>
          <iframe
            title="google-map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345098587!2d144.9537363153168!3d-37.81720997975161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d5e6b1d1bff%3A0x5045675218ce720!2sVictoria%20State%20Library%2C%20Melbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1633223079147!5m2!1sen!2sus"
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