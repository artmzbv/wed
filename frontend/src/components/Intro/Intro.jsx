import React from 'react';
import './Intro.css'; 
import Button from '../common/Button/Button'

const Intro = () => {
    return (
        <section className='intro' id='intro'>
            <div className='intro__container'>
            <div className='intro__text'>
            <h1 className='intro__title'>{`It’s all about you —\nyour story, your vibe. Just you!`}</h1>
            <p className='intro__subtitle'>30£ for 15 min</p>
            <p className='intro__subtitle'>40£ for 30 min</p>
            <p className='intro__subtitle'>60£ for 45 min</p>
            <p className='intro__subtitle'>70£ for 60 min</p>
            </div>
            <div className='intro__buttons'>
            <Button book={true} type={"time"} value={"BOOK"}/>
            <Button book={false} type={"gift"} value={"BUY AS A GIFT"}/>
            </div>
            </div>
        </section>
    );
  };
  

export default Intro;