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
    <Grid>
      <Row>
        <Col style={{ paddingHorizontal:15 }}>
          <Text style={{color: 'green'}}>CUADRICULA DASHBOARD</Text>
        </Col>
      </Row>
    </Grid>
    );
  }
}
