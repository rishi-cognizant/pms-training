import { Switch, Route } from "react-router-dom";
import Login from "../screens/Login";

const AuthRoutes = () => {
  return (
    <>
      <Switch>  
        <Route path="/login" component={Login} />
      </Switch>
    </>
  );
};

export default (AuthRoutes);
