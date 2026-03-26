import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5163", // backend post
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export function setAuthRole(role: string | null) {
  if (role) {
    api.defaults.headers.common["Authorization"] = `Bearer ${role}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}
