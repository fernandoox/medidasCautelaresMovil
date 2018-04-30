import axios from 'axios';

// Ruta al REST default para peticiones con axios
axios.defaults.baseURL = 'http://10.2.51.161:60523/SSCMC_WS/api/app';
axios.defaults.timeout = 2000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


// Colores default
export default {
  COLORS: {
    BACKGROUND_PRIMARY: "#d9534f",
    TEXT_PRIMARY: "#F58A1F",
    TEXT_SECONDARY: "#757575",
    TEXT_WARN: "CRIMSON",
  }
};
