import React from 'react';
import './ContactUs.css'; 
import chamber from '../../images/chamber.png'

const ContactUs = () => {
    return (
      <section className='contact' id='contact'>
        {/* <h1 className='contact__title'>Contact Us</h1> */}
        <div className='contact__container'>
        <h2 className='contact__title contact__title_mobile'>HOW TO FIND US ?</h2>
          <div className='contact__info'>
          <div className='contact__adress-container'>
          <h2 className='contact__title contact__title_desktop'>HOW TO FIND US ?</h2>
          <p className='contact__adress'>Studio 8, Citibase Brighton, 95 Ditchling Road, Brighton, BN1 4ST</p>
          <p className='contact__adress'>info@self-made-portraits.com</p>
          <p className='contact__adress'>01273 011626</p>
          </div>
          <img className='contact__image' src={chamber} ></img>
          {/* <p className='contact__adress'>36</p> */}
          </div>
          <div className='contact__maps'>
          <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1259.9432515835967!2d-0.13435557976227308!3d50.833266164177566!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4875854f742456e5%3A0xb253b4493ce9f45c!2sSelf-Made%20Portraits!5e0!3m2!1sru!2sru!4v1745599108720!5m2!1sen!2sen" 
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