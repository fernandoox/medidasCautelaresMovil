import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, Alert, NetInfo, AsyncStorage, Image, ScrollView, KeyboardAvoidingView, Keyboard, ToastAndroid } from 'react-native';
import { Button, Text, Item, Label, Input, Picker, Spinner } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import Display from 'react-native-display';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import GLOBALS from '../Utils/Globals';
import Storage from 'react-native-storage';

export default class Login extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      isLoading: false,
      isConnected: null,
      user: null,
      password: null
    };
  }

  componentDidMount(){
    const {navigate} = this.props.navigation;

    NetInfo.isConnected.addEventListener('connectionChange',this._handleConnectivityChange);
    NetInfo.isConnected.fetch().done(
      (isConnected) => { this.setState({isConnected}); }
    );

    storage.load({
      key: 'evaluadorLogueado',
    }).then((response) => {
      navigate('BuscarImputadoScreen', {evaluador: response});
    }).catch(async (err) => {
      await AsyncStorage.clear();
    })

  }
  
 componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange',this._handleConnectivityChange);
  }

  _handleConnectivityChange = (isConnected) => {
    this.setState({isConnected});
  };

  loginEvaluador = () => {
    const {navigate} = this.props.navigation;
    if(this.state.user != null && this.state.password != null){
      this.setState({isLoading: true});
      instanceAxios.post(`/login?username=${this.state.user}&password=${this.state.password}`)
      .then(async (response) => {
        if (response.data.status == 'ok') {
          ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
          storage.save({
            key: 'evaluadorLogueado',
            data: response.data.evaluador,
          });
          navigate('BuscarImputadoScreen', {evaluador: response.data.evaluador});
          Keyboard.dismiss();
        }
        if (response.data.status == 'error') {
          ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        }
        this.setState({isLoading: false});
      })
      .catch(async (error) => {
        this.setState({isLoading: false});
        //console.warn(JSON.stringify(error))
        Alert.alert('Conexión', 'Sin red celular o servidor no disponible.',[{text: 'OK'}],{ cancelable: false })
      });
    }else{
      ToastAndroid.show('Usuario y contraseña son obligatorios', ToastAndroid.SHORT);
    }
  }

  omitirSesion = () => {
    const {navigate} = this.props.navigation;
    navigate('BuscarImputadoScreen', {carpetaJudicialParam: ""});
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="position">
        <ScrollView keyboardShouldPersistTaps="always" >
          <Grid >
            <Row>
              <Col style={{ paddingHorizontal:15 }}>

                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Image source={require('../assets/img/iconAppRojo.png')} resizeMode="contain"
                  style={{width:150, marginTop:-5}}></Image>
                </View>

                <Text style={{fontSize:18, textAlign:'center', color: COLORS.BACKGROUND_PRIMARY, marginTop:-15, marginBottom:20}}>
                  GESTIÓN DE MEDIDAS CAUTELARES
                </Text>

                <Item rounded style={{marginVertical: 10}}>
                  <Icon active name='user' style={{fontSize: 22, marginHorizontal:10}}/>
                  <Input
                    placeholder="Usuario"
                    onChangeText={(user) => this.setState({user}) }
                    autoCapitalize='none' autoCorrect={false}
                    style={{fontSize: 18}}
                  />
                </Item>

                <Item rounded style={{marginVertical: 10}}>
                  <Icon active name='unlock' style={{fontSize: 22, marginHorizontal:10}}/>
                  <Input placeholder="Contraseña" 
                    onChangeText={(password) => this.setState({password}) }
                    style={{fontSize: 18}} secureTextEntry={true}/>
                </Item>

                <Display enable={this.state.isLoading}
                  enterDuration={300}
                  exitDuration={300}
                  enter="fadeIn"
                  exit="fadeOut">
                  <Spinner color='red' style={{ marginTop:-20, marginBottom:-20}}/>
                </Display>

                <Button full danger
                  disabled={!this.state.isConnected}
                  style={{marginVertical: 10, borderRadius:20, marginTop: 40}}
                  onPress={this.loginEvaluador}>
                    <Text>Iniciar sesión</Text>
                </Button>

                {/*<Button full danger bordered
                  style={{marginVertical: 10, borderRadius:20}}
                  onPress={this.omitirSesion} disabled={this.state.isConnected}>
                    <Text>Omitir</Text>
                </Button>*/}

              </Col>
            </Row>
          </Grid>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
