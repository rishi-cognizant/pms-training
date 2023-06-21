import axios from "axios";
import { connect } from 'react-redux';

export const fetchApi = async (url, method, body, statusCode, token , isFormData) => {
  const BASE_URL = global.ENV.BASE_URL;
  try {
    let headers = {
      'Content-Type': isFormData ? 'multipart/form-data/' : 'application/json',
      'Access-Control-Allow-Origin': "*",
      'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }
    if (token) {
      headers['x-access-token'] = token;
    }

    var response = await axios({
      baseURL: BASE_URL,
      method: method,
      crossDomain:true,
      headers: headers,
      url: url,
      timeout: 30000,
      data: body,
    });

    const result = {
      success: false,
      responseBody: null,
    };

    if (response.status === statusCode) {
      result.success = true;
      const responseBody = response.data;
      if (responseBody.token) {
        result.token = responseBody.token;
      }
    
      result.responseBody = responseBody;
      result.responseHeaders = response.headers;
      return result;
    }
    
    result.responseBody = response.data;
    throw result;
  } catch (error) {
    return error;
  }
};


const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect( mapDispatchToProps)(fetchApi);