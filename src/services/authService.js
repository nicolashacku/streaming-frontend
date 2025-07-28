import axios from 'axios';

const API_URL = 'https://streaming-backend-gl1f.onrender.com/api/auth';

export async function login(email, password) {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
}
