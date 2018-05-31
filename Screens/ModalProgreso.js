import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
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
      jsonBase: {},
      jsonGenerales: {},
      jsonDomicilios: {},
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
      this.setState({jsonGenerales: response});
      this.setState({jsonBase: jsonBaseEntrevistaLocal});
    }).catch(err => {
      console.warn("ERROR ASYNC GENERALES: "+err.message);
    })
    
     //Load JSON Domicilios
    storage.load({
      key: 'datosDomiciliosStorage',
    }).then((response) => {
      jsonBaseEntrevistaLocal.domicilios = response;
      this.setState({jsonDomicilios: response});
      this.setState({jsonBase: jsonBaseEntrevistaLocal});
    }).catch(err => {
      console.warn("ERROR ASYNC DOMICILIOS: "+err.message);
    })
    
    console.log("JSON Base: " + JSON.stringify(this.state.jsonBase))
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
                <Text style={[styles.labelInfo]}>
                  CARPETA JUDICIAL: {this.props.carpetaJudicial}
                </Text>
              </Body>
            </CardItem>
            <CardItem style={{ marginTop:-10, marginBottom:0, paddingTop:-20, paddingBottom:-10 }}>
              <Body>
                <Text style={[styles.labelInfo]}>
                  IMPUTADO: {this.props.imputado.nombre + " " + this.props.imputado.primerApellido + " " + this.props.imputado.segundoApellido}
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
          <Badge style={{marginVertical:5, backgroundColor:'transparent',  borderWidth:1, borderColor: (this.state.jsonGenerales.completo) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN}}>
            <Icon 
              name={(this.state.jsonGenerales.completo) ? "check" : "times"} 
              style={{ marginRight:10, fontSize: 15, color: (this.state.jsonGenerales.completo) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN, position:'absolute', top:5, left:5}}
            />
            <Text style={{marginLeft:10,  color: (this.state.jsonGenerales.completo) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN }}>Completo</Text>
          </Badge>
          </TouchableOpacity>
        </Col>
 
        <Col style={[styles.columnStep]}>
        <TouchableOpacity onPress={() => { this.changeStep(1) }} style={{ padding:15 }}>
          <Text style={[styles.titleStep]}>Domicilios</Text>
          <Badge style={{marginVertical:5, backgroundColor:'transparent',  borderWidth:1, borderColor: (this.state.jsonDomicilios.completo) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN}}>
            <Icon 
              name={(this.state.jsonDomicilios.completo) ? "check" : "times"} 
              style={{ marginRight:10, fontSize: 15, color: (this.state.jsonDomicilios.completo) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN, position:'absolute', top:5, left:5}}
            />
            <Text style={{marginLeft:10,  color: (this.state.jsonDomicilios.completo) ? COLORS.LIGHT_SUCCESS : COLORS.LIGHT_WARN }}>Completo</Text>
          </Badge>
          </TouchableOpacity>
        </Col>

      </Row>

      <Row>

        <Col style={[styles.columnStep]}>
        <TouchableOpacity onPress={() => { this.changeStep(2) }} style={{ padding:15 }}>
          <Text style={[styles.titleStep]}>Familia</Text>
          <Badge style={{backgroundColor: 'transparent', borderWidth:1, borderColor:COLORS.LIGHT_ERROR}}>
            <Icon name="times" style={{ marginRight:10, fontSize: 15, color: COLORS.LIGHT_ERROR, position:'absolute', top:5, left:5}}/>
            <Text style={{marginLeft:10, color: COLORS.LIGHT_ERROR}}>Completo</Text>
          </Badge>
        </TouchableOpacity>
        </Col>
        
        <Col style={[styles.columnStep]}>
        <TouchableOpacity onPress={() => { this.changeStep(3) }} style={{ padding:15 }}>
          <Text style={[styles.titleStep]}>Estudios</Text>
          <Badge style={{marginVertical:5, backgroundColor:'transparent',  borderWidth:1 ,borderColor: COLORS.LIGHT_SUCCESS}}>
            <Icon name="check" style={{ marginRight:10, fontSize: 15, color: COLORS.LIGHT_SUCCESS, position:'absolute', top:5, left:5}}/>
            <Text style={{marginLeft:10,  color: COLORS.LIGHT_SUCCESS }}>Completo</Text>
          </Badge>
        </TouchableOpacity>
        </Col>

      </Row>

      <Row>
        
      <Col style={[styles.columnStep]}>
        <TouchableOpacity onPress={() => { this.changeStep(4) }} style={{ padding:15 }}>
          <Text style={[styles.titleStep]}>Ocupación</Text>
          <Badge style={{marginVertical:5, backgroundColor:'transparent',  borderWidth:1 ,borderColor: COLORS.LIGHT_SUCCESS}}>
            <Icon name="check" style={{ marginRight:10, fontSize: 15, color: COLORS.LIGHT_SUCCESS, position:'absolute', top:5, left:5}}/>
            <Text style={{marginLeft:10,  color: COLORS.LIGHT_SUCCESS }}>Completo</Text>
          </Badge>
        </TouchableOpacity>
        </Col>

        <Col style={[styles.columnStep]}>
        <TouchableOpacity onPress={() => { this.changeStep(5) }} style={{ padding:15 }}>
          <Text style={[styles.titleStep]}>Sustancias</Text>
          <Badge style={{backgroundColor: 'transparent', borderWidth:1, borderColor:COLORS.LIGHT_ERROR}}>
            <Icon name="times" style={{ marginRight:10, fontSize: 15, color: COLORS.LIGHT_ERROR, position:'absolute', top:5, left:5}}/>
            <Text style={{marginLeft:10, color: COLORS.LIGHT_ERROR}}>Completo</Text>
          </Badge>
        </TouchableOpacity>
        </Col>
        
      </Row>
      <Row>
        <Col>
          <Text>{JSON.stringify(this.state.jsonBase)}</Text>
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
//
const styles = StyleSheet.create({
  labelInfo: {
    fontSize:15, 
    fontWeight:'bold', 
    color: COLORS.BACKGROUND_PRIMARY
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