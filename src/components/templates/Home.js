import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import Header from './header';
import './App.css';
import Footer from './footer';
import './Home.css';

const Home = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [products, setProducts] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке рекомендуемых товаров:', error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const onSubmit = async (data) => {
    try {
      const templateParams = {
        from_name: data.name,
        reply_to: data.email,
        message: data.message,
      };

      await emailjs.send(
        'service_885j5ys',
        'template_0au3gzb',
        templateParams,
        'DYNVXL4jcUjdbL68T'
      );

      console.log('Email успешно отправлен');
      setFeedbackMessage('СПАСИБО ЗА ОБРАТНУЮ СВЯЗЬ, МЫ ОТВЕТИМ В БЛИЖАЙШЕЕ ВРЕМЯ');
      reset();
    } catch (error) {
      console.error('Ошибка при отправке email:', error);
      setFeedbackMessage('Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.');
    }
  };

  const pageVariants = {
    initial: {
      opacity: 0,
      y: -100,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      y: 100,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className='wrapepr'>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <Header />

        <div className='about-section'>
          <h1>BNS</h1>

        </div>

        <h2>Рекомендуемые товары</h2>
        {
          products.length > 0 ? (
            <div className="product-container">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <h3>{product.name}</h3>
                  <img src={product.image} alt={product.name} className="product-image" />
                  <p>{product.description}</p>
                  <p>Цена: ${product.price}</p>
                  <Link to={`/product/${product.id}`}>Подробнее</Link>
                </div>
              ))}
            </div>
          ) : (
            <p>Загрузка рекомендуемых товаров...</p>
          )
        }

        <div className="contact-form-section">
          <h2>Свяжитесь с нами</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("name", { required: true })} placeholder="Имя" />
            {errors.name && <span>Это поле обязательно</span>}
            <input {...register("email", { required: true })} placeholder="Электронная почта" />
            {errors.email && <span>Это поле обязательно</span>}
            <textarea {...register("message", { required: true })} placeholder="Сообщение" />
            {errors.message && <span>Это поле обязательно</span>}
            <input type="submit" value="Отправить" />
          </form>

          {feedbackMessage && <p>{feedbackMessage}</p>}
          <Footer />
        </div>
      </motion.div >
    </div>
  );
};

export default Home;