import { useState } from 'react';
import './DressCode.css';

const COLORS = [
  { hex: '#5C724C', label: 'Оливковый' },
  { hex: '#DEE0D9', label: 'Серебристый' },
  { hex: '#BA7A60', label: 'Терракота' },
  { hex: '#F6EAD8', label: 'Кремовый' },
];

const SLIDES = [
  { bg: '#c8bfac' },
  { bg: '#a89b8c' },
  { bg: '#d6cfc4' },
  { bg: '#b5aa9e' },
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
            Мы очень ждем и готовимся к нашему незабываемому дню! Поддержите нас
            Вашими улыбками и объятиями, а также красивыми нарядами в палитре мероприятия
          </p>
          <div className="dresscode__swatches">
            {COLORS.map((c) => (
              <div
                key={c.hex}
                className="dresscode__swatch"
                style={{ background: c.hex }}
                title={c.label}
              />
            ))}
          </div>
        </div>

        <div className="dresscode__carousel">
          <button className="dresscode__nav dresscode__nav--prev" onClick={prev} aria-label="Назад">
            ‹
          </button>

          <div className="dresscode__slide" style={{ background: SLIDES[slide].bg }} />

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
