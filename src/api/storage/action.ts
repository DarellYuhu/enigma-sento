import axios from "axios";

export const uploadFile = (url: string, file: File) => {
  return axios.put(url, file);
};
