import React from 'react';
import { AsyncStorage, TouchableOpacity, Alert, NetInfo, Keyboard,  BackHandler, ToastAndroid, FlatList , ScrollView} from 'react-native';
import { Root, Button, Text, Card, CardItem, CheckBox, Body, Item, Input, Picker, Spinner, ListItem, Right } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import Display from 'react-native-display';
import Icon from 'react-native-vector-icons/FontAwesome';
import SQLiteHelpers  from '../Utils/SQLiteHelpers';
import ImputadoTemporal from './ImputadoTemporal';
import Database from '../Utils/Database';
import faker from 'faker';
import moment from 'moment';

export default class BuscarImputado extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return{
      headerRight: (
        <Root>
          <Grid >
            <Row style={{marginTop: 5}}> 
              <Col>
                <Button light transparent style={{marginRight:10, paddingHorizontal: 10}} light bordered
                  onPress={params.hanldeBorrarEvaluacionesSQLite}>
                  <Icon active name="trash" style={{color:'white', fontSize:20}}/>
                </Button> 
              </Col> 
              <Col>
                <Button style={{marginRight:10, paddingLeft:10}} light bordered iconLeft 
                  onPress={params.hanldeActualizarEvaluacionesSQLite}>
                  <Icon active name="download" style={{color:'white', fontSize:20}}/>
                  <Text style={{fontSize:19}}>{params.countEntrevistasPendientes}</Text>
                </Button>
              </Col>
            </Row>
          </Grid>
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
    arrFakeImputados = [];
    faker.locale = "es_MX";
    for (let index = 0; index < 20; index++) {
      itemFake = {
        "id": faker.random.number(),
        "nombre": faker.name.findName().toUpperCase() ,
        "primerApellido": faker.name.lastName().toUpperCase() ,
        "segundoApellido": faker.name.lastName().toUpperCase() ,
        "idEstatus": ( index%2 == 0 ) ? 4 : 7,
        "evaluacionMensual": ( index%2 == 0 ) ? false : true,
        "carpetaJudicial": ( index%2 == 0 ) ? faker.random.number() + "/" + faker.lorem.word().toUpperCase()  + "/" + faker.random.number()  : null,
        "carpetaInvestigacion":  ( index%2 == 1 ) ? faker.random.number() + "/" + faker.lorem.word().toUpperCase()  + "/" + faker.random.number()  : null,
        "fechaAsignacion": moment(faker.date.past()).format('DD-MM-YYYY')
      }
      arrFakeImputados.push(itemFake);
    }
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
            hanldeActualizarEvaluacionesSQLite: this.actualizarEvaluacionesSQLite,
            hanldeBorrarEvaluacionesSQLite: this.borrarTodasEntrevistasSQLite
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

  borrarTodasEntrevistasSQLite = () => {
    Alert.alert(
      'Borrar evaluaciones locales',
      '¿Está seguro de borrar todas las evaluaciones guardadas en su teléfono?',
      [
        {text: 'Cancelar', onPress: () => console.log('Cancel Pressed')},
        {text: 'SI', onPress: () => this.borrarEntrevistasSQLite()}
      ],
      { cancelable: false }
    )
  }

  borrarEntrevistasSQLite = () => {
    ObjHelperSQlite.deleteAlllEvaluacionesSQLite();
    setTimeout(() => {
      this.countEvaluacionesSQLite();
    }, 700);
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
      instanceAxios.get('/imputado/getByGeneralParam', {
        params: {
          idEvaluador: this.state.evaluador.id,
          data: this.state.carpetaJudicial,
          buscarAsignados: this.state.buscarAsignados,
          buscarConcluidos: this.state.buscarConcluidos
        }
      })
      .then((res) => {
        if (res.data.status == "ok") {
          Keyboard.dismiss();
          this.setState({
            imputados: res.data.imputados,
            numImputados: res.data.imputados.length,
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
  
  aplicarEntrevista = (imputadoSelected) => {
    const {navigate} = this.props.navigation;
    navigate('EntrevistaScreen',
      {
        imputadoParam: imputadoSelected,
        carpetaJudicialParam: (imputadoSelected.carpetaJudicial == null) ? imputadoSelected.carpetaInvestigacion : imputadoSelected.carpetaJudicial,
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
      <Grid style={{ paddingHorizontal:15 }} >

        <Row size={0.6} >
          <Col>
            <Display enable={this.state.evaluador != null}
              enterDuration={500}
              enter="fadeInDown" style={{flex:1}}>
              <Card>
                <CardItem style={{paddingBottom:-20, paddingTop:-20}}>
                  <Body style={{ alignItems: 'center' }}>
                    <Text style={{color:COLORS.TEXT_PRIMARY, textAlign:'center', fontWeight:'bold', marginTop:10}}>
                      {this.getNombreEvaluador()}
                    </Text>
                    <Button transparent full danger
                      onPress={this.cerrarSesion}>
                      <Text style={{fontSize:16, textDecorationLine: "underline", textDecorationStyle: "solid",}}>Cerrar sesión</Text>
                    </Button>
                  </Body>
                </CardItem> 
              </Card>
            </Display>
          </Col>
        </Row>

        <Row size={3.4}>
          <Col>
            {/* Buscar imputados por carpeta solo cuando hay conexión a internet */}
            <Display enable={this.state.isConnected}
              enterDuration={500}
              enter="fadeInDown" >
              <Item style={{marginVertical: 10}} regular>
                <Input
                  defaultValue={this.state.carpetaJudicial}
                  placeholder='Buscar por carpetas'
                  placeholderTextColor='#2C4743'
                  autoCapitalize='characters' autoCorrect={false}
                  style={{color:'#2C4743', fontSize: 17, textAlign: 'center'}}
                  onChangeText={(carpetaJudicial) => this.setState({carpetaJudicial}) }/>
              </Item>

              <Row style={{flex: 0, flexDirection: 'row'}}>
                <Col style={{flexDirection: 'row', justifyContent:'space-evenly'}}>
                  <CheckBox color={COLORS.BACKGROUND_PRIMARY} checked={this.state.buscarAsignados} 
                    onPress={this._selectCheckBoxSearchAsignados}/>
                  <TouchableOpacity onPress={this._selectCheckBoxSearchAsignados}>
                    <Text>Asignados</Text>
                  </TouchableOpacity>
                </Col>
                <Col style={{flex:1, flexDirection: 'row', justifyContent:'space-evenly'}}>
                  <CheckBox color={COLORS.BACKGROUND_PRIMARY} checked={this.state.buscarConcluidos}
                    onPress={this._selectCheckBoxSearchConcluidos}/>
                  <TouchableOpacity onPress={this._selectCheckBoxSearchConcluidos}>
                    <Text>Concluidos</Text>
                  </TouchableOpacity>
                </Col>
              </Row> 
              
              <Display enable={this.state.isLoading}
                enterDuration={300}
                exitDuration={300}
                enter="fadeIn"
                exit="fadeOut">
                <Spinner color='red' style={{ marginTop:-20, marginBottom:-20}}/>
              </Display>

              <Button full light
                style={{marginTop:10}}
                disabled={!this.state.isConnected || this.state.carpetaJudicial == null || this.state.carpetaJudicial == "" || 
                  (!this.state.buscarAsignados && !this.state.buscarConcluidos)}
                onPress={this.buscarImputadosByCarpeta}>
                  <Text>Buscar por Carpeta</Text>
              </Button>
            </Display>

            {/* Imputado en BD cuando hay imputados en la carpeta y hay conexión a internet */}
            <Display enable={this.state.numImputados > 0 && this.state.isConnected}
              enterDuration={500}
              enter="fadeInDown" style={{flex:1}}>

              <Text style={{marginVertical:5, textAlign:'center', color:'#c93242', fontWeight:'bold'}}>
                Imputados:
              </Text>
            
              <ScrollView> 
                <FlatList
                  data={this.state.imputados}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item}) =>
                  <ListItem button={true} onPress={() => this.aplicarEntrevista(item)} style={{marginLeft: -15, paddingLeft:10, paddingBottom:10, paddingTop:10}}>
                    <Body>
                      <Text style={{fontSize:15, fontWeight:'bold'}}>{item.nombre} {item.primerApellido} {item.segundoApellido}</Text>
                      <Text style={{fontSize:13}}>{(item.carpetaJudicial != null) ? item.carpetaJudicial : item.carpetaInvestigacion}</Text>
                    </Body> 
                    <Right style={{alignSelf: 'flex-start'}}>
                      <Text style={{fontSize:11}} note>{item.fechaAsignacion}</Text>
                      <Text>{(item.evaluacionMensual) ? "📅" : ""}</Text>
                      <Text>{(item.idEstatus == ESTATUS_SOLICITUD.ASIGNADO) ? "✔️" : "🚫"}</Text>
                    </Right>
                  </ListItem> 
                  }
                  keyExtractor = { (item, index) => index.toString() }
                />
              </ScrollView>
            </Display> 
            
            {/* Imputado temporal cuando no hay conexión a internet */}
            <Display enable={!this.state.isConnected}
              enterDuration={500}
              enter="fadeInDown" style={{flex:1}}>
              <ImputadoTemporal carpetaJudicial={this.state.carpetaJudicial} nav={this.props.navigation}/>
            </Display>

          </Col>
        </Row>
      
      </Grid>
    );
  }
}
