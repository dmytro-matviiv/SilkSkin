import React, { useState, useEffect } from "react";
import './PriceList.css';
import { db } from '../../firebase.js';
import { collection, getDocs, onSnapshot } from "firebase/firestore";

// 🧠 Підключення локальних зображень із src/assets
const getImage = (fileName) => {
  try {
    // Якщо це URL з Firebase Storage або base64, повертаємо як є
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

const PriceList = () => {
  const defaultData = {
    "РОЗТЯЖКИ": [
      { id: 1, title: "Груди", price: "900-1500 грн", image: "Price1.jpg" },
      { id: 2, title: "Живіт", price: "900-2000 грн", image: "Price2.jpg" },
      { id: 3, title: "Бока", price: "900-1500 грн", image: "Price3.jpg" },
      { id: 4, title: "Стегна", price: "900-2000 грн", image: "Price4.jpg" },
      { id: 5, title: "Сідниці", price: "900-1500 грн", image: "Price5.jpg" },
      { id: 6, title: "Гомілки", price: "900-1000 грн", image: "Price6.jpg" },
    ],
    "ШРАМИРУБЦІ": [
      { id: 7, title: "Шрам до 5см", price: "700 грн" },
      { id: 8, title: "Шрам після кесаревого", price: "1000 грн" },
      { id: 9, title: "Шрам після мамопластики", price: "1000 грн" },
      { id: 10, title: "Шрам після абдомінопластики", price: "1300 грн" }
    ],
    "ГОЛОВАОБЛИЧЧЯ": [
      { id: 11, title: "Шкіра голови", price: "800 грн", image: "Price1.1.webp" },
      { id: 12, title: "Обличчя", price: "800 грн", image: "Price1.2.jpg" },
      { id: 13, title: "Шия+декольте", price: "900 грн", image: "Price1.3.jpg" }
    ],
    "ВІЇ": [
      { id: 14, title: "Ламінування + фарбування брів", price: "800 грн", image: "Price1.4.jpg" }
    ]
  };

  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Підписуємося на зміни в Firestore
    const unsubscribe = onSnapshot(collection(db, "services"), (querySnapshot) => {
      const servicesData = {};
      querySnapshot.forEach(doc => {
        servicesData[doc.id] = doc.data().items || [];
      });
      
      // Якщо дані з Firebase порожні, використовуємо defaultData
      if (Object.keys(servicesData).length === 0) {
        setData(defaultData);
      } else {
        setData(servicesData);
      }
      setLoading(false);
    }, (error) => {
      console.error("Помилка завантаження даних з Firestore:", error);
      // При помилці використовуємо дані з localStorage або defaultData
      const saved = localStorage.getItem("priceListData");
      if (saved) {
        setData(JSON.parse(saved));
      } else {
        setData(defaultData);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const categoryOrder = [
    "РОЗТЯЖКИ",
    "ГОЛОВАОБЛИЧЧЯ",
    "ШРАМИРУБЦІ",
    "ВІЇ"
  ];

  if (loading) {
    return <div className="loading">Завантаження цін...</div>;
  }

  return (
    <div className='cotainer_priceList'>
      {categoryOrder
        .filter(category => data[category])
        .map((category) => (
          <div key={category}>
            <h2 className='container-tite' id={category.replace(/[\/ _]/g, '').toLowerCase()}>
              {category}
            </h2>

            {category === "ШРАМИРУБЦІ" ? (
              <div className="price-list">
                {data[category].map((item) => (
                  <div className="price-item" key={item.id}>
                    <div className="procedure">{item.title}</div>
                    <div className="price">{item.price}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-container">
                {data[category].map((item) => (
                  <div className="cardList" key={item.id}>
                    <div
                      className="cardList-img"
                      style={{
                        backgroundImage:
                          typeof item.image === 'string'
                            ? item.image.startsWith('data:image') || item.image.startsWith('http')
                              ? `url(${item.image})`
                              : `url(${getImage(item.image)})`
                            : 'none'
                      }}
                    />
                    <div className="cardList-info">
                      <p className="text-title">{item.title}</p>
                    </div>
                    <div className="cardList-footer">
                      <span className="text-title">{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default PriceList; 