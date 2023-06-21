import { Container, Row, Col } from "react-bootstrap";
import Layout from './Layout';
import TaskDetails from "../components/Home/TaskDetails";

const Task = () => {
    return (
      <>
      <Layout>
      <Container>
      <div style={{marginTop:"30px"}}>
        <Row className="justify-content-center">
          <Col >
            <TaskDetails />
          </Col>
        </Row>
        </div>
      </Container>
      </Layout>
      </>
    );
  };
  
  export default Task;