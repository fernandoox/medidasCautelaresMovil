import React from 'react';
import { Font } from 'expo';
import { AsyncStorage, View, ActivityIndicator, TouchableOpacity, Alert, NetInfo, Image, ScrollView, KeyboardAvoidingView, Keyboard,  BackHandler, ToastAndroid } from 'react-native';
import { Button, Text, Card, CardItem, ListItem, CheckBox, Body, Item, Input, Picker } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import Display from 'react-native-display';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import Storage from 'react-native-storage';
import GLOBALS from '../Utils/Globals';
import CONSTANTS from '../Utils/ConstantsNG';
import ImputadoTemporal from './ImputadoTemporal'

export default class BuscarImputado extends React.Component {

  constructor(props){
    super(props)
    const { params } = this.props.navigation.state;
    this.state = {
      isLoading: false,
      isConnected: null,
      carpetaJudicial: (params.carpetaJudicialParam != undefined) ? params.carpetaJudicialParam : null,
      evaluador: (params.evaluador !=  undefined || params.evaluador !=  null) ? params.evaluador : null,
      imputados: [],
      numImputados: 0,
      selectedImputado: null,
      buscarAsignados: true,
      buscarConcluidos: false,
      jsonEntrevistaPendiente: null,
      entrevistaPendienteGuardada: false
    };
    numBack = 0;
  }

  componentDidMount(){
    NetInfo.isConnected.addEventListener('connectionChange',this._handleConnectivityChange);
    NetInfo.isConnected.fetch().done(
      (isConnected) => { 
        this.setState({isConnected}); 
        if (isConnected) {
          this.enviarEntrevistaPendiente();
        }
      }
    );
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
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
    this.setState({isConnected}, () => {
      if (this.state.isConnected && !this.state.entrevistaPendienteGuardada) {
        this.enviarEntrevistaPendiente();
      }
    });
  };

  _selectCheckBoxSearchAsignados = () => {
    this.setState({ buscarAsignados: !this.state.buscarAsignados });
  }

  _selectCheckBoxSearchConcluidos = () => {
    this.setState({ buscarConcluidos: !this.state.buscarConcluidos });
  }
  
  buscarImputadosByCarpeta = async () => {
    const {navigate} = this.props.navigation;
    if(this.state.evaluador){
      this.setState({isLoading: true});
      axios.get('/imputado/getByCarpetaJudicial', {
        params: {
          idEvaluador: this.state.evaluador.id,
          numeroCarpeta: this.state.carpetaJudicial,
          buscarAsignados: this.state.buscarAsignados,
          buscarConcluidos: this.state.buscarConcluidos
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
          Alert.alert('Sin resultados', res.data.message, [{text: 'OK'}], { cancelable: false });
          this.setState({
            imputados: [],
            numImputados: 0,
            isLoading: false,
          })
        }
      })
      .catch(async (error) => {
        Alert.alert('Sin red', error, [{text: 'OK'}],{ cancelable: false });
        this.setState({isLoading: false});
      });
    }else{
      Alert.alert('Evaluador', "No ha iniciado sesión un evaluador.", [{text: 'OK'}],{ cancelable: false });
      navigate('LoginScreen');
    }
  }

  enviarEntrevistaPendiente = () => {
    if (!this.state.entrevistaPendienteGuardada) {
      this.setState({entrevistaPendienteGuardada: true});
      storage.load({
        key: 'entrevistaPendiente',
      }).then((responseStorage) => {
        let imputadoEntrevistaPendiente = responseStorage.imputado.nombre + " "+ responseStorage.imputado.nombre + " " + responseStorage.imputado.nombre;
        ToastAndroid.show('Enviando entrevista pendiente para: ' + imputadoEntrevistaPendiente,  ToastAndroid.LONG);
        this.setState({jsonEntrevistaPendiente: responseStorage}, () => {
          this._reqGuardarEntrevista(imputadoEntrevistaPendiente);
        });
      }).catch(err => {
        this.setState({jsonEntrevistaPendiente: null});
        //console.log("ENTREVISTA PENDIENTE: "+err.message);
      })
    }
  }

  _reqGuardarEntrevista = (paramImputado) => {
    console.log("Entrevista pendiente to save: " + JSON.stringify(this.state.jsonEntrevistaPendiente));
    axios({
      method: 'POST',
      url: '/evaluacion/update',
      data: this.state.jsonEntrevistaPendiente,
    })
    .then((res) => {
      console.log("Res request to save pendding... " + JSON.stringify(res.data));
      if(res.data.status == "ok"){
        Alert.alert('Guardado', res.data.message + " Imputado: " + paramImputado,  [{text: 'OK'}], { cancelable: false });
        storage.remove({
          key: 'entrevistaPendiente'
        });
        this.setState({jsonEntrevistaPendiente: null});
      }
    })
    .catch(async (error) => {
      console.log("Error to save: " + error)
      Alert.alert('Error', error, [{text: 'OK'}], { cancelable: false });
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
        tipoCapturaParam: "ONLINE",
        evaluador: this.state.evaluador
      }
    )
  }

