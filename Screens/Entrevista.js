import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { Button, Text, Item, Input, H3, Separator, ListItem, Card, CardItem, Body } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import axios from 'axios';
import GLOBALS from '../Utils/Globals';
import MultiStep from 'react-native-multistep-wizard'
import StepIndicator from 'react-native-step-indicator';
import DatosGenerales from './DatosGenerales';
import Domicilios from './Domicilios';
import RedFamiliar from './RedFamiliar';
import Estudios from './Estudios';
import Ocupacion from './Ocupacion';
import Sustancias from './Sustancias';
export default class Entrevista extends React.Component {

  constructor(props){
    super(props)
    // Props contienen los parametros de BuscarImputadoScreen e ImputadoTemporalScreen
    const { params } = this.props.navigation.state;
    this.state = {
      isConnected: null,
      imputado: params.imputadoParam,
      carpetaJudicial: params.carpetaJudicialParam,
      tipoCaptura: params.tipoCapturaParam,
    };
    jsonBaseEntrevista = {
      "imputado": params.imputadoParam,
      "carpetaJudicial": params.carpetaJudicialParam,
      "tipoCaptura": params.tipoCapturaParam,
      "respuestas": [],
    }
  }

  componentDidMount(){
    NetInfo.isConnected.addEventListener('connectionChange',this.verificarConexion);
    NetInfo.isConnected.fetch().done(
      (isConnected) => { this.setState({isConnected}); }
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange',this.verificarConexion);
  }

  verificarConexion = (isConnected) => {
    this.setState({isConnected});
  };

  terminarEntrevista = (wizardState) => {
    jsonBaseEntrevista.respuestas = wizardState;
    console.log(JSON.stringify(jsonBaseEntrevista));
    Alert.alert('FINAL DE ENTREVISTA', "Puede aplicar la entrevista a otro imputado", [{text: 'OK'}], { cancelable: false });
    const {navigate} = this.props.navigation;
    navigate('BuscarImputadoScreen');
  }


  render() {
    const labelsSteps = ["Generales","Domicilios","Familia","Estudios","Ocupación", "Sustancias"];

    const customStylesSteps = {
      stepIndicatorSize: 20,
      currentStepIndicatorSize:25,
      separatorStrokeWidth: 1,
      currentStepStrokeWidth: 2,
      stepStrokeCurrentColor: '#fe7013',
      stepStrokeWidth: 2,
      stepStrokeFinishedColor: '#fe7013',
      stepStrokeUnFinishedColor: '#aaaaaa',
      separatorFinishedColor: '#fe7013',
      separatorUnFinishedColor: '#aaaaaa',
      stepIndicatorFinishedColor: '#fe7013',
      stepIndicatorUnFinishedColor: '#ffffff',
      stepIndicatorCurrentColor: '#ffffff',
      stepIndicatorLabelFontSize: 11,
      currentStepIndicatorLabelFontSize: 11,
      stepIndicatorLabelCurrentColor: '#fe7013',
      stepIndicatorLabelFinishedColor: '#ffffff',
      stepIndicatorLabelUnFinishedColor: '#aaaaaa',
      labelColor: '#999999',
      labelSize: 11,
      currentStepLabelColor: '#fe7013'
    }

    const steps = [
      {name: 'DatosGenerales',  component: <DatosGenerales testProp={this.state.carpetaJudicial}/>},
      {name: 'Domicilios',      component: <Domicilios/>},
      {name: 'RedFamiliar',     component: <RedFamiliar/>},
      {name: 'Estudios',        component: <Estudios/>},
      {name: 'Ocupacion',       component: <Ocupacion/>},
      {name: 'Sustancias',      component: <Sustancias/>},
    ];

    return (

      <Grid>
        <Row style={{backgroundColor: '#607D8B', height:70}}>
          <Col>
            <Card>
              <CardItem>
                <Body>
                  <Text style={{ fontSize:13, fontWeight:'bold' }}>
                    CARPETA JUDICIAL: {this.state.carpetaJudicial}
                  </Text>
                </Body>
              </CardItem>
              <CardItem style={{ marginTop:-20, marginBottom:-20 }}>
                <Body>
                  <Text style={{ fontSize:13, fontWeight:'bold' }}>
                    IMPUTADO: {this.state.imputado.nombre + " " + this.state.imputado.primerApellido + " " + this.state.imputado.segundoApellido}
                  </Text>
                </Body>
              </CardItem>
            </Card>
          </Col>
        </Row>

        <StepIndicator
          stepCount={6}
          currentPosition={2}
          customStyles={customStylesSteps}
          labels={labelsSteps}
        />

        <MultiStep steps={steps} onFinish={this.terminarEntrevista}/>
      </Grid>

    );
  }
}
