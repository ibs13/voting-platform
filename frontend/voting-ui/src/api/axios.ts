import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5163", // backend post
});
