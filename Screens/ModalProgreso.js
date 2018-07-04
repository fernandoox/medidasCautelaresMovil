import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, Alert, NetInfo, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Button, Text, Item, Input, H3, Card, CardItem, Body, Badge, Spinner } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import Display from 'react-native-display';
import GLOBALS from '../Utils/Globals';
import CONSTANTS from '../Utils/ConstantsNG';
import Storage from 'react-native-storage';

export default class ModalProgreso extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      isLoading: false,
      isConnected: null,
      jsonBase: {},
      jsonGeneralesCompleto: null,
      jsonDomiciliosCompleto: null,
      jsonRedFamiliarCompleto: null,
      jsonEstudiosCompleto: null,
      jsonOcupacionesCompleto: null,
      jsonSustanciasCompleto: null,
      evaluador: null
    };
    jsonBaseEntrevistaLocal = {}
    const nav = this.props.nav;
  }

  componentDidMount(){
    // Detectar conexion
    NetInfo.isConnected.addEventListener('connectionChange',this._handleConnectivityChange);
    NetInfo.isConnected.fetch().done(
      (isConnected) => { this.setState({isConnected}); }
    );

    NetInfo.getConnectionInfo().then((connectionInfo) => {
      console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
    });

    // Load evaluador logueado
    storage.load({
      key: 'evaluadorLogueado',
    }).then((response) => {
      this.setState({evaluador: response})
    }).catch(async (err) => {
      console.error("ERROR EVALUADOR: "+err.message);
    })

    // Load JSON Base
    storage.load({
      key: 'jsonBaseEntrevistaStorage',
    }).then((response) => {
      jsonBaseEntrevistaLocal = response;
    }).catch(err => {
      console.error("ERROR ASYNC: "+err.message);
    })

    // Load JSON Generales
    storage.load({
      key: 'datosGeneralesStorage',
    }).then((response) => {
      jsonBaseEntrevistaLocal.datosGenerales = response;
      this.setState({jsonGeneralesCompleto: response.completo});
      this.setState({jsonBase: jsonBaseEntrevistaLocal});
    }).catch(err => {
      console.error("ERROR ASYNC GENERALES: "+err.message);
    })
    
    // Load JSON Domicilios
    storage.load({
      key: 'datosDomiciliosStorage',
    }).then((response) => {
      jsonBaseEntrevistaLocal.domicilios = response;
      this.setState({jsonDomiciliosCompleto: response.completo});
      this.setState({jsonBase: jsonBaseEntrevistaLocal});
    }).catch(err => {
      console.warn("ERROR ASYNC DOMICILIOS: "+err.message);
    })

    // Load JSON Red Familiares
    storage.load({
      key: 'datosFamiliaresStorage',
    }).then((response) => {
      jsonBaseEntrevistaLocal.redFamiliar = response;
      this.setState({jsonRedFamiliarCompleto: response.completo});
      this.setState({jsonBase: jsonBaseEntrevistaLocal});
    }).catch(err => {
      console.error("ERROR ASYNC RED FAMILIAR: "+err.message);
    })

    // Load JSON Estudios
    storage.load({
      key: 'datosEstudiosStorage',
    }).then((response) => {
      jsonBaseEntrevistaLocal.estudios = response;
      this.setState({jsonEstudiosCompleto: response.completo});
      this.setState({jsonBase: jsonBaseEntrevistaLocal});
    }).catch(err => {
      console.warn("ERROR ASYNC ESTUDIOS: "+err.message);
    })

    // Load JSON Ocupaciones
    storage.load({
      key: 'datosOcupacionesStorage',
    }).then((response) => {
      jsonBaseEntrevistaLocal.ocupaciones = response;
      this.setState({jsonOcupacionesCompleto: response.completo});
      this.setState({jsonBase: jsonBaseEntrevistaLocal});
    }).catch(err => {
      console.warn("ERROR ASYNC OCUPACIONES: "+err.message);
    })

    // Load JSON Sustancias
    storage.load({
      key: 'datosSustanciasStorage',
    }).then((response) => {
      jsonBaseEntrevistaLocal.sustancias = response;
      this.setState({jsonSustanciasCompleto: response.completo});
      this.setState({jsonBase: jsonBaseEntrevistaLocal});
    }).catch(err => {
      console.warn("ERROR ASYNC SUSTANCIAS: "+err.message);
    })
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange',this._handleConnectivityChange);
    NetInfo.getConnectionInfo().then((connectionInfo) => {
      console.log('Change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
    });
  }

  _handleConnectivityChange = (isConnected) => {
    this.setState({isConnected});
    
  };

  changeStep = (numberStep) => {
    console.log("JSON Base: " + JSON.stringify(this.state.jsonBase))
    this.props.changeStepChild(numberStep);
  }

  saveInfoTotal = () => {
    console.log("JSON Base: " + JSON.stringify(this.state.jsonBase))
    if (this.state.isConnected) {
      this.setState({isLoading:true});
      axios({
        method: 'POST',
        url: '/evaluacion/update',
        data: this.state.jsonBase,
        timeout: 2500
      })
      .then((res) => {
        console.log("Res request to save: " + JSON.stringify(res.data));
        if(res.data.status == "ok"){
          Alert.alert('Guardado', res.data.message, [{text: 'OK'}], { cancelable: false });
          // Pendiente: Limpiar storage
          this.props.cerrarModalProgrsoChild();
          this.props.nav.navigate('BuscarImputadoScreen', {carpetaJudicialParam: this.props.carpetaJudicial, evaluador:this.props.evaluador});
        }
        this.setState({isLoading:false});
      })
      .catch(async (error) => {
        this.setState({isLoading:false});
        console.warn("Error to save: " + error)
        Alert.alert('Error', error, [{text: 'OK'}], { cancelable: false });
      });
    }else{
      Alert.alert('Problemas de red', "No hay conexión a internet, se enviará cuando se recupere la conexión.", [{text: 'OK'}], { cancelable: false });
      /**
      * Guardar en dispositivo el json aux que se enviará.
      * Podrá continuar realizando mas entrevistas.
      */
      storage.save({
        key: 'entrevistaPendiente',
        data: this.state.jsonBase,
      });
      this.props.cerrarModalProgrsoChild();
      this.props.nav.navigate('BuscarImputadoScreen', 
        {
          carpetaJudicialParam: this.props.carpetaJudicial,
          evaluador: this.state.evaluador
        }
      );

    }
    
  }

  render() {
    return (
    <Grid style={{backgroundColor:'white'}}>
      
      <Row style={{backgroundColor: '#607D8B', height:100}}>
        <Col>
          <Card>
            <CardItem>
              <Body>
                <Text style={[styles.labelInfo]}>
                  CARPETA JUDICIAL: {this.props.carpetaJudicial}
                </Text>
              </Body>
            </CardItem>
            <CardItem style={{ marginTop:-10, marginBottom:0, paddingTop:-20, paddingBottom:-10 }}>
              <Body>
                <Text style={[styles.labelInfo]}>
                  IMPUTADO: {this.props.imputadoProp.nombre + " " + this.props.imputadoProp.primerApellido + " " + this.props.imputadoProp.segundoApellido}
                </Text>
              </Body>
            </CardItem>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col style={[styles.columnStep]}>
        <TouchableOpacity onPress={() => { this.changeStep(0) }} style={{ padding:15 }}>
          <Text style={[styles.titleStep]}>Generales</Text>
          <Badge style={{marginVertical:5, backgroundColor:'transparent',  borderWidth:1, borderColor: (this.state.jsonGeneralesCompleto) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN}}>
            <Icon 
              name={(this.state.jsonGeneralesCompleto) ? "check" : "times"} 
              style={{ marginRight:10, fontSize: 15, color: (this.state.jsonGeneralesCompleto) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN, position:'absolute', top:5, left:5}}
            />
            <Text style={{marginLeft:10,  color: (this.state.jsonGeneralesCompleto) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN }}>Completo</Text>
          </Badge>
        </TouchableOpacity>
        </Col>
 
        <Col style={[styles.columnStep]}>
        <TouchableOpacity onPress={() => { this.changeStep(1) }} style={{ padding:15 }}>
          <Text style={[styles.titleStep]}>Domicilios</Text>
          <Badge style={{marginVertical:5, backgroundColor:'transparent',  borderWidth:1, borderColor: (this.state.jsonDomiciliosCompleto) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN}}>
            <Icon 
              name={(this.state.jsonDomiciliosCompleto) ? "check" : "times"} 
              style={{ marginRight:10, fontSize: 15, color: (this.state.jsonDomiciliosCompleto) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN, position:'absolute', top:5, left:5}}
            />
            <Text style={{marginLeft:10,  color: (this.state.jsonDomiciliosCompleto) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN }}>Completo</Text>
          </Badge>
        </TouchableOpacity>
        </Col>
      </Row>

      <Row>

        <Col style={[styles.columnStep]}>
        <TouchableOpacity onPress={() => { this.changeStep(2) }} style={{ padding:15 }}>
          <Text style={[styles.titleStep]}>Red Familiar</Text>
          <Badge style={{marginVertical:5, backgroundColor:'transparent',  borderWidth:1, borderColor: (this.state.jsonRedFamiliarCompleto) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN}}>
            <Icon 
              name={(this.state.jsonRedFamiliarCompleto) ? "check" : "times"} 
              style={{ marginRight:10, fontSize: 15, color: (this.state.jsonRedFamiliarCompleto) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN, position:'absolute', top:5, left:5}}
            />
            <Text style={{marginLeft:10,  color: (this.state.jsonRedFamiliarCompleto) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN }}>Completo</Text>
          </Badge>
        </TouchableOpacity>
        </Col>
        
        <Col style={[styles.columnStep]}>
        <TouchableOpacity onPress={() => { this.changeStep(3) }} style={{ padding:15 }}>
          <Text style={[styles.titleStep]}>Estudios</Text>
          <Badge style={{marginVertical:5, backgroundColor:'transparent',  borderWidth:1, borderColor: (this.state.jsonEstudiosCompleto) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN}}>
            <Icon 
              name={(this.state.jsonEstudiosCompleto) ? "check" : "times"} 
              style={{ marginRight:10, fontSize: 15, color: (this.state.jsonEstudiosCompleto) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN, position:'absolute', top:5, left:5}}
            />
            <Text style={{marginLeft:10,  color: (this.state.jsonEstudiosCompleto) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN }}>Completo</Text>
          </Badge>
        </TouchableOpacity>
        </Col>

      </Row>

      <Row>
        
        <Col style={[styles.columnStep]}>
        <TouchableOpacity onPress={() => { this.changeStep(4) }} style={{ padding:15 }}>
          <Text style={[styles.titleStep]}>Ocupaciones</Text>
          <Badge style={{marginVertical:5, backgroundColor:'transparent',  borderWidth:1, borderColor: (this.state.jsonOcupacionesCompleto) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN}}>
            <Icon 
              name={(this.state.jsonOcupacionesCompleto) ? "check" : "times"} 
              style={{ marginRight:10, fontSize: 15, color: (this.state.jsonOcupacionesCompleto) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN, position:'absolute', top:5, left:5}}
            />
            <Text style={{marginLeft:10,  color: (this.state.jsonOcupacionesCompleto) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN }}>Completo</Text>
          </Badge>
        </TouchableOpacity>
        </Col>

        <Col style={[styles.columnStep]}>
        <TouchableOpacity onPress={() => { this.changeStep(5) }} style={{ padding:15 }}>
          <Text style={[styles.titleStep]}>Sustancias</Text>
          <Badge style={{marginVertical:5, backgroundColor:'transparent',  borderWidth:1, borderColor: (this.state.jsonSustanciasCompleto) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN}}>
            <Icon 
              name={(this.state.jsonSustanciasCompleto) ? "check" : "times"} 
              style={{ marginRight:10, fontSize: 15, color: (this.state.jsonSustanciasCompleto) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN, position:'absolute', top:5, left:5}}
            />
            <Text style={{marginLeft:10,  color: (this.state.jsonSustanciasCompleto) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN }}>Completo</Text>
          </Badge>
        </TouchableOpacity>
        </Col>
        
      </Row>
      
      {/*<Row>
        <Col>
          <Text>{JSON.stringify(this.state.jsonBase)}</Text>
        </Col>
      </Row>*/}

      <Row>
        <Col style={{ padding:15, justifyContent:'center' }}>
          <Display enable={this.state.ultimoGrado != 23}
            enterDuration={100}
            exitDuration={100}
            enter="fadeInDown"
            exit="fadeOutDown">
            <Spinner color='red'/>
          </Display>
          <Button danger full onPress={this.saveInfoTotal} 
            disabled={(this.props.imputadoProp.idEstatus == ESTATUS_SOLICITUD.CONCLUIDO)}>
            <Text>Terminar entrevista {(this.state.isLoading) ? "Cargando..." : "Listo"}</Text>
          </Button>
        </Col>
      </Row>

    </Grid>
    );
  }
}
//
const styles = StyleSheet.create({
  labelInfo: {
    fontSize:15, 
    fontWeight:'bold', 
    color: COLORS.TEXT_PRIMARY
  },
  columnStep: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin:5,
    borderRadius:5,
    borderColor: COLORS.BACKGROUND_PRIMARY,
    borderWidth: 2
  },
  titleStep: {
    color: COLORS.TEXT_SECONDARY, 
    textAlign: 'center', 
    fontWeight: 'bold'
  }
});