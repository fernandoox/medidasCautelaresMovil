import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Button, Text, Item, Input, H3, Separator, ListItem } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import DatePicker from 'react-native-datepicker'
import axios from 'axios';
import GLOBALS from '../Utils/Globals';
import preguntasData from '../Utils/Preguntas.json';

export default class DatosGenerales extends React.Component {
  // Header Screen
  static navigationOptions = {
    title: 'Imputado temporal',
  }

  constructor(props){
    super(props)
    this.state = {
      isConnected: null,
      preguntas: preguntasData,
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

  nextPreprocess = () => {
    console.log("Siguiente general...");
    // Save step state for use in other steps of the wizard
    this.props.saveState(0,{key1:'Info General Page 2'});
    this.props.nextFn()
  }
  
  previousPreprocess = () => {
    console.log("Anterior general...");
    // Go to previous step
    this.props.prevFn();
  }

  render() {
    return (

          <Grid style={{ paddingBottom:55 }}>
            <Row>
              <Col style={{ paddingHorizontal:15 }}>
                <Text style={{marginVertical:10, textAlign:'center', color: '#D66F59', fontWeight:'bold'}}>
                  Datos Generales {/*- CP: {this.props.testProp}*/}
                </Text>
                {/* Iterar el JSON de Preguntas */}
                {
                  this.state.preguntas.map((preg, i) => {
                    return (
                      <Item style={{marginVertical: 8}} key={i}>
                        <Input
                          placeholder={preg.pregunta}
                          placeholderTextColor='#2C4743'
                          style={{color:'#2C4743', fontSize: 18}}/>
                      </Item>
                    )
                  })
                }
              </Col>
            </Row>
                
            <Row size={20}>
              <Col>
                <Button full info onPress={this.previousPreprocess}>
                  <Text>Anterior</Text>
                </Button>
              </Col>
              <Col>
                <Button full onPress={this.nextPreprocess}>
                  <Text>Siguiente</Text>
                </Button>
              </Col>
            </Row>

          </Grid>

    );
  }
}
