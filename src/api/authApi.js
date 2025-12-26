import axios from "./axios";

export async function loginUser(credentials) {
  const { data } = await axios.post("/login", credentials);
  return data;
}
