import { Switch, Route } from "react-router-dom";
import Home from "../screens/Home";

const HomeRoutes = () => {
  return (
    <>
      <Switch>
        <Route exact path='/' component={Home} />
      </Switch>
    </>
  );
};

export default (HomeRoutes);
