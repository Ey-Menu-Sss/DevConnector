import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/dashboardHeader";
import "../styles/pages/_editProfile.scss";

const editProfile = () => {
  const [display, setDisplay] = useState("none");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //   const [valueData, setValueData] = useState({});
  //   let userdatas = useSelector((s) => s.userDatas);
  let userdatas = JSON.parse(localStorage.getItem("userinfo")) || {};

  //   useEffect(() => {
  //     (async function inputvaluesuchun() {
  //       try {
  //         let res = await axios.get("/profile/me").then((data) => {
  //           setValueData(data.data);
  //         });
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     })();
  //   }, []);

  // Object.keys(valueData).length === 0 <-- tipa arr.length

  //   if (Object.keys(valueData).length === 0) {
  //     console.log("pusto");
  //   } else {
  //     console.log("ne pusto");
  //   }
  //   if(valueData.length !== 0){
  //         console.log("pusto");
  //   }else{
  //     console.log("ne pusto");
  //   }

  const [values, setValues] = useState({
    job: userdatas?.status,
    company: userdatas?.company,
    website: userdatas?.website,
    location: userdatas?.location,
    skills: userdatas?.skills,
    gitUsername: userdatas?.githubusername,
    bio: userdatas?.bio,
    url: {
      facebook: userdatas?.social?.facebook,
      instagram: userdatas?.social?.instagram,
      linkedin: userdatas?.social?.linkedin,
      twitter: userdatas?.social?.twitter,
      youtube: userdatas?.social?.youtube,
    },
  });

  //   form on submit
  async function submit(e) {
    e.preventDefault();

    if (values.job === "sps" && values.skills.length === 0) {
      toast("status and skills are required", { type: "error" });
    } else if (values.job === "sps") {
      toast("status is required!", { type: "error" });
    } else if (values.skills?.length === 0) {
      toast("skills is required", { type: "error" });
    }

    // if(values.job)

    try {
      let data = await axios.post("/profile", {
        status: values.job,
        skills: values.skills,
        bio: values.bio,
        company: values.company,
        githubusername: values.gitUsername,
        location: values.location,
      });
      data.data.social.youtube = values.url.youtube;
      data.data.social.instagram = values.url.instagram;
      data.data.social.linkedin = values.url.linkedin;
      data.data.social.twitter = values.url.twitter;
      data.data.social.facebook = values.url.facebook;
      toast("Profile updated successfully", { type: "success" });
      navigate("/dashboard");
      localStorage.setItem("userinfo", JSON.stringify(data.data));
      //   dispatch(UserDatas(data.data));
    } catch (err) {
      toast(err.response?.data?.errors[0].msg, { type: "error" });
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
      <div className="edit_profile_container">
        {/* texts tipa logo */}
        <div className="texts">
          <h1>Edit Your Profile</h1>
          <br />
          <div>
            <i className="bx bxs-user"></i>
            Add some changes to your profile
          </div>
          <br />
          <p>* = required field</p>
        </div>

        {/* Form */}
        <form onSubmit={submit}>
          {/* inputs akkaunt informations*/}
          <section id="inputs">
            <select onChange={onchange} name="job" value={values.job}>
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
              value={values.company}
              onChange={onchange}
            />
            <p>Could be your own company or one you work for</p>
            <br />
            <input
              type="text"
              placeholder="Website"
              name="website"
              value={values.website}
              onChange={onchange}
            />
            <p>Could be your own or a company website</p>
            <br />
            <input
              type="text"
              placeholder="Location"
              name="location"
              value={values.location}
              onChange={onchange}
            />
            <p>City & state suggested (eg. Boston, MA)</p>
            <br />
            <input
              type="text"
              placeholder="* Skills"
              name="skills"
              value={values.skills}
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
              value={values.gitUsername}
              onChange={onchange}
            />
            <p>
              If you want your latest repos and a Github link, include your
              username
            </p>
            <br />
            <textarea
              cols="30"
              rows="3"
              name="bio"
              onChange={onchange}
              value={values.bio}
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
                value={values.url.twitter}
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
                value={values.url.facebook}
                onChange={onchangeurl}
              />
            </div>
            <div className="logoandurl">
              <i className="bx bxl-youtube" style={{ color: "#c4302b" }}></i>
              <input
                type="text"
                placeholder="Youtube URL"
                name="youtube"
                value={values.url.youtube}
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
                value={values.url.linkedin}
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
                value={values.url.instagram}
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

export default editProfile;
