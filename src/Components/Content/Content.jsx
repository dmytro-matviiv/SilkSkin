import './Content.css';
import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../firebase.js';
import { collection, getDocs, onSnapshot } from "firebase/firestore";

import { Helmet } from 'react-helmet-async';

const defaultCards = [
  {
    id: 1,
    image: 'Whywe1.jpg',
    title: 'Підтвердження професіоналізму та якості',
    desc: 'Ми постійно вдосконалюємо свої навички...',
    actionLink: 'https://www.instagram.com/royalskin_rivne/',
    actionText: 'Переглянути',
  },
  {
    id: 2,
    image: 'Whywe2.jpg',
    title: 'Найсучасніше обладнання для вашої краси',
    desc: 'Відкрийте для себе можливості...',
    actionLink: 'https://www.instagram.com/royalskin_rivne/',
    actionText: 'Ознайомитись',
  },
  {
    id: 3,
    image: 'micronid_photo.jpg',
    title: 'Видимий результат після першої процедури',
    desc: 'Шкіра стає гладкою...',
    actionLink: 'https://www.instagram.com/royalskin_rivne/',
    actionText: 'Результати',
  }
];

const getImage = (fileName) => {
  try {
    // Якщо це URL з Firebase Storage або інший URL, повертаємо як є
    if (fileName.startsWith('http') || fileName.startsWith('data:image')) {
      return fileName;
    }
    // Інакше намагаємося завантажити з assets
    return require(`../../assets/${fileName}`);
  } catch (err) {
    console.error("Image not found:", fileName);
    return null;
  }
};

const Content = () => {
  const [cards, setCards] = useState(defaultCards);
  const [loading, setLoading] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const headerRef = useRef(null);

  useEffect(() => {
    // Підписуємося на зміни в Firestore для контенту
    const unsubscribe = onSnapshot(collection(db, "content"), (querySnapshot) => {
      const contentData = [];
      querySnapshot.forEach(doc => {
        contentData.push({ id: doc.id, ...doc.data() });
      });
      
      // Якщо дані з Firebase порожні, використовуємо defaultCards
      if (contentData.length === 0) {
        setCards(defaultCards);
      } else {
        setCards(contentData);
      }
      setLoading(false);
    }, (error) => {
      console.error("Помилка завантаження контенту з Firestore:", error);
      // При помилці використовуємо дані з localStorage або defaultCards
      const saved = localStorage.getItem('contentCards');
      if (saved) {
        setCards(JSON.parse(saved));
      } else {
        setCards(defaultCards);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;
      const rect = headerRef.current.getBoundingClientRect();
      setShowHeader(rect.bottom > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return <div className="loading">Завантаження контенту...</div>;
  }

  return (
    <div className="content-container">
      <Helmet>
        <title>Мікронідлінг, видалення шрамів, косметологія у Рівному | Silk & Skin</title>
        <meta name="description" content="Мікронідлінг, видалення шрамів, розтяжок, сучасна косметологія у Рівному. Професійний догляд за шкірою, акції, консультації." />
        <meta name="keywords" content="мікронідлінг Рівне, видалення шрамів Рівне, позбутися шраму Рівне, косметологія Рівне, догляд за шкірою, Silk & Skin" />
      </Helmet>
      <div className={`main-header${showHeader ? '' : ' sticky-fade'}`} ref={headerRef}>
        <h1>Мікронідлінг, видалення шрамів та сучасна косметологія у Рівному</h1>
        <p>Вітаємо у Silk & Skin! Ми спеціалізуємося на <a href="/blog" style={{color:'#b77b7b',textDecoration:'underline'}}>мікронідлінгу</a>, <a href="/blog" style={{color:'#b77b7b',textDecoration:'underline'}}>видаленні шрамів</a>, розтяжок та сучасних косметологічних процедурах у місті Рівне. <a href="#explanation" style={{color:'#b77b7b',textDecoration:'underline'}}>Скористайтеся акцією -25% на першу процедуру!</a></p>
      </div>
      <div id='whywe'>
        <h2 className="container-tite">ЧОМУ САМЕ МИ?</h2>
        <div className="card-container">
          {cards.map(card => (
            <div className="card" key={card.id}>
              <div
                className="image"
                style={{ backgroundImage: `url(${getImage(card.image)})` }}
              ></div>
              <div className="content">
                <a href="#">
                  <span className="title">{card.title}</span>
                </a>
                <p className="desc">{card.desc}</p>
                <a className="action" href={card.actionLink} target="_blank" rel="noreferrer">
                  {card.actionText}
                  <span aria-hidden="true"> → </span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <section style={{marginTop:'2rem'}}>
        <h2 className="faq-title">Поширені питання про мікронідлінг та видалення шрамів у Рівному</h2>
        <div className="faq-block">
          <details>
            <summary>Чи боляче проходить мікронідлінг?</summary>
            <div>Перед процедурою наноситься анестезуючий крем, тому дискомфорт мінімальний.</div>
          </details>
          <details>
            <summary>Скільки потрібно процедур для видимого результату?</summary>
            <div>Зазвичай достатньо 3-5 процедур для помітного ефекту, залежно від стану шкіри.</div>
          </details>
          <details>
            <summary>Чи можна повністю позбутися шраму?</summary>
            <div>Мікронідлінг значно зменшує видимість шрамів, але повне зникнення залежить від їх глибини та типу.</div>
          </details>
          <details>
            <summary>Яка ціна мікронідлінгу у Рівному?</summary>
            <div>Дивіться <a href="#price-list" style={{color:'#b77b7b'}}>актуальні ціни</a> на нашому сайті. Для нових клієнтів діє знижка -25%!</div>
          </details>
        </div>
        <script type="application/ld+json">{`
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Чи боляче проходить мікронідлінг?",
              "acceptedAnswer": {"@type": "Answer", "text": "Перед процедурою наноситься анестезуючий крем, тому дискомфорт мінімальний."}
            },
            {
              "@type": "Question",
              "name": "Скільки потрібно процедур для видимого результату?",
              "acceptedAnswer": {"@type": "Answer", "text": "Зазвичай достатньо 3-5 процедур для помітного ефекту, залежно від стану шкіри."}
            },
            {
              "@type": "Question",
              "name": "Чи можна повністю позбутися шраму?",
              "acceptedAnswer": {"@type": "Answer", "text": "Мікронідлінг значно зменшує видимість шрамів, але повне зникнення залежить від їх глибини та типу."}
            },
            {
              "@type": "Question",
              "name": "Яка ціна мікронідлінгу у Рівному?",
              "acceptedAnswer": {"@type": "Answer", "text": "Дивіться актуальні ціни на нашому сайті. Для нових клієнтів діє знижка -25%!"}
            }
          ]
        }
        `}</script>
      </section>
    </div>
  );
};

export default Content;
