import { Container, Row, Col } from "react-bootstrap";
import Layout from "./Layout";
import Users from "../components/Home/Users";

const userDetails = () => {
  return (
    <>
    <Layout>
      <Container>
        <Row className="justify-content-center">
          <Col md="5">
            Welcome to User page
          </Col>
        </Row>
        <Users />
        <div style={{marginTop:"30px"}}></div>
      </Container>
      </Layout>
    </>
  );  };
  
  export default userDetails;