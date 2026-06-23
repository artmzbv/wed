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
          <div className="program__divider" />
          <div className="program__item">
            <span className="program__label">Адрес:</span>
            <span className="program__value">
              Дачный отель Pine River<br />Калужская область
            </span>
          </div>
          <div className="program__divider" />
          <div className="program__item">
            <span className="program__label">Начало церемонии</span>
            <span className="program__value">16:30</span>
          </div>
          <div className="program__divider" />
          <div className="program__item">
            <span className="program__label">Регистрация</span>
            <span className="program__value">6:00 – 0:00</span>
          </div>
        </div>

        <div className="program__card">
          <div className="program__item">
            <span className="program__label">Программа:</span>
            <span className="program__value">
              Конкурсы от Ларина<br />Дискотека
            </span>
          </div>
          <div className="program__divider" />
          <div className="program__item">
            <span className="program__label">Еда:</span>
            <span className="program__value">
              Сезонное меню, включающее в себя блюда из продуктов местного производства.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Program;
