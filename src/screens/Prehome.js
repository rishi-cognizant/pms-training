import { Container, Row, Col } from "react-bootstrap";
import Layout from "./Layout";

const Prehome = () => {
    return (
        <>
        <Layout>
      <Container>
        <Row className="justify-content-center">
          <Col md="6">
          <div style={{fontSize : 35,fontWeight: "bold"}}>Please Login to access Home Page</div>
          </Col>
        </Row>
      </Container>
      </Layout>
      </>
    );
  };
  
  export default Prehome;