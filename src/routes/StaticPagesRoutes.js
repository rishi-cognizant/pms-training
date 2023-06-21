import { Switch, Route} from "react-router-dom";
import userDetails from "../screens/UserDetails";
import Project from "../screens/Projects";
import Prehome from "../screens/Prehome";
import Home from "../screens/Home";
import Task from "../screens/Task";

const StaticPagesRoutes = () => {
  return (
    <>
      <Switch>
        <Route path="/userdetails" component={userDetails} />
        <Route path="/project" component={Project} />
        <Route path="/prehome" component={Prehome} />
        <Route path="/home" component={Home} />
        <Route path="/taskDetails" component={Task} />
      </Switch>
    </>
  );
};

export default (StaticPagesRoutes);
