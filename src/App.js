import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/templates/Home';
import Catalog from './components/templates/Catalog';
import Favorites from './components/templates/Favorites';
import Cart from './components/templates/Cart';
import Product from './components/templates/Product';
import Order from './components/templates/Order';
import '../src/components/templates/App.css';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/order" element={<Order />} />
      </Routes>
    </Router>
  );
};

export default App;