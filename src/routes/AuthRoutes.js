import { Navigate, Route } from "react-router-dom";
import Login from "../screens/Login";
import VerifyOtp from "../screens/Login";
import Layout from "../screens/Layout";
import React from "react";

class AuthRoutes extends React.Component {

  render(){
  return (
    
     <Route path="/" element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/" element={<Navigate replace to="/login" />} />
        </Route> 
    
  );
  }
};

export default (AuthRoutes);
