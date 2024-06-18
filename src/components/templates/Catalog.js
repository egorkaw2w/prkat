import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from './header';
import './App.css';
import './Catalog.css';
const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleFeatureChange = (event, productId) => {
    setSelectedFeatures((prevFeatures) => ({
      ...prevFeatures,
      [productId]: event.target.value,
    }));
  };

  const addToFavorites = async (productId) => {
    try {
      const product = products.find((product) => product.id === productId);
      if (product) {
        await axios.post('http://localhost:3001/favorites', product);
      }
    } catch (error) {
      console.error('Error adding product to favorites:', error);
    }
  };

  const addToCart = async (productId, quantity) => {
    const selectedFeature = selectedFeatures[productId];
    if (!selectedFeature) {
      alert('Пожалуйста, выберите характеристику товара.');
      return;
    }
    try {
      const product = products.find((product) => product.id === productId);
      if (product) {
        const cartItem = { ...product, quantity, feature: selectedFeature };
        await axios.post('http://localhost:3001/cart', cartItem);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === '' || product.category === selectedCategory)
  );

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }}
    >
      <Header />
      <div className="catalog-page">
        <h1>Каталог</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products"
            value={searchTerm}
            onChange={handleSearch}
          />
          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">Все категории</option>
            <option value="ноутбук">ноутбук</option>
            <option value="Планшет">Планшет</option>
            <option value="Наушники">Наушники</option>
            <option value="Фотоаппарат">Фотоаппарат</option>
            <option value="Apple">Apple</option>
          </select>
        </div>
        {filteredProducts.length > 0 ? (
          <div className="product-list">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-item">
                <h2>{product.name}</h2>
                <img src={product.image} alt={product.name} />
                <p>{product.description}</p>
                <p>Цена: ${product.price}</p>
                <p>Кол-во: {product.quantity}</p>
                <div>
                  <label>Характеристики:</label>
                  <select onChange={(event) => handleFeatureChange(event, product.id)}>
                    {product.features && product.features.map((feature, index) => (
                      <option key={index} value={feature}>
                        {feature}
                      </option>
                    ))}
                  </select>
                </div>
                <button onClick={() => addToFavorites(product.id)}>
                  Добавить в Избранное
                </button>
                <button onClick={() => addToCart(product.id, 1)}>
                  Добавить в корзину
                </button>
                <Link to={`/product/${product.id}`} className="view-details">
                  Подробнее
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-products">Нет товаров.</p>
        )}
        <div className="go-home">
          <Link to="/">Главная</Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Catalog;