import React, { useState } from 'react';
import './ContactUS.css';
import emailjs from '@emailjs/browser';

const procedures = [
  'Розтяжки грудей',
  'Розтяжки живота',
  'Розтяжки бока',
  'Розтяжки стегна',
  'Розтяжки ног',
  'мікронідлінг шкіри голови',
  'Мікронідлінг обличчя',
  'Мікронідлінг шия+декольте',
  'Видалення шрамів/рубців до 5см',
  'Видалення шрамів/рубців після кесаревого розтину',
  'Видалення шрамів/рубців після мамопластики',
  'Видалення шрамів/рубців після абдомінопластики',
  'Ламінування + фарбування брів',
];

const ContactUS = ({ onClose }) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    procedure: procedures[0],
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await emailjs.send(
        'service_83xoiii', // замініть на свій serviceID
        'template_wccyid7', // замініть на свій templateID
        {
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          procedure: form.procedure,
        },
        'uOobu2TjagBW68Gg3' // замініть на свій public key
      );
      setSent(true);
      // Google Ads Conversion Tracking
      if (window.gtag) {
        window.gtag('event', 'conversion', {
          'send_to': 'AW-17284202271/zY_LCLrUhuoaEJ_-37FA',
          'transaction_id': ''
        });
      }
    } catch (err) {
      setError('Сталася помилка. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="contactus-modal-bg">
        <div className="contactus-modal">
          <button className="contactus-close" onClick={onClose}>×</button>
          <h2>Дякуємо!</h2>
          <p>Ваша заявка успішно надіслана.<br/>Ми зв'яжемося з вами найближчим часом.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="contactus-modal-bg">
      <div className="contactus-modal">
        <button className="contactus-close" onClick={onClose}>×</button>
        <h2>Запис на процедуру</h2>
        <form className="contactus-form" onSubmit={handleSubmit}>
          <div className="contactus-row">
            <input
              type="text"
              name="firstName"
              placeholder="Ім'я"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Прізвище"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <input
            type="tel"
            name="phone"
            placeholder="Номер телефону"
            value={form.phone}
            onChange={handleChange}
            required
            pattern="[0-9+\-() ]{10,15}"
          />
          <select
            name="procedure"
            value={form.procedure}
            onChange={handleChange}
            required
          >
            {procedures.map(proc => (
              <option key={proc} value={proc}>{proc}</option>
            ))}
          </select>
          {error && <div className="contactus-error">{error}</div>}
          <button type="submit" className="contactus-btn" disabled={loading}>
            {loading ? 'Відправка...' : 'Надіслати'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUS; 