import { Component } from "react";
import { connect } from "react-redux";
import { fetchApi } from "../../../service/api";
import { Formik } from "formik";
import * as Yup from "yup";
import { Alert, Row, Col, Table, Button, Modal, Form, Pagination } from "react-bootstrap";
import ReactPaginate from 'react-paginate';
import EditUser from "./EditUser";
import '../../../assets/scss/App.scss';


const validationSchema = Yup.object().shape({
  email: Yup.string().max(100)
    .email("*Must be a valid email address")
    .required("*Email is required"),
  name: Yup.string().matches(/^[A-Za-z]+$/, 'Name must contain only alphabetic characters').min(3).max(50)
    .required("*name is required"),
  mobile: Yup.string().matches(/^[0-9]{10}$/, '*Mobile number must be 10 digits and only digits are allowed eg. (9863565467)')
    .required("*Mobile number is required"),
});

class Users extends Component {
  constructor(props) {
    super(props);
    this.users = this.users.bind(this);
    this.newUserForm = this.newUserForm.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.submitNewUserForm = this.submitNewUserForm.bind(this);
    this.showProjects = this.showProjects.bind(this);
    this.closeEditUserForm = this.closeEditUserForm.bind(this);
    this.handleEditUserSuccess = this.handleEditUserSuccess.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.handleCloseProjects = this.handleCloseProjects.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  state = {
    errorMessage: "",
    usersData: [],
    editUsersData: {},
    editUserData: {},
    user_id: 0,
    projectsData: [],
    selectedProject: '',
    show: false,
    showPopup: false,
    showProjects: false,
    currentPage: 1,
    totalPages: null,
    itemsPerPage: 5,
  };

  async componentDidMount() {
    await this.getUsers();
  }

  async getUsers() {
    const { currentPage, itemsPerPage } = this.state;
    // console.log(itemsPerPage, currentPage);
    const response = await fetchApi("getUserDetails", "POST", { currentPage, itemsPerPage }, 200, null);
    if (response.responseBody && response.responseBody.data) {
      this.setState({
        usersData: response.responseBody.data.users,
        currentPage: response.responseBody.data.currentPage,
        totalPages: response.responseBody.data.totalPages,

      });
    } else {
      console.log("Error fetching users:", response);
    }
  }

  handleChange = event => {
    this.setState({ selectedProject: event.target.files[0] });
  };

  async newUserForm() {
    this.setState({ show: true });
  }

  async handleClose() {
    this.setState({ show: false });
  }

  closeEditUserForm() {
    this.setState({ showPopup: false });
  }

  async handleCloseProjects() {
    this.setState({ showProjects: false });
  }

  async editUserForm(user_id) {
    const { token } = this.props.getUser;
    const response = await fetchApi("getUserDetailsBYUserID", "POST", { user_id: user_id }, 200, token);
    // console.log("users edit",response.responseBody.data);
    this.setState({ editUsersData: response.responseBody.data, user_id, showPopup: true });
  }

  async handleEditUserSuccess(editUserData) {
    const updatedUsersData = this.state.usersData.map((user) => {
      if (user.user_id === editUserData.user_id) {
        return editUserData;
      }
      return user;
    });
    // console.log("update user", updatedUsersData);
    const { currentPage, itemsPerPage } = this.state;
    // console.log(itemsPerPage, currentPage);
    const response = await fetchApi("getUserDetails", "POST", { currentPage, itemsPerPage }, 200, null);
    if (response.responseBody && response.responseBody.data) {
      this.setState({
        usersData: response.responseBody.data.users,
        currentPage: response.responseBody.data.currentPage,
        totalPages: response.responseBody.data.totalPages,

      });
    } else {
      console.log("Error fetching users:", response);
    }
  }

  async deleteUser(record) {
    const { isLoggedIn, token } = this.props.getUser;
    const response = await fetchApi("deleteUser", "POST", { user_id: record.user_id }, 200, token);
    let records = this.state.usersData;

    records = records.filter((v, i) => {
      return v.user_id !== record.user_id
    });

    this.setState({ usersData: records })
  }

  async submitNewUserForm(values, Callback) {
    const { isLoggedIn, token } = this.props.getUser;
    const response = await fetchApi('registerNewUser', 'POST', values, 200, token);
    if (response.responseBody.status == 0) {
      this.setState({ isError: true, errorMessage: response.responseBody.message });
      let _this = this;
      setTimeout(function () {
        _this.setState({ isError: false });
      }, 4000)
    } else {
      const response1 = await fetchApi("getUserDetails1", "GET", {}, 200, null);
      this.setState({ usersData: response1.responseBody.data });
      this.setState({ isSuccess: true });
      let _this = this;
      setTimeout(function () {
        _this.setState({ isSuccess: false });
      }, 2000)
      Callback(true);
    }

  }

  async showProjects(user_id) {
    const { isLoggedIn, token } = this.props.getUser;
    const response = await fetchApi("getProjectsByUser", "POST", { user_id: user_id }, 200, token);
    this.setState({ projectsData: response.responseBody.data, showProjects: true });
  }

  async handlePageChange(data) {
    const selectedPage = data.selected;
    const newCurrentPage = selectedPage + 1;
    await this.setState({ currentPage: newCurrentPage });
    await this.getUsers();
  }

  users() {
    let usersData = this.state.usersData;
    return usersData.map((item, key) => {
      return (
        <tr key={item.user_id}>
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
          <td>
            <Button className="btn btn-warning edit" onClick={() => this.editUserForm(item.user_id)} size="sm">Edit</Button>
            <Button className="btn btn-danger delete" onClick={() => this.deleteUser(item)} size="sm" >Delete</Button>
          </td>
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
    const { show, isSuccess, isError, currentPage, totalPages, errorMessage } = this.state;
    // console.log(this.state.usersData)
    if (typeof this.state.usersData != "undefined" && this.state.usersData.length > 0)
      return (<>
        <Row>
          <div style={{ marginTop: "30px" }}>
            <EditUser editUsersData={this.state.editUsersData} user_id={this.state.user_id} showPopup={this.state.showPopup} closeEditUserForm={this.closeEditUserForm} onHandleEditUserSuccess={this.handleEditUserSuccess} />
            <Col>
              <Button variant="success" onClick={() => this.newUserForm()}>Add New User</Button>
              <div className="table-responsive" style={{ marginTop: "30px" }}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Projects Assigned</th>
                      <th>Action</th>
                      {/* <th>Assign new Project</th> */}
                    </tr>
                  </thead>
                  <tbody>{this.users()}</tbody>
                </Table>
              </div>
            </Col>
          </div>
        </Row>

        <Modal show={show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add New User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={{
                name: "",
                email: "",
                // address: "",
                mobile: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                setSubmitting(true);
                this.submitNewUserForm(values, (returnValue) => {
                  setSubmitting(false);
                  resetForm(true);
                });

              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <form onSubmit={handleSubmit} className="mx-auto">
                  {isSuccess && (
                    <Alert key={"primary"} variant={"primary"}>
                      User created successfully .......
                    </Alert>)}
                  {isError && (
                    <Alert key={"danger"} variant={"danger"}>
                      {errorMessage}
                    </Alert>)}
                  <Form.Group controlId="formName" className="formName">
                    <Form.Label>Full Name :</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Please Enter full name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      className={touched.name && errors.name ? "error" : null}
                    />
                    {touched.name && errors.name ? (
                      <div className="error-message">{errors.name}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group controlId="formEmail" className="formName">
                    <Form.Label>Email :</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Please enter your Email Address (eg: xyz@gmail.com)"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      className={
                        touched.email && errors.email ? "error" : null
                      }
                    />
                    {touched.email && errors.email ? (
                      <div className="error-message">{errors.email}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group controlId="formMobile" className="formName">
                    <Form.Label>Mobile</Form.Label>
                    <Form.Control
                      type="text"
                      name="mobile"
                      placeholder="Please enter 10 digits mobile number(e.g. : 1234567890)"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength="10"
                      value={values.mobile}
                      className={
                        touched.mobile && errors.mobile ? "error" : null
                      }
                    />
                    {touched.mobile && errors.mobile ? (
                      <div className="error-message">{errors.mobile}</div>
                    ) : null}
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </form>
              )}
            </Formik>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Row>
          <Col className="d-flex justify-content-center">
            <ReactPaginate
              breakLabel="..."
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              onPageChange={this.handlePageChange}
              pageRangeDisplayed={10}
              pageCount={this.state.totalPages}

              renderOnZeroPageCount={null}
              containerClassName={"pagination"}
              previousLinkClassName={"pagination__link"}
              nextLinkClassName={"pagination__link"}
              disabledClassName={"pagination__link--disabled"}
              activeClassName={"pagination__link--active"}
            />
          </Col>
        </Row>
      </>);
    else
      return <>
        <Row>
          <Col>
            <Button variant="success" onClick={() => this.newUserForm()}>Add New User</Button>
            <div style={{ marginTop: "30px" }}>
              {this.users()}
            </div>
          </Col>
        </Row>

        <Modal show={show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add New User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={{
                name: "",
                email: "",
                // address: "",
                mobile: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                setSubmitting(true);
                this.submitNewUserForm(values, (returnValue) => {
                  setSubmitting(false);
                  resetForm(true);
                });

              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <form onSubmit={handleSubmit} className="mx-auto">
                  {isSuccess && (
                    <Alert key={"primary"} variant={"primary"}>
                      User created successfully .......
                    </Alert>)}
                  {isError && (
                    <Alert key={"danger"} variant={"danger"}>
                      {errorMessage}
                    </Alert>)}
                  <Form.Group controlId="formName" className="formName">
                    <Form.Label>Full Name :</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Please Enter full name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      className={touched.name && errors.name ? "error" : null}
                    />
                    {touched.name && errors.name ? (
                      <div className="error-message">{errors.name}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group controlId="formEmail" className="formName">
                    <Form.Label>Email :</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Please enter your Email Address (eg: xyz@gmail.com)"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      className={
                        touched.email && errors.email ? "error" : null
                      }
                    />
                    {touched.email && errors.email ? (
                      <div className="error-message">{errors.email}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group controlId="formMobile" className="formName">
                    <Form.Label>Mobile</Form.Label>
                    <Form.Control
                      type="text"
                      name="mobile"
                      placeholder="Please enter 10 digits mobile number(e.g. : 1234567890)"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength="10"
                      value={values.mobile}
                      className={
                        touched.mobile && errors.mobile ? "error" : null
                      }
                    />
                    {touched.mobile && errors.mobile ? (
                      <div className="error-message">{errors.mobile}</div>
                    ) : null}
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </form>
              )}
            </Formik>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {this.emptyUsers()}</>;
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
