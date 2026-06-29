import './Timeline.css';

const EVENTS = [
  { time: '15:00', label: 'Начало мероприятия', above: false },
  { time: '16:00', label: 'Церемония', above: true },
  { time: '17:00', label: 'Ужин', above: false },
  { time: '21:00', label: 'Пати-тайм', above: true },
  { time: '23:00', label: 'Завершение\nвечера', above: false },
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
