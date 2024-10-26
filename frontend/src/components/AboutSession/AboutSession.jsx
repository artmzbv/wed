import React from 'react';
import './AboutSession.css'; 
import dress from '../../images/about/dress.png'
import smile from '../../images/about/smile.png'
import click from '../../images/about/click.png'
import repeat from '../../images/about/repeat.png'

const AboutSession = () => {

  const options = [
    {title:'Get Excited!', src: dress, 
    description: 'For your convenience, we have a mirrored changing area to prepare your best looks.', alt: 'ready'},
    {title:'Strike That Pose', src: smile,
    description: 'Take stunning professional photos of yourself and your loved ones by simply looking in a large mirror and using a small remote control clicker, allowing you to be both the photographer and the model.', alt: 'cheese'},
    {title:'Click', src: click, 
    description: 'Our studio features a minimalist design equipped with professional lighting, a magic mirror, lighter or darker background. This setup gives you full creative control over your shoot, all with the ease of a simple click.' ,alt: 'click'},
    {title:'Shoot/Repeat', src: repeat,
      description: `Your session is yours to take as many photos as you like.`, alt: 'repeat'},
]

    return (
      <section className='session' id="about">
          <h1 className='session__title'>HOW IT WORKS?</h1>
          <h2 className='session__subtitle'>{`Are you comfortable in front of a photographer?\n- Well, we’re not!`}</h2>
            <div className='session__container'>
            {options.map((option) => (
              <div key={option.title} 
              className='session__card'>
                <h3 className='session__card-title'>{option.title}</h3>
                <img className='session__card-image' src={option.src} alt={option.alt} />
                <p className='session__card-description'>{option.description}</p>
              </div>
          ))}
        </div>
      </section>
    );
  };
  

export default AboutSession;