import axios from 'axios';
import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';


/*-------------------------------------------------------------------------------------*/
// REST API with Axios config
let urlDev  = 'http://172.19.40.61:8080/SSCMC_WS-dev/api/app';
let urlProd = 'http://172.19.40.61:8080/SSCMC_WS/api/app';
var initAxios = axios.create({
    baseURL: urlDev,
    timeout: 3000
});
initAxios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
global.instanceAxios = initAxios;
/*-------------------------------------------------------------------------------------*/


/*-------------------------------------------------------------------------------------*/
// Local storage config
global.storage = new Storage({
	// maximum capacity, default 1000 
	size: 2000,
	// Use AsyncStorage for RN, or window.localStorage for web.
	// If not set, data would be lost after reload.
	storageBackend: AsyncStorage,
	// expire time, default 1 day(1000 * 3600 * 24 milliseconds).
	// can be null, which means never expire.
	defaultExpires: null,
	// cache data in the memory. default is true.
	enableCache: false,
	// if data was not found in storage or expired,
	// the corresponding sync method will be invoked and return 
	// the latest data.
	sync : {
		// we'll talk about the details later.
	}
})
/*-------------------------------------------------------------------------------------*/


/*-------------------------------------------------------------------------------------*/
// Colores default
global.COLORS = {
    BACKGROUND_PRIMARY: 	"#d9534f",
    TEXT_PRIMARY: 			"#5c5c5c",
    TEXT_SECONDARY: 		"#464646",
	TEXT_WARN: 				"#ed143d",
	
	LIGHT_SUCCESS: 			"#44C4A1",
	LIGHT_WARN: 			"#ffa500",
	LIGHT_ERROR: 			"#E56353"
}
/*-------------------------------------------------------------------------------------*/


/*-------------------------------------------------------------------------------------*/
// Steps config
global.labelsSteps = ["Generales","Domicilios","Familia","Estudios","Ocupación", "Sustancias"];
global.customStylesSteps = {
      stepIndicatorSize: 30,
      currentStepIndicatorSize:32,
      separatorStrokeWidth: 1,
      currentStepStrokeWidth: 2,
      stepStrokeCurrentColor: COLORS.BACKGROUND_PRIMARY,
      stepStrokeWidth: 2,
      stepStrokeFinishedColor: COLORS.BACKGROUND_PRIMARY,
      stepStrokeUnFinishedColor: '#aaaaaa',
      separatorFinishedColor: COLORS.BACKGROUND_PRIMARY,
      separatorUnFinishedColor: '#aaaaaa',
      stepIndicatorFinishedColor: COLORS.BACKGROUND_PRIMARY,
      stepIndicatorUnFinishedColor: '#ffffff',
      stepIndicatorCurrentColor: '#ffffff',
      stepIndicatorLabelFontSize: 12,
      currentStepIndicatorLabelFontSize: 12,
      stepIndicatorLabelCurrentColor: COLORS.BACKGROUND_PRIMARY,
      stepIndicatorLabelFinishedColor: '#ffffff',
      stepIndicatorLabelUnFinishedColor: '#aaaaaa',
      labelColor: '#999999',
      labelSize: 11,
      currentStepLabelColor: COLORS.BACKGROUND_PRIMARY
}
/*-------------------------------------------------------------------------------------*/




