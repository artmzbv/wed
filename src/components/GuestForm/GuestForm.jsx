import { useState } from 'react';
import './GuestForm.css';

// label — что видит гость на сайте, value — ТОЧНЫЙ текст варианта в Google-форме.
// value менять нельзя, иначе ответ не запишется; label можно любой.
const TRANSPORT = [
  { label: 'Самостоятельно', value: 'Самостоятельно' },
  { label: 'Присоединюсь к друзьям/семье', value: 'Присоединюсь к друзьям/семье' },
  { label: 'Рассчитываю на трансфер', value: 'На трансфере' },
];

// ─── Подключение к Google Forms ───────────────────────────────────
// Замените ВАШ_ID_ФОРМЫ и entry-номера на свои (как получить — см. инструкцию).
const GOOGLE_FORM_ACTION =
  'https://docs.google.com/forms/d/e/1FAIpQLSfU1rZ_QpjKEfFhXHeVKEXATVh9rSL-5LUzQEyM60Bt4hHzyw/formResponse';

const ENTRY = {
  name:      'entry.472895937',  // «Имя и Фамилия (все гости)»
  attending: 'entry.1313687343', // «Планируете ли Вы быть на празднике?»
  transport: 'entry.748411919',  // «Как вы предпочитаете добираться до площадки?»
};

const GuestForm = () => {
  const [form, setForm] = useState({
    name: '',
    attending: '',
    partnerName: '',
    transport: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  // Обновляем поле и сбрасываем ошибку, как только гость что-то заполняет
  const patch = (p) => {
    setForm((f) => ({ ...f, ...p }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Транспорт обязателен только если гость придёт; при «Не смогу» — нет.
    const needsTransport = form.attending === 'yes';
    if (!form.name.trim() || !form.attending || (needsTransport && !form.transport)) {
      setError('Пожалуйста, ответьте на все вопросы.');
      return;
    }
    setError('');

    const attendingText = form.attending === 'yes' ? 'Да, с удовольствием' : 'Не смогу';

    const data = new FormData();
    data.append(ENTRY.name, form.name);
    data.append(ENTRY.attending, attendingText);
    data.append(ENTRY.transport, form.transport);

    // mode: 'no-cors' — ответ Google непрозрачный (прочитать нельзя),
    // но при обрыве связи fetch отклоняется — это ловим в .catch.
    setSending(true);
    fetch(GOOGLE_FORM_ACTION, { method: 'POST', mode: 'no-cors', body: data })
      .then(() => setSubmitted(true))
      .catch(() =>
        setError('Не удалось отправить — похоже, пропала связь. Проверьте интернет и попробуйте ещё раз.')
      )
      .finally(() => setSending(false));
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
        Просим подтвердить ваше присутствие на мероприятии до 25/07/2026:
      </p>
      {/* <p className="guestform__date">25/07/2026</p> */}

      <form className="guestform__grid" onSubmit={handleSubmit}>

        <div className="guestform__left">
          <div className="guestform__block">
            <p className="guestform__hint">Ваши Имя и Фамилия</p>
            <input
              className="guestform__input"
              type="text"
              placeholder="Павел Техников"
              value={form.name}
              onChange={(e) => patch({ name: e.target.value })}
            />
            <div className="guestform__line" />
          </div>

          <div className="guestform__block">
            <p className="guestform__question">Планируете ли вы быть на празднике?</p>
            <label className="guestform__radio">
              <input
                type="radio"
                name="attending"
                value="yes"
                checked={form.attending === 'yes'}
                onChange={() => patch({ attending: 'yes' })}
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
                onChange={() => patch({ attending: 'no' })}
              />
              <span className="guestform__radio-circle" />
              Не смогу
            </label>
          </div>
        </div>

        <div className="guestform__right">
          <p className="guestform__question">Как вы планируете добираться до площадки?</p>
          <div className="guestform__transport">
            {TRANSPORT.map((opt) => (
              <label key={opt.value} className="guestform__radio">
                <input
                  type="radio"
                  name="transport"
                  value={opt.value}
                  checked={form.transport === opt.value}
                  onChange={() => patch({ transport: opt.value })}
                />
                <span className="guestform__radio-circle" />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
        <div className="guestform__submit-row">
          {error && <p className="guestform__error">{error}</p>}
          <button className="guestform__btn" type="submit" disabled={sending}>
            {sending ? 'Отправка…' : 'Отправить'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default GuestForm;
