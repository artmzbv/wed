import './Hero.css';
import heroVideo from '../../images/intro/video_hero.mp4';
import heroPoster from '../../images/intro/poster.jpg';

const Hero = () => {
  return (
    <section className="hero">
      {/* <h1 className="hero__title">ИННА И НИКОЛАЙ</h1> */}
      <div className="hero__media-wrap">
        <video
          className="hero__media"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={heroPoster}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      </div>
    </section>
  );
};

export default Hero;
