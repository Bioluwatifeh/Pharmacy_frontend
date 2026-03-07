import axios from "axios";

const API = axios.create({
  baseURL: "https://pharmacybackend-production-3e54.up.railway.app/api"
});

export default API;