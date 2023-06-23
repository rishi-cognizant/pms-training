import { Routes, Route } from "react-router-dom";
import Login from "../screens/Login";
import VerifyOtp from "../screens/Login";


const AuthRoutes = () => {
  return (
    <>
      
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
      
    </>
  );
};

export default (AuthRoutes);
