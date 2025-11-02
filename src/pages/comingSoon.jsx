import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/dashboardHeader";
import "../styles/pages/_comingSoon.scss";

const ComingSoon = () => {
  return (
    <div>
      <Header />
      <div className="coming_soon_container">
        <div className="coming_soon_content">
          <div className="icon_wrapper">
            <i className="bx bx-code-alt"></i>
          </div>
          <h1>Still cooking in the dev kitchen</h1>
          <p className="subtitle">Production Coming Soon!</p>
          <p className="description">
            We're working hard to bring you an amazing experience. This feature is currently under development and will be available soon!
          </p>
          <Link to="/dashboard" className="back_button">
            <i className="bx bx-arrow-back"></i>
            Back to Dashboard
          </Link>
        </div>
        <div className="decoration_circles">
          <div className="circle circle_1"></div>
          <div className="circle circle_2"></div>
          <div className="circle circle_3"></div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;

