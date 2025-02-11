import React, { useState, useEffect } from 'react';
import './Comments.css';
import { URL } from '../../utils/constants/constants';

const Comments = () => {
  // State to store fetched comments, loading and error states
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // comments states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchPosition, setTouchPosition] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Responsive number of cards visible
  const getVisibleCount = (width) => {
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
  };
  const [visibleCount, setVisibleCount] = useState(getVisibleCount(window.innerWidth));

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${URL}/comments`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        setComments(data);
        // console.log(data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchComments();
  }, []);
  
  // Adjust visible count on window resize
  useEffect(() => {
    const handleResize = () => {
      const newVisibleCount = getVisibleCount(window.innerWidth);
      setVisibleCount(newVisibleCount);
      if (currentIndex > comments.length - newVisibleCount) {
        setCurrentIndex(Math.max(0, comments.length - newVisibleCount));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex, comments.length]);

  // Calculate total slides for dot navigation
  const totalSlides = comments.length - visibleCount + 1;

  // comments navigation functions
  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const goToSlide = (slideIndex) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(slideIndex);
  };

  // Release transition lock after CSS transition (500ms)
  useEffect(() => {
    const timer = setTimeout(() => setIsTransitioning(false), 500);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Touch events for swipe support
  const handleTouchStart = (e) => {
    const touchDown = e.touches[0].clientX;
    setTouchPosition(touchDown);
  };

  const handleTouchMove = (e) => {
    if (touchPosition === null || isTransitioning) return;

    const currentTouch = e.touches[0].clientX;
    const diff = touchPosition - currentTouch;

    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
      setTouchPosition(null);
    }
  };

  // Calculate the sliding container style based on currentIndex and visibleCount
  const containerStyle = {
    transform: `translateX(-${(100 / visibleCount) * currentIndex}%)`,
    transition: 'transform 0.5s ease',
    display: 'flex',
  };

  // Helper function to render five stars based on rating
  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = rating;
    const emptyStars = totalStars - filledStars;
    const starsArray = [];

    for (let i = 0; i < filledStars; i++) {
      starsArray.push(
        <span key={`star-filled-${i}`} className="comments__star comments__star--filled">
          ★
        </span>
      );
    }
    for (let i = 0; i < emptyStars; i++) {
      starsArray.push(
        <span key={`star-empty-${i}`} className="comments__star">
          ☆
        </span>
      );
    }
    return starsArray;
  };

  return (
    <section className="comments" id="comments">
      {loading ? (
        <p>Loading comments...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <h1 className="comments__title">REVIEWS</h1>
          <h2 className="comments__subtitle">
          Experiences Captured in Words
          </h2>

          <div
            className="comments__container"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            <div className="comments__slider comments__slider">
              <div
                className="comments__arrows comments__arrow_left"
                onClick={prevSlide}
              ></div>

              <div className="comments__viewport">
                <div className="comments__container" style={containerStyle}>
                  {comments.map((comment, index) => (
                    <div
                      key={index}
                      className="comments__card"
                      style={{ flex: `0 0 ${100 / visibleCount}%` }}
                    >
                      <img
                        className="comments__card-image"
                        src={comment.src}
                        alt={comment.name}
                      />
                      <h3 className="comments__card-title">{comment.name}</h3>
                      <div className="comments__stars">
                        {renderStars(comment.stars)}
                      </div>
                      <p className="comments__card-description">
                        {comment.review}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="comments__arrows comments__arrow_right"
                onClick={nextSlide}
              ></div>
            </div>

            <div className="comments__dots">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <span
                  key={index}
                  className={`comments__dot ${
                    currentIndex === index ? 'comments__dot_active' : ''
                  }`}
                  onClick={() => goToSlide(index)}
                ></span>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Comments;
