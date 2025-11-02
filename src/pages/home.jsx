import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import RegisterHeader from "../components/registerHeader";
import "../styles/pages/_home.scss";

const home = () => {
  const navigate =  useNavigate()

  if(localStorage.getItem("token")){
    useEffect(() => navigate("/dashboard"), [])
  }

  return (
    <div className="home">

      {/* header */}
      <RegisterHeader />

        {/* background img */}
      <div className="opacityImg">
        <div className="img"></div>
      </div>


      {/* body */}
      <div className="body">
        <div className="info">
            <h1>Developer Connector</h1>
            <br />
            <p>Create a developer profile/portfolio, share posts and get help from other developers</p>
            <br />
            <div className="btns">
                <Link to="/register"><button className="signup">Sign Up</button></Link>
                <Link to="/login"><button className="login">Login</button></Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default home;
