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
          {/* <p className='contact__adress'>36</p> */}
          </div>
          <div className='contact__maps'>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1962.0583123797524!2d-0.13613519219177442!3d50.83386728793635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4875859ce5d26893%3A0x5dc017b773bf6748!2s95%20Ditchling%20Rd%2C%20Brighton%20and%20Hove%2C%20Brighton%20BN1%204ST%2C%20Royaume-Uni!5e0!3m2!1sfr!2sfr!4v1735999827037!5m2!1sfr!2sfr" 
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