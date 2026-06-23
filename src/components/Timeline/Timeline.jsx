import './Timeline.css';

const EVENTS = [
  { time: '16:00', label: 'Сбор гостей', above: false },
  { time: '16:30', label: 'Выездная\nцеремония', above: true },
  { time: '18:00', label: 'Банкет', above: false },
  { time: '23:00', label: 'Праздничный\nторт', above: true },
  { time: '00:00', label: 'Завершение\nторжества', above: false },
];

const Timeline = () => {
  return (
    <section className="timeline" id="тайминг">
      <h2 className="section-title">ТАЙМИНГ</h2>
      <div className="timeline__track">
        <div className="timeline__line" />
        {EVENTS.map((ev, i) => (
          <div
            key={i}
            className={`timeline__event${ev.above ? ' timeline__event--above' : ''}`}
          >
            <div
              className={`timeline__text${ev.above ? ' timeline__text--above' : ' timeline__text--below'}`}
            >
              <span className="timeline__label">{ev.label}</span>
              <span className="timeline__time">{ev.time}</span>
            </div>
            <div className="timeline__dot" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Timeline;
