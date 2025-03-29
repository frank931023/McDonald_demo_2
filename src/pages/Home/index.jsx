import React, { useState, useEffect } from 'react';
import './Home.css';
import banner1 from '../../assets/banner1.png'; // 請添加輪播圖片
import banner2 from '../../assets/banner2.jpeg';
import banner3 from '../../assets/banner3.jpeg';
import product1 from '../../assets/product1.jpeg'; // 請添加產品圖片
import product2 from '../../assets/product2.jpeg';
import product3 from '../../assets/product3.jpeg';
import product4 from '../../assets/product4.jpeg';
import csr1 from '../../assets/csr1.jpg'; // 請添加社會責任相關圖片
import csr2 from '../../assets/csr2.jpg';
import { Link } from 'react-router-dom';

function Home() {
  // 輪播圖狀態管理
  const [currentSlide, setCurrentSlide] = useState(0);
  const banners = [
    { id: 1, image: banner1, title: "超值早餐套餐", description: "限時優惠中", link: "/breakfast" },
    { id: 2, image: banner2, title: "新品上市：辣味麥脆雞", description: "嚐鮮價只要$99", link: "/lunchdinner?category=炸雞" },
    { id: 3, image: banner3, title: "歡樂送到家", description: "外送滿$300折$50", link: "/lunchdinner" }
  ];

  // 倒數計時器狀態
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 12,
    minutes: 30,
    seconds: 0
  });

  // 產品分類
  const categories = [
    { id: 1, name: "漢堡", icon: "🍔", path: "/lunchdinner?category=經典漢堡" },
    { id: 2, name: "炸雞", icon: "🍗", path: "/lunchdinner?category=炸雞" },
    { id: 3, name: "點心", icon: "🍟", path: "/lunchdinner?category=配餐" },
    { id: 4, name: "飲料", icon: "🥤", path: "/breakfast?category=飲品" },
    { id: 5, name: "早餐", icon: "🍳", path: "/breakfast" },
    { id: 6, name: "甜點", icon: "🍦", path: "/lunchdinner?category=配餐&product=冰旋風（Oreo）" }
  ];

  // 熱門產品
  const popularProducts = [
    { id: 1, name: "麥香雞", price: 49, image: product1, isNew: false ,category: "經典漢堡" },
    { id: 2, name: "大麥克", price: 89, image: product2, isNew: false ,category: "經典漢堡"},
    { id: 3, name: "焙果堡", price: 109, image: product3, isNew: true ,category: "焙果"},
    { id: 4, name: "四盎司牛肉堡", price: 120, image: product4, isNew: false ,category: "經典漢堡"}
  ];

  // 自動輪播
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // 倒數計時
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        // 計算剩餘秒數
        if (prevTime.seconds > 0) {
          return { ...prevTime, seconds: prevTime.seconds - 1 };
        } else if (prevTime.minutes > 0) {
          return { ...prevTime, minutes: prevTime.minutes - 1, seconds: 59 };
        } else if (prevTime.hours > 0) {
          return { ...prevTime, hours: prevTime.hours - 1, minutes: 59, seconds: 59 };
        } else if (prevTime.days > 0) {
          return { ...prevTime, days: prevTime.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prevTime;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-container">

      {/* 輪播橫幅 */}
      <section className="banner-section">
        <div className="carousel">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${banner.image})` }}
            >
              <div className="carousel-content">
                <h2>{banner.title}</h2>
                <p>{banner.description}</p>
                  <button className="cta-button">立即查看</button>
              </div>
            </div>
          ))}

          <div className="carousel-indicators">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* 產品分類導航 */}
      <section className="categories-section">
        <h2 className="section-title">美食分類</h2>
        <div className="categories-container">
          {categories.map(category => (
            <div key={category.id} className="category-item">
              <Link to={category.path} className="category-link">
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 熱門產品展示區 */}
      <section className="popular-products-section">
        <h2 className="section-title">熱門餐點</h2>
        <div className="products-grid">
          {popularProducts.map(product => (
            <div key={product.id} className="product-card">
              {product.isNew && <span className="new-badge">新品</span>}
              <img src={product.image} alt={product.name} className="product-image" />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${product.price}</p>
              <Link to={product.category === "焙果" ? `/breakfast?category=${product.category}` : `/lunchdinner?category=${product.category}`} >
              <button className="add-to-cart-btn">查看更多</button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 最新優惠區 */}
      <section className="promotion-section">
        <div className="promotion-content">
          <h2 className="section-title">超值優惠，限時倒數！</h2>
          <p className="promotion-description">全新雙層牛肉堡買一送一</p>
          <div className="countdown-timer">
            <div className="countdown-item">
              <span className="countdown-number">{timeLeft.days}</span>
              <span className="countdown-label">天</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-number">{timeLeft.hours}</span>
              <span className="countdown-label">時</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-number">{timeLeft.minutes}</span>
              <span className="countdown-label">分</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-number">{timeLeft.seconds}</span>
              <span className="countdown-label">秒</span>
            </div>
          </div>
          <button className="cta-button">立即訂購</button>
        </div>
      </section>

      {/* 麥當勞特色介紹 */}
      <section className="features-section">
        <h2 className="section-title">麥當勞特色</h2>
        <div className="features-container">
          <div className="feature-item">
            <div className="feature-icon">🍽️</div>
            <h3>新鮮食材</h3>
            <p>每天嚴選新鮮食材，確保美味與品質</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⏱️</div>
            <h3>快速服務</h3>
            <p>確保90秒內完成點餐服務</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🏠</div>
            <h3>歡樂送到家</h3>
            <p>30分鐘內送達，讓您在家也能享用美食</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">💖</div>
            <h3>用心服務</h3>
            <p>用微笑與熱情迎接每一位顧客</p>
          </div>
        </div>
      </section>

      {/* 社會責任區 */}
      <section className="csr-section">
        <h2 className="section-title">企業社會責任</h2>
        <div className="csr-container">
          <div className="csr-item">
            <img src={csr1} alt="環保餐具" className="csr-image" />
            <div className="csr-content">
              <h3>環保行動</h3>
              <p>減少塑膠的使用，引入可生物降解餐具</p>
              <a href="/csr" className="read-more">了解更多</a>
            </div>
          </div>
          <div className="csr-item">
            <img src={csr2} alt="麥當勞叔叔之家" className="csr-image" />
            <div className="csr-content">
              <h3>麥當勞叔叔之家</h3>
              <p>為生病兒童家庭提供臨時住所</p>
              <a href="/csr" className="read-more">了解更多</a>
            </div>
          </div>
        </div>
      </section>

      {/* 社交媒體分享區 */}
      <section className="social-share-section">
        <h2 className="section-title">分享美食時刻</h2>
        <p>與朋友分享麥當勞的美好體驗</p>
        <div className="social-buttons">
          <button className="social-button facebook">Facebook</button>
          <button className="social-button instagram">Instagram</button>
          <button className="social-button line">Line</button>
          <button className="social-button twitter">Twitter</button>
        </div>
      </section>


    </div>
  );
}

export default Home;