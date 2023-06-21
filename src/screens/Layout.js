import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Component } from "react";
import { connect } from "react-redux";
import { logoutUser } from "../actions/auth.actions";

class Layout extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.logout = this.logout.bind(this);
  }

  logout() {
    this.props.dispatch(logoutUser());
  }

  render() {
    const { isLoggedIn } = this.props.getUser;
    return (
      <>
        <Navbar  className="stroke" bg="danger" variant="light">
          <Container>
            <Navbar.Brand style={{color:"#fff",fontWeight :"bold", fontFamily :"serif"}}  href="/prehome">Project Management System</Navbar.Brand>
            <Nav className="mr-auto navbar-nav" >
              {!isLoggedIn &&
                <>
                  <Link className="nav-item" to="/prehome" >Home</Link>
                </>
              }
              {isLoggedIn &&
                <>
                  <Link className="nav-item" style={{fontWeight :"bold", fontFamily :"serif"}}  to="/home" >Home</Link>&nbsp;&nbsp;
                  <Link className="nav-item" style={{fontWeight :"bold", fontFamily :"serif"}} to='/project' >Projects</Link>&nbsp;&nbsp;
                  <Link className="nav-item" style={{fontWeight :"bold", fontFamily :"serif"}} to='/userDetails'>Users</Link>&nbsp;&nbsp;
                  <Link className="nav-item" style={{fontWeight :"bold", fontFamily :"serif"}} to='/taskDetails'>Tasks</Link>&nbsp;&nbsp;

                </>
              }
            </Nav>

            <Nav className="right">
              {!isLoggedIn &&
                <>
                  
                  <button style={{ color: "#fff", fontWeight: "bold" }} type="button" className="btn btn-outline-light" to="/login">Login</button>
                  
                </>
              }
              {isLoggedIn &&
                <div>
                 
                  <button style={{ color: "#fff", fontWeight: "bold" }} type="button" className="btn btn-outline-light" to="/" onClick={() => this.logout()}>Logout</button>
                </div>
              }

            </Nav>
          </Container>
        </Navbar>
        {this.props.children}
      </>
    )
  };
}


const mapStateToProps = (state) => ({
  loginUser: state.authReducer.loginUser,
  getUser: state.userReducer.getUser,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);