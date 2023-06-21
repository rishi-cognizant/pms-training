import { fetchApi } from '../service/api';

// Login User
export const loginUser = (values) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: 'LOGIN_USER_LOADING',
      });
      const response = await fetchApi('loginUsingEmail', 'POST', values, 200, null);
      if (response.responseBody && response.responseBody.status === 1) {
        
        dispatch({
          type: 'LOGIN_USER_SUCCESS',
        });
      
        dispatch({
          type: 'GET_USER_SUCCESS',
          token: response.responseBody.token,
          });
        return response.responseBody;
      } else {
        dispatch({
          type: 'LOGIN_USER_FAIL',
          errorDetails: response.responseBody.data.token,
        });
        
        return response.responseBody;
      }
    } catch (error) {
      console.log("catch");
      dispatch({
        type: 'LOGIN_USER_FAIL',
        errorDetails: error.responseBody,
      });
      return error;
    }
  };
};

// Logout User

export const logoutUser = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        userReducer: {
          getUser: { token },
        },
      } = state;
      dispatch({
        type: 'USER_LOGGED_OUT_SUCCESS',
      });
    } catch (e) {
      console.log('logout dispatch error', e);
    }
  };
};
