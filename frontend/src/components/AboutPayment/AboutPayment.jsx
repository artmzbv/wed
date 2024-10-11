import React from 'react';
import './AboutPayment.css'; 

const AboutPayment = () => {

  const items = [
    {number: '1', title:`Online\nBooking`,
    description: 'For your convenience, we have a dressing room and makeup area inside the studio'},
    {number: '2', title: `Pay per\nsession`,
    description: 'Capture professional photos of yourself and your loved ones by simply looking at your reflection and using a small clicker, where you can be both the photographer and the model'},
    {number: '3', title:`Same day \nresults`,
    description: 'Our studio offers a minimalist space with a professional studio lighting , magic mirror and a variety of backgrounds, allowing you to have complete creative control over your shoot with a small clicker'},
    {number: '4', title:`Get all\nphotos`,
      description: `You can take as many pictures as you'd like`},
]

    return (
      <section className='about-payment' id="about">
          <h2 className='about-payment__subtitle'>{`From booking to beautiful photos — \nmake it easy with us`}</h2>
            <div className='about-payment__container'>
            {items.map((item) => (
              <div key={item.title} 
              className='about-payment__card'>
                <div className='about-payment__block'>
                <h3 className='about-payment__block-number'>{item.number}</h3>
                <h3 className='about-payment__block-title'>{item.title}</h3>
                </div>
                <p className='about-payment__description'>{item.description}</p>
              </div>
          ))}
        </div>
      </section>
    );
  };
  

export default AboutPayment;