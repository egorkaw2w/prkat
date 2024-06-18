import React from 'react';
import { Link } from 'react-router-dom';
import '../css/header.css';

const Header = (props) => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <nav className="nav">
            <Link to="/" className="nav-item">Главная</Link>
            <Link to="/catalog" className="nav-item">Каталог</Link>
            <Link to="/favorites" className="nav-item">Избранное</Link>
            <Link to="/cart" className="nav-item">Корзина</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;