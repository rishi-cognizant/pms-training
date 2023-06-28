import { Component } from "react";
import { connect } from "react-redux";
import { fetchApi } from "../../../service/api";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from 'moment';
import { Alert, Row, Form, Col, Button, Modal } from "react-bootstrap";

const validationSchema = Yup.object().shape({
  user_name: Yup.string().min(3)
    .required("*user_name is required"),
  project_name: Yup.string().min(3)
    .required("*project_name required"),
});

class AssignProject extends Component {

  constructor(props) {
    super(props);
    this.openForm = this.openForm.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onUserChange = this.onUserChange.bind(this);

    this.state = {
      userDetails: null,
      projectDetails: null,
      taskDetails: null,
      show: false,
      user_name: [],
      user_id: 0,
      project_name: [],
      project_id: 0,
      selectedUser: [],
    };
  }

  async componentDidMount() {
    try {
      const response = await fetchApi("getUserDetails1", "GET", {}, 200, null);
      this.setState({ userDetails: response.responseBody.data });

      const response2 = await fetchApi("getProjectDetails1", "GET", {}, 200, null);
      this.setState({ projectDetails: response2.responseBody.data });

    } catch (error) {
      console.error("Error occurred while fetching data:", error);
    }
  }

  onProjectChange = event => {        
    console.log("project_id ",event.target.value);
    this.setState({ project_id: event.target.value });
};

onUserChange = event => {
    console.log("user_id ",event.target.value);
    this.setState({ user_id: event.target.value });
};

  async openForm() {
    this.setState({ show: true });
  }

  async handleClose() {
    this.setState({ show: false });
  }

  async submitForm(values, Callback) {
    const { isLoggedIn, token } = this.props.getUser;
    const { show, isSuccess, isError, user_name, user_id } = this.state;
    const response = await fetchApi('assignProjectToUsers', 'POST', values, 200, token);
    if (response.responseBody.status === 0) {
      this.setState({ isError: true, errorMessage: response.responseBody.message });
      let _this = this;
      setTimeout(function () {
        _this.setState({ isError: false });
      }, 4000)
    } else {
      this.setState({ isSuccess: true });
      let _this = this;
      setTimeout(function () {
        _this.setState({ isSuccess: false });
      }, 2000)
      Callback(true);
    }
  }

  render() {
    const { isLoggedIn } = this.props.getUser;
    const { show, isSuccess, isError, user_name, user_id, errorMessage, userDetails, projectDetails } = this.state;
    return (<>
      <Button variant="success" onClick={() => this.openForm()}>Assign Project</Button>

      <Modal show={show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Assign project to user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              user_id: "",
              project_id: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              this.submitForm(values, (returnValue) => {
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
                    Project Assigned successfully .......
                  </Alert>)}
                {isError && (
                  <Alert key={"danger"} variant={"danger"}>
                    {errorMessage}
                  </Alert>)}
                <Form.Group as={Col} controlId="formProject" className="formName">
                  <Form.Label>Project:</Form.Label>
                  <Form.Control
                    as="select"
                    value={values.project_id}
                    onChange={this.onProjectChange}
                  >
                    <option value="">Select Project</option>
                    {projectDetails.map((project) => (
                      <option key={project.project_id} value={project.project_id}>
                        {project.title}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} controlId="formUser" className="formName">
                  <Form.Label>User:</Form.Label>
                  <Form.Control
                    as="select"
                    value={values.user_id}
                    onChange={this.onUserChange}
                  >
                    <option value="">Select User</option>
                    {userDetails.map((user) => (
                      <option key={user.user_id} value={user.user_id}>
                        {user.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <div className="footter">
                  <Button variant="primary" type="submit">
                    Assign
                  </Button>
                  <Button variant="secondary" onClick={this.handleClose}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
    )
  }
}

const mapStateToProps = (state) => ({
  loginUser: state.authReducer.loginUser,
  getUser: state.userReducer.getUser,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(AssignProject);
