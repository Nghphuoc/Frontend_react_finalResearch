import { useNavigate } from "react-router-dom";
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  //const navigator = useNavigate();
  const token = sessionStorage.getItem("Authorization");
  return token ? children : <Navigate to="/home" />;
};
export default PrivateRoute;
