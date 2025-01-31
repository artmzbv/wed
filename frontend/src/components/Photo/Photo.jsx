import React, { useState, useEffect } from 'react';
import './Photo.css';
import Button from '../common/Button/Button';
import { URL } from '../../utils/constants/constants';
import PhotosCarousel from '../PhotosCarusel/PhotosCarusel';
import Privacy from '../Privacy/Privacy';

const Photo = () => {
  const [fetchedItems, setFetchedItems] = useState([]);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 767);

  // Fetch the data from your backend
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(`${URL}/photos`, {
          method: 'GET',  // Make sure you're using the correct method
          headers: {
            'Content-Type': 'aplication/json',  // If necessary, add other headers
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        setFetchedItems(data);  // Set the fetched items
      } catch (error) {
        console.error('Failed to fetch photos:', error);
      }
    };
  
    fetchPhotos();  // Fetch data on component mount
  }, []);
  

  // Monitor screen size changes and update state
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 767);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Original items array
  const items = [
    {
      images: [], // Placeholder for dynamic images
      alt: 'journey',
      subtitle: 'TRULY SEE YOURSELF',
      text: "Self-Made Portraits offers a distinctive journey of self-discovery through photography. Fully delve into your creative expression. It’s just you reflecting you.",
      position: 'left',
      blockId: 1,
    },
    {
      images: [], // Placeholder for dynamic images
      alt: 'experience',
      subtitle: 'A UNIQUE CREATIVE EXPERIENCE',
      text: 'Capturing photos with partners, friends, coworkers, or family members is such a delightful experience, even for those who may be a bit shy about participating. At Self-Made Portraits we offer the perfect setting to create a photoshoot that genuinely reflects your unique relationships and personalities.',
      position: 'right',
      blockId: 2,
    },
    {
      images: [], // Placeholder for dynamic images
      alt: 'moments',
      subtitle: 'SPECIAL MOMENTS TO CAPTURE IN LIFE',
      text: 'We provide an ideal space for capturing the beauty of pregnancy, birthdays, graduations, and other intimate moments. Our setting allows you to express yourself and showcase your unique beauty in a sensitive and personal way.',
      position: 'left',
      blockId: 3,
    },
  ];

  // Step 1: Group fetchedItems by blockId and include Order attribute
  const groupByBlockId = (items) => {
    return items.reduce((acc, item) => {
      if (!acc[item.BlockID]) {
        acc[item.BlockID] = [];
      }
      acc[item.BlockID].push({
        Photo: item.Photo,
        Order: item.Order || 0, // Use 0 if no order is specified
      });
      return acc;
    }, {});
  };

  // Group the fetched items by blockId
  const groupedFetchedItems = groupByBlockId(fetchedItems);

  // Step 2: Sort each group's images by Order attribute
  Object.keys(groupedFetchedItems).forEach((key) => {
    groupedFetchedItems[key].sort((a, b) => a.Order - b.Order);
  });

  // Step 3: Combine sorted images with original items array
  const combinedItems = items.map((item) => ({
    ...item,
    images: [
      ...item.images,
      ...(groupedFetchedItems[item.blockId]?.map((image) => image.Photo) || []),
    ],
  }));

  return (
    <section className='photos' id='photos'>
      {combinedItems.map((item, index) => (
        <div
          key={index}
          className={`photos__container ${
            isMobileView ? 'photos__container_center' : `photos__container_${item.position}`
          }`}
        >
          {isMobileView ? (
            <>
              {/* Render image carousel first in mobile view */}
              <div className='photos__shoots'>
                <PhotosCarousel images={item.images} />
              </div>
              {/* Render description below the image in mobile view */}
              <div className='photos__description'>
                <h2 className='photos__subtitle'>{item.subtitle}</h2>
                <p className='photos__text'>{item.text}</p>
                <Button book={true} type={'time'} value={'BOOK NOW'} />
              </div>
            </>
          ) : item.position === 'left' ? (
            <>
              <div className='photos__shoots'>
                <PhotosCarousel images={item.images} />
              </div>
              <div className='photos__description'>
                <h2 className='photos__subtitle'>{item.subtitle}</h2>
                <p className='photos__text'>{item.text}</p>
                <Button book={true} type={'time'} value={'BOOK NOW'} />
              </div>
            </>
          ) : (
            <>
              <div className='photos__description'>
                <h2 className='photos__subtitle'>{item.subtitle}</h2>
                <p className='photos__text'>{item.text}</p>
                <Button book={true} type={'time'} value={'BOOK NOW'} />
              </div>
              <div className='photos__shoots'>
                <PhotosCarousel images={item.images} />
              </div>
            </>
          )}
        </div>
      ))}
      <Privacy />
    </section>
  );
};

export default Photo;
