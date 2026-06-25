import './Hero.css';
import heroVideo from '../../images/intro/video.mov';

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
        >
          <source src={heroVideo} type="video/mp4" />
          <source src={heroVideo} type="video/quicktime" />
        </video>
      </div>
    </section>
  );
};

export default Hero;
