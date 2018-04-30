import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { Button, Text, Item, Input, H3, Separator, ListItem, Card, CardItem, Body } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import axios from 'axios';
import GLOBALS from '../Utils/Globals';
import MultiStep from 'react-native-multistep-wizard'
import DatosGenerales from './DatosGenerales';
import Test from './Test';
import Login from './Login';

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
  //http://medidascautelares.tsjcdmx.gob.mx/sscmc
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
    Alert.alert('FINISH DATOS GEN...', JSON.stringify(jsonBaseEntrevista), [{text: 'OK'}], { cancelable: false });   
  }


  render() {
    
    const steps = [
      {name: 'DatosGenerales', component: <DatosGenerales testProp={this.state.carpetaJudicial}/>},
      {name: 'StepTwo', component: <Test/>},
      {name: 'StepThree', component: <Login/>},
    ];

    return (
      <KeyboardAvoidingView behavior="position">
      <ScrollView keyboardShouldPersistTaps="handled" >
      <Grid>

        <Row style={{backgroundColor: GLOBALS.COLORS.BACKGROUND_PRIMARY, height:110}}>
          <Col>
            <Card>
              <CardItem>
                <Body>
                  <Text style={{ fontSize:15, fontWeight:'bold', textDecorationLine: 'underline' }}>
                    CARPETA JUDICIAL: {this.state.carpetaJudicial}
                  </Text>
                </Body>
              </CardItem>
              <CardItem style={{ marginTop:-15, marginBottom: -15 }}>
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
      </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}