import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuActive, setIsMenuActive] = useState(false);

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  // Закриває бургер-меню при скролі
  useEffect(() => {
    const handleScroll = () => {
      if (isMenuActive) {
        setIsMenuActive(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuActive]);

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo" onClick={() => setIsMenuActive(false)}>
          <img src="/logo.png" alt="Silk & Skin - логотип косметологічного салону у Рівному" className="logo-img" />
          <span className="logo-text">Silk & Skin</span>
        </Link>
        <a href="tel:0988055084" className="navbar-phone">
          <span className="phone-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" stroke="#F36684" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="phone-number">098 805 50 84</span>
        </a>
      </div>

      {/* Бургер-меню */}
      <div className={`burger-menu ${isMenuActive ? 'active' : ''}`} onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      {/* Навігаційне меню */}
      <nav className={`navbar ${isMenuActive ? 'active' : ''}`}>
        <Link to={{ pathname: '/', search: '?scrollTo=roztyazhki' }} onClick={() => setIsMenuActive(false)}>Ціни</Link>
        <Link to={{ pathname: '/', search: '?scrollTo=contacts' }} onClick={() => setIsMenuActive(false)}>КОНТАКТИ</Link>
        <Link to="/blog" onClick={() => setIsMenuActive(false)}>Блог</Link>
        <Link to="/login" onClick={() => setIsMenuActive(false)}>Вхід</Link>
      </nav>
    </header>
  );
};

export default Navbar;
