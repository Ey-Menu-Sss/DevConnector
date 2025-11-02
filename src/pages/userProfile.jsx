import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/pages/_userProfile.scss";
import Header from "../components/dashboardHeader";
import axios from "axios";
import { UserProfileSkeleton } from "../components/LoadingSkeleton";

const userProfile = () => {
  const { id } = useParams();
  const [proData, setProfileData] = useState([]);
  useEffect(() => {
    axios.get(`/profile/user/${id}`).then((data) => {
      setProfileData(data.data);
    });
  }, [id]);

  return (
    <div>
      <Header />
      <div className="userProfile_container">
        <Link to="/profiles" className="back">
          <i class="bx bx-arrow-back"></i>
          Back to Profiles
        </Link>
        <br />
        {Object.keys(proData).length === 0 ? (
          <UserProfileSkeleton />
        ) : (
          <div className="informations">
            <div className="tipashowcase">
              <img src={proData.user?.avatar} alt="" />
              <br />
              <div className="name">{proData.user?.name}</div>
              <br />
              <div className="company">
                {proData.status} {proData.company != "" ? <p>at</p> : <p></p>}{" "}
                {proData.company}
              </div>
              <div className="socialLinks">
                {proData.social?.facebook !== "" &&
                proData.social?.facebook !== null && (
                  <a href={proData.social?.facebook} target="_blank" rel="noopener noreferrer">
                    <i className="bx bxl-facebook-circle"></i>
                  </a>
                )}
                {proData.social?.instagram !== "" &&
                proData.social?.instagram !== null && (
                  <a href={proData.social?.instagram} target="_blank" rel="noopener noreferrer">
                    <i className="bx bxl-instagram-alt"></i>
                  </a>
                )}
                {proData.social?.linkedin !== "" &&
                proData.social?.linkedin !== null && (
                  <a href={proData.social?.linkedin} target="_blank" rel="noopener noreferrer">
                    <i className="bx bxl-linkedin-square"></i>
                  </a>
                )}
                {proData.social?.twitter !== "" &&
                proData.social?.twitter !== null && (
                  <a href={proData.social?.twitter} target="_blank" rel="noopener noreferrer">
                    <i className="bx bxl-twitter"></i>
                  </a>
                )}
                {proData.social?.youtube !== "" &&
                proData.social?.youtube !== null && (
                  <a href={proData.social?.youtube} target="_blank" rel="noopener noreferrer">
                    <i className="bx bxl-youtube"></i>
                  </a>
                )}
                <Link to="/coming-soon" className="social_chat_link">
                  <i className="bx bx-chat"></i>
                </Link>
              </div>
            </div>
            <br />
            <div className="bio_skills">
              <div className="bio">
                <h2>{proData.user?.name}'s Bio</h2>
                <br />
                <p>{proData.bio}</p>
                <br />
              </div>
              <hr />
              <div className="skills">
                <br />
                <h2>Skill Set</h2>
                <br />
                <div className="flexallskills">
                  {proData.skills?.map((s, index) => (
                    <div className="skill" key={index}>
                      <i className="bx bx-check"></i>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="expAndedu">
              {proData.experience?.length === 0 ? (
                <div className="experiense">
                  <h3>Experiense</h3>
                  <h5>no experiences</h5>
                </div>
              ) : (
                proData.experience?.map((e, index) => (
                  <div className="experiense" key={index}>
                    <h3>Experiense</h3>
                    <br />
                    <div className="company">
                      <h4>{e.company}</h4>
                    </div>
                    <div className="date">{e.from} - Now</div>
                    <div className="postion">
                      <h4>Position:</h4> {e.title}
                    </div>
                    <div className="location">
                      <h4>Location:</h4> {e.location}
                    </div>
                    <div className="description">
                      <h4>Description:</h4> {e.description}
                    </div>
                  </div>
                ))
              )}
              {proData.education?.length === 0 ? (
                <div className="education">
                  <h3>Education</h3>
                  <h5>no educations</h5>
                </div>
              ) : (
                proData.education?.map((e, index) => (
                  <div className="education" key={index}>
                    <h3>Educations</h3>
                    <br />
                    <div className="school">
                      <h4>school:</h4>
                      {e.school}
                    </div>
                    <div className="feilesofstudy">
                      <h4>feiled of study:</h4>
                      {e.fieldofstudy}
                    </div>
                    <div className="description">
                      <h4>description:</h4>
                      {e.description}
                    </div>
                    <div className="degree">
                      <h4>degree:</h4>
                      {e.degree}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default userProfile;
