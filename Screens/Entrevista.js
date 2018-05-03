import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { Button, Text, Item, Input, H3, Separator, ListItem, Card, CardItem, Body } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import axios from 'axios';
import GLOBALS from '../Utils/Globals';
import MultiStep from 'react-native-multistep-wizard'
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

        <Row style={{backgroundColor: '#607D8B', height:90}}>
          <Col>
            <Card>
              <CardItem>
                <Body>
                  <Text style={{ fontSize:15, fontWeight:'bold' }}>
                    CARPETA JUDICIAL: {this.state.carpetaJudicial}
                  </Text>
                </Body>
              </CardItem>
              <CardItem style={{ marginTop:-15, marginBottom:-15,}}>
                <Body>
                  <Text style={{ fontSize:15, fontWeight:'bold' }}>
                    IMPUTADO: {this.state.imputado.nombre + " " + this.state.imputado.primerApellido + " " + this.state.imputado.segundoApellido}
                  </Text>
                </Body>
              </CardItem>
            </Card>
          </Col>
        </Row>

        <MultiStep steps={steps} onFinish={this.terminarEntrevista}/>

      </Grid>

    );
  }
}
