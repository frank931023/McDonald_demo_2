import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
// import AppPage from "./pages/App";
import Breakfast from "./pages/Breakfast/Breakfast";
import LunchDinner from "./pages/LunchDinner/LunchDinner";
import mcdonaldsLogo from "./assets/mcdonalds-logo.png"; // 確保路徑正確
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <Router>
      <ScrollToTop /> {/* 放置在 Router 內 */}
      <div className="App">
        {/* 全域共享的 Header */}
        <header className="header">
          <div className="logo-container">
            <Link to="/">
              <img src={mcdonaldsLogo} alt="麥當勞" className="logo" />
            </Link>
          </div>

          <div className="search-container">
            <input
              type="text"
              placeholder="搜尋餐點..."
              className="search-input"
            />
            <button className="search-button">搜尋</button>
          </div>

          <nav className="nav-menu">
            <ul>
              <li>
                <Link to="/">首頁</Link>
              </li>
              <li>
                <Link to="/breakfast">早餐</Link>
              </li>
              <li>
                <Link to="/lunchdinner">午晚餐</Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* 頁面內容 */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/app" element={<AppPage />} /> */}
            <Route path="/breakfast" element={<Breakfast />} />
            <Route path="/lunchdinner" element={<LunchDinner />} />
          </Routes>
        </main>

        {/* 全域共享的 Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>公司資訊</h3>
              <p>台灣麥當勞股份有限公司</p>
              <p>統一編號: 12345678</p>
              <p>&copy; 2025 McDonald's Taiwan. 版權所有。</p>
            </div>

            <div className="footer-section">
              <h3>聯絡我們</h3>
              <p>客服專線: 0800-123-456</p>
              <p>Email: service@mcdonalds.com.tw</p>
              <p>地址: 台北市中山區南京東路二段</p>
            </div>

            <div className="footer-section">
              <h3>社群媒體</h3>
              <div className="social-links">
                <a href="#" className="social-link">
                  Facebook
                </a>
                <a href="#" className="social-link">
                  Instagram
                </a>
                <a href="#" className="social-link">
                  YouTube
                </a>
                <a href="#" className="social-link">
                  Line
                </a>
              </div>
            </div>

            <div className="footer-section">
              <h3>營業時間</h3>
              <p>週一至週五: 06:00 - 23:00</p>
              <p>週六至週日: 24小時營業</p>
              <p>部分門市營業時間可能有所不同</p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>本網站僅作為設計展示使用，非官方麥當勞網站</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
