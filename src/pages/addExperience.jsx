import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/dashboardHeader";
import { Experience } from "../store/slices/user";
import "../styles/pages/_addExperience.scss";

const addExperience = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    jobtitle: "",
    company: "",
    location: "",
    date: "",
    jobdesc: "",
  });

  //   form on submit
  async function submit(e) {
    e.preventDefault();
    try {
      let res = axios
        .put("/profile/experience", {
          title: values.jobtitle,
          company: values.company,
          from: values.date,
        })
        .then((data) => {
          dispatch(Experience(data.data?.experience));
          toast("Experience added successfully", { type: "success" });
          navigate("/dashboard");
        })
        .catch((err) => {
          err?.response?.data?.errors.map((e) => {
            toast(e.msg, { type: "error" });
          });
        });
    } catch (err) {
      // Error handled by toast in catch block above
    }
  }

  //   input values onchange
  function onchange(e) {
    setValues((old) => ({
      ...old,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <div>
      <Header />
      <div className="add_experience_container">
        {/* texts tipa logo */}
        <div className="texts">
          <h1>Add An Experience</h1>
          <br />
          <div>
            <i className="bx bx-git-branch"></i>
            Add any developer/programming positions that you have had in the
            past
          </div>
          <br />
          <p>* = required field</p>
        </div>

        {/* Form */}
        <form onSubmit={submit}>
          {/* inputs akkaunt informations*/}
          <section id="inputs">
            <input
              type="text"
              placeholder="* Job Title"
              name="jobtitle"
              onChange={onchange}
            />
            <br />
            <br />
            <input
              type="text"
              placeholder="* Company"
              name="company"
              onChange={onchange}
            />
            <br />
            <br />
            <input
              type="text"
              placeholder="Location"
              name="location"
              onChange={onchange}
            />
            <br />
            <br />
            <h3>From Date</h3>
            <input type="date" name="date" onChange={onchange} />
            <br />
            <div className="checkbox">
              <input type="checkbox" className="checkbox" />
              <span>Curren Job</span>
            </div>
            <br />
            <h3>To Date</h3>
            <input type="date" name="current date" onChange={onchange} />
            <br />
            <br />
            <textarea
              cols="30"
              rows="4"
              name="jobdesc"
              onChange={onchange}
              placeholder="Job Description"
            ></textarea>
          </section>

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

export default addExperience;
