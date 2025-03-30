import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // 引入useLocation鉤子
import { breakfastData } from "../../data/breakfastData";
import ModalBox from "../../components/ModalBox";
import "./menu.css";

// 類別選項
const categories = ["全部", "滿福堡", "蛋堡", "焙果", "鬆餅", "麵包", "配餐", "飲品"];

const Breakfast = () => {
  const location = useLocation(); // 獲取當前URL信息
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category");
  
  // 如果URL參數中有category且該category在我們的列表中，則設為默認選項
  const initialCategory = categoryParam && categories.includes(categoryParam) 
    ? categoryParam 
    : "全部";
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedItem, setSelectedItem] = useState(null);

  // 使用useEffect處理URL參數變化
  useEffect(() => {
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  // 處理過濾的邏輯
  const handleFilterChange = (category) => {
    setSelectedCategory(category);
  };

  // 過濾資料
  const filteredItems = selectedCategory === "全部"
    ? breakfastData
    : breakfastData.filter(item => item.category === selectedCategory);

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
        <h2 className="section-title">早餐</h2>

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

        {/* 早餐清單 */}
        <ul className="breakfast-list">
          {filteredItems.map((item) => (
            <li key={item.id} className="breakfast-item">
              {item.image ? (
                <img src={item.image} alt={item.name} className="food-image" />
              ) : (
                <p>[圖片缺失]</p>
              )}
              <p>{item.name}</p>
              <button className="seemore-btn" onClick={() => handleSeeMore(item)}>See More</button>
            </li>
          ))}
        </ul>

        {/* 顯示模態框 */}
        <ModalBox item={selectedItem} onClose={handleCloseModal} />
      </div>
    </div>
  );
};

export default Breakfast;