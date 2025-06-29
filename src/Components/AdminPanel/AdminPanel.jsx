import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './AdminPanel.css';

// 🔥 Імпортуємо все необхідне з Firebase
import { db, storage } from '../../firebase.js';
import { collection, getDocs, doc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Стандартні дані для скидання
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

// Стандартні дані для контенту
const defaultContentData = [
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

// Перейменовуємо компонент для ясності
const AdminPanel = () => {
  const navigate = useNavigate();

  // 🔥 Стани для даних, завантаження та вибраної категорії
  const [data, setData] = useState(null);
  const [contentData, setContentData] = useState(defaultContentData);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("РОЗТЯЖКИ");
  const [activeTab, setActiveTab] = useState("prices"); // "prices" або "content"
  const [uploadingImages, setUploadingImages] = useState({}); // Для відстеження завантаження зображень

  // 🔥 Завантажуємо дані з Firestore один раз при завантаженні компонента
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Завантажуємо послуги
        const servicesCollection = collection(db, "services");
        const servicesSnapshot = await getDocs(servicesCollection);
        const servicesData = {};
        servicesSnapshot.forEach(doc => {
          servicesData[doc.id] = doc.data().items || [];
        });
        setData(servicesData);

        // Завантажуємо контент
        const contentCollection = collection(db, "content");
        const contentSnapshot = await getDocs(contentCollection);
        const contentItems = [];
        contentSnapshot.forEach(doc => {
          contentItems.push({ id: doc.id, ...doc.data() });
        });
        if (contentItems.length > 0) {
          setContentData(contentItems);
        }
      } catch (error) {
        console.error("Помилка завантаження даних з Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔥 Допоміжна функція для компресії зображень
  const compressImage = (base64String, maxSize = 500000) => { // 500KB limit
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Розраховуємо нові розміри для компресії
        let { width, height } = img;
        const maxDimension = 800;
        
        if (width > height) {
          if (width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Малюємо зображення з новими розмірами
        ctx.drawImage(img, 0, 0, width, height);
        
        // Конвертуємо в base64 з компресією
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        
        // Якщо все ще занадто велике, зменшуємо якість
        if (compressedBase64.length > maxSize) {
          const moreCompressed = canvas.toDataURL('image/jpeg', 0.5);
          resolve(moreCompressed);
        } else {
          resolve(compressedBase64);
        }
      };
      
      img.onerror = () => {
        // Якщо не вдалося завантажити зображення, повертаємо оригінал
        resolve(base64String);
      };
      
      img.src = base64String;
    });
  };

  // 🔥 Допоміжна функція для оновлення даних у Firestore
  const updateFirestoreCategory = async (category, updatedItems) => {
    try {
      // Валідація та санітизація даних перед збереженням
      const sanitizedItems = updatedItems.map(item => ({
        id: Number(item.id) || Date.now(),
        title: String(item.title || '').trim(),
        price: String(item.price || '').trim(),
        image: item.image ? String(item.image).trim() : ''
      }));

      const categoryDocRef = doc(db, "services", category);
      await updateDoc(categoryDocRef, { items: sanitizedItems });
    } catch (error) {
      console.error("Помилка оновлення категорії:", error);
      throw error;
    }
  };

  // 🔥 Допоміжна функція для оновлення контенту у Firestore
  const updateFirestoreContent = async (updatedContent) => {
    try {
      // Валідація та санітизація даних контенту
      const sanitizedContent = updatedContent.map(item => ({
        id: Number(item.id) || Date.now(),
        image: item.image ? String(item.image).trim() : '',
        title: String(item.title || '').trim(),
        desc: String(item.desc || '').trim(),
        actionLink: String(item.actionLink || '').trim(),
        actionText: String(item.actionText || '').trim()
      }));

      // Видаляємо всі документи в колекції content
      const contentCollection = collection(db, "content");
      const contentSnapshot = await getDocs(contentCollection);
      const deletePromises = contentSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Додаємо нові документи
      const addPromises = sanitizedContent.map(item => {
        const docRef = doc(contentCollection);
        return setDoc(docRef, item);
      });
      await Promise.all(addPromises);
    } catch (error) {
      console.error("Помилка оновлення контенту:", error);
      throw error;
    }
  };

  // 🔥 Оновлення текстових полів для послуг (тільки локально)
  const handleChange = (index, field, value) => {
    const updatedItems = [...data[selectedCategory]];
    updatedItems[index][field] = value;
    setData({ ...data, [selectedCategory]: updatedItems });
  };

  // 🔥 Оновлення полів контенту
  const handleContentChange = async (index, field, value) => {
    try {
      const updatedContent = [...contentData];
      updatedContent[index][field] = value;
      
      setContentData(updatedContent);
      await updateFirestoreContent(updatedContent);
    } catch (error) {
      console.error("Помилка оновлення контенту:", error);
      alert("Помилка збереження змін. Спробуйте ще раз.");
    }
  };
// Додайте цю функцію у ваш компонент AdminPanel
const handleSaveChanges = async () => {
  try {
    await updateFirestoreCategory(selectedCategory, data[selectedCategory]);
    alert("✅ Зміни успішно збережено!");
  } catch (error) {
    alert("❌ Помилка збереження змін. Спробуйте ще раз.");
  }
};
  // 🔥 Завантаження та оновлення зображення для послуг (тільки локально)
  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Файл занадто великий. Максимальний розмір: 5MB");
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert("Будь ласка, виберіть зображення");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Image = event.target.result;
      const compressedImage = await compressImage(base64Image);
      const updatedItems = [...data[selectedCategory]];
      updatedItems[index].image = compressedImage;
      setData({ ...data, [selectedCategory]: updatedItems });
    };
    reader.readAsDataURL(file);
  };

  // 🔥 Завантаження та оновлення зображення для контенту
  const handleContentImageChange = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Перевіряємо розмір файлу (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Файл занадто великий. Максимальний розмір: 5MB");
      return;
    }

    // Перевіряємо тип файлу
    if (!file.type.startsWith('image/')) {
      alert("Будь ласка, виберіть зображення");
      return;
    }

    const uploadKey = `content_${index}`;
    setUploadingImages(prev => ({ ...prev, [uploadKey]: true }));

    try {
      console.log("Початок завантаження зображення контенту:", file.name);
      
      // Через CORS проблеми з Firebase Storage, використовуємо base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64Image = event.target.result;
          
          // Компресуємо зображення перед збереженням
          const compressedImage = await compressImage(base64Image);
          
          const updatedContent = [...contentData];
          updatedContent[index].image = compressedImage;
          
          setContentData(updatedContent);
          await updateFirestoreContent(updatedContent);
          
          console.log("Зображення контенту збережено як base64 (стиснуте)");
          alert("Зображення успішно завантажено!");
        } catch (error) {
          console.error("Помилка обробки зображення контенту:", error);
          alert("Помилка обробки зображення: " + error.message);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Помилка завантаження зображення контенту:", error);
      alert("Помилка завантаження зображення: " + error.message);
    } finally {
      setUploadingImages(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  // 🔥 Додавання нової послуги
  const handleAddService = async () => {
    try {
      const newService = { id: Date.now(), title: "Нова послуга", price: "0 грн", image: "" };
      const updatedItems = [...data[selectedCategory], newService];

      setData({ ...data, [selectedCategory]: updatedItems });
      await updateFirestoreCategory(selectedCategory, updatedItems);
    } catch (error) {
      console.error("Помилка додавання послуги:", error);
      alert("Помилка додавання послуги. Спробуйте ще раз.");
    }
  };

  // 🔥 Додавання нового контенту
  const handleAddContent = async () => {
    try {
      const newContent = { 
        id: Date.now(), 
        image: '', 
        title: 'Новий заголовок', 
        desc: 'Новий опис...', 
        actionLink: 'https://example.com', 
        actionText: 'Дії' 
      };
      const updatedContent = [...contentData, newContent];

      setContentData(updatedContent);
      await updateFirestoreContent(updatedContent);
    } catch (error) {
      console.error("Помилка додавання контенту:", error);
      alert("Помилка додавання контенту. Спробуйте ще раз.");
    }
  };

  // 🔥 Видалення послуги
  const handleDelete = async (index) => {
    try {
      const updatedItems = [...data[selectedCategory]];
      updatedItems.splice(index, 1);

      setData({ ...data, [selectedCategory]: updatedItems });
      await updateFirestoreCategory(selectedCategory, updatedItems);
    } catch (error) {
      console.error("Помилка видалення послуги:", error);
      alert("Помилка видалення послуги. Спробуйте ще раз.");
    }
  };

  // 🔥 Видалення контенту
  const handleDeleteContent = async (index) => {
    try {
      const updatedContent = [...contentData];
      updatedContent.splice(index, 1);

      setContentData(updatedContent);
      await updateFirestoreContent(updatedContent);
    } catch (error) {
      console.error("Помилка видалення контенту:", error);
      alert("Помилка видалення контенту. Спробуйте ще раз.");
    }
  };

  // 🔥 Скидання до стандартних значень
  const handleResetToDefault = async () => {
    const confirmed = window.confirm("Ви дійсно хочете скинути всі дані до стандартних значень? Це неможливо буде відмінити!");
    if (!confirmed) return;

    try {
      if (activeTab === "prices") {
        // Оновлюємо всі категорії до стандартних значень
        for (const [category, items] of Object.entries(defaultData)) {
          const categoryDocRef = doc(db, "services", category);
          await setDoc(categoryDocRef, { items: items });
        }
        
        // Оновлюємо локальний стан
        setData(defaultData);
      } else {
        // Скидаємо контент
        await updateFirestoreContent(defaultContentData);
        setContentData(defaultContentData);
      }
      
      alert("Дані успішно скинуті до стандартних значень!");
    } catch (error) {
      console.error("Помилка скидання даних:", error);
      alert("Помилка при скиданні даних. Спробуйте ще раз.");
    }
  };

  // 🔥 Зберегти зміни для однієї послуги
  const handleSaveService = async (index) => {
    try {
      const updatedItems = [...data[selectedCategory]];
      await updateFirestoreCategory(selectedCategory, updatedItems);
      alert("✅ Зміни для послуги збережено!");
    } catch (error) {
      alert("❌ Помилка збереження змін для послуги");
    }
  };

  // 🧠 Підключення локальних зображень із src/assets
  const getImage = (fileName) => {
    try {
      if (!fileName) return null;
      if (fileName.startsWith('http') || fileName.startsWith('data:image')) {
        return fileName;
      }
      return require(`../../assets/${fileName}`);
    } catch (err) {
      return null;
    }
  };

  // 🔥 Показуємо індикатор, поки дані завантажуються
  if (loading) {
    return <div className="admin-panel-loading">Завантаження даних з сервера...</div>;
  }

  return (
    <div className="admin-panel">
      <h2>Адмін Панель</h2>
      
      {/* Вкладки */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === "prices" ? "active" : ""}`}
          onClick={() => setActiveTab("prices")}
        >
          Редагування Цін
        </button>
        <button 
          className={`tab ${activeTab === "content" ? "active" : ""}`}
          onClick={() => setActiveTab("content")}
        >
          Редагування Контенту
        </button>
      </div>

      {activeTab === "prices" ? (
        <>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {data && Object.keys(data).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="services-list">
            {data && data[selectedCategory] && data[selectedCategory].map((item, index) => (
              <div key={item.id} className="service-item">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                  placeholder="Назва послуги"
                />
                <input
                  type="text"
                  value={item.price}
                  onChange={(e) => handleChange(index, "price", e.target.value)}
                  placeholder="Ціна"
                />
                
                {selectedCategory !== "ШРАМИРУБЦІ" && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(index, e)}
                    />
                    {item.image && (
                      <img
                        src={getImage(item.image)}
                        alt="preview"
                        className="image-preview"
                        style={{ maxWidth: 80, maxHeight: 80, marginLeft: 8 }}
                        onError={e => e.target.style.display = 'none'}
                      />
                    )}
                  </>
                )}

                <button onClick={() => handleDelete(index)} className="delete-btn">Видалити</button>
              </div>
            ))}

            <button onClick={handleAddService} className="add-btn">
              Додати послугу
            </button>
          </div>
        </>
      ) : (
        <div className="content-list">
          {contentData.map((item, index) => (
            <div key={item.id} className="content-item">
              <input
                type="text"
                value={item.title}
                onChange={(e) => handleContentChange(index, "title", e.target.value)}
                placeholder="Заголовок"
              />
              <textarea
                value={item.desc}
                onChange={(e) => handleContentChange(index, "desc", e.target.value)}
                placeholder="Опис"
                rows="3"
              />
              <input
                type="text"
                value={item.actionLink}
                onChange={(e) => handleContentChange(index, "actionLink", e.target.value)}
                placeholder="Посилання"
              />
              <input
                type="text"
                value={item.actionText}
                onChange={(e) => handleContentChange(index, "actionText", e.target.value)}
                placeholder="Текст кнопки"
              />
              
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleContentImageChange(index, e)}
                disabled={uploadingImages[`content_${index}`]}
              />
              {uploadingImages[`content_${index}`] && (
                <div className="upload-indicator">Завантаження...</div>
              )}
              {item.image && (
                <img
                  src={item.image}
                  alt="preview"
                  className="image-preview"
                  onError={(e) => {
                    console.error("Помилка завантаження зображення контенту:", item.image);
                    e.target.style.display = 'none';
                  }}
                />
              )}

              <button onClick={() => handleDeleteContent(index)} className="delete-btn">
                Видалити
              </button>
            </div>
          ))}

          <button onClick={handleAddContent} className="add-btn">
            Додати контент
          </button>
        </div>
      )}

      <button onClick={handleResetToDefault} className="reset-btn">
        Скинути до стандартних
      </button>

      <button
        onClick={() => {
          const confirmed = window.confirm("Ви дійсно хочете вийти з адмін панелі?");
          if (confirmed) navigate("/");
        }}
        className="close-btn"
      >
        Покинути адмін панель
      </button>

      <button onClick={handleSaveChanges} className="save-btn">Зберегти зміни</button>
    </div>
  );
};

export default AdminPanel;