import React, { useState } from "react";
import { lunchDinner } from "../../data/lunchDinner"; // 引入資料
import ModalBox from "../../components/ModalBox"; // 假設你已經有這個模態框組件
import "./menu.css";

// 類別選項
const categories = ["全部", "經典漢堡", "極選系列", "炸雞", "配餐", "飲品"];

const LunchDinner = () => {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [selectedItem, setSelectedItem] = useState(null);

  // 處理過濾的邏輯
  const handleFilterChange = (category) => {
    setSelectedCategory(category);
  };

  // 過濾資料
  const filteredItems = selectedCategory === "全部"
    ? lunchDinner
    : lunchDinner.filter(item => item.category === selectedCategory);

  // 顯示更多的動作
  const handleSeeMore = (item) => {
    setSelectedItem(item);
    document.body.style.overflow = 'hidden'; // 防止滾動
  };

  // 關閉模態框
  const handleCloseModal = () => {
    setSelectedItem(null);
    document.body.style.overflow = 'auto'; // 恢復滾動
  };

  return (
    <div className="container">
      <div className="app">
        <h2 className="section-title">午晚餐</h2>

        {/* 篩選按鈕 */}
        <div className="filter-buttons">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? "active" : ""}`}
              onClick={() => handleFilterChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 午晚餐清單 */}
        <ul className="lunch-dinner-list">
          {filteredItems.map((item) => (
            <li key={item.id} className="lunch-dinner-item">
              {item.image ? (
                <img src={item.image} alt={item.name} className="food-image" />
              ) : (
                <p>[圖片缺失]</p> // 這樣可以避免沒有圖片時畫面錯誤
              )}
              <p>{item.name}</p>
              <button onClick={() => handleSeeMore(item)}>See More</button>
            </li>
          ))}
        </ul>

        {/* 顯示模態框 */}
        <ModalBox item={selectedItem} onClose={handleCloseModal} />
      </div>
    </div>
  );
};

export default LunchDinner;





