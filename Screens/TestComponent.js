import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Button, Text, Item, Input, H3 } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import axios from 'axios';
import GLOBALS from '../Utils/Globals';

export default class Sustancias extends React.Component {

  constructor(props){
    super(props)
    this.state = {
    };
  }

  nextPreprocess = () => {
    this.props.nextFn()
  }
  
  previousPreprocess = () => {
    this.props.prevFn();
  }

  render() {
    return (
          <Grid>
            <Row>
              <Col style={{ paddingHorizontal:15 }}>
                <Text style={{color: 'green'}}>PASO 6 - FIN : CONSUMO DE SUSTANCIAS!!...</Text>
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
