import { Component } from "react";
import { connect } from "react-redux";
import { fetchApi } from "../../service/api";
import { Alert, Row, Col, Table, Button, Modal, Form } from "react-bootstrap";

class Users extends Component {
  constructor(props) {
    super(props);
    this.users = this.users.bind(this);
    this.showProjects = this.showProjects.bind(this);
    this.handleCloseProjects = this.handleCloseProjects.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }

  state = {
    usersData: [],
    user_id: 0,
    projectsData:[],
    selectedProject: '',
    showPopup: false,
    showProjects: false,
  };

  async componentDidMount() {
    const response = await fetchApi("getUserDetails", "GET", {}, 200, null);
    this.setState({ usersData: response.responseBody.data });
  }
  handleChange = event => {
    this.setState({ selectedProject: event.target.files[0] });

  };
  
  async handleCloseProjects () {
    this.setState({ showProjects: false});

  };

  async showProjects(user_id) {
    const { isLoggedIn, token } = this.props.getUser;
    const response = await fetchApi("getProjectsByUser", "POST", { user_id: user_id }, 200, token);
    this.setState({ projectsData: response.responseBody.data, showProjects: true });
  }

  users() {
    let usersData = this.state.usersData;
    return usersData.map((item, key) => {
      return (
          <tr key={item.users_id}>
          <td>{item.user_id}</td>
          <td>{item.name}</td>
          <td>{item.email}</td>
          <td><Button onClick={() => this.showProjects(item.user_id)}>{item.projects}</Button></td>
          <Modal show={this.state.showProjects} onHide={this.handleCloseProjects}>
              <Modal.Header closeButton onClick={() => this.handleCloseProjects()}>
                <Modal.Title>Projects</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>project ID</th>
                      <th>Project Title</th>
                    </tr>
                  </thead>
                  <tbody>{this.projects()}</tbody>
                </Table>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => this.handleCloseProjects()}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            {/* <td></td> add autocomplete or typeahead to selct project to assign to a user */}
        </tr>

      );
    });
  }

  projects() {
    let projectsData = this.state.projectsData;
    if (projectsData.length === 0) {
      return (
        <>
          <tr key={1}>
            <td colSpan={4}>No projectsData for this User</td>
          </tr>
        </>
      )
    }
    
    return projectsData.map((item, key) => {
      return (
        <tr key={item.project_id}>
          <td>{item.project_id}</td>
          <td>{item.title}</td>
        </tr>
      );
    });
  }

  emptyUsers() {
    return (
      <Alert key={"primary"} variant={"primary"}>
        No Data found for users
      </Alert>
    )
  }

  render() {
    const { isLoggedIn } = this.props.getUser;
    const { show, isSuccess, isError } = this.state;
    if (typeof this.state.usersData != "undefined" && this.state.usersData.length > 0)
      return (<>
        <Row>
          <div style={{ marginTop: "30px" }}>
          <Col>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>email</th>
                    <th>Projects Assigned</th>
                    {/* <th>Assign new Project</th> */}
                  </tr>
                </thead>
                <tbody>{this.users()}</tbody>
              </Table>
            </Col>
          </div>
        </Row>
      </>);
    else
      return <>{this.emptyUsers()}</>;
  }
}

const mapStateToProps = (state) => ({
  loginUser: state.authReducer.loginUser,
  getUser: state.userReducer.getUser,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Users);
