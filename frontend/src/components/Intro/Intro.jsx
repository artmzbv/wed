import React, { useState, useEffect } from 'react';
import './Intro.css'; 
import Button from '../common/Button/Button'
import intro from '../../images/intro/NEW-MOBILE.webp'

const Intro = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 800);
      };
  
      // Add event listener for window resize
      window.addEventListener('resize', handleResize);
  
      // Cleanup the event listener on component unmount
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    return (
      <section className='intro' id='intro'>
        <div className='intro__container'>
          <div className='intro__text'>
            <h1 className='intro__title'>{`No Photographer\nProfessional Studio, Ready to Go!\nJust Click & Shoot.`}</h1>
            
            {/* Render for screens larger than 500px */}
            {!isMobile && (
              <>
                <ul className='intro__list'>
                {/* <li className='intro__subtitle'>£30 for 15 min</li> */}
                <li className='intro__subtitle'>£40 for 30 min</li>
                <li className='intro__subtitle'>£60 for 45 min</li>
                <li className='intro__subtitle'>£70 for 60 min</li>
                </ul>
                <div className='intro__buttons'>
                <Button book={true} type={"time"} value={"BOOK"} />
                <Button book={false} type={"gift"} value={"BUY AS A GIFT"} />
                </div>
              </>
            )}
  
            {/* Render for screens smaller than 500px */}
            {isMobile && (
              <div className='intro__mobile-container'>
                <ul className='intro__list'>
                {/* <li className='intro__subtitle'>£30 for 15 min</li> */}
                <li className='intro__subtitle'>£40 for 30 min</li>
                <li className='intro__subtitle'>£60 for 45 min</li>
                <li className='intro__subtitle'>£70 for 60 min</li>
                </ul>
                <div className='intro__buttons'>
                <Button book={true} type={"time"} value={"BOOK"} />
                <Button book={false} type={"gift"} value={"BUY AS A GIFT"} />
                </div>
              </div>
            )}
          </div>
          <img src={intro} className='intro__picture' alt="Intro" />
        </div>
      </section>
    );
  };
  

export default Intro;