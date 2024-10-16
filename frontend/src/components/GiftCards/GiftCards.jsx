import React from 'react';
import './GiftCards.css'; 
import Button from '../common/Button/Button';
import digital from '../../images/404.jpg'
import physical from '../../images/404.jpg'

const GiftCards = () => {
    return (
        <section className='gifts' id="gifts">
            <h1 className='gifts__title'>MAKE A GIFT TO YOUR LOVED ONES</h1>
            <div className='gifts__container'>
            <div className='gifts__digital'>
                <h2 className='gifts__subtitle'>Digital certificates</h2>
                <p className='gifts__description'>You can print them, but we suggest emailing them to minimise paper waste</p>
                <img className='gifts__image' src={digital} alt='digital gift' />
                <Button book={false} type={"digital gift"} value={"BUY FOR 60£"} />
            </div>
            <div className='gifts__physical'>
                <h2 className='gifts__subtitle'>Physical certificates</h2>
                <p className='gifts__description'>You can print them, but we suggest emailing them to minimise paper waste</p>
                <img className='gifts__image' src={physical} alt='physical gift'/>
                <Button book={false} type={"physical gift"} value={"BUY FOR 60£"} />
            </div>
            </div>
        </section>
    );
  };
  

export default GiftCards;