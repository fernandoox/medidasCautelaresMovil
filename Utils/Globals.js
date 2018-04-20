import axios from 'axios';

// Ruta al REST default para peticiones con axios
axios.defaults.baseURL = 'http://10.2.48.179:60523/QuestionsWS/api/';
axios.defaults.timeout = 2000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


// Colores default
export default {
  COLORS: {
    BTN_PRIMARY: "#D66F59",
    BTN_DISABLED: "",
    TEXT_BTN_ACTIVE: "#F58A1F",
    TEXT_BTN_DISABLED: "#757575",
    TEXT_PRIMARY: "#F58A1F",
    TEXT_SECONDARY: "#757575",
    TEXT_WARN: "CRIMSON",
  }
};
