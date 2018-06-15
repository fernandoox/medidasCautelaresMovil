import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, Alert, NetInfo, Image, ScrollView, KeyboardAvoidingView, Keyboard,  BackHandler, ToastAndroid } from 'react-native';
import { Button, Text, Item, Input, Picker } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import Display from 'react-native-display';
import axios from 'axios';
import Storage from 'react-native-storage';
import GLOBALS from '../Utils/Globals';
import ImputadoTemporal from './ImputadoTemporal'

export default class BuscarImputado extends React.Component {

  constructor(props){
    super(props)
    const { params } = this.props.navigation.state;
    this.state = {
      isLoading: false,
      isConnected: null,
      carpetaJudicial: (params.carpetaJudicialParam == undefined) ? null : params.carpetaJudicialParam,
      imputados: [],
      numImputados: 0,
      selectedImputado: null,
    };
    numBack = 0;
  }

  componentDidMount(){
    NetInfo.isConnected.addEventListener('connectionChange',this._handleConnectivityChange);
    NetInfo.isConnected.fetch().done(
      (isConnected) => { this.setState({isConnected}); }
    );
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    //storage.clearMap();
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange',this._handleConnectivityChange);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    numBack++;
    if (numBack > 1) {
      ToastAndroid.show('Cerró la aplicación.', ToastAndroid.SHORT);
      BackHandler.exitApp();
      numBack = 0;
    }else{
      ToastAndroid.show('Presione otra vez para salir.', ToastAndroid.SHORT);
    }
    return true;
  }

  _handleConnectivityChange = (isConnected) => {
    this.setState({isConnected});
  };

  buscarImputadosByCarpeta = async () => {
    this.setState({isLoading: true});
    axios.get('/imputado/getByCarpetaJudicial', {
      params: {
        idEvaluador: 545,
        numeroCarpeta: this.state.carpetaJudicial
      }
    })
    .then((res) => {
      if (res.data.status == "ok") {
        Keyboard.dismiss();
        this.setState({
          imputados: res.data.imputados,
          numImputados: Object.keys(res.data.imputados).length,
          isLoading: false,
        })
      }
      if (res.data.status == "error") {
        Alert.alert('Error', res.data.message, [{text: 'OK'}], { cancelable: false });
        this.setState({
          imputados: [],
          numImputados: 0,
          isLoading: false,
        })
      }
    })
    .catch(async (error) => {
      console.log("CATCH ERROR: "+error);
      Alert.alert('External error', error, [{text: 'OK'}],{ cancelable: false });
      this.setState({isLoading: false});
    });
  }

  onSelectImputado(value) {
    this.setState({ selectedImputado: value })
  }

  aplicarEntrevistaImputado = () => {
      const {navigate} = this.props.navigation;
      navigate('EntrevistaScreen',
        {
          imputadoParam: this.state.selectedImputado,
          carpetaJudicialParam: this.state.carpetaJudicial,
          tipoCapturaParam: "ONLINE"
        }
      )
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
        <ScrollView keyboardShouldPersistTaps="always">
          <Grid>
            <Row>
              <Col style={{ paddingHorizontal:15 }}>

                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Image source={require('../assets/img/medidasCautelares.png')} resizeMode="contain"
                  style={{width:250, marginTop:-25}}></Image>
                </View>

                <Text style={{textAlign:'center', color: '#D66F59', fontWeight:'bold', marginTop:-30}}>
                  Buscar imputados por Carpeta Judicial:
                </Text>

                <Item style={{marginVertical: 10}}>
                  <Input
                    defaultValue={this.state.carpetaJudicial}
                    placeholder='Carpeta juidicial'
                    placeholderTextColor='#2C4743'
                    autoCapitalize='characters' autoCorrect={false}
                    style={{color:'#2C4743', fontSize: 17}}
                    onChangeText={(carpetaJudicial) => this.setState({carpetaJudicial}) }/>
                </Item>

                {/* Buscar imputados por carpeta solo cuando hay conexión a internet */}
                <Display enable={this.state.isConnected}
                  enterDuration={500}
                  enter="fadeInDown">
                  <Button full light
                    style={{marginVertical: 10, borderRadius:20}}
                    disabled={!this.state.isConnected || this.state.carpetaJudicial == null}
                    onPress={this.buscarImputadosByCarpeta}>
                     <Text>Buscar por Carpeta</Text>
                  </Button>
                </Display>

                {/* Imputado en BD cuando hay imputados en la carpeta y hay conexión a internet */}
                <Display enable={this.state.numImputados > 0 && this.state.isConnected}
                  enterDuration={500}
                  enter="fadeInDown">
                  {/* Picker: Imputados */}
                  <Text>Imputados:</Text>
                  <Picker
                    iosHeader="Seleccionar un imputado"
                    placeholder="Seleccionar un imputado"
                    itemTextStyle={{ fontSize: 17}}
                    supportedOrientations={['portrait','landscape']}
                    selectedValue={this.state.selectedImputado}
                    onValueChange={this.onSelectImputado.bind(this)}
                    mode="dropdown">
                    <Item label="Seleccionar un imputado" value={null} />
                    {
                      this.state.imputados.map((imputado) => {
                        return (
                          <Item
                            label={imputado.nombre + " " + imputado.primerApellido + " " + imputado.segundoApellido}
                            value={imputado} key={imputado.id}/>
                        );
                      })
                    }
                  </Picker>
                  <Button full danger
                    style={{marginVertical: 10, borderRadius:20}}
                    disabled={this.state.selectedImputado == null}
                    onPress={this.aplicarEntrevistaImputado}>
                      <Text>Aplicar entrevista</Text>
                  </Button>
                </Display>

                {/* Imputado temporal cuando no hay conexión a internet */}
                <Display enable={!this.state.isConnected}
                  enterDuration={500}
                  enter="fadeInDown">
                  <ImputadoTemporal carpetaJudicial={this.state.carpetaJudicial} nav={this.props.navigation}/>
                </Display>

              </Col>
            </Row>
          </Grid>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
