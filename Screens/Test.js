import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Button, Text, Item, Input, H3 } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import axios from 'axios';
import GLOBALS from '../Utils/Globals';

export default class Test extends React.Component {
  // Header Screen
  static navigationOptions = {
    title: 'Imputado temporal',
  }

  constructor(props){
    super(props)
    this.state = {
    };
  }



  nextPreprocess = () => {
    console.log("Siguiente test...");
    // Save step state for use in other steps of the wizard
    this.props.saveState(1,{hola:'value dos'});
    this.props.nextFn()
  }
  
  previousPreprocess = () => {
    console.log("Anterior test...");
    // Go to previous step
    this.props.prevFn();
  }

  render() {
    return (
          <Grid>
            <Row>
              <Col style={{ paddingHorizontal:15 }}>
                <Text style={{color: 'teal'}}>IMPUTADO TEMPORAL SIN CONEXIÓN</Text>
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
