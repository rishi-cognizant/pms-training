import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Layout from "./Layout";
import { fetchApi } from "../service/api";
import img1 from "../assets/images/userhome.png";
import img2 from "../assets/images/project.png";
import img3 from "../assets/images/task.png";

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      usersCount: null,
      projectsCount: null,
      tasksCount: null
    };
  }
  
  async componentDidMount() {
    try {
      const response = await fetchApi("getUsersCount", "GET", {}, 200, null);
      this.setState({ usersCount: response.responseBody.data.users_count });

      const response2 = await fetchApi("getProjectsCount", "GET", {}, 200, null);
      this.setState({ projectsCount: response2.responseBody.data.projects_count });

      const response3 = await fetchApi("getTasksCount", "GET", {}, 200, null);
      this.setState({ tasksCount: response3.responseBody.data.tasks_count });

    } catch (error) {
      console.error("Error occurred while fetching data:", error);
    }
  }

  render() {
    return (
      <>
        <Layout>
          <Container>
            <Row className="justify-content-center">
              <div className="mt-2">
                <h4 className="w3-container w3-animate-right  mt-2">Hello Admin! </h4>
                <div className="p-1 d-flex justify-content-around">
                  <div className="px-3 pt-2 pb-3 border shadow-sm p-3 mb-5 bg-white rounded w-25 ">
                    <img src={img1} alt="user" style={{ width: "auto", height: "auto" }} />
                    <div className="text-center pb-1">
                      <h4>Users</h4>
                    </div>
                    <hr />
                    <div className="">
                      <h1>Total: {this.state.usersCount}</h1>
                    </div>
                  </div>
                  <div className="px-3 pt-2 pb-3 border shadow-sm p-3 mb-5 bg-white rounded w-25">
                    <img src={img2} alt="user" style={{ width: "auto", height: "auto" }} />
                    <div className="text-center pb-1">
                      <h4>Projects</h4>
                    </div>
                    <hr />
                    <div className="">
                      <h1>Total: {this.state.projectsCount}</h1>
                    </div>
                  </div>
                  <div className="px-3 pt-2 pb-3 border shadow-sm p-3 mb-5 bg-white rounded w-25">
                    <img src={img3} alt="user" style={{ width: "auto", height: "auto" }} />
                    <div className="text-center pb-1">
                      <h4>Task</h4>
                    </div>
                    <hr />
                    <div className="">
                      <h1>Total: {this.state.tasksCount}</h1>
                    </div>
                  </div>
                </div>
              </div>
            </Row>
          </Container>
        </Layout>
      </>
    );
  }
  
}
export default Home;
