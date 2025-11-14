// src/services/api.ts
const API_URL = "http://localhost:4000/api";

export const fetchCars = async () => {
  const res = await fetch(`${API_URL}/cars`);
  const json = await res.json();
  return json.data;
};
