import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RegisterHeader from "../components/registerHeader";
import "../styles/pages/_login.scss";
import { useDispatch } from "react-redux";

const login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch()
  const navigate = useNavigate()

  if(localStorage.getItem("token")){
    useEffect(()=>navigate("/dashboard"), [])
  }

  function onchange(e){
    setValues((old) => ({
      ...old,
      [e.target.name]: e.target.value,
    }));
  }

  async function submit(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post("login/", {
        email: values.email,
        password: values.password,
      }, {
        withCredentials: true,
      });
  

      if(data.token){
        toast("login success", {type: "success"})
        localStorage.setItem("token", data.token)
        axios.defaults.headers.common["x-auth-token"] = `${data.token}`
        navigate("/my-profile")
      }
    } catch (err) {
      toast("Invalid Credentials", {type: "error"})
    }
  }

  return (
    <div>
      <RegisterHeader />

      <div className="login_container">
        <div className="texts">
          <h1>Sign In</h1>
          <br />
          <div className="info">
            <i className="bx bxs-user"></i>
            <h2>Sign Into Your Account</h2>
          </div>
        </div>
        <form className="form" onSubmit={submit}>
          <input
            type="text"
            name="email"
            placeholder="Email Address"
            onChange={onchange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={onchange}
            required
          />
          <br />
          <br />
          <button type="submit">Login</button>
        </form>
        <br />
        <h4>
          Don't have an account?
          <Link to="/register" className="link">
            Sign Up
          </Link>
        </h4>
      </div>
    </div>
  );
};

export default login;
