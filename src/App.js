import React from 'react';
import Header from './components/templates/header';
import Footer from './components/templates/footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <div className="search-container">
          <input type="text" placeholder="Поиск по товарам..." className="search-input" />
        </div>
        <section className="product-grid">
          <div className="product-card">
            <img src="path_to_product_image.jpg" alt="Product" className="product-image" />
            <h3 className="product-title">Название товара</h3>
            <p className="product-description">Описание товара</p>
            <span className="product-price">Цена</span>
          </div>
          {/* Добавьте больше карточек товаров */}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;