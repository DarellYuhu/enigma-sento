import axios from "axios";

const SentoClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_API,
  headers: {
    "Content-Type": "application/json",
  },
});

export { SentoClient };
