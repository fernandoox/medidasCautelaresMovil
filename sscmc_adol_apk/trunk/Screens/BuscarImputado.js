import React from 'react';
import { AsyncStorage, TouchableOpacity, Alert, NetInfo, ScrollView, KeyboardAvoidingView, Keyboard,  BackHandler, ToastAndroid } from 'react-native';
import { Root, Button, Text, Card, CardItem, ListItem, CheckBox, Body, Item, Input, Picker, Spinner } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import Display from 'react-native-display';
import Icon from 'react-native-vector-icons/FontAwesome';
import SQLiteHelpers  from '../Utils/SQLiteHelpers';
import ImputadoTemporal from './ImputadoTemporal';
import Database from '../Utils/Database';

export default class BuscarImputado extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return{
      headerRight: (
        <Root>
          <Button style={{marginRight:10, paddingLeft:10}} light bordered iconLeft 
            onPress={params.hanldeActualizarEvaluacionesSQLite}>
            <Icon active name="download" style={{color:'white', fontSize:20}}/>
            <Text style={{fontSize:19}}>{params.countEntrevistasPendientes}</Text>
          </Button>
        </Root>
      )
    }
  } 

  constructor(props){
    super(props)
    const { params } = this.props.navigation.state;
    ObjHelperSQlite = new SQLiteHelpers();
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
      isEntrevistaPendienteGuardada: false,
      countEntrevistasPendientes: 0
    };
    numBack = 0;
    //console.log(varFake);
  }
  
  componentDidMount(){
    ObjHelperSQlite.actualizarEntrevistasSQLiteBack();
    this.countEvaluacionesSQLite();
    NetInfo.isConnected.addEventListener('connectionChange',this._handleConnectivityChange);
    NetInfo.isConnected.fetch().done(
      (isConnected) => { 
        this.setState({isConnected}, () => {
          this.props.navigation.setParams({
            isConnected: isConnected,
            hanldeActualizarEvaluacionesSQLite: this.actualizarEvaluacionesSQLite
          });
        });
        if (isConnected) {
          console.log("Primer estado");
          this.enviarEntrevistaPendienteTest();
        }
      }
    );
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  /*componentWillReceiveProps(){
    console.log("componentWillReceiveProps Buscar imputado!!!!!!!!");
  }*/

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange',this._handleConnectivityChange);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  actualizarEvaluacionesSQLite = () => {
    ObjHelperSQlite.actualizarEntrevistasSQLiteButton();
    setTimeout(() => {
      this.countEvaluacionesSQLite();
    }, 900);
  }

  countEvaluacionesSQLite = () => {
    Database.transaction(
      tx => {
        tx.executeSql('SELECT COUNT(*) AS c FROM entrevistasOffline', [], (tx, r) => {
          this.setState({countEntrevistasPendientes: r.rows.item(0).c})
          this.props.navigation.setParams({countEntrevistasPendientes: r.rows.item(0).c});
        });
      },
      (err) => { console.log("Select Failed Message", err) },
      this.update
    );
 }

  handleBackButton() {
    numBack++;
    if (numBack > 1) {
      ToastAndroid.show('Cerró la aplicación.', ToastAndroid.SHORT);
      BackHandler.exitApp();
      numBack = 0;
    }else {
      ToastAndroid.show('Presione otra vez para salir.', ToastAndroid.SHORT);
    }
    return true;
  }

  _handleConnectivityChange = (isConnected) => {
    this.setState({isConnected}, () => {
      this.props.navigation.setParams({isConnected: isConnected});
      if (this.state.isConnected && !this.state.entrevistaPendienteGuardada) {
        console.log("_handleConnectivityChange estado");
        this.enviarEntrevistaPendienteTest();
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
      instanceAxios.get('/imputado/getByCarpetaJudicial', {
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
        this.setState({isLoading: false});
        //console.warn(JSON.stringify(error))
        Alert.alert('Conexión', 'Sin red celular o servidor no disponible.',[{text: 'OK'}],{ cancelable: false })
      });
    }else{
      Alert.alert('Evaluador', "No ha iniciado sesión un evaluador.", [{text: 'OK'}],{ cancelable: false });
      navigate('LoginScreen');
    }
  }

  /**
   * Enviar entrevistas automaticamente cuando detecte conexion 
   * Ennviar solo una vez las entrevistas que esten en listas para envio 1
   * Las offline 
   */
  enviarEntrevistaPendienteTest = () => {
    if (!this.state.entrevistaPendienteGuardada) {
      this.setState({entrevistaPendienteGuardada: true});
      console.log("Verificando si hay entrevista pendiente para guardar...!")
      Database.transaction(
        tx => {
           tx.executeSql('SELECT * FROM entrevistasOffline WHERE lista_para_envio = ?', [1], 
            (_, { rows: { _array }}) => {
              _array.map((evaluacion) => {
                evaluacion.data = JSON.parse(evaluacion.data);
                let imputadoEntrevistaPendiente = evaluacion.data.imputado.nombre + " "+ evaluacion.data.imputado.primerApellido + " " + evaluacion.data.imputado.segundoApellido;
                console.log("Nombre imputado pendiente:", imputadoEntrevistaPendiente)
                ToastAndroid.show('Enviando entrevista pendiente para: ' + imputadoEntrevistaPendiente,  ToastAndroid.LONG);
                this._saveEntrevistaOnlinePendiente(imputadoEntrevistaPendiente, evaluacion);
              })
            });
        },
        (err) => { console.log("Select Failed Message", err) },
        this.update
     );
    }
  }

  _saveEntrevistaOnlinePendiente = (paramImputado, entrevistaOnlinePendiente) => {
    this.setState({isLoading: true});
    console.log("Entrevista pendiente to save: " + JSON.stringify(entrevistaOnlinePendiente));
    instanceAxios({
      method: 'POST',
      url: '/evaluacion/update',
      data: entrevistaOnlinePendiente.data,
      onUploadProgress: (progressEvent) => {
        let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
        console.log("percentCompleted: ", percentCompleted);
      }
    })
    .then((res) => {
      console.log("Res request to save pendding... " + JSON.stringify(res.data));
      if(res.data.status == "ok"){
        ToastAndroid.showWithGravity(res.data.message + " Imputado: " + paramImputado, ToastAndroid.LONG, ToastAndroid.BOTTOM);
        //Alert.alert('Guardado', res.data.message + " Imputado: " + paramImputado,  [{text: 'OK'}], { cancelable: true });
        this.deleteEntrevistasPendientesEnviadas(entrevistaOnlinePendiente.id);
      }
      this.setState({isLoading: false});
    })
    .catch(async (error) => {
      this.setState({isLoading: false});
      console.log("Error:: ",JSON.stringify(error))
      Alert.alert('Conexión', 'OK Sin red celular o servidor no disponible.',[{text: 'OK'}],{ cancelable: false })
    });
  }

  deleteEntrevistasPendientesEnviadas = (idEntrevistaSQLite) => {
    Database.transaction(
      tx => {
        tx.executeSql('DELETE FROM entrevistasOffline WHERE id = ?;',  [idEntrevistaSQLite]),
        this.countEvaluacionesSQLite();
      },
      (err) => { console.log("Delete & Count Failed Message", err) },
      this.update
    );
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
    return (
      <KeyboardAvoidingView behavior="position">
        <ScrollView keyboardShouldPersistTaps="always">
          <Grid style={{ paddingHorizontal:15 }}>

            <Row style={{marginTop: 20}}>
              <Col>

                {/*<View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Image source={require('../assets/img/medidasCautelares.png')} resizeMode="contain"
                  style={{width:250, marginTop:-25}}></Image>
                  </View>*/}
                <Display enable={this.state.evaluador != null}
                  enterDuration={500}
                  enter="fadeInDown">
                  <Card>
                    <CardItem>
                      <Body style={{alignSelf: 'center'}}>
                        <Row style={{marginTop: -20, flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',alignSelf: 'center'}}>             
                          <Text style={{color:COLORS.TEXT_PRIMARY, textAlign:'center', fontWeight:'bold', marginTop:25}}>
                            {this.getNombreEvaluador()}
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


                {/* Buscar imputados por carpeta solo cuando hay conexión a internet */}
                <Display enable={this.state.isConnected}
                  enterDuration={500}
                  enter="fadeInDown">
                  <Item style={{marginVertical: 10}}>
                    <Input
                      defaultValue={this.state.carpetaJudicial}
                      placeholder='Carpeta juidicial / investigación'
                      placeholderTextColor='#2C4743'
                      autoCapitalize='characters' autoCorrect={false}
                      style={{color:'#2C4743', fontSize: 17}}
                      onChangeText={(carpetaJudicial) => this.setState({carpetaJudicial}) }/>
                  </Item>

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

                  <Display enable={this.state.isLoading}
                    enterDuration={300}
                    exitDuration={300}
                    enter="fadeIn"
                    exit="fadeOut">
                    <Spinner color='red' style={{ marginTop:-20, marginBottom:-20}}/>
                  </Display>

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
