import axios from "axios";

const axios_instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default axios_instance;
