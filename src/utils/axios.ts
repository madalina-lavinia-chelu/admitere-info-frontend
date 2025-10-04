import { HOST_API } from "@/config.global";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${HOST_API}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 1200000,
});

export default axiosInstance;
