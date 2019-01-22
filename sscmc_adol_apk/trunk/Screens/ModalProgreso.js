import React from 'react';
import { Alert, NetInfo, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Text, Card, CardItem, Body, Badge, Spinner, CheckBox, ListItem } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import Icon from 'react-native-vector-icons/FontAwesome';
import Display from 'react-native-display';
import Database from '../Utils/Database';
import SQLiteHelpers  from '../Utils/SQLiteHelpers';

export default class ModalProgreso extends React.Component {

  constructor(props){
    super(props)
    ObjHelperSQlite = new SQLiteHelpers();
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
      evaluador: null,
      evaluacionListaParaEnvio: false
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

    // Load evaluador logueado
    storage.load({
      key: 'evaluadorLogueado',
    }).then((response) => {
      this.setState({evaluador: response})
    }).catch(async (err) => {
      console.warn("ERROR EVALUADOR: "+err.message);
    })

    // Load JSON Base
    storage.load({
      key: 'jsonBaseEntrevistaStorage',
    }).then((response) => {
      jsonBaseEntrevistaLocal = response;
    }).catch(err => {
      console.warn("ERROR ASYNC: "+err.message);
    })

    // Load JSON Generales
    storage.load({
      key: 'datosGeneralesStorage',
    }).then((response) => {
      jsonBaseEntrevistaLocal.datosGenerales = response;
      this.setState({jsonGeneralesCompleto: response.completo});
      this.setState({jsonBase: jsonBaseEntrevistaLocal});
    }).catch(err => {
      console.warn("ERROR ASYNC GENERALES: "+err.message);
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
      console.warn("ERROR ASYNC RED FAMILIAR: "+err.message);
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
  }

  _handleConnectivityChange = (isConnected) => {
    this.setState({isConnected});
  };

  changeStep = (numberStep) => {
    console.log("JSON Step Base: " + JSON.stringify(this.state.jsonBase))
    this.props.changeStepChild(numberStep);
  }

  _selectCheckBoxEvaluacionParaEnvio = () => {
    this.setState({ evaluacionListaParaEnvio: !this.state.evaluacionListaParaEnvio });
  }

  saveInfoTotal = () => {
    if (this.state.isConnected && this.state.jsonBase.tipoCaptura == "ONLINE") {
      console.log("JSON BASE ONLINE: " + JSON.stringify(this.state.jsonBase))
      this.setState({isLoading:true});
      instanceAxios({
        method: 'POST',
        url: '/evaluacion/update',
        data: this.state.jsonBase,
        timeout: 2500,
      })
      .then((res) => {
        console.log("Res request to save: " + JSON.stringify(res.data));
        if(res.data.status == "ok"){
          Alert.alert('Guardado', res.data.message, [{text: 'OK'}], { cancelable: false });
          //ELIMINAR LA RECIEN ENVIADA SI EXISTE EN SQLITE EN BASE AL ID IMPUTADO
          ObjHelperSQlite.deleteEntrevistaByIdImputado(this.state.jsonBase.imputado.id);
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
    }else if(!this.state.isConnected && this.state.jsonBase.tipoCaptura == "ONLINE"){
      /**
      * Cuando se empieza con internet pero durante la entrevista se pierde 
      * (se interactua con información del web service)
      */
      Alert.alert('Red', "No hay conexión a internet, se podrá enviar cuando se recupere la conexión.", [{text: 'OK'}], { cancelable: false });
      this.saveSQLiteEntrevistaPendiente();
    }else{
      /**
       * Cuando se empieza sin internet y se interactua con SQLite
       */
      Alert.alert('Red 2', "No hay conexión a internet, se podrá enviar cuando se recupere la conexión.", [{text: 'OK'}], { cancelable: false });
      this.updateEvaluacionSQLite();
    }
    
  }
  
  updateEvaluacionSQLite = () => {
    console.log("Actualizando a SQLite imputado:", this.state.jsonBase.imputado.id);
    Database.transaction(
       tx => {
          tx.executeSql('UPDATE entrevistasOffline SET data = ?, lista_para_envio = ? WHERE id_imputado = ?',
             [
                JSON.stringify(this.state.jsonBase),
                (this.state.evaluacionListaParaEnvio) ? 1 : 0,
                this.state.jsonBase.imputado.id
             ]);
       },
       (err) => { console.log("Update Failed Message", err) },
       this.update
    );
    this.props.cerrarModalProgrsoChild();
    this.props.nav.navigate('BuscarImputadoScreen', 
      {
        carpetaJudicialParam: this.props.carpetaJudicial,
        evaluador: this.state.evaluador
      }
    );
 }

  saveSQLiteEntrevistaPendiente = () => {
    // Transactions to SQLite!
    Database.transaction(
       tx => {
          tx.executeSql('INSERT INTO entrevistasOffline (tipo_captura, carpeta_investigacion, carpeta_judicial, data, id_imputado, fecha_asignacion, lista_para_envio) values (?, ?, ?, ?, ?, ?, ?)',
            [
              this.state.tipoCaptura,
              this.state.jsonBase.carpetaJudicial,
              this.state.jsonBase.carpetaJudicial,
              JSON.stringify(this.state.jsonBase),
              this.state.jsonBase.imputado.id,
              null,
              1
            ]);
       },
       (err) => { console.log("Insert Failed Message", err) },
       this.update
    );
    //console.log("JSON BASE: " + JSON.stringify(this.state.jsonBase))
    this.props.cerrarModalProgrsoChild();
    this.props.nav.navigate('BuscarImputadoScreen', 
      {
        carpetaJudicialParam: this.props.carpetaJudicial,
        evaluador: this.state.evaluador
      }
    );
  }

  saveEvaluacionSQLite = (objNuevaEvaluacion) => {
    let evaluacionAux = objNuevaEvaluacion.evaluacion;
    delete objNuevaEvaluacion.evaluacion;
    var objEvaluacionToSaveSQLite = Object.assign(objNuevaEvaluacion, evaluacionAux);
    console.log("Object to save:", JSON.stringify(objEvaluacionToSaveSQLite));
    Database.transaction(
       tx => {
          tx.executeSql('INSERT INTO entrevistasOffline (tipo_captura, carpeta_investigacion, carpeta_judicial, data, id_imputado, fecha_asignacion, lista_para_envio) values (?, ?, ?, ?, ?, ?, ?)',
            [
              'OFFLINE',
              objNuevaEvaluacion.carpetaInvestigacion,
              objNuevaEvaluacion.carpetaJudicial,
              JSON.stringify(objEvaluacionToSaveSQLite),
              objNuevaEvaluacion.imputado.id,
              objNuevaEvaluacion.fechaAsignacion,
              0
            ]);
       },
       (err) => { console.log("Insert Failed Message", err) },
       this.update
    );
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
                  CARPETA: {this.props.carpetaJudicial}
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
          <Display enable={this.state.isLoading}
            enterDuration={300}
            exitDuration={300}
            enter="fadeIn"
            exit="fadeOut">
            <Spinner color='red' style={{ marginTop:-20, marginBottom:-20}}/>
          </Display>
          
          <Display enable={this.state.jsonBase.tipoCaptura == 'OFFLINE'}
            enterDuration={30}
            exitDuration={30}
            enter="fadeIn"
            exit="fadeOut">
            <ListItem style={{marginLeft:0}}>
              <CheckBox color={COLORS.BACKGROUND_PRIMARY} checked={this.state.evaluacionListaParaEnvio} 
                onPress={this._selectCheckBoxEvaluacionParaEnvio}/>
              <TouchableOpacity onPress={this._selectCheckBoxEvaluacionParaEnvio}>
                <Body>
                  <Text>Evaluación lista para envío</Text>
                </Body>
              </TouchableOpacity>
            </ListItem>
          </Display>
          

          <Button danger full onPress={this.saveInfoTotal} 
            disabled={(this.props.imputadoProp.idEstatus == ESTATUS_SOLICITUD.CONCLUIDO)}>
            <Text>Terminar entrevista</Text>
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
    borderWidth: 1
  },
  titleStep: {
    color: COLORS.TEXT_SECONDARY, 
    textAlign: 'center', 
    fontWeight: 'bold'
  }
});