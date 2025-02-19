import { useNavigate } from "react-router-dom";
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  //const navigator = useNavigate();
  const token = localStorage.getItem("Authorization");
  console.log(token);
  return token ? children : <Navigate to="/login" />;
};
export default PrivateRoute;
