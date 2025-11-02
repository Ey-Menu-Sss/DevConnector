import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/dashboardHeader";
import "../styles/pages/_createProfile.scss";

const createProfile = () => {
  const [display, setDisplay] = useState("none");
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [values, setValues] = useState({
    job: "",
    company: "",
    website: "",
    location: "",
    skills: "",
    gitUsername: "",
    bio: "",
    url: {
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      youtube: "",
    },
  });

  //   form on submit
  async function submit(e) {
    e.preventDefault();
    try {
      let data = await axios.post("create-profile/", {
        status: values.job,
        skills: values.skills,
        bio: values.bio,
        company: values.company,
        githubusername: values.gitUsername,
        location: values.location,
        website: values.website,
        twitter: values.url.twitter,
        facebook: values.url.facebook,
        youtube: values.url.youtube,
        linkedin: values.url.linkedin,
        instagram: values.url.instagram,
      }, {
        headers: {
          "x-auth-token": `${localStorage.getItem("token")}`,
        }
      });
      toast("Profile created successfully", {type: 'success'})
      navigate("/dashboard")
      localStorage.setItem("userinfo", JSON.stringify(data.data))
      dispatch(UserDatas(data.data))
      } catch (err) {
        toast("Failed to create profile", { type: "error" });
    }
  }

  //   input values onchange
  function onchange(e) {
    setValues((old) => ({
      ...old,
      [e.target.name]: e.target.value,
    }));
  }
  function onchangeurl(e) {
    // console.log(`${e.target.name}: ${e.target.value}`);
    setValues((old) => ({
      ...old,
      url: {
        ...old.url,
        [e.target.name]: e.target.value,
      },
    }));
  }
  //   social networks drop down
  function handleClick() {
    if (display === "block") {
      setDisplay("none");
    } else {
      setDisplay("block");
    }
  }

  return (
    <div>
      <Header />
      <div className="create_profile_container">
        {/* texts tipa logo */}
        <div className="texts">
          <h1>Create Your Profile</h1>
          <br />
          <div>
            <i className="bx bxs-user"></i>
            Let's get some information to make your
          </div>
          <br />
          <p>* = required field</p>
        </div>

        {/* Form */}
        <form onSubmit={submit}>
          {/* inputs akkaunt informations*/}
          <section id="inputs">
            <select onChange={onchange} name="job" required>
              <option value="sps">* Select Professional Status</option>
              <option value="Developer">Developer</option>
              <option value="Junior Developer">Junior Developer</option>
              <option value="Senior Developer">Senior Developer</option>
              <option value="Mananger">Mananger</option>
              <option value="Student or Learning">Student or Learning</option>
              <option value="Instructor or Techer">Instructor or Techer</option>
              <option value="Intern">Intern</option>
              <option value="Ohter">Other</option>
            </select>
            <p>Give us an idea of where you are at in your career</p>
            <br />
            <input
              type="text"
              placeholder="Company"
              name="company"
              onChange={onchange}
            />
            <p>Could be your own company or one you work for</p>
            <br />
            <input
              type="text"
              placeholder="Website"
              name="website"
              onChange={onchange}
            />
            <p>Could be your own or a company website</p>
            <br />
            <input
              type="text"
              placeholder="Location"
              name="location"
              onChange={onchange}
            />
            <p>City & state suggested (eg. Boston, MA)</p>
            <br />
            <input
              type="text"
              placeholder="* Skills"
              name="skills"
              onChange={onchange}
            />
            <p>
              Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
            </p>
            <br />
            <input
              type="text"
              placeholder="Github Username"
              name="gitUsername"
              onChange={onchange}
            />
            <p>
              If you want your latest repos and a Github link, include your
              username
            </p>
            <br />
            <textarea
              cols="30"
              rows="4"
              name="bio"
              onChange={onchange}
              placeholder="A short bio of yourself"
            ></textarea>
            <p>Tell us a little about yourself</p>
          </section>

          {/* add social networks */}
          <div className="btn_social">
            <button onClick={handleClick} type="button">
              Add Social Network Links
            </button>
            <p>Optional</p>
          </div>

          {/* social urls (input) */}
          <div className={`socialUrls ${display}`}>
            <div className="logoandurl">
              <i className="bx bxl-twitter" style={{ color: "#38a1f3" }}></i>
              <input
                type="text"
                placeholder="Twitter URL"
                name="twitter"
                onChange={onchangeurl}
              />
            </div>
            <div className="logoandurl">
              <i
                className="bx bxl-facebook-square"
                style={{ color: "#3b5998" }}
              ></i>
              <input
                type="text"
                placeholder="Facebook URL"
                name="facebook"
                onChange={onchangeurl}
              />
            </div>
            <div className="logoandurl">
              <i className="bx bxl-youtube" style={{ color: "#c4302b" }}></i>
              <input
                type="text"
                placeholder="Youtube URL"
                name="youtube"
                onChange={onchangeurl}
              />
            </div>
            <div className="logoandurl">
              <i
                className="bx bxl-linkedin-square"
                style={{ color: "#0077b5" }}
              ></i>
              <input
                type="text"
                placeholder="Linkedin URL"
                name="linkedin"
                onChange={onchangeurl}
              />
            </div>
            <div className="logoandurl">
              <i
                className="bx bxl-instagram-alt"
                style={{ color: "rgb(255, 90, 156)" }}
              ></i>
              <input
                type="text"
                placeholder="Instagram URL"
                name="instagram"
                onChange={onchangeurl}
              />
            </div>
          </div>

          {/* buttons submit and go back */}
          <div className="btns_submitandgoback">
            <button className="submit" type="submit">
              Submit
            </button>
            <Link to="/dashboard" className="link">
              Go Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default createProfile;
