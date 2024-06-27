import { Navigate } from "react-router-dom";
import { isLogin } from "./helper";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ component: Component, ...rest }) => {
  if (isLogin()) {
    return <Component {...rest} />;
  }
  return <Navigate to="/login" />;
};
export default PrivateRoute;
