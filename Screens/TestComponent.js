import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Button, Text, Item, Input, H3, Card, CardItem, Body, Badge } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import GLOBALS from '../Utils/Globals';
import Storage from 'react-native-storage';

export default class TestComponent extends React.Component {

  constructor(props){
    super(props)
    this.state = {
    };
  }

  componentDidMount(){
    // load
    storage.load({
      key: 'jsonBaseEntrevistaStorage',
        
      // autoSync(default true) means if data not found or expired,
      // then invoke the corresponding sync method
      autoSync: true,
        
      // syncInBackground(default true) means if data expired,
      // return the outdated data first while invoke the sync method.
      // It can be set to false to always return data provided by sync method when expired.(Of course it's slower)
      syncInBackground: true,
    }).then(ret => {
      // found data go to then()
      console.log("Load in Async Modal: "+JSON.stringify(ret));
    }).catch(err => {
      // any exception including data not found 
      // goes to catch()
      console.warn(err.message);
      switch (err.name) {
          case 'NotFoundError':
              // TODO;
              break;
            case 'ExpiredError':
                // TODO
                break;
      }
    })
  }

  changeStep = (numberStep) => {
    console.warn("Step progress: "+numberStep)
  }

  render() {
    return (
    <Grid style={{backgroundColor:'white'}}>
      
      <Row style={{backgroundColor: '#607D8B', height:100}}>
        <Col>
          <Card>
            <CardItem>
              <Body>
                <Text style={{ fontSize:15, fontWeight:'bold', color: GLOBALS.COLORS.BACKGROUND_PRIMARY }}>
                  CARPETA JUDICIAL: {this.props.carpetaJudicial}
                </Text>
              </Body>
            </CardItem>
            <CardItem style={{ marginTop:-10, marginBottom:0, paddingTop:-20, paddingBottom:-10 }}>
              <Body>
                <Text style={{ fontSize:15, fontWeight:'bold', color: GLOBALS.COLORS.BACKGROUND_PRIMARY }}>
                  IMPUTADO: {this.props.imputado.nombre + " " + this.props.imputado.primerApellido + " " + this.props.imputado.segundoApellido}
                </Text>
              </Body>
            </CardItem>
          </Card>
        </Col>
      </Row>

      <Row>
        
        <Col style={{justifyContent:'center', margin:5, padding:15, borderRadius:5, borderColor: GLOBALS.COLORS.BACKGROUND_PRIMARY, borderWidth: 2 }}>
          <Text style={{color: 'teal', textAlign: 'center', fontWeight: 'bold'}}>Generales</Text>
        </Col>

        
        <Col style={{ margin:5, padding:15, borderRadius:5, borderColor: GLOBALS.COLORS.BACKGROUND_PRIMARY, borderWidth: 2 }}>
          <TouchableOpacity onPress={this.changeStep(1)}>
            <Text style={{color: 'teal', textAlign: 'center', fontWeight: 'bold'}}>Domicilios</Text>
            <Badge style={{backgroundColor: 'crimson'}}>
              <Text>Terminado</Text>
            </Badge>
          </TouchableOpacity>
        </Col>
        
      </Row>

      <Row>
        <Col style={{ margin:5, padding:15, borderRadius:5, borderColor: GLOBALS.COLORS.BACKGROUND_PRIMARY, borderWidth: 2 }}>
          <Text style={{color: 'teal', textAlign: 'center', fontWeight: 'bold'}}>Familia</Text>
        </Col>
        <Col style={{ margin:5, padding:15, borderRadius:5, borderColor: GLOBALS.COLORS.BACKGROUND_PRIMARY, borderWidth: 2 }}>
          <Text style={{color: 'teal', textAlign: 'center', fontWeight: 'bold'}}>Estudios</Text>
          <Badge style={{backgroundColor: 'teal'}}>
            <Icon name="check" style={{ marginRight:10, fontSize: 15, color: "white", position:'absolute', top:5, left:5}}/>
            <Text style={{marginLeft:10}}>Confirmado</Text>
          </Badge>
        </Col>
      </Row>

      <Row>
        <Col style={{ margin:5, padding:15, borderRadius:5, borderColor: GLOBALS.COLORS.BACKGROUND_PRIMARY, borderWidth: 2 }}>
          <Text style={{color: 'teal', textAlign: 'center', fontWeight: 'bold'}}>Ocupación</Text>
        </Col>
        <Col style={{ margin:5, padding:15, borderRadius:5, borderColor: GLOBALS.COLORS.BACKGROUND_PRIMARY, borderWidth: 2 }}>
          <Text style={{color: 'teal', textAlign: 'center', fontWeight: 'bold'}}>Sustancias</Text>
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
