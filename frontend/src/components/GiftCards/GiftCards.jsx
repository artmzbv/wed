import React from 'react';
import './GiftCards.css'; 
import Button from '../common/Button/Button';
import digital from '../../images/voucher.webp'
import physical from '../../images/voucher.webp'

const GiftCards = () => {
    return (
        <section className='gifts' id="gifts">
            <h1 className='gifts__title'>A ONE-OF-A-KIND, MEANINGFUL GIFT EXPERIENCE</h1>
            <div className='gifts__container'>
            <div className='gifts__digital'>
                <h2 className='gifts__subtitle'>Digital Gift Certificates</h2>
                <p className='gifts__description'>Feel free to print your gift card, but we recommend emailing them to help reduce paper waste</p>
                <img className='gifts__image' src={digital} alt='digital gift' />
                <Button book={false} type={"digital gift"} value={"GIFT OPTIONS"} />
            </div>
            <div className='gifts__physical'>
                <h2 className='gifts__subtitle'>Physical Gift Cards</h2>
                <p className='gifts__description'>Send a gift card experience with Royal Mail</p>
                <img className='gifts__image' src={physical} alt='physical gift'/>
                <Button book={false} type={"physical gift"} value={"GIFT OPTIONS"} />
            </div>
            </div>
        </section>
    );
  };
  

export default GiftCards;