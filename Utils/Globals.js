import axios from 'axios';
import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

// Ruta al REST default para peticiones con axios
axios.defaults.baseURL = 'http://10.2.48.179:60523/SSCMC_WS/api/app';
axios.defaults.timeout = 3000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';



global.storage = new Storage({
	// maximum capacity, default 1000 
	size: 1000,

	// Use AsyncStorage for RN, or window.localStorage for web.
	// If not set, data would be lost after reload.
	storageBackend: AsyncStorage,
	
	// expire time, default 1 day(1000 * 3600 * 24 milliseconds).
	// can be null, which means never expire.
	defaultExpires: 1000 * 3600 * 24,
	
	// cache data in the memory. default is true.
	enableCache: true,
	
	// if data was not found in storage or expired,
	// the corresponding sync method will be invoked and return 
	// the latest data.
	sync : {
		// we'll talk about the details later.
	}
})

// Colores default
export default {
  COLORS: {
    BACKGROUND_PRIMARY: "#d9534f",
    TEXT_PRIMARY: "#F58A1F",
    TEXT_SECONDARY: "#757575",
    TEXT_WARN: "#ed143d",
  }
};


