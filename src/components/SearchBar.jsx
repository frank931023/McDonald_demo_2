import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { breakfastData } from "../data/breakfastData";
import { lunchDinner } from "../data/lunchDinner";
import "./SearchBar.css";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState(false); // 新增: 查無資料狀態
  const [popularSuggestions, setPopularSuggestions] = useState([]); // 新增: 熱門搜尋建議
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  // 在組件加載時從 localStorage 獲取搜索歷史
  useEffect(() => {
    const storedHistory = localStorage.getItem("searchHistory");
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  // 合併所有菜單數據，用於搜索
  const allMenuItems = [...breakfastData, ...lunchDinner];

  // 關鍵字推薦功能
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filteredItems = allMenuItems
      .filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((item) => ({
        name: item.name,
        category: item.category,
        mealTime: breakfastData.some((breakfast) => breakfast.name === item.name)
          ? "breakfast"
          : "lunchdinner"
      }));

    // 只顯示最多5個建議
    setSuggestions(filteredItems.slice(0, 5));
  }, [searchTerm]);

  // 處理點擊建議項
  const handleSuggestionClick = (suggestion) => {
    // 保存到搜索歷史
    saveToSearchHistory(suggestion.name);
    
    // 導航到相應頁面並設置過濾器
    const path = suggestion.mealTime === "breakfast" 
      ? `/breakfast?category=${suggestion.category}`
      : `/lunchdinner?category=${suggestion.category}`;
    
    navigate(path);
    setSearchTerm("");
    setShowSuggestions(false);
  };

  // 查找流行/推薦的關鍵字
  const getPopularSuggestions = () => {
    // 返回熱門分類或餐點
    return [
      { name: "漢堡", category: "經典漢堡", mealTime: "lunchdinner" },
      { name: "滿福堡", category: "滿福堡", mealTime: "breakfast" },
      { name: "炸雞", category: "炸雞", mealTime: "lunchdinner" },
      { name: "蛋捲冰淇淋", category: "配餐", mealTime: "lunchdinner" },
      { name: "薯條", category: "配餐", mealTime: "lunchdinner" }
    ];
  };

  // 處理搜索提交
  const handleSearchSubmit = () => {
    if (searchTerm.trim() === "") return;

    saveToSearchHistory(searchTerm);

    // 嘗試找到匹配的商品
    const matchedItems = allMenuItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matchedItems.length > 0) {
      const matchedItem = matchedItems[0]; // 取第一個匹配項
      const isBreakfast = breakfastData.some(item => item.name === matchedItem.name);
      const path = isBreakfast 
        ? `/breakfast?category=${matchedItem.category}`
        : `/lunchdinner?category=${matchedItem.category}`;
      
      navigate(path);
    } else {
      // 如果沒有找到匹配項，顯示無結果的提示
      setNoResultsFound(true);
      // 不清空搜索詞，讓用戶能看到查無結果的提示
      return;
    }

    setSearchTerm("");
    setNoResultsFound(false);
  };

  // 保存到搜索歷史
  const saveToSearchHistory = (term) => {
    // 將新搜索添加到歷史記錄中，避免重複並限制為5項
    const updatedHistory = [
      term,
      ...searchHistory.filter(item => item !== term)
    ].slice(0, 5);

    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  // 清除搜索歷史
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  // 處理搜索歷史項點擊
  const handleHistoryClick = (term) => {
    setSearchTerm(term);
    setShowHistory(false);
    
    // 尋找匹配項並導航
    const matchedItem = allMenuItems.find(item => 
      item.name.toLowerCase().includes(term.toLowerCase()) ||
      item.category.toLowerCase().includes(term.toLowerCase())
    );

    if (matchedItem) {
      const isBreakfast = breakfastData.some(item => item.name === matchedItem.name);
      const path = isBreakfast 
        ? `/breakfast?category=${matchedItem.category}`
        : `/lunchdinner?category=${matchedItem.category}`;
      
      navigate(path);
    }
  };

  // 載入熱門搜尋建議
  useEffect(() => {
    setPopularSuggestions(getPopularSuggestions());
  }, []);
  
  // 點擊外部關閉建議和歷史
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setShowHistory(false);
        setNoResultsFound(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="search-container" ref={searchContainerRef}>
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="搜尋餐點..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setNoResultsFound(false); // 當輸入變化時重置無結果提示
          }}
          onFocus={() => {
            setShowSuggestions(true);
            if (searchTerm.trim() === "" && searchHistory.length > 0) {
              setShowHistory(true);
            }
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearchSubmit();
            }
          }}
        />
        
        {/* 查無資料提示 */}
        {noResultsFound && (
          <div className="search-dropdown no-results">
            <div className="no-results-message">
              <p>抱歉，找不到與「{searchTerm}」相關的餐點</p>
              <p className="no-results-tip">您可以試試這些熱門餐點：</p>
            </div>
            <ul>
              {popularSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="suggestion-name">{suggestion.name}</span>
                  <span className="suggestion-category">{suggestion.category}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* 搜索歷史 */}
        {showHistory && searchHistory.length > 0 && !noResultsFound && (
          <div className="search-dropdown search-history">
            <div className="history-header">
              <h4>搜尋紀錄</h4>
              <button className="clear-history" onClick={clearSearchHistory}>
                清除紀錄
              </button>
            </div>
            <ul>
              {searchHistory.map((item, index) => (
                <li key={index} onClick={() => handleHistoryClick(item)}>
                  <span className="history-icon">⏱</span> {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* 搜索建議 */}
        {showSuggestions && suggestions.length > 0 && !noResultsFound && (
          <div className="search-dropdown">
            <ul>
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="suggestion-name">{suggestion.name}</span>
                  <span className="suggestion-category">{suggestion.category}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <button className="search-button" onClick={handleSearchSubmit}>
        搜尋
      </button>
    </div>
  );
};

export default SearchBar;