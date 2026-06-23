import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer__org-title">
        На все вопросы, связанные с торжеством, с радостью ответят организаторы нашей свадьбы
      </p>
      <div className="footer__contacts">
        <div className="footer__col">
          <a href="tel:+79055709847">Диана — +7 (905) 570-98-47</a>
          <a href="tel:+79774932477">Валерия — +7 (977) 493-24-77</a>
        </div>
        <div className="footer__col">
          <a href="tel:+79252411775">Вячеслав — +7 (925) 241-17-75</a>
          <a href="tel:+79670518346">Виктория — +7 (967) 051-83-46</a>
        </div>
      </div>
      <div className="footer__monogram">
        <span className="footer__monogram-main">И&amp;Н</span>
        <span className="footer__monogram-sub">А&amp;З</span>
      </div>
    </footer>
  );
};

export default Footer;
