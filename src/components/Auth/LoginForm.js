import { Formik } from "formik";
import * as Yup from "yup";
import React, { Component } from "react";
import { Button, Col, Form, Row, Alert } from "react-bootstrap";
import { connect } from "react-redux";
import { loginUser } from "../../actions/auth.actions";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("*Must be a valid email address")
    .required("*Email is required"),
  password: Yup.string()
    .min(6, "*Password must have at least 6 characters")
    .required("*Password required"),
});

class LoginForm extends Component {
  state ={
    showSuccess: false
  }
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const {isLoading, isError, isSuccess} = this.props.loginUser;
  }

  async submitForm(values){
    const response = await this.props.dispatch(loginUser(values));
  }

  render() {
    const {isLoading, isError, isSuccess} = this.props.loginUser;
    return (
      <Row>
        <Col>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {

              setSubmitting(true);

              this.submitForm(values, (returnValue) => {
                setSubmitting(false);
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
              <form onSubmit={handleSubmit} className="mx-auto formLogin">
                {isLoading && (<div className="loadingBlocker"><div>Loading</div></div>)}
                {isSuccess && (
                <Alert key={"primary"} variant={"primary"}>
                  Login successfully .......
                </Alert>)}
                {isError && (
                <Alert key={"danger"} variant={"danger"}>
                  Authentication failed.
                </Alert>)}
                <Form.Group controlId="formEmail" className="formName">
                  <Form.Label>Email :</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    className={touched.email && errors.email ? "error" : null}
                  />
                  {touched.email && errors.email ? (
                    <div className="error-message">{errors.email}</div>
                  ) : null}
                </Form.Group>
                <Form.Group controlId="formPassword" className="formName">
                  <Form.Label>Password :</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    className={
                      touched.password && errors.password ? "error" : null
                    }
                  />
                  {touched.password && errors.password ? (
                    <div className="error-message">{errors.password}</div>
                  ) : null}
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </form>
            )}
          </Formik>
        </Col>
      </Row>
    );
  }
}


const mapStateToProps = (state) => ({
  loginUser: state.authReducer.loginUser,
  getUser: state.userReducer.getUser,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);

