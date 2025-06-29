import './Content.css';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase.js';
import { collection, getDocs, onSnapshot } from "firebase/firestore";

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

  if (loading) {
    return <div className="loading">Завантаження контенту...</div>;
  }

  return (
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
  );
};

export default Content;
