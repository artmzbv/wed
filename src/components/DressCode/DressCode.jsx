import { useState } from 'react';
import './DressCode.css';
import men from '../../images/men.webp';
import women from '../../images/women.webp';

// Палитра вечера — тёмные тона
const COLORS = ['#0B090C', '#50311D', '#591F1F'];

// Каждый слайд — одна фотография образа (женский / мужской)
const SLIDES = [
  women,
  men,
];

const DressCode = () => {
  const [slide, setSlide] = useState(0);

  const prev = () => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setSlide((s) => (s + 1) % SLIDES.length);

  return (
    <section className="dresscode" id="дресс-код">
      <h2 className="section-title">ДРЕСС-КОД</h2>
      <div className="dresscode__content">

        <div className="dresscode__card">
          <p className="dresscode__text">
            Просим вас поддержать палитру вечера.<br />
            Нам будет приятно, если вы предпочтете спокойные и лаконичные образы.
          </p>
          <div className="dresscode__swatches">
            {COLORS.map((hex) => (
              <div key={hex} className="dresscode__swatch" style={{ background: hex }} />
            ))}
          </div>
        </div>

        <div className="dresscode__carousel">
          <button className="dresscode__nav dresscode__nav--prev" onClick={prev} aria-label="Назад">
            ‹
          </button>

          <div
            className="dresscode__photo"
            style={{ backgroundImage: `url(${SLIDES[slide]})` }}
          />

          <button className="dresscode__nav dresscode__nav--next" onClick={next} aria-label="Вперёд">
            ›
          </button>

          <div className="dresscode__dots">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`dresscode__dot${i === slide ? ' dresscode__dot--active' : ''}`}
                onClick={() => setSlide(i)}
                aria-label={`Слайд ${i + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default DressCode;
