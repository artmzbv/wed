import { useState, useRef } from 'react';
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

  // Свайп пальцем влево/вправо (мобильная версия)
  const touchStartX = useRef(null);
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx <= -40) next();
    else if (dx >= 40) prev();
    touchStartX.current = null;
  };

  return (
    <section className="dresscode" id="дресс-код">
      <h2 className="section-title">ДРЕСС-КОД</h2>
      <div className="dresscode__content">

        <div className="dresscode__card">
          <p className="dresscode__text">
            Просим вас поддержать палитру вечера<br />
            и отдать предпочтение лаконичным образам
          </p>
          <div className="dresscode__swatches">
            {COLORS.map((hex) => (
              <div key={hex} className="dresscode__swatch" style={{ background: hex }} />
            ))}
          </div>
        </div>

        <div className="dresscode__carousel">
          <div
            className="dresscode__photo"
            style={{ backgroundImage: `url(${SLIDES[slide]})` }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <button className="dresscode__nav dresscode__nav--prev" onClick={prev} aria-label="Назад">
              ‹
            </button>
            <button className="dresscode__nav dresscode__nav--next" onClick={next} aria-label="Вперёд">
              ›
            </button>
          </div>

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
