import { Component } from "react";
import { connect } from "react-redux";
import { fetchApi } from "../../../service/api";
import { Formik } from "formik";
import * as Yup from "yup";
import { Alert, Row, Form, Col, Button, Modal } from "react-bootstrap";

const validationSchema = Yup.object().shape({
    email: Yup.string().max(100)
        .email("*Must be a valid email address")
        .required("*Email is required"),
    name: Yup.string().matches(/^[A-Za-z]+$/, 'Name must contain only alphabetic characters').min(3).max(50)
        .required("*name is required"),
    mobile: Yup.string().matches(/^[0-9]{10}$/, '*must be 10 digits')
        .required("*Mobile number is required"),
});


class EditUser extends Component {
    constructor(props) {
        super(props);
        this.onUserChange = this.onUserChange.bind(this);
    }

    state = {
        errorMessage: "",
        usersData: [],
        editUsersData: {},
        show: false,
        user_id: 0,
        selectedUser: {
            name: ""
        },
    };

    // On file select (from the pop up)
    onUserChange = event => {
        this.setState({ selectedUser: event.target.files[0] });
    };

    async componentDidMount() {
        // console.log(this.props);
    }

    async submitForm(values, Callback) {
        const { getUser: { isLoggedIn, token }, user_id } = this.props;
        values.user_id = user_id;
        const response = await fetchApi('editUserDetails', 'POST', values, 200, token);
        if (response.responseBody.status == 0) {
            this.setState({ isError: true, errorMessage: response.responseBody.message });
            let _this = this;
            setTimeout(function () {
                _this.setState({ isError: false });
            }, 4000)
        } else {
            const updatedUserData = { ...this.props.editUsersData, ...values };
            this.props.onHandleEditUserSuccess(updatedUserData);
            this.setState({ isSuccess: true });
            let _this = this;
            setTimeout(function () {
                _this.setState({ isSuccess: false });
            }, 2000)
            Callback(true);
        }
    }


    render() {
        const { user_id, showPopup, editUsersData, closeEditUserForm, onHandleEditUserSuccess } = this.props;
        const { show, isSuccess, isError, errorMessage } = this.state;
        return (<>

            <Modal show={showPopup} onHide={() => closeEditUserForm()}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={{
                            name: editUsersData.name,
                            email: editUsersData.email,
                            mobile: editUsersData.mobile
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
                                        User details edited successfully .......
                                    </Alert>)}
                                {isError && (
                                    <Alert key={"danger"} variant={"danger"}>
                                        {errorMessage}
                                    </Alert>)}
                                <Form.Group controlId="formname" className="formName">
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
                                        type="text"
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
                                    <Form.Label>Mobile :</Form.Label>
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
                                {/* <Form.Group controlId="formDate" className="formName">
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
                </Form.Group> */}
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </form>
                        )}
                    </Formik>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => closeEditUserForm()}>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditUser);
