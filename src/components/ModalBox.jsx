// import React from "react";
// import './modal.css';

// const ModalBox = ({ item, onClose }) => {
//   if (!item) return null;

//   return (
//     <div className="modal-overlay-custom" onClick={onClose}>
//       <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
//         <span className="close-custom" onClick={onClose}>&times;</span>
//         <div className="modal-header-custom">
//           <h2>{item.name}</h2>
//         </div>
//         <div className="modal-body-custom">
//           {item.image && <img src={item.image} alt={item.name} className="food-image-custom" />}
//           <div className="details-custom">
//             <p>{item.description}</p>
//             <h3>Nutritional Information</h3>
//             <table className="nutrient-table-custom">
//               <thead>
//                 <tr>
//                   <th>Nutrient</th>
//                   <th>Amount per Meal</th>
//                   <th>% Daily Value</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {Object.keys(item.nutrientPerMeal).map((key) => (
//                   <tr key={key}>
//                     <td>{key}</td>
//                     <td>{item.nutrientPerMeal[key]}</td>
//                     <td>{item.nutrientDV[key + 'DV']}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <h3>Ingredients</h3>
//             <ul className="ingredients-list-custom">
//               {item.ingredients.map((ingredient, index) => (
//                 <li key={index}>{ingredient}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ModalBox;

import React from "react";
import './modal.css';

const ModalBox = ({ item, onClose }) => {
  if (!item) return null;

  // 營養成分名稱對應中文的映射
  const nutrientTranslations = {
    'calories': '熱量 (Kcal)',
    'protein': '蛋白質 (g)',
    'fat': '脂肪 (g)',
    'saturatedFat': '飽和脂肪 (g)',
    'transFat': '反式脂肪 (g)',
    'carbohydrate': '碳水化合物 (g)',
    'sugar': '糖 (g)',
    'sodium': '鈉 (mg)',
    // 根據需求添加更多的營養成分
  };

  return (
    <div className="modal-overlay-custom" onClick={onClose}>
      <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
        <button className="close-custom" onClick={onClose} aria-label="Close">&times;</button>
        <div className="modal-header-custom">
          <h2>{item.name}</h2>
        </div>
        <div className="modal-body-custom">
          {item.image && <img src={item.image} alt={item.name} className="food-image-custom" />}
          <div className="details-custom">
            <p>{item.description}</p>
            <h3>Nutritional Information</h3>
            <table className="nutrient-table-custom">
              <thead>
                <tr>
                  <th>Nutrient</th>
                  <th>每份</th>
                  <th>每日參考值百分比 (%Daily Value, %DV)</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(item.nutrientPerMeal).map((key) => (
                  <tr key={key}>
                    {/* <td>{key}</td>
                    <td>{item.nutrientPerMeal[key]}</td>
                    <td>{item.nutrientDV[key + 'DV']}</td> */}
                    <td>{nutrientTranslations[key] || key}</td> {/* 將營養成分名稱轉換為中文 */}
                    <td>{item.nutrientPerMeal[key]}</td>
                    <td>{item.nutrientDV[key + 'DV']}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3>Ingredients</h3>
            <ul className="ingredients-list-custom">
              {item.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalBox;
