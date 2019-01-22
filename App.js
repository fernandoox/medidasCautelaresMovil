import React from 'react';
import { SQLite, Font } from 'expo';
import { View, ActivityIndicator, Alert } from 'react-native';
import { Root } from 'native-base';
import { StackNavigator } from 'react-navigation';
import Login from './Screens/Login';
import BuscarImputado from './Screens/BuscarImputado';
import Entrevista from './Screens/Entrevista';
import GLOBALS from './Utils/Globals';
import './Utils/ReactotronConfig'
import ignoreWarnings from 'react-native-ignore-warnings'; 
import Database from './Utils/Database';
import Sentry from 'sentry-expo';
// Remove this once Sentry is correctly setup.
Sentry.enableInExpoDevelopment = true;
Sentry.config('https://11eec907408e4573a126c5485ed789b0@sentry.io/1319007').install();

//Definicion de pantallas activas en la navegacion de la app
const ScreensMedidasCautelares = StackNavigator({
  LoginScreen: {
    screen: Login,
    navigationOptions: {
      title: 'Login',
      headerStyle: {backgroundColor: COLORS.BACKGROUND_PRIMARY},
      headerTitleStyle: {color:'white'},
      headerTintColor: 'white',
      headerLeft: null,
    },
  },
  
  BuscarImputadoScreen: {
    screen: BuscarImputado,
    navigationOptions: {
      title: 'Buscar imputado',
      headerStyle: {backgroundColor: COLORS.BACKGROUND_PRIMARY},
      headerTitleStyle: {color:'white'},
      headerTintColor: 'white',
      headerLeft: null, // Quita el boton de regresar (pero el backButton de Android sigue, se deactiva abajo)
    },
  },

  EntrevistaScreen: {
    screen: Entrevista,
    navigationOptions: {
      title: 'Entrevista',
      headerStyle: {backgroundColor: COLORS.BACKGROUND_PRIMARY},
      headerTitleStyle: {color:'white'},
      headerTintColor: 'white',
    },
  },
})

const AppNavigation = () => (
  <ScreensMedidasCautelares />
);

export default class App extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
   }

    componentDidMount(){
      //Sentry.captureException(new Error('Error simulado para Sentry - Medidas App!'))
      /*Database.transaction(tx => {
        tx.executeSql(
          'DROP TABLE entrevistasOffline;'
        );
      });*/

      Database.transaction(tx => {
        tx.executeSql(
          'create table if not exists entrevistasOffline (id integer primary key not null, tipo_captura text, carpeta_investigacion text, carpeta_judicial text, data text, id_imputado integer, fecha_asignacion varchar, lista_para_envio integer);'
        );
      });

      Database.transaction(
        tx => {
           tx.executeSql('ALTER TABLE entrevistasOffline ADD nombre_imputado VARCHAR'); 
           tx.executeSql('ALTER TABLE entrevistasOffline ADD ap_pat_imputado VARCHAR'); 
           tx.executeSql('ALTER TABLE entrevistasOffline ADD ap_mat_imputado VARCHAR'); 
        },
        (err) => { console.log("Alter table error", err) },
        this.update
     );
      
      
      ignoreWarnings([
         'Warning: componentWillMount is deprecated',
         'Warning: componentWillReceiveProps is deprecated',
         'Warning: componentWillUpdate is deprecated',
         'Setting a timer'
      ]);
    }
   
  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading: false });
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{flex: 1, alignItems:'center', justifyContent:'center'}}>
          <ActivityIndicator size="large"/>
        </View>
      );
    }
    return (
      <Root>
        <AppNavigation/>
      </Root>
    );
  }
}
