import React, { Component } from "react";
import "./assets/scss/App.scss";
import { BrowserRouter } from "react-router-dom";
import IndexRoute from "./routes";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import persist from "./config/store";
import SplashScreen from './screens/SplashScreen';

const persistStore = persist();

function onBeforeLift (){
  return "";
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <Provider store={persistStore.store}>
          <PersistGate
            loading={<SplashScreen />}
            onBeforeLift={onBeforeLift}
            persistor={persistStore.persistor}
          >
            <BrowserRouter basename="/">
            <IndexRoute />
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </div>
    );
  }
}

export default App;
