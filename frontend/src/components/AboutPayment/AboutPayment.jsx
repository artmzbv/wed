import React from 'react';
import './AboutPayment.css'; 

const AboutPayment = () => {

  const items = [
    {number: '1', title:`Online\nBooking`,
    description: 'Select and pay for your perfect photoshoot via our quick and easy booking platform'},
    {number: '2', title: `Pay per\nsession`,
    description: `Pick and choose what works for you: whether it's 15 minutes for headshots or capturing memories with a visiting friend, or a full hour that allows for themes and costume changes, catering to family, friends, professionals, and creatives alike to explore.`},
    {number: '3', title:`Same day \nresults`,
    description: 'Receive a secure link to download your photoshoot.'},
    {number: '4', title:`Pick &\nChoose`,
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