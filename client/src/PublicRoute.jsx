import { Navigate } from "react-router-dom";
import { isLogin } from "./helper";

// eslint-disable-next-line react/prop-types
const PublicRoute = ({ component: Component, ...rest }) => {
  if (isLogin()) {
    return <Navigate to="/app" />;
  }
  return <Component {...rest} />;
};
export default PublicRoute;
