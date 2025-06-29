import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [loginInput, setLoginInput] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

 const handleSubmit = (e) => {
  e.preventDefault();
  if (loginInput === '23160725') {
    localStorage.setItem('isLoggedIn', 'true');  // зберігаємо статус входу
    setError('');
    navigate('/admin');
  } else {
    setError('Невірний логін. Спробуйте ще раз.');
  }
};

  const handleClose = () => {
    navigate('/');
  };

  return (
    <>
      <div className="overlay" onClick={handleClose}></div>
      <div className="modal">
        <h2>Введіть логін</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            placeholder="Логін"
            autoFocus
            className="input"
          />
          {error && <p className="error">{error}</p>}
          <div className="buttons">
            <button type="submit" className="button">Ввійти</button>
            <button type="button" className="button" onClick={handleClose}>Відміна</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
