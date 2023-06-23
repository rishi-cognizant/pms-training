import { Component } from "react";
import { connect } from "react-redux";
import { fetchApi } from "../../../service/api";
import { Formik } from "formik";
import * as Yup from "yup";
import {Alert, Row, Form, Col, Button, Modal} from "react-bootstrap";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("*Title is required"),
  description: Yup.string()
    .required("*Description required"),
    startDate: Yup.date()
    .required("*Start date is required"),
  endDate: Yup.date()
    .required("*End date is required"),
});


class EditTask extends Component {
  constructor(props) {
    super(props);
    this.onTaskChange = this.onTaskChange.bind(this);
  }

  state = {
    tasksData : [],
    editTasksData: {},
    show: false,
    task_id: 0,
    selectedTask: {
      name: ""
    },
  };

  // On file select (from the pop up)
  onTaskChange = event => {
    this.setState({ selectedTask: event.target.files[0] });
  };

  async componentDidMount() {
    // console.log(this.props);
  }

  async submitForm(values, Callback){
    const {getUser: {isLoggedIn , token}, task_id} = this.props;
    values.task_id = task_id;
        const response = await fetchApi('editTasksData', 'POST', values, 200, token);
        if(response.responseBody.status == 0){
            this.setState({isError: true});
        }else{
            this.setState({ tasksData: response.responseBody.data });
          this.setState({isSuccess: true});
          let _this = this;
          setTimeout(function(){
            _this.setState({isSuccess: false});
          }, 2000)
          Callback(true);
        }
  }

  
  render() {
    const { task_id, showPopup, editTasksData,closeEditForm} = this.props;
    const {show, isSuccess, isError} = this.state;
    return (<>

    <Modal show={showPopup} onHide={() => closeEditForm()}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Formik
            initialValues={{
              title: editTasksData.title,
              description: editTasksData.description,
              startDate: editTasksData.startDate,
              endDate: editTasksData.endDate
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              // When button submits form and form is in the process of submitting, submit button is disabled
              setSubmitting(true);

              // Simulate submitting to database, shows us values submitted, resets form

              this.submitForm(values, (returnValue) => {
                setSubmitting(false);
                resetForm(true);
              });
              
            }}
          >
            {/* Callback function containing Formik state and helpers that handle common form actions */}
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
                  Project edited successfully .......
                </Alert>)}
                {isError && (
                <Alert key={"danger"} variant={"danger"}>
                  Error in editing Project.
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
                <Form.Group controlId="formDesc" className="formName">
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
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => closeEditForm()}>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditTask);
