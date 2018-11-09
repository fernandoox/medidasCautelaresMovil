import React from 'react';
import { View, ActivityIndicator, NetInfo, Dimensions } from 'react-native';
import { Root, Button, Text,  Card, CardItem, Body } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from "react-native-easy-grid";
import Modal from "react-native-modal";
import ModalProgreso from './ModalProgreso';
import DatosGenerales from './DatosGenerales';
import Domicilios from './Domicilios';
import RedFamiliar from './RedFamiliar';
import Estudios from './Estudios';
import Ocupacion from './Ocupacion';
import Sustancias from './Sustancias';
import Database from '../Utils/Database';
import {ScrollableTabView, ScrollableTabBar} from '@valdio/react-native-scrollable-tabview'

const { width, height } = Dimensions.get('window');

export default class Entrevista extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return{
      headerRight: (
        <Root>
          <Button style={{marginRight:10, paddingHorizontal: 12}} onPress={params.handleToggleModalProgress} light transparent>
            <Icon active name="sliders" style={{color:'white', fontSize:26}}/>
          </Button>
        </Root>
      )
    }
  }

  constructor(props){
    super(props)
    // Props contienen los parametros de BuscarImputadoScreen e ImputadoTemporalScreen
    const { params } = this.props.navigation.state;
    this.state = {
      isLoading: false,
      isConnected: null,
      isModalVisible: false,
      imputado: params.imputadoParam,
      dataImputado: {},
      dataGeneralesDB: null,
      dataDomicilioDB: null,
      dataFamiliaDB: null,
      dataEstudiosBD: null,
      dataOcupacionesDB: null,
      dataSustanciasDB: null,
      carpetaJudicial: params.carpetaJudicialParam,
      evaluador: (params.evaluador != null) ? params.evaluador : null,
      tipoCaptura: params.tipoCapturaParam,
      loadedResponsesBD: false,
    };
    jsonBaseEntrevista = {
      "imputado": params.imputadoParam,
      "carpetaJudicial": params.carpetaJudicialParam,
      "tipoCaptura": params.tipoCapturaParam,
    }
  }

  componentDidMount(){
    //Sentry.captureException(new Error('Oops!'))
    this.props.navigation.setParams({ handleToggleModalProgress: this._toggleModalProgress });
    NetInfo.isConnected.addEventListener('connectionChange',this.verificarConexion);
    NetInfo.isConnected.fetch().done(
      (isConnected) => { this.setState({isConnected}); }
    );

    storage.save({
      key: 'jsonBaseEntrevistaStorage',
      data: jsonBaseEntrevista,
    });
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange',this.verificarConexion);
  }

  verificarConexion = (isConnected) => {
    this.setState({isConnected});
  };

  getDataImputado = async () => {
    if (!this.state.loadedResponsesBD && this.state.imputado.id != null) {
    if (this.state.isConnected) {
      console.log("Get data imputado!!");
      this.setState({isLoading: true, loadedResponsesBD: true});
      instanceAxios.get('/evaluacion/get', {
        params: {
          idImputado: this.state.imputado.id,
        }
      })
      .then(async (res) => {
        if (res.data.status == "ok") {
          //console.log("Data imputado generales: " + JSON.stringify(res.data.evaluacion));
          this.setState({
            dataGeneralesDB: res.data.evaluacion.datosGenerales,
            dataDomicilioDB: res.data.evaluacion.domicilios,
            dataFamiliaDB: res.data.evaluacion.redFamiliar,
            dataEstudiosBD: res.data.evaluacion.estudios,
            dataOcupacionesDB: res.data.evaluacion.ocupaciones,
            dataSustanciasDB: res.data.evaluacion.sustancias,
            isLoading: false
          });
        }
        if (res.data.status == "error") {
          Alert.alert('Error', res.data.message, [{text: 'OK'}], { cancelable: false });
          this.setState({isLoading: false, loadedResponsesBD: true,});
        }
      })
      .catch(async (error) => {
        this.setState({isLoading: false});
        //console.warn(JSON.stringify(error))
        Alert.alert('Conexión', 'Sin red celular o servidor no disponible.',[{text: 'OK'}],{ cancelable: false })
      });
    } else { 
      // Si no hay conexion busca en SQLite
      this.getImputadoSQLiteById();
    }
    }
  }

  getImputadoSQLiteById = () => {
    this.setState({isLoading: true, loadedResponsesBD: true});
    console.log("Buscando imputado SQLite:", this.state.imputado.id);
    Database.transaction(
      tx => {
         tx.executeSql('SELECT * FROM entrevistasOffline WHERE id_imputado = ?', 
          [this.state.imputado.id], (_, { rows: { _array }}) => {
            let infoEvaluacion = JSON.parse(_array[0].data);    
              //console.log("Evaluacion imputado:", JSON.stringify(infoEvaluacion))
              this.setState({
                dataGeneralesDB: infoEvaluacion.datosGenerales,
                dataDomicilioDB: infoEvaluacion.domicilios,
                dataFamiliaDB: infoEvaluacion.redFamiliar,
                dataEstudiosBD: infoEvaluacion.estudios,
                dataOcupacionesDB: infoEvaluacion.ocupaciones,
                dataSustanciasDB: infoEvaluacion.sustancias,
                isLoading: false,
              });
         });
      },
      (err) => { console.log("Select Failed Message", err) },
      this.update
   );
  }

  _toggleModalProgress = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }


  changeStepInProgress = (stepNumber) => {
    this.setState({ isModalVisible: false })
    console.log("Tab:",stepNumber)
    this.tabView.goToPage(stepNumber);
  }
  
  showAllSections = () => {
    console.log("Respuestas cargadas, mostrar secciones!")
    return(
      <ScrollableTabView  
        ref={(tabView) => { this.tabView = tabView; }}
        renderTabBar={() => <ScrollableTabBar/>} 
        tabBarActiveTextColor={COLORS.BACKGROUND_PRIMARY}
        tabBarUnderlineStyle={{backgroundColor: COLORS.BACKGROUND_PRIMARY}}>
        <DatosGenerales tabLabel="Generales" generalesDB={this.state.dataGeneralesDB} imputadoProp={this.state.imputado}/>
        <Domicilios tabLabel="Domicilios" domiciliosDB={this.state.dataDomicilioDB} imputadoProp={this.state.imputado}/>
        <RedFamiliar tabLabel="Red Familiar" familiaDB={this.state.dataFamiliaDB} imputadoProp={this.state.imputado}/>
        <Estudios tabLabel="Estudios" estudiosDB={this.state.dataEstudiosBD} imputadoProp={this.state.imputado}/>
        <Ocupacion tabLabel="Ocupaciones" ocupacionesDB={this.state.dataOcupacionesDB} imputadoProp={this.state.imputado}/>
        <Sustancias tabLabel="Sustancias" sustanciasDB={this.state.dataSustanciasDB} imputadoProp={this.state.imputado}/>
      </ScrollableTabView> 
    );
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
      <Grid onLayout={this.getDataImputado}>
        <Row style={{backgroundColor: '#607D8B', height:80}}>
          <Col>
            <Card>
              <CardItem>
                <Body style={{flex: 1, flexDirection: 'row'}}>
                  {
                    (this.state.imputado.evaluacionMensual) ?
                    <Icon active name="calendar" style={{marginRight:5, fontSize: 20, color: "#3c85ea"}}/> : 
                    <Icon active name="bell" style={{marginRight:5, fontSize: 20, color: "#3c85ea"}}/>
                  }
                  <Text style={{ fontSize:14, fontWeight:'bold' }}>
                    CARPETA: {this.state.carpetaJudicial}
                  </Text>
                </Body>
              </CardItem>
              <CardItem style={{ marginTop:-10, marginBottom:0, paddingTop:-20, paddingBottom:-10 }}>
                <Body style={{flex: 1, flexDirection: 'row'}}>
                  <Icon active name={(this.state.imputado.idEstatus == ESTATUS_SOLICITUD.CONCLUIDO) ? "ban" : "edit"} 
                  style={{marginRight:5, fontSize: 20, color:(this.state.imputado.idEstatus == ESTATUS_SOLICITUD.CONCLUIDO) ? COLORS.LIGHT_WARN : "teal"}}/>
                  <Text style={{ fontSize:14, fontWeight:'bold',
                    color:(this.state.imputado.idEstatus == ESTATUS_SOLICITUD.CONCLUIDO) ? COLORS.LIGHT_WARN : "teal"}}>
                    IMPUTADO: {this.state.imputado.nombre + " " + this.state.imputado.primerApellido + " " + this.state.imputado.segundoApellido}
                  </Text>
                </Body>
              </CardItem>
            </Card>
          </Col>
        </Row>

        {
          this.state.loadedResponsesBD ? 
          this.showAllSections()
          : null
        }

        <Modal onBackButtonPress={() => this.setState({ isModalVisible: false })}
          onSwipe={() => this.setState({ isModalVisible: false })}
          swipeDirection="right" isVisible={this.state.isModalVisible}>
          <ModalProgreso 
            changeStepChild={this.changeStepInProgress} 
            imputadoProp={this.state.imputado} 
            carpetaJudicial={this.state.carpetaJudicial}
            nav={this.props.navigation}
            evaluador={this.state.evaluador}
            cerrarModalProgrsoChild={this._toggleModalProgress}/>
        </Modal>

      </Grid>
      
    );
  }
}
