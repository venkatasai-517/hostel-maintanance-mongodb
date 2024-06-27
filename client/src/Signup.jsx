import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import "./Nav";
// import { Link,Route,Routes } from "react-router-dom";

function Signup() {
  const [data, setData] = useState({
    email: "",
    password: "",
    password2: "",
  });
  const [singupSuccess, setSignupSuccess] = useState(false); // State to hold login success message
  const [signupError, setSignupError] = useState(""); // State to hold login error message
  const { email, password, password2 } = data;

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    try {
      createUserWithEmailAndPassword(auth, email, password);
      setSignupSuccess(true);
      setSignupError("");
      console.log("Signup Suceess");
      const user = auth.currentUser;
      console.log(user);
      setTimeout(() => {
        navigate("/login"); // Navigate to the dashboard page after a delay
      }, 2000); // Adjust delay time as needed
    } catch (error) {
      setSignupError(error.message);
      setSignupSuccess(false);
      console.log(error.message);
    }
  };

  return (
    <div className="container p-5 mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="border-top border-primary border-3 rounded-3">
            <div className="card p-3">
              <div className="mb-2">
                <h2>Sign Up</h2>
                <hr />
              </div>
              <form onSubmit={handleSignup}>
                <div className="input-group mb-2">
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Email"
                    aria-describedby="addon-wrapping"
                    value={email}
                    onChange={changeHandler}
                    required
                  />
                  <span className="input-group-text" id="addon-wrapping">
                    <i className="fa-solid fa-user"></i>
                  </span>
                </div>
                <div className="input-group mt-3">
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={password}
                    placeholder="Password"
                    aria-label="Password"
                    aria-describedby="addon-wrapping"
                    onChange={changeHandler}
                    required
                  />
                  <span className="input-group-text" id="addon-wrapping">
                    <i className="fa-solid fa-lock"></i>
                  </span>
                </div>
                <div className="input-group mt-3">
                  <input
                    type="password"
                    name="password2"
                    className="form-control"
                    value={password2}
                    placeholder="Confirm Password"
                    onChange={changeHandler}
                    required
                  />
                  <span className="input-group-text">
                    <i className="fa-solid fa-lock"></i>
                  </span>
                </div>
                <div className="mt-3 d-flex justify-content-between align-items-center">
                  <a href="/login">Go to Login</a>
                  <button className="btn btn-primary" type="submit">
                    Sign Up
                  </button>
                </div>
              </form>
              {singupSuccess && (
                <div className="alert alert-success mt-3">
                  Login successful! Redirecting...
                </div>
              )}
              {signupError && (
                <div className="alert alert-danger mt-3">{signupError}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