  getNombreEvaluador= () => {
    let nombreEvaluador = "";
    if (this.state.evaluador != null) {
      nombreEvaluador = this.state.evaluador.nombre + " " + this.state.evaluador.apellidoPaterno + " " + this.state.evaluador.apellidoMaterno
    }
    return nombreEvaluador;
  }

  cerrarSesion = async () => {
    const {navigate} = this.props.navigation;
    await AsyncStorage.clear();
    ToastAndroid.show('Cerró sesión correctamente.', ToastAndroid.SHORT);
    navigate('LoginScreen');
  }
  

  render() {
    if (this.state.isLoading) {
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
            <Row style={{marginTop: 20}}>
              <Col style={{ paddingHorizontal:15 }}>

                {/*<View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Image source={require('../assets/img/medidasCautelares.png')} resizeMode="contain"
                  style={{width:250, marginTop:-25}}></Image>
                  </View>*/}

                <Display enable={this.state.evaluador != null}
                  enterDuration={500}
                  enter="fadeInDown">
                  <Card>
                    <CardItem>
                      <Body>
                        <Row style={{marginTop: -20, flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',}}>             
                          <Text style={{color:COLORS.TEXT_PRIMARY, textAlign:'center', fontWeight:'bold', marginTop:25}}>
                            EVALUADOR: {this.getNombreEvaluador()}
                          </Text>
                        </Row>
                        <Row style={{marginTop: -15, marginBottom:-20}}>
                          <Col>
                            <Button transparent full danger
                                style={{marginVertical: 10}}
                                onPress={this.cerrarSesion}>
                                <Text style={{fontSize:16, textDecorationLine: "underline", textDecorationStyle: "solid",}}>Cerrar sesión</Text>
                              </Button>
                          </Col>
                        </Row>
                      </Body>
                    </CardItem>
                  </Card>
                </Display>

                <Text style={{textAlign:'center', color:COLORS.TEXT_PRIMARY, fontWeight:'bold', marginTop:10, marginBottom:-10}}>
                  Buscar imputados por:
                </Text>

                <Item style={{marginVertical: 10}}>
                  <Input
                    defaultValue={this.state.carpetaJudicial}
                    placeholder='Carpeta juidicial / investigación'
                    placeholderTextColor='#2C4743'
                    autoCapitalize='characters' autoCorrect={false}
                    style={{color:'#2C4743', fontSize: 17}}
                    onChangeText={(carpetaJudicial) => this.setState({carpetaJudicial}) }/>
                </Item>

                {/* Buscar imputados por carpeta solo cuando hay conexión a internet */}
                <Display enable={this.state.isConnected}
                  enterDuration={500}
                  enter="fadeInDown">
                  <ListItem>
                    <CheckBox color={COLORS.BACKGROUND_PRIMARY} checked={this.state.buscarAsignados} 
                      onPress={this._selectCheckBoxSearchAsignados}/>
                    <TouchableOpacity onPress={this._selectCheckBoxSearchAsignados}>
                      <Body>
                        <Text>Asignados</Text>
                      </Body>
                    </TouchableOpacity>
                  </ListItem>
                  <ListItem>
                    <CheckBox color={COLORS.BACKGROUND_PRIMARY} checked={this.state.buscarConcluidos}
                       onPress={this._selectCheckBoxSearchConcluidos}/>
                     <TouchableOpacity onPress={this._selectCheckBoxSearchConcluidos}>
                      <Body>
                        <Text>Concluidos</Text>
                      </Body>
                    </TouchableOpacity>
                  </ListItem>
                  <Button full light
                    style={{marginVertical: 10, borderRadius:20}}
                    disabled={!this.state.isConnected || this.state.carpetaJudicial == null || this.state.carpetaJudicial == "" || 
                      (!this.state.buscarAsignados && !this.state.buscarConcluidos)}
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
                            value={imputado} key={imputado.id}
                            label={( (imputado.idEstatus == ESTATUS_SOLICITUD.ASIGNADO) ? "✔️ (A) - " : "🚫 (C) - ") + 
                                  imputado.nombre + " " + imputado.primerApellido + " " + imputado.segundoApellido +
                                  ((imputado.evaluacionMensual) ? " 📅" : "")}/>
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
