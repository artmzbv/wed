import React from 'react';
import './AboutPayment.css'; 

const AboutPayment = () => {

  const items = [
    {number: '1', title:`Online\nBooking`,
    description: 'Choose and book your ideal photoshoot with ease through our simple booking platform.'},
    {number: '2', title: `Pay per\nsession`,
    description: `Whether you're booking 15 minutes for headshots or a full hour for themed shoots and costume changes, there's something for everyone!`},
    {number: '3', title:`Same day \nresults`,
    description: `Within minutes of your session ending, you'll receive a secure download link for all your images.`},
    {number: '4', title:`Pick &\nChoose`,
      description: `Keep all your images and take time to select your favourite shots.`},
]

    return (
      <section className='about-payment' id="about">
          <h2 className='about-payment__subtitle'>{`From booking to breathtaking photos — \nwe make it effortless for you.`}</h2>
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