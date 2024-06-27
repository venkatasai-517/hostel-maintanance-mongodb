import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { login } from "./helper";
import { Link } from "react-router-dom";

function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [loginSuccess, setLoginSuccess] = useState(false); // State to hold login success message
  const [loginError, setLoginError] = useState(""); // State to hold login error message

  const { email, password } = data;

  const navigate = useNavigate();

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoginSuccess(true);
      setLoginError("");
      console.log("Logged in successfully");
      login();
      setTimeout(() => {
        navigate("/app"); // Navigate to the dashboard page after a delay
      }, 2000); // Adjust delay time as needed
    } catch (error) {
      setLoginError(error.message);
      setLoginSuccess(false);
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
                <h2>Login</h2>
                <hr />
              </div>
              <form onSubmit={handleLogin}>
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
                <div className="mt-3 d-flex justify-content-between align-items-center">
                  <Link to="/signup">Go to Signup</Link>
                  <button className="btn btn-primary" type="submit">
                    Login
                  </button>
                </div>
              </form>
              {loginSuccess && (
                <div className="alert alert-success mt-3">
                  Login successful! Redirecting...
                </div>
              )}
              {loginError && (
                <div className="alert alert-danger mt-3">{loginError}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
