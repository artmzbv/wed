import './Invitation.css';

const Invitation = () => {
  return (
    <section className="invitation">
      <div className="invitation__overlay" />
      <p className="invitation__text">
        {`С любовью и благодарностью приглашаем вас разделить радость\n нашего свадебного дня.`}
      </p>
    </section>
  );
};

export default Invitation;
