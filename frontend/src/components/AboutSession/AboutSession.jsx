import React from 'react';
import './AboutSession.css'; 
import dress from '../../images/about/dress.png'
import smile from '../../images/about/smile.png'
import click from '../../images/about/click.png'
import repeat from '../../images/about/repeat.png'

const AboutSession = () => {

  const options = [
    {title:'Reflect', src: dress, 
    description: 'See yourself reflected back at you. Capture exactly what you see in the mirror.', alt: 'ready'},
    {title:'Strike That Pose!', src: smile,
    description: 'Change positions and move around to create different lighting moods.', alt: 'cheese'},
    {title:'Click', src: click, 
    description: 'Capture stunning professional photos with just a click of a button, letting you be both the photographer and the model.' ,alt: 'click'},
    {title:'Shoot/Repeat', src: repeat,
      description: `Take unlimited photos during your session`, alt: 'repeat'},
]

    return (
      <section className='session' id="about">
          <h1 className='session__title'>HOW DOES IT ALL WORK?</h1>
          <h2 className='session__subtitle'>{`No photographer needed, just you! \nNo experience required, just seize the moment!`}</h2>
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