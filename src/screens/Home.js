import { Container, Row, Col } from "react-bootstrap";
import Layout from "./Layout";
import user from "../assets/images/user.png";
const Home = () => {
  return (
    <>
      <Layout>
        <Container>
          <Row className="justify-content-center">
            <div>
              <div className="p-1 d-flex justify-content-around mt-3">
                <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
                  <div className="text-center pb-1">
                    <h4>Users</h4>
                  </div>
                  <hr />
                  <div className="">
                    <h5>Total:</h5>
                  </div>
                </div>
                <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
                  <div className="text-center pb-1">
                    <h4>Projects</h4>
                  </div>
                  <hr />
                  <div className="">
                    <h5>Total: </h5>
                  </div>
                </div>
                <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
                  <div className="text-center pb-1">
                    <h4>Task</h4>
                  </div>
                  <hr />
                  <div className="">
                    <h5>Total: </h5>
                  </div>
                </div>
              </div>
            </div>
          </Row>
        </Container>
      </Layout>
    </>
  );
};

export default Home;
