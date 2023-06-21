import React, { Component } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { connect } from 'react-redux';
import HomeRoutes from "./HomeRoutes";
import AuthRoutes from "./AuthRoutes";
import StaticPagesRoutes from "./StaticPagesRoutes";

class Routes extends Component {

  render() {
    let { getUser: { isLoggedIn, token } } = this.props;
    if(typeof isLoggedIn == "undefined") isLoggedIn = false;
    return (
      <Switch>
          <Route>
          {!isLoggedIn && <><AuthRoutes />
          <Redirect exact from="/" to="/login" /> 
          </>}
          {isLoggedIn &&
            <>
              <HomeRoutes />
              <Redirect exact from="/login" to="/" />
            </>
          }   
          <StaticPagesRoutes/>
        </Route>
      </Switch>
    );
  }
}

const mapStateToProps = (state) => ({
  getUser: state.userReducer.getUser,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Routes);