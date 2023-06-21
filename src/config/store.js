import {compose, createStore, applyMiddleware} from 'redux';
import {persistStore, persistReducer} from 'redux-persist'
import thunk from "redux-thunk";
import storage from 'redux-persist/lib/storage';
import reducers from "../reducers";

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ["authReducer", "userReducer"]
}

const persistedReducer = persistReducer(persistConfig, reducers);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  let store = createStore(persistedReducer, undefined, composeEnhancers(applyMiddleware(thunk)));
  let persistor = persistStore(store)
  return {store, persistor}
}