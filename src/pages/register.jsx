import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RegisterHeader from "../components/registerHeader";
import "../styles/pages/_register.scss";


const register = () => {
  // input values...
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmedPassword: "",
  });
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  if(localStorage.getItem("token")){
    useEffect(() => navigate("/dashboard"), [])
  }

  // input on change..
  function onchange(e) {
    setValues((old) => ({
      ...old,
      [e.target.name]: e.target.value,
    }));
  }
  // form on submit...
  async function submit(e) {
    e.preventDefault();
    if (values.password !== values.confirmedPassword) {
      toast("Password do not match!", { type: "error" });
      return;
    }
    // post
    try {
      let { data } = await axios.post("register/", {
        name: values.name,
        email: values.email,
        password: values.password,
      });      
      const token = data.token;
      localStorage.setItem("token", token)
      axios.defaults.headers.common["x-auth-token"] = `${token}`
      toast("SignUp success", {type: "success"})
      localStorage.setItem("", values.name)
      navigate("/my-profile")
    } catch (err) {
      toast("User already exists", {type: "error"})
    }
  }

  // axios.defaults.headers.common["x-auth-token"] = `Bearer ${token}`
  return (
    <div>
      <RegisterHeader />

      <div className="register_container">
        <div className="texts">
          <h1>Sign Up</h1>
          <br />
          <div className="info">
            <i className="bx bxs-user"></i>
            <h2>Create Your Account</h2>
          </div>
        </div>
        <form className="form" onSubmit={submit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={onchange}
            required
          />
          <input
            type="text"
            name="email"
            placeholder="Email Address"
            onChange={onchange}
            required
          />
          <p>
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </p>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={onchange}
            required
          />
          <input
            type="password"
            name="confirmedPassword"
            placeholder="Confirm Password"
            onChange={onchange}
            required
          />
          <br />
          <br />
          <button type="submit">Register</button>
        </form>
        <br />
        <h4>
          Already have an account?{" "}
          <Link to="/login" className="link">
            Sign In
          </Link>
        </h4>
      </div>
    </div>
  );
};

export default register;
