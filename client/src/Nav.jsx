import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import App from "./App";
import Second from "./Double";
import Thrible from "./Thrible";
import Four from "./Four";
import Student from "./Studentdetails";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
function Nav() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicRoute component={Login} />} />
        <Route path="/login" element={<PublicRoute component={Login} />} />

        <Route path="/signup" element={<PublicRoute component={Signup} />} />

        <Route path="/app" element={<PrivateRoute component={App} />} />
        <Route path="/second" element={<PrivateRoute component={Second} />} />
        <Route path="/thrible" element={<PrivateRoute component={Thrible} />} />
        <Route path="/four" element={<PrivateRoute component={Four} />} />
        <Route
          path="/studentdetails"
          element={<PrivateRoute component={Student} />}
        />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default Nav;
