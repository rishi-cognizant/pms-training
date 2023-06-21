import { Container, Row, Col } from "react-bootstrap";
import LoginForm from "../components/Auth/LoginForm";
import Layout from "./Layout";

const Login = () => {
  return (
    <>
    <Layout>
      <Container >
        <Row >
          <Col className="login_form">
            <LoginForm />
          </Col>
        </Row>
      </Container>
      </Layout>
    </>
  );
};

export default Login;
