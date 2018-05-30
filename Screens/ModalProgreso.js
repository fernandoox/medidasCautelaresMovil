import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Button, Text, Item, Input, H3, Card, CardItem, Body, Badge } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import GLOBALS from '../Utils/Globals';
import Storage from 'react-native-storage';

export default class ModalProgreso extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      jsonGenerales: {},
    };
    jsonBaseEntrevistaLocal = {}
  }

  componentDidMount(){
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
      console.warn("JSON Mamalon: "+JSON.stringify(jsonBaseEntrevistaLocal));
      this.setState({jsonGenerales: response});
    }).catch(err => {
      console.warn("ERROR ASYNC GENERALES: "+err.message);
    })
  }

  changeStep = (numberStep) => {
    this.props.changeStepChild(numberStep);
  }

  render() {
    return (
    <Grid style={{backgroundColor:'white'}}>
      
      <Row style={{backgroundColor: '#607D8B', height:100}}>
        <Col>
          <Card>
            <CardItem>
              <Body>
                <Text style={{ fontSize:15, fontWeight:'bold', color: COLORS.BACKGROUND_PRIMARY }}>
                  CARPETA JUDICIAL: {this.props.carpetaJudicial}
                </Text>
              </Body>
            </CardItem>
            <CardItem style={{ marginTop:-10, marginBottom:0, paddingTop:-20, paddingBottom:-10 }}>
              <Body>
                <Text style={{ fontSize:15, fontWeight:'bold', color: COLORS.BACKGROUND_PRIMARY }}>
                  IMPUTADO: {this.props.imputado.nombre + " " + this.props.imputado.primerApellido + " " + this.props.imputado.segundoApellido}
                </Text>
              </Body>
            </CardItem>
          </Card>
        </Col>
      </Row>

      <Row>
        
        <Col style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin:5, borderRadius:5, borderColor: COLORS.BACKGROUND_PRIMARY, borderWidth: 2 }}>
        <TouchableOpacity onPress={() => { this.changeStep(0) }} style={{ padding:15 }}>
          <Text style={{color: COLORS.TEXT_SECONDARY, textAlign: 'center', fontWeight: 'bold'}}>Generales</Text>
          <Badge style={{marginVertical:5, backgroundColor:'transparent',  borderWidth:1, borderColor: (this.state.jsonGenerales.completo) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN}}>
            <Icon name={(this.state.jsonGenerales.completo) ? "check" : "times"} style={{ marginRight:10, fontSize: 15, color: (this.state.jsonGenerales.completo) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN, position:'absolute', top:5, left:5}}/>
            <Text style={{marginLeft:10,  color: (this.state.jsonGenerales.completo) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN }}>Completo</Text>
          </Badge>
          </TouchableOpacity>
        </Col>
 
        <Col style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin:5, borderRadius:5, borderColor: COLORS.BACKGROUND_PRIMARY, borderWidth: 2 }}>
        <TouchableOpacity onPress={() => { this.changeStep(1) }} style={{ padding:15 }}>
          <Text style={{color: COLORS.TEXT_SECONDARY, textAlign: 'center', fontWeight: 'bold'}}>Domicilios</Text>
          <Badge style={{backgroundColor:'transparent',  borderWidth:1 ,borderColor: COLORS.LIGHT_SUCCESS}}>
            <Icon name="check" style={{ marginRight:10, fontSize: 15, color: COLORS.LIGHT_SUCCESS, position:'absolute', top:5, left:5}}/>
            <Text style={{marginLeft:10,  color: COLORS.LIGHT_SUCCESS }}>Completo</Text>
          </Badge>
          </TouchableOpacity>
        </Col>

      </Row>

      <Row>

        <Col style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin:5, borderRadius:5, borderColor: COLORS.BACKGROUND_PRIMARY, borderWidth: 2 }}>
        <TouchableOpacity onPress={() => { this.changeStep(2) }} style={{ padding:15 }}>
          <Text style={{color: COLORS.TEXT_SECONDARY, textAlign: 'center', fontWeight: 'bold'}}>Familia</Text>
          <Badge style={{backgroundColor: 'transparent', borderWidth:1, borderColor:COLORS.LIGHT_ERROR}}>
            <Icon name="times" style={{ marginRight:10, fontSize: 15, color: COLORS.LIGHT_ERROR, position:'absolute', top:5, left:5}}/>
            <Text style={{marginLeft:10, color: COLORS.LIGHT_ERROR}}>Completo</Text>
          </Badge>
        </TouchableOpacity>
        </Col>
        
        <Col style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin:5, borderRadius:5, borderColor: COLORS.BACKGROUND_PRIMARY, borderWidth: 2 }}>
        <TouchableOpacity onPress={() => { this.changeStep(3) }} style={{ padding:15 }}>
          <Text style={{color: COLORS.TEXT_SECONDARY, textAlign: 'center', fontWeight: 'bold'}}>Estudios</Text>
          <Badge style={{marginVertical:5, backgroundColor:'transparent',  borderWidth:1 ,borderColor: COLORS.LIGHT_SUCCESS}}>
            <Icon name="check" style={{ marginRight:10, fontSize: 15, color: COLORS.LIGHT_SUCCESS, position:'absolute', top:5, left:5}}/>
            <Text style={{marginLeft:10,  color: COLORS.LIGHT_SUCCESS }}>Completo</Text>
          </Badge>
        </TouchableOpacity>
        </Col>

      </Row>

      <Row>
        
      <Col style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin:5, borderRadius:5, borderColor: COLORS.BACKGROUND_PRIMARY, borderWidth: 2 }}>
        <TouchableOpacity onPress={() => { this.changeStep(4) }} style={{ padding:15 }}>
          <Text style={{color: COLORS.TEXT_SECONDARY, textAlign: 'center', fontWeight: 'bold'}}>Ocupación</Text>
          <Badge style={{marginVertical:5, backgroundColor:'transparent',  borderWidth:1 ,borderColor: COLORS.LIGHT_SUCCESS}}>
            <Icon name="check" style={{ marginRight:10, fontSize: 15, color: COLORS.LIGHT_SUCCESS, position:'absolute', top:5, left:5}}/>
            <Text style={{marginLeft:10,  color: COLORS.LIGHT_SUCCESS }}>Completo</Text>
          </Badge>
        </TouchableOpacity>
        </Col>

        <Col style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin:5, borderRadius:5, borderColor: COLORS.BACKGROUND_PRIMARY, borderWidth: 2 }}>
        <TouchableOpacity onPress={() => { this.changeStep(5) }} style={{ padding:15 }}>
          <Text style={{color: COLORS.TEXT_SECONDARY, textAlign: 'center', fontWeight: 'bold'}}>Sustancias</Text>
          <Badge style={{backgroundColor: 'transparent', borderWidth:1, borderColor:COLORS.LIGHT_ERROR}}>
            <Icon name="times" style={{ marginRight:10, fontSize: 15, color: COLORS.LIGHT_ERROR, position:'absolute', top:5, left:5}}/>
            <Text style={{marginLeft:10, color: COLORS.LIGHT_ERROR}}>Completo</Text>
          </Badge>
        </TouchableOpacity>
        </Col>
        
      </Row>

      <Row>
        <Col style={{ padding:15, justifyContent:'center' }}>
          <Button danger full>
            <Text>Terminar entrevista</Text>
          </Button>
        </Col>
      </Row>

    </Grid>
    );
  }
}
