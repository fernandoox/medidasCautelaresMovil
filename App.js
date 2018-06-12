import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, YellowBox } from 'react-native';
import { Root } from 'native-base';
import { StackNavigator } from 'react-navigation';
import Login from './Screens/Login';
import BuscarImputado from './Screens/BuscarImputado';
import ImputadoTemporal from './Screens/ImputadoTemporal';
import Entrevista from './Screens/Entrevista';
import GLOBALS from './Utils/Globals';

//Definicion de pantallas activas en la navegacion de la app
const ScreensMedidasCautelares = StackNavigator({
  
  LoginScreen: {
    screen: Login,
    navigationOptions: {
      title: 'Login',
      headerStyle: {backgroundColor: COLORS.BACKGROUND_PRIMARY},
      headerTitleStyle: {color:'white'},
      headerTintColor: 'white',
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
     YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated',
      'Warning: componentWillReceiveProps is deprecated',
      'Warning: componentWillUpdate is deprecated',
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
