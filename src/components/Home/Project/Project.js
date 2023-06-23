import { Component } from "react";
import { connect } from "react-redux";
import { fetchApi } from "../../../service/api";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { Alert, Row, Form, Col, Button, Table, Container, Modal } from "react-bootstrap";
import { Typeahead } from 'react-bootstrap-typeahead';
import { Link } from "react-router-dom";
import ReactPaginate from 'react-paginate';
import EditProject from "./EditProject";
import '../../../assets/scss/App.scss';


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
    this.editProjectForm = this.editProjectForm.bind(this);
    this.closeEditForm = this.closeEditForm.bind(this);
    this.handleEditProjectSuccess = this.handleEditProjectSuccess.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.onUserChange = this.onUserChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this); // Add this line
  }

  state = {
    projectsData: [],
    editProjectsData: {},
    user_name: [],
    user_id: 0,
    project_id: 0,
    show: false,
    showPopup: false,
    selectedUser: [],
    currentPage: 1,
    totalPages: null,
    itemsPerPage: 2,
  };

  onUserChange = event => {
    this.setState({ selectedUser: event.target.files[0] });
  };

  async componentDidMount() {
    const { currentPage, itemsPerPage } = this.state;
    // const response = await fetchApi("getUserName", "GET", {}, 200, null);
    // this.setState({ user_name: response.responseBody.data });

    const response1 = await fetchApi("getProjectDetails", "POST", { currentPage, itemsPerPage }, 200, null);
    console.log(response1)
    if (response1.responseBody && response1.responseBody.data.projects) {
      this.setState({

        projectsData: response1.responseBody.data.projects,
        currentPage: response1.responseBody.data.currentPage,
        totalPages: response1.responseBody.data.totalPages
      });
    } else {
      console.log("Error fetching users:", response1);
    }
  }

  async handlePageChange(data) {
    const selectedPage = data.selected;
    const newCurrentPage = selectedPage + 1;
    await this.setState({ currentPage: newCurrentPage });
    await this.componentDidMount();
  }

  async openForm() {
    this.setState({ show: true });
  }

  async handleClose() {
    this.setState({ show: false });
  }

  closeEditForm() {
    this.setState({ showPopup: false });
  }

  async handleEditProjectSuccess(editProjectDetails) {
    let projectsData = this.state.projectsData;
    console.log("projects data", projectsData, "edid projects data", editProjectDetails);
    // for(let data of projectsData){
    //   if(data.project_id == this.state.project_id){
    //     this.setState({})
    //   }
    // }
  }

  async editProjectForm(project_id) {
    const { token } = this.props.getUser;
    const response = await fetchApi("getProjectDetailsBYProjectID", "POST", { project_id: project_id }, 200, token);
    this.setState({ editProjectsData: response.responseBody.data, project_id, showPopup: true });
  }

  async deleteProject(record) {
    const { isLoggedIn, token } = this.props.getUser;
    const response = await fetchApi("deleteProject", "POST", { project_id: record.project_id }, 200, token);
    let records = this.state.projectsData;

    records = records.filter((v, i) => {
      return v.project_id !== record.project_id
    });

    this.setState({ projectsData: records });
    alert(response.responseBody.message);
  }

  async submitForm(values, Callback) {
    const { isLoggedIn, token } = this.props.getUser;
    const response = await fetchApi('addNewProject', 'POST', values, 200, token);
    if (response.responseBody.status === 0) {
      this.setState({ isError: true });
    } else {
      this.setState({ isSuccess: true });
      let _this = this;
      setTimeout(function () {
        _this.setState({ isSuccess: false });
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
            <div style={{ marginTop: "5px" }}></div><Button className="btn btn-warning" onClick={() => this.editProjectForm(item.project_id)} >Edit</Button>
            <div style={{ marginTop: "5px" }}></div><Button className="btn btn-danger" onClick={() => this.deleteProject(item)} size="sm" >Delete</Button>
          </td>
        </tr>
      );
    });
  }

  emptyProjects() {
    return (
      <Alert key={"primary"} variant={"primary"}>
        No Data found for projects
      </Alert>
    )
  }

  render() {
    const { isLoggedIn } = this.props.getUser;
    const { show, isSuccess, isError, user_name, user_id } = this.state;
    if (typeof this.state.projectsData != "undefined" && this.state.projectsData.length > 0)
      return (<>
        <Row>
          <EditProject projectsData={this.state.projectsData} editProjectsData={this.state.editProjectsData} project_id={this.state.project_id} showPopup={this.state.showPopup} closeEditForm={() => { this.closeEditForm() }} handleEditProjectSuccess={() => { this.handleEditProjectSuccess() }} />
          <Col>
            <Button variant="success" onClick={() => this.openForm()}>Add New Project</Button>
            <div style={{ marginTop: "30px" }}>
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
        <Row>
          <Col className="d-flex justify-content-center">
            <ReactPaginate
              breakLabel="..."
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              onPageChange={this.handlePageChange}
              pageRangeDisplayed={2}
              pageCount={this.state.totalPages}

              renderOnZeroPageCount={null}
              containerClassName={"pagination"}
              previousLinkClassName={"pagination__link"}
              nextLinkClassName={"pagination__link"}
              disabledClassName={"pagination__link--disabled"}
              activeClassName={"pagination__link--active"}
            />
            {/* <Pagination
              className="mt-3"
              size="sm"
              activePage={currentPage}
              itemsCountPerPage={this.state.itemsPerPage}
              totalItemsCount={this.state.totalPages * this.state.itemsPerPage}
              pageRangeDisplayed={5}
              onChange={this.handlePageChange}
            /> */}
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
                endDate: "",
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
    else
      return <>
        <Row>
          <Col>
            <Button variant="success" onClick={() => this.openForm()}>Add New Project</Button>
            <div style={{ marginTop: "30px" }}>
              {this.projects()}
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
                endDate: "",
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
        {this.emptyProjects()}</>;

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
