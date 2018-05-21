import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Button, Text, Item, Input, H3 } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import axios from 'axios';
import GLOBALS from '../Utils/Globals';

export default class TestComponent extends React.Component {

  constructor(props){
    super(props)
    this.state = {
    };
  }

  render() {
    return (
    <Grid style={{backgroundColor:'white'}}>

      <Row>
        <Col style={{ padding:15 }}>
          <Text style={{color: GLOBALS.COLORS.BACKGROUND_PRIMARY, textAlign:'center'}}>Imputado: XXXXXXX</Text>
        </Col>
      </Row>

      <Row>
        <Col style={{ margin:5, padding:15, borderRadius:5, borderColor: GLOBALS.COLORS.BACKGROUND_PRIMARY, borderWidth: 2 }}>
          <Text style={{color: 'teal', textAlign: 'center'}}>Generales</Text>
        </Col>
        <Col style={{ margin:5, padding:15, borderRadius:5, borderColor: GLOBALS.COLORS.BACKGROUND_PRIMARY, borderWidth: 2 }}>
          <Text style={{color: 'teal', textAlign: 'center'}}>Domicilios</Text>
        </Col>
      </Row>

      <Row>
        <Col style={{ margin:5, padding:15, borderRadius:5, borderColor: GLOBALS.COLORS.BACKGROUND_PRIMARY, borderWidth: 2 }}>
          <Text style={{color: 'teal', textAlign: 'center'}}>Familia</Text>
        </Col>
        <Col style={{ margin:5, padding:15, borderRadius:5, borderColor: GLOBALS.COLORS.BACKGROUND_PRIMARY, borderWidth: 2 }}>
          <Text style={{color: 'teal', textAlign: 'center'}}>Estudios</Text>
        </Col>
      </Row>

      <Row>
        <Col style={{ margin:5, padding:15, borderRadius:5, borderColor: GLOBALS.COLORS.BACKGROUND_PRIMARY, borderWidth: 2 }}>
          <Text style={{color: 'teal', textAlign: 'center'}}>Ocupación</Text>
        </Col>
        <Col style={{ margin:5, padding:15, borderRadius:5, borderColor: GLOBALS.COLORS.BACKGROUND_PRIMARY, borderWidth: 2 }}>
          <Text style={{color: 'teal', textAlign: 'center'}}>Sustancias</Text>
        </Col>
      </Row>

      <Row>
        <Col style={{ padding:15 }}>
          <Button danger full>
            <Text>Terminar entrevista</Text>
          </Button>
        </Col>
      </Row>

    </Grid>
    );
  }
}
