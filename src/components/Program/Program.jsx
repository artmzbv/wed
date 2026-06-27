import './Program.css';

const Program = () => {
  return (
    <section className="program" id="программа">
      <div className="program__banner" />

      <div className="program__cards">
        <div className="program__card">
          <div className="program__item">
            <span className="program__label">Дата:</span>
            <span className="program__value">Вторник, 25 Августа, 2026</span>
          </div>
          <div className="program__item">
            <span className="program__label">Адрес:</span>
            <span className="program__value">
              Загородный отель Pine River<br />Восход, Обнинск<br />Калужская область
            </span>
            <a
              className="program__map-btn"
              href="https://yandex.ru/maps/org/pine_river/1191694528/?ll=36.772563%2C54.955262&z=16"
              target="_blank"
              rel="noopener noreferrer"
            >
              Точка на карте
            </a>
          </div>
          <div className="program__item">
            <span className="program__label">Начало мероприятия</span>
            <span className="program__value">15:00</span>
          </div>
        </div>

        <div className="program__card">
          <div className="program__item">
            <span className="program__value">
              Мы позаботились о вашем размещении в домиках на территории загородного клуба после мероприятия.<br />
            </span>
          </div>
          <div className="program__item">
            <span className="program__value">
              Детали о времени заселения и выселения сообщат наши организаторы ближе к дате торжества.
            </span>
          </div>
          <div className="program__item">
            <span className="program__value">
              За неделю до мероприятия вам придет приглашение для вступления в чат по организационным моментам.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Program;
