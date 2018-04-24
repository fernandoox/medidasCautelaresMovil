import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { Button, Text, Item, Input, H3, Separator, ListItem } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import axios from 'axios';
import GLOBALS from '../Utils/Globals';
import MultiStep from 'react-native-multistep-wizard'
import InfoGeneral from './InfoGeneral';
import Test from './Test';
import Login from './Login';

export default class Entrevista extends React.Component {
  // Header Screen
  static navigationOptions = {
    title: 'Entrevista',
  };

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

  finish = (wizardState) => {
    Alert.alert('Finish ...', JSON.stringify(wizardState), [{text: 'OK'}], { cancelable: false });   
  }

  render() {
    
    const steps = [
      {name: 'StepOne', component: <InfoGeneral testProp={this.state.carpetaJudicial}/>},
      {name: 'StepTwo', component: <Test />},
      {name: 'StepThree', component: <Login/>},
    ];

    return (
      <KeyboardAvoidingView behavior="position">
        <ScrollView keyboardDismissMode="none" overScrollMode="never">
          <Grid>

            <Row size={20}>
              <Col>
                <Separator bordered style={{backgroundColor: '#D66F59', paddingLeft:10}}>
                  <Text style={{fontSize:14, fontWeight:'bold', color: 'white'}}>
                    CARPETA JUDICIAL
                  </Text>
                </Separator>
                <ListItem style={{paddingTop: -5, paddingBottom: -5}}>
                  <Text style={{fontSize:16, fontWeight:'bold'}}>{this.state.carpetaJudicial}</Text>
                </ListItem>
                <Separator bordered style={{backgroundColor: '#D66F59', paddingLeft:10}}>
                  <Text style={{fontSize:14, fontWeight:'bold', color: 'white'}}>IMPUTADO</Text>
                </Separator>
                <ListItem style={{paddingTop: -5, paddingBottom: -5}}>
                  <Text style={{fontSize:16, fontWeight:'bold'}}>{this.state.imputado.nombre + " " + this.state.imputado.apellidoP + " " + this.state.imputado.apellidoM}</Text>
                </ListItem>
              </Col>
            </Row>

            <MultiStep steps={steps} onFinish={this.finish}/>

          </Grid>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
