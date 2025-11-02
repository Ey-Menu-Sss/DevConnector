import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/dashboardHeader";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Education, Experience, UserAllInfo } from "../store/slices/user";
import { toast } from "react-toastify";
import "../styles/dashboard.scss";

const Dashboard = () => {
  const [name, setName] = useState("");
  const [profile, setProfile] = useState({});
  const [use, setUse] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ud = useSelector((s) => s.userDatas.userdatas);
  const edu = useSelector((s) => s.userDatas.educations);

  if (!localStorage.getItem("token")) {
    useEffect(() => navigate("/login"), []);
  }

  const fetchProfile = async () => {
    try {
      axios.defaults.headers.common["x-auth-token"] =
        localStorage.getItem("token");
      const res = await axios.get("/profile/me");
      res.data && localStorage.setItem("userinfo", JSON.stringify(res.data));
      
      setName(res.data?.user?.name);
      setProfile(res.data);
      dispatch(UserAllInfo(res.data));
      setUse(true);
    } catch (err) {
      setUse(true);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const deleteExp = async (id) => {
    try {
      const res = await axios.delete(`/profile/experience/${id}`);
      dispatch(Experience(res.data.experience));
      setProfile(prev => ({ ...prev, experience: res.data.experience }));
      toast("Experience deleted successfully", { type: "success" });
    } catch (err) {
      toast("Failed to delete experience", { type: "error" });
    }
  };

  const deleteEdu = async (id) => {
    try {
      const res = await axios.delete(`/profile/education/${id}`);
      dispatch(Education(res.data.education));
      setProfile(prev => ({ ...prev, education: res.data.education }));
      toast("Education deleted successfully", { type: "success" });
    } catch (err) {
      toast("Failed to delete education", { type: "error" });
    }
  };

  const deleteAccount = async () => {
    console.log('Delete account function called');
    const data = JSON.parse(localStorage.getItem("userinfo"));
    const id = data?.user?._id;
    
    
    if (confirm("Are you sure? This cannot be undone!")) {
      const res = await axios.delete(`/profile/${id}`);
      console.log(res.data);
      
      toast(res.data.msg, { type: "success" });
      localStorage.clear();
      navigate("/");
    }
  };
  

  return (
    <div>
      <Header />

      {Object.keys(profile).length === 0 ? (
        <div className="dashboardContainer">
          <h1>Dashboard</h1>
          {!use ? (
            <h1>Loading...</h1>
          ) : (
            <div>
              <h2>
                <i className="bx bxs-user"></i>Welcome new User!
              </h2>
              <p>You have not yet setup a profile. Please add some info.</p>
              <Link to="/create-profile" className="btnPrimary">
                Create Profile
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="dashboardContainer">
          <h1>Dashboard</h1>
          <h2>
            <i className="bx bxs-user"></i> Hello, {name}!
          </h2>

          <div className="addOrEditSection">
            <Link to="/edit-profile" className="link">
              <div className="editProfile">
                <i className="bx bxs-user-circle"></i>
                <p>Edit Profile</p>
              </div>
            </Link>
            <Link to="/add-experience" className="link">
              <div className="addExperience">
                <i className="bx bx-clipboard"></i>
                <p>Add Experience</p>
              </div>
            </Link>
            <Link to="/add-education" className="link">
              <div className="addEducation">
                <i className="bx bxs-graduation"></i>
                <p>Add Education</p>
              </div>
            </Link>
          </div>

          <div className="expCredentials">
            <h2>Experience Credentials</h2>
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Title</th>
                  <th>Years</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {(profile?.experience && profile.experience.length > 0) ? (
                  profile.experience.map((item) => (
                    <tr key={item._id}>
                      <td>{item.company}</td>
                      <td>{item.title}</td>
                      <td>{item.from}</td>
                      <td>
                        <button
                          className="btnDelete"
                          onClick={() => deleteExp(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", color: "var(--color-text-muted)" }}>
                      No experiences yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="expCredentials">
            <h2>Education Credentials</h2>
            <table>
              <thead>
                <tr>
                  <th>School</th>
                  <th>Degree</th>
                  <th>Years</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {(profile?.education && profile.education.length > 0) ? (
                  profile.education.map((item) => (
                    <tr key={item._id}>
                      <td>{item.school}</td>
                      <td>{item.degree}</td>
                      <td>{item.from}</td>
                      <td>
                        <button
                          className="btnDelete"
                          onClick={() => deleteEdu(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", color: "var(--color-text-muted)" }}>
                      No educations yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <button className="deleteAccount" onClick={deleteAccount}>
            Delete My Account
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
