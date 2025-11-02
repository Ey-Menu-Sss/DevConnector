import React from "react";
import Header from "../components/dashboardHeader";
import RegHeader from "../components/registerHeader";
import "../styles/pages/_notFoundPage.scss";

const notFoundPage = () => {
  const token = localStorage.getItem("token");
  return (
    <div>
      {token ? <Header /> : <RegHeader />}
      <div className="background">
        <div className="nf_container">
          <h1>404</h1>
          <div>
            <h2>Sorry, this page not found</h2>
            <i className="bx bx-confused"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default notFoundPage;
