import React from 'react';
import './Privacy.css'; 
import door from '../../images/privacy/door.png'
import comfort from '../../images/privacy/comfort.png'
import safety from '../../images/privacy/private.jpg'
import assurance from '../../images/privacy/assurance.png'

const Privacy = () => {

  const options = [
    {title:'Secure Setting', src: door, 
    description: 'Away from prying eyes, relax and reflect in our studio space. No third party intervention, just you and your creativity.', alt: 'ready'},
    {title:'Comfort', src: comfort,
    description: 'Strike a pose to your favourite playlist or relax to a rhythmical, technical symphony while remotely conducting the studio.', alt: 'cheese'},
    {title:'Safety', src: safety, 
    description: 'Your secure download link ensures that only you can access your photos.' ,alt: 'click'},
    {title:'Assurance', src: assurance,
      description: `Your photos will be deleted automatically after 48 hours.`, alt: 'repeat'},
]

    return (
      <section className='privacy' id="about">
          <h1 className='privacy__title'>WE VALUE YOUR PRIVACY</h1>
          <h2 className='privacy__subtitle'>For us, comfort is the foundation of every photoshoot experience</h2>
            <div className='privacy__container'>
            {options.map((option) => (
              <div key={option.title} 
              className='privacy__card'>
                <h3 className='privacy__card-title'>{option.title}</h3>
                <img className='privacy__card-image' src={option.src} alt={option.alt} />
                <p className='privacy__card-description'>{option.description}</p>
              </div>
          ))}
        </div>
      </section>
    );
  };
  

export default Privacy;