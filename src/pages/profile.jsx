import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import RegisterHeader from "../components/registerHeader";
import DashboardHeader from "../components/dashboardHeader";
import "../styles/pages/_profile.scss";
import { Link, useParams } from "react-router-dom";

const profile = () => {
  const [Userdata, setUserData] = useState([]);
  useEffect(() => {
    async function profiles() {
      let res = await axios.get("/profile").then((data) => {
        setUserData(data.data);
      });
    }
    profiles();
  }, []);

  return (
    <div>
      {localStorage.getItem("token") ? <DashboardHeader /> : <RegisterHeader />}
      <div className="profile_container">
        {/* texts */}
        <div className="texts">
          <h1>Developers</h1>
          <div className="info">
            <i className="bx bxl-gitlab"></i>
            <h2>Browse and connect with developers</h2>
          </div>
        </div>
        <br />
        <br />

        {Userdata.length === 0 ? (
          <h1>Just a second...</h1>
        ) : (
          Userdata.map((i, index) => (
            <div className="card" key={index}>
              <div className="img_names">
                <Link to={`/profile/${i.user?._id}`}>
                  <img src={i.user?.avatar} alt="" />
                </Link>
                <div className="names">
                  <h1>{i.user?.name}</h1>
                  <div>
                    {i.status} {i.company != "" ? <p>at</p> : <p></p>}{" "}
                    {i.company}
                  </div>
                  <p>{i.location}</p>
                  <Link
                    to={`/profile/${i.user?._id}`}
                    className="button"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
              <div className="skills">
                {i.skills.map((s, index) => (
                  <div className="skill" key={index}>
                    <i className="bx bx-check"></i>
                    <p>{s}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default profile;
