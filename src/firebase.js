// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcTJCXb-Ri_pFhzxSkTl_MuO3C89C-DvA",
  authDomain: "my-clearskin.firebaseapp.com",
  projectId: "my-clearskin",
  storageBucket: "my-clearskin.firebasestorage.app",
  messagingSenderId: "83537130555",
  appId: "1:83537130555:web:1d79212607f342be17181e",
  measurementId: "G-0Y5QYV6DDD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
const storage = getStorage(app);

// Функція для ініціалізації даних при першому запуску
export const initializeFirebaseData = async () => {
  const { collection, getDocs, setDoc, doc } = await import("firebase/firestore");
  
  try {
    // Стандартні дані для послуг (використовуємо безпечні назви для Firebase)
    const defaultServicesData = {
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

    // Функція для санітизації даних послуг
    const sanitizeServiceItems = (items) => {
      return items.map(item => ({
        id: Number(item.id) || Date.now(),
        title: String(item.title || '').trim(),
        price: String(item.price || '').trim(),
        image: item.image ? String(item.image).trim() : ''
      }));
    };

    // Перевіряємо кожну категорію окремо
    const servicesCollection = collection(db, "services");
    const servicesSnapshot = await getDocs(servicesCollection);
    const existingCategories = new Set();
    
    servicesSnapshot.forEach(doc => {
      existingCategories.add(doc.id);
    });

    // Ініціалізуємо тільки ті категорії, які відсутні
    for (const [category, items] of Object.entries(defaultServicesData)) {
      if (!existingCategories.has(category)) {
        const categoryDocRef = doc(db, "services", category);
        const sanitizedItems = sanitizeServiceItems(items);
        await setDoc(categoryDocRef, { items: sanitizedItems });
        console.log(`Категорія "${category}" ініціалізована`);
      } else {
        console.log(`Категорія "${category}" вже існує`);
      }
    }

    // Перевіряємо чи є дані в колекції content
    const contentCollection = collection(db, "content");
    const contentSnapshot = await getDocs(contentCollection);
    
    if (contentSnapshot.empty) {
      // Ініціалізуємо стандартні дані для контенту
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

      // Функція для санітизації даних контенту
      const sanitizeContentItem = (item) => ({
        id: Number(item.id) || Date.now(),
        image: String(item.image || '').trim(),
        title: String(item.title || '').trim(),
        desc: String(item.desc || '').trim(),
        actionLink: String(item.actionLink || '').trim(),
        actionText: String(item.actionText || '').trim()
      });

      for (const item of defaultContentData) {
        const contentDocRef = doc(contentCollection);
        const sanitizedItem = sanitizeContentItem(item);
        await setDoc(contentDocRef, sanitizedItem);
      }
      console.log("Стандартні дані контенту ініціалізовані");
    } else {
      console.log("Дані контенту вже існують");
    }
  } catch (error) {
    console.error("Помилка ініціалізації Firebase даних:", error);
  }
};

// Функція для тестування підключення до Firebase Storage
export const testFirebaseStorage = async () => {
  try {
    console.log("Тестування підключення до Firebase Storage...");
    
    // Створюємо тестовий файл
    const testContent = "test";
    const testBlob = new Blob([testContent], { type: 'text/plain' });
    const testFile = new File([testBlob], "test.txt", { type: 'text/plain' });
    
    const testRef = ref(storage, `test/${Date.now()}_test.txt`);
    
    // Завантажуємо файл
    const snapshot = await uploadBytes(testRef, testFile);
    console.log("✅ Файл успішно завантажено:", snapshot.metadata.name);
    
    // Отримуємо URL для завантаження
    const downloadURL = await getDownloadURL(testRef);
    console.log("✅ URL для завантаження:", downloadURL);
    
    // Видаляємо тестовий файл
    const { deleteObject } = await import("firebase/storage");
    await deleteObject(testRef);
    console.log("✅ Тестовий файл видалено");
    
    console.log("🎉 Firebase Storage працює коректно!");
    return true;
  } catch (error) {
    console.error("❌ Помилка тестування Firebase Storage:", error);
    return false;
  }
};

export { db, storage };