import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator } from 'react-native';
import { Button, Text, Item, Input, Card, CardItem, Body } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from "react-native-easy-grid";
import axios from 'axios';
import GLOBALS from '../Utils/Globals';
import Modal from "react-native-modal";

export default class Domicilios extends React.Component {

  constructor(props){
    super(props)
    this.state = {
    };
  }

  nextPreprocess = () => {
    this.props.saveState(1,{domicilios:'valores domicilios'});
    this.props.nextFn()
  }
  
  previousPreprocess = () => {
    this.props.prevFn();
  }

  openModal = () => {
    console.warn("Open modal");
  }

  render() {
    return (
      <Grid>
        <Row style={{flexDirection: "row", alignItems:'center'}}>
          <Col>
            <Button danger onPress={this.openModal} style={{position: 'absolute', right:10, bottom: 10, width:50, height:50, borderRadius: 25}}>
              <Icon name='plus' style={{fontSize: 20, color: 'white'}}/>
            </Button>
          </Col>
        </Row>

        <Row>
          <Col style={{ paddingHorizontal:15 }}>
            <Text style={{marginVertical:10, textAlign:'center', color: GLOBALS.COLORS.BACKGROUND_PRIMARY, fontWeight:'bold'}}>
              DOMICILIOS:
            </Text>
          </Col>
        </Row>

        
        <Row>
          <Col>
            <Card>
              <CardItem>
                <Icon active name="home" style={{fontSize: 18, marginRight:5}} />
                <Text>Viena 214, Del Carmen, 04100 Ciudad de México, CDMX</Text>
              </CardItem>
            </Card>
          </Col>
        </Row>
       
        <Row>
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
