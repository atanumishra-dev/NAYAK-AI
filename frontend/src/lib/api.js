import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const analyzeAdvisory = async (data) => {
  const response = await axios.post(`${API_URL}/advisory/analyze`, data);
  return response.data;
};
