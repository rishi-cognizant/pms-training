import { Component } from "react";
import { connect } from "react-redux";
import { fetchApi } from "../../../service/api";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import moment from 'moment';
import { Alert, Row, Col, Table, Button, Modal, Form } from "react-bootstrap";
import EditTask from "./EditTask";
import ReactPaginate from 'react-paginate';
import AssignTask from "./AssignTask";

const validationSchema = Yup.object().shape({
  title: Yup.string().max(50)
    .required("*Title is required"),
  description: Yup.string().max(250)
    .required("*Description required"),
  startDate: Yup.date()
    .required("*Start date is required"),
  endDate: Yup.date()
    .required("*End date is required"),
  // user_name: Yup.string()
  // .required("*user name is required"),
});

class TaskDetails extends Component {
  constructor(props) {
    super(props);
    this.tasks = this.tasks.bind(this);
    this.openForm = this.openForm.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleCloseTasks = this.handleCloseTasks.bind(this);
    this.editTaskForm = this.editTaskForm.bind(this);
    this.handleEditTaskSuccess = this.handleEditTaskSuccess.bind(this);
    this.closeEditForm = this.closeEditForm.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this); // Add this line

  }

  state = {
    errorMessage: "",
    tasksData: [],
    editTasksData: {},
    editTaskData: {},
    task_id: 0,
    projectsData: [],
    selectedTask: '',
    show: false,
    showPopup: false,
    showTasks: false,
    currentPage: 1,
    totalPages: null,
    itemsPerPage: 5,
  };

  async componentDidMount() {
    // const response = await fetchApi("getProjectDetails1", "GET", {}, 200, null);
    // this.setState({ tasksData: response.responseBody.data });
    const { currentPage, itemsPerPage } = this.state;
    const response1 = await fetchApi("getTaskDetails", "POST", { currentPage, itemsPerPage }, 200, null);
    // console.log(response1)
    if (response1.responseBody && response1.responseBody.data.tasks) {
      this.setState({
        tasksData: response1.responseBody.data.tasks,
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

  handleChange = event => {
    this.setState({ selectedTask: event.target.files[0] });

  };


  async openForm() {
    this.setState({ show: true });
  }

  async handleClose() {
    this.setState({ show: false });
  }

  closeEditForm() {
    this.setState({ showPopup: false });
  }

  async handleEditTaskSuccess(editTaskData) {
    const updatedTasksData = this.state.tasksData.map((task) => {
      if (task.task_id === editTaskData.task_id) {
        return editTaskData;
      }
      return task;
    });

    this.setState({ tasksData: updatedTasksData });
  }

  async editTaskForm(task_id) {
    const { token } = this.props.getUser;
    const response = await fetchApi("getTaskDetailsByTaskID", "POST", { task_id: task_id }, 200, token);
    this.setState({ editTasksData: response.responseBody.data, task_id, showPopup: true });
  }

  async deleteTask(record) {
    const { isLoggedIn, token } = this.props.getUser;
    const response = await fetchApi("deleteTask", "POST", { task_id: record.task_id }, 200, token);
    let records = this.state.tasksData;

    records = records.filter((v, i) => {
      return v.task_id !== record.task_id
    });

    this.setState({ tasksData: records })
  }

  async submitForm(values, Callback) {
    const { isLoggedIn, token } = this.props.getUser;
    const response = await fetchApi('addNewTask', 'POST', values, 200, token);
    if (response.responseBody.status === 0) {
      this.setState({ isError: true, errorMessage: response.responseBody.message });
      let _this = this;
      setTimeout(function () {
        _this.setState({ isError: false });
      }, 4000)
    } else {
      const { currentPage, itemsPerPage } = this.state;
      const response1 = await fetchApi("getTaskDetails", "POST", { currentPage, itemsPerPage }, 200, null);
      // console.log(response1)
      if (response1.responseBody && response1.responseBody.data.tasks) {
        this.setState({

          tasksData: response1.responseBody.data.tasks,
          currentPage: response1.responseBody.data.currentPage,
          totalPages: response1.responseBody.data.totalPages
        });
      } else {
        console.log("Error fetching users:", response1);
      }
      this.setState({ isSuccess: true, show: false });
      let _this = this;
      setTimeout(function () {
        _this.setState({ isSuccess: false });
      }, 2000)
      Callback(true);
    }

  }

  async handleCloseTasks() {
    this.setState({ showTasks: false });

  };

  tasks() {
    let tasksData = this.state.tasksData;
    // console.log("tasks",tasksData);
    return tasksData.map((item, key) => {
      let startDate = moment.utc(item.start_date).toDate();
      startDate = moment(startDate).local().format('DD-MM-YYYY');
      let endDate = moment.utc(item.end_date).toDate();
      endDate = moment(endDate).local().format('DD-MM-YYYY');
      return (
        <tr key={item.task_id}>
          <td>{item.task_id}</td>
          <td>{item.title}</td>
          <td>{item.description}</td>
          <td>{startDate}</td>
          <td>{endDate}</td>
          <td>
            <Button className="btn btn-warning edit" onClick={() => this.editTaskForm(item.task_id)} >Edit Task</Button>
            <Button className="btn btn-danger delete" onClick={() => this.deleteTask(item)} size="sm" >Delete</Button>
          </td>
        </tr>

      );
    });
  }

  emptyUsers() {
    return (
      <Alert key={"primary"} variant={"primary"}>
        No Data found for tasks
      </Alert>
    )
  }

  render() {
    const { isLoggedIn } = this.props.getUser;
    const { show, isSuccess, isError, errorMessage } = this.state;
    if (typeof this.state.tasksData != "undefined" && this.state.tasksData.length > 0)
      return (<>
        <Row>
          <EditTask editTasksData={this.state.editTasksData} task_id={this.state.task_id} showPopup={this.state.showPopup} closeEditForm={this.closeEditForm} onHandleEditTaskSuccess={this.handleEditTaskSuccess} />
            <Col>
            <div className="header">
              <Button variant="success" onClick={() => this.openForm()}>Add New Task</Button>
              <AssignTask />
            </div>
            <div style={{ marginTop: "30px" }}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>{this.tasks()}</tbody>
                </Table>
              </div>

              <Col className="d-flex justify-content-center">
                <ReactPaginate
                  breakLabel="..."
                  previousLabel={"← Previous"}
                  nextLabel={"Next →"}
                  onPageChange={this.handlePageChange}
                  pageRangeDisplayed={5}
                  pageCount={this.state.totalPages}

                  renderOnZeroPageCount={null}
                  containerClassName={"pagination"}
                  previousLinkClassName={"pagination__link"}
                  nextLinkClassName={"pagination__link"}
                  disabledClassName={"pagination__link--disabled"}
                  activeClassName={"pagination__link--active"}
                />
              </Col>
            </Col>
        </Row>

        <Modal show={show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Task</Modal.Title>
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
                      Task created successfully .......
                    </Alert>)}
                  {isError && (
                    <Alert key={"danger"} variant={"danger"}>
                      {errorMessage}
                    </Alert>)}
                  <Form.Group controlId="formTitle" className="formName">
                    <Form.Label>Title :</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      placeholder="Please enter title of the task"
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
                      as="textarea"
                      name="description"
                      placeholder="Please enter description of the task"
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
                    <Form.Label>Start Date :</Form.Label>
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
                  <div className="footter">
                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                    <Button variant="secondary" onClick={this.handleClose}>
                      Close
                    </Button>
                  </div>
                </form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
      </>);
    else
      return <>
        <Row>
          <Col>
            <Button variant="success" onClick={() => this.openForm()}>Add New Task</Button>
            <div style={{ marginTop: "30px" }}>
              {this.tasks()}
            </div>
          </Col>
        </Row>

        <Modal show={show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Task</Modal.Title>
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
                      Task created successfully .......
                    </Alert>)}
                  {isError && (
                    <Alert key={"danger"} variant={"danger"}>
                      {errorMessage}
                    </Alert>)}
                  <Form.Group controlId="formTitle" className="formName">
                    <Form.Label>Title :</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      placeholder="Please enter title of the task"
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
                      placeholder="Please enter description of the task"
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
                    <Form.Label>Start Date :</Form.Label>
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

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetails);
