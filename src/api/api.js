import axios from "axios";

const API = axios.create({
  baseURL: "https://tifeh-health.onrender.com"
});

export default API;
