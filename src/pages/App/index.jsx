import React from 'react';
import Breakfast from './Breakfast'; 
import LunchDinner from "./LunchDinner";
import './menu.css';

function AppPage() {
  return (
    <div className="app-container">
      <Breakfast />
      <LunchDinner />
    </div>
  );
}

export default AppPage;


