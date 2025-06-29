import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';


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
      {/* Логотип */}
      <Link to="/clearSkin" className="logo" onClick={() => setIsMenuActive(false)}>
        <img src={logo} alt="Logo" className="logo-img" />
        Silk & Skin
      </Link>

      {/* Бургер-меню */}
      <div className={`burger-menu ${isMenuActive ? 'active' : ''}`} onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      {/* Навігаційне меню */}
      <nav className={`navbar ${isMenuActive ? 'active' : ''}`}>
        <a href="#whywe" onClick={() => setIsMenuActive(false)}>ЧОМУ САМЕ МИ</a>
        <a href="#roztyazhki" onClick={() => setIsMenuActive(false)}>РОЗТЯЖКИ</a>
        <a href="#shramirubci" onClick={() => setIsMenuActive(false)}>ШРАМИ/РУБЦІ</a>
        <a href="#holovaoblychchya" onClick={() => setIsMenuActive(false)}>ГОЛОВА/ОБЛИЧЧЯ</a>
        <a href="#contacts" onClick={() => setIsMenuActive(false)}>КОНТАКТИ</a>
        <Link to="/login" onClick={() => setIsMenuActive(false)}>Вхід</Link>
      </nav>
    </header>
  );
};

export default Navbar;
