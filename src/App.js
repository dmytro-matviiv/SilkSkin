import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { initializeFirebaseData } from './firebase';

import Navbar from './Components/Navbar/Navbar';
import Content from './Components/Content/Content';
import Explanation from './Components/Explanation/Explanation';
import PriceList from './Components/PriceList/PriceList';
import Footer from './Components/Footer/Footer';
import Login from './Components/Login/Login';
import AdminPanel from './Components/AdminPanel/AdminPanel';

function App() {
  useEffect(() => {
    // Ініціалізуємо Firebase дані при кожному запуску
    // Це забезпечить, що всі категорії присутні
    const initData = async () => {
      try {
        await initializeFirebaseData();
        console.log("Firebase дані перевірені та ініціалізовані");
      } catch (error) {
        console.error("Помилка ініціалізації Firebase даних:", error);
      }
    };
    
    initData();
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Explanation />
              <Content />
              <PriceList />
              <Footer />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </>
  );
}

export default App;
