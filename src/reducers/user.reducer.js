import {combineReducers} from 'redux';

const getUser = (state = {}, action) => {
  switch (action.type) {
    case 'GET_USER_LOADING':
      return {
        isLoading: true,
        isLoggedIn: false,
        isError: false,
        isSuccess: false,
        userDetails: null,
        token: null,
        errors: null,
      };
    case 'GET_USER_SUCCESS':
      return {
        isLoading: false,
        isLoggedIn: true,
        isError: false,
        isSuccess: true,
        userDetails: action.userDetails,
        token: action.token,
        errors: null,
      };
    case 'GET_USER_FAIL':
      return {
        isLoading: false,
        isLoggedIn: false,
        isError: true,
        isSuccess: false,
        userDetails: null,
        token: null,
        errors: action.errorDetails,
      };
    default:
      return state;
  }
};

export default combineReducers({
  getUser,
});
