import axios from 'axios';

const googleMapsAPI = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api',
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    key: process.env.GOOGLE_MAPS_API_KEY,
  },
});

export default googleMapsAPI;
