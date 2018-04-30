import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { Button, Text, Item, Input, H3, Separator, ListItem } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import DatePicker from 'react-native-datepicker'
import axios from 'axios';
import GLOBALS from '../Utils/Globals';
import preguntasDatosGeneralesData from '../Utils/Preguntas/DatosGenerales.json';

export default class DatosGenerales extends React.Component {
  // Header Screen
  static navigationOptions = {
    title: 'Imputado temporal',
  }

  constructor(props){
    super(props)
    this.state = {
      isConnected: null,
      preguntas: preguntasDatosGeneralesData,
    };
    jsonDatosGenerales = {
      fechaEntrevista: "FECHA ENTREVISTa",
      horaEntrevista: "HORA ENTREVISTA"
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

  nextPreprocess = () => {
    console.log("Siguiente general...");
    Alert.alert('nextgen JSON ...', JSON.stringify(jsonDatosGenerales), [{text: 'OK'}], { cancelable: false });   

    // Save step state for use in other steps of the wizard
    this.props.saveState(0,{datosGenerales:jsonDatosGenerales});
    this.props.nextFn()
  }
  
  previousPreprocess = () => {
    console.log("Anterior general...");
    // Go to previous step
    this.props.prevFn();
  }

  render() {
    return (

          <Grid>
            <Row>
              <Col style={{ paddingHorizontal:15 }}>
                <Text style={{marginVertical:10, textAlign:'center', color: GLOBALS.COLORS.BACKGROUND_PRIMARY, fontWeight:'bold'}}>
                  DATOS GENERALES {/*- CP: {this.props.testProp}*/}
                </Text>
                {/* Iterar el JSON de Preguntas */}
                {
                  this.state.preguntas.map((preg, i) => {
                    return (
                      <Item style={{marginVertical: 8}} key={i}>
                        <Input
                          placeholder={preg.pregunta}
                          placeholderTextColor='#2C4743'
                          style={{color:'#2C4743', fontSize: 16}}/>
                      </Item>
                    )
                  })
                }
              </Col>
            </Row>
                
            <Row size={20}>
              <Col style={{padding:5}}>
                <Button full rounded light onPress={this.previousPreprocess}>
                  <Text>Anterior</Text>
                </Button>
              </Col>
              <Col style={{padding:5}}>
                <Button full rounded danger onPress={this.nextPreprocess}>
                  <Text>Siguiente</Text>
                </Button>
              </Col>
            </Row>

          </Grid>

    );
  }
}
