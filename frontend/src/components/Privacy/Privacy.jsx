import React from 'react';
import './Privacy.css'; 
import quality from '../../images/privacy/quality.webp'
import comfort from '../../images/privacy/comfort.webp'
import safety from '../../images/privacy/private.jpg'
import assurance from '../../images/privacy/assurance.png'

const Privacy = () => {

  const options = [
    {title:'Quality', src: quality, 
    description: 'Professional camera and lighting set up for high quality photography.', alt: 'ready'},
    {title:'Comfort', src: comfort,
    description: 'Relax in reception before your photoshoot.', alt: 'cheese'},
    {title:'Safety', src: safety, 
    description: 'Only you can download your images.' ,alt: 'click'},
    {title:'Assurance', src: assurance,
      description: `Your photos will be automatically deleted after one week, or sooner if you prefer.`, alt: 'repeat'},
]

    return (
      <section className='privacy' id="about">
          <h1 className='privacy__title'>WHAT WE OFFER</h1>
          <h2 className='privacy__subtitle'>Everything you need for a successful photoshoot!</h2>
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