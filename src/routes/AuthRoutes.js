import { Routes, Route } from "react-router-dom";
import Login from "../screens/Login";


const AuthRoutes = () => {
  return (
    <>
      
        <Route path="/login" element={<Login />} />
      
    </>
  );
};

export default (AuthRoutes);
