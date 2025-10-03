import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gardenflask.fly.dev/api/'});

export default api;
