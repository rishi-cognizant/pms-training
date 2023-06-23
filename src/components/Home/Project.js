import { Component } from "react";
import { connect } from "react-redux";
import { fetchApi } from "../../service/api";
import { Formik, Field} from "formik";
import * as Yup from "yup";
import {Alert, Row, Form, Col, Button, Table, Container, Modal} from "react-bootstrap";
import { Typeahead } from 'react-bootstrap-typeahead';
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("*Title is required"),
    description: Yup.string()
    .required("*Description required"),
    startDate: Yup.date()
    .required("*Start date is required"),
  endDate: Yup.date()
    .required("*End date is required"),
    // user_name: Yup.string()
    // .required("*user name is required"),
});

class CreateProject extends Component {
  constructor(props) {
    super(props);
    this.projects = this.projects.bind(this);
    this.openForm = this.openForm.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.onUserChange = this.onUserChange.bind(this);
  }

  state = {
    projectsData: [],
    user_name:[],
    user_id:0,
    project_id: 0,
    show: false,
    selectedUser: []
  };

  onUserChange = event => {
    this.setState({ selectedUser: event.target.files[0] });
  };

  async componentDidMount() {
    const response = await fetchApi("getUserName", "GET", {}, 200, null);
    this.setState({ user_name: response.responseBody.data });
    const response1 = await fetchApi("getProjectDetails", "GET", {}, 200, null);
    this.setState({ projectsData: response1.responseBody.data });
  }

  async openForm() {
    this.setState({show: true});
  }

  async handleClose(){
    this.setState({show: false});
  }

  async submitForm(values, Callback){
    const { isLoggedIn , token} = this.props.getUser;
        const response = await fetchApi('addNewProject', 'POST', values, 200, token);
        if(response.responseBody.status === 0){
          this.setState({isError: true});
        }else{
          this.setState({isSuccess: true});
          let _this = this;
          setTimeout(function(){
            _this.setState({isSuccess: false});
          }, 2000)
          Callback(true);
        }

  }

  projects() {
    let projectsData = this.state.projectsData;
    return projectsData.map((item, key) => {
      return (
          <tr key={item.project_id}>
          <td>{item.project_id}</td>
          <td>{item.title}</td>
          <td>{item.description}</td>
          <td>{item.start_date}</td>
          <td>{item.end_date}</td>
          <td></td>
          <td>
            <Link className="btn btn-warning">Edit</Link>&nbsp;
            <Link className="btn btn-danger">Delete</Link>
          </td>
          </tr>
      );
    });
  }
  
  render() {
    const { isLoggedIn } = this.props.getUser;
    const {show, isSuccess, isError, user_name,user_id} = this.state;

    return (<>
    <Row>
      <Col>
        <Button variant="success" onClick={() => this.openForm()}>Add New Project</Button>
        <div style={{marginTop:"30px"}}>
        <Table className="projects-table" striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>description</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>User</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>{this.projects()}</tbody>
              </Table>
              </div>
        </Col>
    </Row>

    <Modal show={show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Formik
            initialValues={{
              title: "",
              description: "",
              startDate: "",
              endDate : "",   
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
                  Project created successfully .......
                </Alert>)}
                {isError && (
                <Alert key={"danger"} variant={"danger"}>
                  Error in creating Project.
                </Alert>)}
                <Form.Group controlId="formTitle" className="formName">
                  <Form.Label>Title :</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Title"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.title}
                    className={touched.title && errors.title ? "error" : null}
                  />
                  {touched.title && errors.title ? (
                    <div className="error-message">{errors.title}</div>
                  ) : null}
                </Form.Group>
                <Form.Group controlId="formDescription" className="formName">
                  <Form.Label>Description :</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    placeholder="Description"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description}
                    className={
                      touched.description && errors.description ? "error" : null
                    }
                  />
                  {touched.description && errors.description ? (
                    <div className="error-message">{errors.description}</div>
                  ) : null}
                </Form.Group>
                <Form.Group controlId="formDate" className="formName">
                  <Form.Label>start Date :</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    placeholder="startDate"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.startDate}
                    className={
                      touched.startDate && errors.startDate ? "error" : null
                    }
                  />
                  {touched.startDate && errors.startDate ? (
                    <div className="error-message">{errors.startDate}</div>
                  ) : null}
                </Form.Group>
                <Form.Group controlId="formDate" className="formName">
                  <Form.Label>End Date :</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    placeholder="endDate"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.endDate}
                    className={
                      touched.endDate && errors.endDate ? "error" : null
                    }
                  />
                  {touched.endDate && errors.endDate ? (
                    <div className="error-message">{errors.endDate}</div>
                  ) : null}
                </Form.Group>

                {/* add autocomplete or typeahead to selct user */}

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
    </>);
    
  }
}

const mapStateToProps = (state) => ({
  loginUser: state.authReducer.loginUser,
  getUser: state.userReducer.getUser,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateProject);
