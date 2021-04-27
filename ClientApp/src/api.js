import axios from "axios";

/**
 * The base URL for API calls.
 */
const API_URL = process.env.REACT_APP_API_URL || "/api";

const instance = axios.create({
  // Axios will automatically prefix all requests with the URL for the API.
  baseURL: API_URL,
});

export default instance;
