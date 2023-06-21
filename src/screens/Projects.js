import { Container, Row, Col } from "react-bootstrap";
import Layout from './Layout';
import Projects from "../components/Home/Project";

const Project = () => {
    return (
      <>
      <Layout>
      <Container>
      <div style={{marginTop:"30px"}}>
        <Row className="justify-content-center">
          <Col >
            <Projects />
          </Col>
        </Row>
        </div>
      </Container>
      </Layout>
      </>
    );
  };
  
  export default Project;