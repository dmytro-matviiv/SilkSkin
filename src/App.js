import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { initializeFirebaseData } from './firebase';
import { HelmetProvider } from 'react-helmet-async';

import Navbar from './Components/Navbar/Navbar';
import Content from './Components/Content/Content';
import Explanation from './Components/Explanation/Explanation';
import PriceList from './Components/PriceList/PriceList';
import Footer from './Components/Footer/Footer';
import Login from './Components/Login/Login';
import AdminPanel from './Components/AdminPanel/AdminPanel';
import Blog from './Components/Blog/Blog';
import './Components/Blog/Blog.css';

function PrivateRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  const location = useLocation();
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

  useEffect(() => {
    if (location.pathname === '/') {
      const params = new URLSearchParams(location.search);
      const scrollTo = params.get('scrollTo');
      if (scrollTo) {
        setTimeout(() => {
          const el = document.getElementById(scrollTo);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 200); // невелика затримка для рендеру
      }
    }
  }, [location]);

  return (
    <HelmetProvider>
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
        <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
        <Route path="/blog" element={<><Navbar /><Blog /><Footer /></>} />
      </Routes>
    </HelmetProvider>
  );
}

export default App;
