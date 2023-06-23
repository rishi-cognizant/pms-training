import { Container, Row, Col } from "react-bootstrap";
import Layout from './Layout';
import Projects from "../components/Home/Project/Project";

const Project = () => {
    return (
      <>
      
      <Container>
      <div style={{marginTop:"30px"}}>
        <Row className="justify-content-center">
          <Col >
            <Projects />
          </Col>
        </Row>
        </div>
      </Container>
      
      </>
    );
  };
  
  export default Project;
