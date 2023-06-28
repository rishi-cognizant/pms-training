import { Component } from "react";
import { connect } from "react-redux";
import { fetchApi } from "../../../service/api";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from 'moment';
import { Alert, Row, Form, Col, Button, Modal } from "react-bootstrap";

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

class AssignTask extends Component {

    constructor(props) {
        super(props);
        this.openForm = this.openForm.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.onUserChange = this.onUserChange.bind(this);
        // this.onProjectChange = this.onProjectChange.bind(this);
        this.onTaskChange = this.onTaskChange.bind(this);

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
            task_id: 0,
            selectedTask: [],
            shiva:"shiva",
        };
    }

    async componentDidMount() {
        try {
            const response = await fetchApi("getUserDetails1", "GET", {}, 200, null);
            this.setState({ userDetails: response.responseBody.data });

            // const response2 = await fetchApi("getProjectDetails1", "GET", {}, 200, null);
            // this.setState({ projectDetails: response2.responseBody.data });

            const response3 = await fetchApi("getTaskDetails1", "GET", {}, 200, null);
            this.setState({ taskDetails: response3.responseBody.data });

        } catch (error) {
            console.error("Error occurred while fetching data:", error);
        }
    }

    onTaskChange = event => {
        console.log("task_id ",event.target.value);
        this.setState({ task_id: event.target.value });
    };

    // onProjectChange = event => {        
    //     console.log("project_id ",event.target.value);
    //     this.setState({ project_id: event.target.value });
    // };

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
        const response = await fetchApi('assignTaskToUser', 'POST', values, 200, token);
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
        const { show, isSuccess, isError, user_name, user_id, errorMessage, userDetails, projectDetails, taskDetails } = this.state;
        return (<>
            <Button variant="success" onClick={() => this.openForm()}>Assign Task</Button>

            <Modal show={show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Assign task to user</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={{
                            task_name: "",
                            user_name: "",
                            // project_name: "",
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
                                        Task Assigned successfully .......
                                    </Alert>)}
                                {isError && (
                                    <Alert key={"danger"} variant={"danger"}>
                                        {errorMessage}
                                    </Alert>)}
                                <Form.Group as={Col} controlId="formTask" className="formName">
                                    <Form.Label>Task:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={values.task_name}
                                        onChange={this.onTaskChange}
                                    >
                                        <option value="">Select Task</option>
                                        {taskDetails.map((task) => (
                                            <option key={task.task_id} value={task.task_id}>
                                                {task.title}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                {/* <Form.Group as={Col} controlId="formProject" className="formName">
                                    <Form.Label>Project:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={values.project_name}
                                        onChange={this.onProjectChange}
                                    >
                                        <option value="">Select Project</option>
                                        {projectDetails.map((project) => (
                                            <option key={project.project_id} value={project.project_id}>
                                                {project.title}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group> */}
                                <Form.Group as={Col} controlId="formUser" className="formName">
                                    <Form.Label>User:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={values.user_name}
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

export default connect(mapStateToProps, mapDispatchToProps)(AssignTask);
