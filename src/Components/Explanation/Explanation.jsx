import './Explanation.css';
import React, { useState } from 'react';
import exp1 from '../../assets/Explanation1.jpg';
import exp2 from '../../assets/Explanation2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

const Explanation = () => {
  const [showContact, setShowContact] = useState(false);

  if (showContact) {
    const ContactUS = React.lazy(() => import('../ContactUS/ContactUS'));
    return (
      <React.Suspense fallback={<div>Завантаження форми...</div>}>
        <ContactUS onClose={() => setShowContact(false)} />
      </React.Suspense>
    );
  }

  return (
    <div className="explanation_content promo-bg">
      <div className="promo-block">
        <div className="promo-img-wrap">
          <img src={exp1} alt="Мікронідлінг у Рівному" className="promo-img" />
        </div>
        <div className="promo-text">
          <h2 className="promo-title">Акція! Знижка -25% на першу процедуру</h2>
          <p className="promo-desc">
            Тільки зараз діє унікальна пропозиція: <b>отримайте -25% знижки на перший візит</b> до косметолога у Рівному! 
            Скористайтеся шансом спробувати мікронідлінг, видалення розтяжок, шрамів, чистку обличчя чи ламінування брів/вій за спеціальною ціною.
          </p>
          <ul className="promo-list">
            <li>Мікронідлінг</li>
            <li>Видалення розтяжок</li>
            <li>Видалення шрамів</li>
            <li>Чистка обличчя</li>
            <li>Ламінування брів та вій</li>
          </ul>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginTop: '1.2em' }}>
            <button className="promo-btn" onClick={() => setShowContact(true)}>Записатися</button>
            <a
              href="https://www.instagram.com/royalskin_rivne/"
              target="_blank"
              rel="noopener noreferrer"
              className="promo-insta-link"
              style={{ display: 'flex', alignItems: 'center', color: '#F36684', fontWeight: 600, textDecoration: 'none', fontSize: '1.08em' }}
            >
              <FontAwesomeIcon icon={faInstagram} style={{ fontSize: '1.6em', marginRight: '7px' }} />
              Ми є в Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explanation;
