import React, { Component } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { connect } from 'react-redux';
import HomeRoutes from "./HomeRoutes";
import AuthRoutes from "./AuthRoutes";
import StaticPagesRoutes from "./StaticPagesRoutes";
import Layout from "../screens/Layout";
import Home from "../screens/Home";
import UserDetails from "../screens/UserDetails";
import Project from "../screens/Projects";
import Task from "../screens/Task";

import Login from "../screens/Login";
import VerifyOtp from "../screens/Login";


class IndexRoutes extends Component {

  render() {
    let { getUser: { isLoggedIn, token } } = this.props;
    if (typeof isLoggedIn == "undefined") isLoggedIn = false;
    return (
      <Routes>
        <Route path="/" element={<Layout />}>
          {!isLoggedIn && <>
            {/* <AuthRoutes /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />

            <Route path="/" element={<Navigate replace to="/login" />} />

          </>}
          {isLoggedIn &&
            <>
              <Route path="/login" element={<Navigate replace to="/" />} />
              <Route path="/signup" element={<Navigate replace to="/" />} />
              {/* <HomeRoutes /> */}
              <Route exact path='/' element={<Home />} />
              <Route path="/userdetails" element={<UserDetails />} />
              <Route path="/project" element={<Project />} />
              <Route path="/home" element={<Home />} />
              <Route path="/taskDetails" element={<Task />} />
            </>
          }

          {/* <StaticPagesRoutes/> */}
        </Route>
      </Routes>
    );
  }
}

const mapStateToProps = (state) => ({
  getUser: state.userReducer.getUser,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(IndexRoutes);