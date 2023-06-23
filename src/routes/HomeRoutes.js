import { Routes, Route } from "react-router-dom";
import Home from "../screens/Home";
import UserDetails from "../screens/UserDetails";
import Project from "../screens/Projects";
import Task from "../screens/Task";

import React from "react";

class HomeRoutes extends React.Component {

  render(){
  return (
    <>
    
        <Route exact path='/' element={<Home />} />
        <Route path="/userdetails" element={<UserDetails />} />
        <Route path="/project" element={<Project />} />
        <Route path="/home" element={<Home />} />
        <Route path="/taskDetails" element={<Task />} />
    
        </>
  );
  }
};

export default (HomeRoutes);
