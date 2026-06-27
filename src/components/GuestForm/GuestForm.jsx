import { useState } from 'react';
import './GuestForm.css';

const TRANSPORT = [
  'Самостоятельно',
  'Присоединюсь к друзьям/семье',
  'На трансфере',
];

const GuestForm = () => {
  const [form, setForm] = useState({
    name: '',
    attending: '',
    partnerName: '',
    transport: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to backend
    console.log('Guest form:', form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="guestform" id="анкета">
        <h2 className="section-title">АНКЕТА ГОСТЯ</h2>
        <div className="guestform__success">
          <p>Спасибо, {form.name}! Ваш ответ принят. Мы с нетерпением вас ждём!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="guestform" id="анкета">
      <h2 className="section-title">АНКЕТА ГОСТЯ</h2>
      <p className="guestform__deadline">
        Просим подтвердить своё присутствие на мероприятии до:
      </p>
      <p className="guestform__date">15/07/2026</p>

      <form className="guestform__grid" onSubmit={handleSubmit}>

        <div className="guestform__left">
          <div className="guestform__block">
            <p className="guestform__hint">Ваши Имя и Фамилия</p>
            <input
              className="guestform__input"
              type="text"
              placeholder="Если вы будете с парой/семьей, укажите все имена"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <div className="guestform__line" />
          </div>

          <div className="guestform__block">
            <p className="guestform__question">Планируете ли Вы быть на празднике?</p>
            <label className="guestform__radio">
              <input
                type="radio"
                name="attending"
                value="yes"
                checked={form.attending === 'yes'}
                onChange={() => setForm((f) => ({ ...f, attending: 'yes' }))}
              />
              <span className="guestform__radio-circle" />
              Да, с удовольствием
            </label>
            <label className="guestform__radio">
              <input
                type="radio"
                name="attending"
                value="no"
                checked={form.attending === 'no'}
                onChange={() => setForm((f) => ({ ...f, attending: 'no' }))}
              />
              <span className="guestform__radio-circle" />
              Не смогу
            </label>
          </div>

          {form.attending === 'yes' && (
            <div className="guestform__block">
              <p className="guestform__hint">Если Вы будете не одни, пожалуйста, заполните поле ниже</p>
              <div className="guestform__line" />
              <input
                className="guestform__input"
                type="text"
                placeholder="Имя и Фамилия Вашего спутника"
                value={form.partnerName}
                onChange={(e) => setForm((f) => ({ ...f, partnerName: e.target.value }))}
              />
              <div className="guestform__line" />
            </div>
          )}
        </div>

        <div className="guestform__right">
          <p className="guestform__question">Как вы предпочитаете добираться до площадки?</p>
          <div className="guestform__transport">
            {TRANSPORT.map((opt) => (
              <label key={opt} className="guestform__radio">
                <input
                  type="radio"
                  name="transport"
                  value={opt}
                  checked={form.transport === opt}
                  onChange={() => setForm((f) => ({ ...f, transport: opt }))}
                />
                <span className="guestform__radio-circle" />
                {opt}
              </label>
            ))}
          </div>
        </div>

        <div className="guestform__submit-row">
          <button className="guestform__btn" type="submit">Отправить</button>
        </div>

      </form>
    </section>
  );
};

export default GuestForm;
