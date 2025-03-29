import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { lunchDinner } from "../../data/lunchDinner";
import ModalBox from "../../components/ModalBox";
import "./menu.css";

// 類別選項
const categories = ["全部", "經典漢堡", "極選系列", "炸雞", "配餐", "飲品"];

const LunchDinner = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category");
  const productParam = queryParams.get("product");
  
  // 如果URL參數中有category且該category在我們的列表中，則設為默認選項
  const initialCategory = categoryParam && categories.includes(categoryParam) 
    ? categoryParam 
    : "全部";
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // 建立產品元素的參考
  const productRefs = useRef({});

  // 處理URL參數和滾動
  useEffect(() => {
    // 處理類別選擇
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
    
    // 處理產品滾動
    if (productParam) {
      // 等待DOM更新後再滾動
      setTimeout(() => {
        const targetProduct = productRefs.current[productParam];
        if (targetProduct) {
          targetProduct.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // 可選：突出顯示找到的產品
          targetProduct.classList.add('highlight-item');
          setTimeout(() => targetProduct.classList.remove('highlight-item'), 3000);
        }
      }, 500);
    }
  }, [categoryParam, productParam]);

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
    document.body.style.overflow = 'hidden';
  };

  // 關閉模態框
  const handleCloseModal = () => {
    setSelectedItem(null);
    document.body.style.overflow = 'auto';
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
            <li 
              key={item.id} 
              className="lunch-dinner-item"
              ref={el => {
                // 保存元素引用，使用項目名稱作為鍵
                productRefs.current[item.name] = el;
              }}
            >
              {item.image ? (
                <img src={item.image} alt={item.name} className="food-image" />
              ) : (
                <p>[圖片缺失]</p>
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