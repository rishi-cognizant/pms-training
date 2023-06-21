import { Component } from "react";
import { connect } from "react-redux";
import { fetchApi } from "../../service/api";
import { Alert, Row, Col, Table, Button, Modal, Form } from "react-bootstrap";

class TaskDetails extends Component {
  constructor(props) {
    super(props);
    this.tasks = this.tasks.bind(this);
    this.handleCloseTasks = this.handleCloseTasks.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }

  state = {
    tasksData: [],
    task_id: 0,
    projectsData:[],
    selectedProject: '',
    showPopup: false,
    showTasks: false,
  };

  async componentDidMount() {
    const response = await fetchApi("getTaskDetails", "GET", {}, 200, null);
    this.setState({ tasksData: response.responseBody.data });
  }
  handleChange = event => {
    this.setState({ selectedProject: event.target.files[0] });

  };
  
  async handleCloseTasks () {
    this.setState({ showTasks: false});

  };

  tasks() {
    let tasksData = this.state.tasksData;
    return tasksData.map((item, key) => {
      return (
          <tr key={item.task_id}>
          <td>{item.task_id}</td>
          <td>{item.title}</td>
          <td>{item.description}</td>
        </tr>

      );
    });
  }

  emptyUsers() {
    return (
      <Alert key={"primary"} variant={"primary"}>
        No Data found for users
      </Alert>
    )
  }

  render() {
    const { isLoggedIn } = this.props.getUser;
    const { show, isSuccess, isError } = this.state;
    if (typeof this.state.tasksData != "undefined" && this.state.tasksData.length > 0)
      return (<>
        <Row>
          <div> Select User to show Tasks</div>
          
          {/* add autocomplete or typeahead to selct user */}

          {/* add a condition to get only selected user tasks details */}

          <div style={{ marginTop: "30px" }}>
          <Col>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>description</th>
                  </tr>
                </thead>
                <tbody>{this.tasks()}</tbody>
              </Table>
            </Col>
          </div>
        </Row>
      </>);
    else
      return <>{this.emptyUsers()}</>;
  }
}

const mapStateToProps = (state) => ({
  loginUser: state.authReducer.loginUser,
  getUser: state.userReducer.getUser,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetails);
