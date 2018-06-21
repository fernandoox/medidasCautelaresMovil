import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, Alert, NetInfo, Image, ScrollView, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Button, Text, Item, Label, Input, Picker } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import Display from 'react-native-display';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import GLOBALS from '../Utils/Globals';
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
    NetInfo.isConnected.addEventListener('connectionChange',this._handleConnectivityChange);
    NetInfo.isConnected.fetch().done(
      (isConnected) => { this.setState({isConnected}); }
    );
  }

 componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange',this._handleConnectivityChange);
  }

  _handleConnectivityChange = (isConnected) => {
    this.setState({isConnected});
  };

  loginEvaluador = () => {
    const {navigate} = this.props.navigation;
    navigate('BuscarImputadoScreen',{idEvaludador: 545});
    /*if(this.state.user != null && this.state.password != null){
      console.log("User: " + this.state.user + " - Pass: " + this.state.password);
      this.setState({isLoading: true});
      axios.post('/login', {
        username: this.state.user,
        password: this.state.password,
      })
      .then(async (response) => {
        console.log("Data login: " + JSON.stringify(response.data));
        if (response.data.status == 'ok') {
          Alert.alert('Éxito', response.data.message, [{text: 'OK'}], { cancelable: false })
          navigate('BuscarImputadoScreen',{idEvaludador: 545});
        }
        if (response.data.status == 'error') {
          Alert.alert('Error', response.data.message, [{text: 'OK'}], { cancelable: false })
        }
        this.setState({isLoading: false});
      })
      .catch(async (error) => {
        console.log("ERROR: " + error)
        this.setState({isLoading: false});
        Alert.alert('Conexión', error,[{text: 'OK'}],{ cancelable: false })
      });
    }else{
        Alert.alert('Error', 'Los campos usuario y contraseña son obligatorios', [{text: 'OK'}], { cancelable: false });
    }*/
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
      <KeyboardAvoidingView behavior="position">
        <ScrollView keyboardShouldPersistTaps="always" >
          <Grid >
            <Row>
              <Col style={{ paddingHorizontal:15 }}>

                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Image source={require('../assets/img/iconAppRojo.png')} resizeMode="contain"
                  style={{width:150, marginTop:-5}}></Image>
                </View>

                <Text style={{fontSize:18, textAlign:'center', color: COLORS.BACKGROUND_PRIMARY, marginTop:-15, marginBottom:30}}>
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

                <Button full danger
                  style={{marginVertical: 10, borderRadius:20, marginTop: 30}}
                  onPress={this.loginEvaluador}>
                    <Text>Iniciar sesión</Text>
                </Button>

                <Button full danger bordered
                  style={{marginVertical: 10, borderRadius:20}}
                  onPress={this.loginEvaluador} disabled={this.state.isConnected}>
                    <Text>Omitir</Text>
                </Button>

              </Col>
            </Row>
          </Grid>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
