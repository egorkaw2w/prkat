import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import emailjs from 'emailjs-com';
import Header from './header';
import Captcha from '../templates/Capthca.js';
import '../templates/App.css';

const Order = () => {
  const location = useLocation();
  const { cart } = location.state || { cart: [] }; // Используем cart из location.state или пустой массив, если он не передан

  const [formData, setFormData] = useState({
    address: '',
    fullName: '',
    paymentMethod: '',
    cart: cart, // Используем cart из location.state
    totalCost: 0,
  });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState(false);
  const [captchaPassed, setCaptchaPassed] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = (e) => {
    e.preventDefault();

    const templateParams = {
      address: formData.address,
      fullName: formData.fullName,
      paymentMethod: formData.paymentMethod,
      cart: formData.cart.map(item => `${item.name}: ${item.price} x ${item.quantity}`).join('\n'),
      totalCost: formData.totalCost,
    };

    emailjs.send(
      'service_885j5ys',
      'template_9lahw8f',
      templateParams,
      'DYNVXL4jcUjdbL68T'
    ).then((result) => {
      console.log('Email sent successfully:', result.text);
    }, (error) => {
      console.error('Error sending email:', error.text);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaPassed) {
      alert('Пожалуйста, пройдите капчу.');
      return;
    }
    console.log('Form Data:', formData);
    try {
      const response = await axios.post('http://localhost:3001/orders', formData);
      console.log('Server Response:', response.data);
      if (response.status === 201) {
        setOrderSuccess(true);
        setOrderError(false);
        setFormData({
          address: '',
          fullName: '',
          paymentMethod: '',
          cart: [],
          totalCost: 0,
        });
        sendEmail(e);
      } else {
        setOrderError(true);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setOrderError(true);
    }
  };

  const pageVariants = {
    initial: {
      opacity: 0,
      x: '-100vw', // Анимация перемещения с левой стороны экрана
      scale: 0.8, // Уменьшение масштаба
    },
    animate: {
      opacity: 1,
      x: 0, // Возвращение в исходное положение
      scale: 1, // Восстановление масштаба
      transition: {
        duration: 0.5,
        ease: 'easeInOut', // Использование стандартной кривой для анимации
      },
    },
    exit: {
      opacity: 0,
      x: '100vw', // Анимация перемещения за правую сторону экрана
      scale: 0.8, // Уменьшение масштаба
      transition: {
        duration: 0.5,
        ease: 'easeInOut', // Использование стандартной кривой для анимации
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <Header />
      <div className="order-page">
        <h1>Заказ</h1>
        <form onSubmit={handleSubmit} className="order-form">
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
          >
            <option value="">Выберете метод оплаты</option>
            <option value="creditCard">Карта</option>
            <option value="payPal">PayPal</option>
            <option value="cashOnDelivery">Деньгами курьеру</option>
          </select>
          <Captcha onCaptchaChange={setCaptchaPassed} />
          <button type="submit">Оформить заказ</button>
        </form>
        {orderSuccess && <p className="success-message">Заказ сделан!</p>}
        {orderError && <p className="error-message">Ошибка заказа! Пожалуйста, попробуйте снова.</p>}
        <div className="go-to-home">
          <Link to="/">Главная</Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Order;