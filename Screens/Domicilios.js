import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, ScrollView, KeyboardAvoidingView, Dimensions } from 'react-native';
import { Button, Text, Item, Input, Label, Card, CardItem, Body } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from "react-native-easy-grid";
import axios from 'axios';
import GLOBALS from '../Utils/Globals';
import Modal from "react-native-modal";
import ActionButton from 'react-native-action-button';
import AgregarDomicilio from './AgregarDomicilio'

let deviceWidth = Dimensions.get("window").width;
let deviceHeight = Dimensions.get("window").height;

export default class Domicilios extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      isModalVisible: false,
      domicilios: [],
    };
  }

  _toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }
  
  agregarDomicilio = (stateDomicilio) => {
    this.state.domicilios.push(stateDomicilio)
    console.warn(JSON.stringify(this.state.domicilios))
    this._toggleModal();
  }

  nextPreprocess = () => {
    this.props.saveState(1,{domicilios:'valores domicilios'});
    this.props.nextFn()
  }
  
  previousPreprocess = () => {
    this.props.prevFn();
  }

  render() {
    return (

      <View>
      <ScrollView style={{height:(deviceHeight-100)}} overScrollMode="never">
      <Grid style={{paddingBottom: 120}}>

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
              <CardItem style={{marginBottom:-10}}>
                <Icon active name="map-marker" style={{fontSize: 18, marginRight:8}} />
                <Text>Viena 214, Del Carmen, 04100 Ciudad de México, CDMX</Text>
              </CardItem>
              <CardItem style={{marginBottom:-10}}>
                <Icon active name="tag" style={{fontSize: 18, marginRight:8}} />
                <Text>Tipo domicilio: Actual</Text>
              </CardItem>
              <CardItem style={{marginBottom:-10}}>
                <Icon active name="calendar" style={{fontSize: 18, marginRight:8}} />
                <Text>Horarios en los que se encuentra: 14:00 a 19:00</Text>
              </CardItem>
              <CardItem style={{marginBottom:-10}}>
                <Icon active name="phone" style={{fontSize: 18, marginRight:8}} />
                <Text>Teléfono: 2414197940</Text>
              </CardItem>
              <CardItem style={{marginBottom:-10}}>
                <Col>
                <Button transparent full>
                  <Icon active name="trash" style={{color:GLOBALS.COLORS.TEXT_WARN, fontSize:17}}/>
                  <Text style={{color:GLOBALS.COLORS.TEXT_WARN}}>Eliminar domicilio</Text>
                </Button>
                </Col>
              </CardItem>
            </Card>

             <Card>
              <CardItem style={{marginBottom:-10}}>
                <Icon active name="map-marker" style={{fontSize: 18, marginRight:8}} />
                <Text>Viena 214, Del Carmen, 04100 Ciudad de México, CDMX</Text>
              </CardItem>
              <CardItem style={{marginBottom:-10}}>
                <Icon active name="tag" style={{fontSize: 18, marginRight:8}} />
                <Text>Tipo domicilio: Actual</Text>
              </CardItem>
              <CardItem style={{marginBottom:-10}}>
                <Icon active name="calendar" style={{fontSize: 18, marginRight:8}} />
                <Text>Horarios en los que se encuentra: 14:00 a 19:00</Text>
              </CardItem>
              <CardItem style={{marginBottom:-10}}>
                <Icon active name="phone" style={{fontSize: 18, marginRight:8}} />
                <Text>Teléfono: 2414197940</Text>
              </CardItem>
              <CardItem style={{marginBottom:-10}}>
                <Col>
                <Button transparent full>
                  <Icon active name="trash" style={{color:GLOBALS.COLORS.TEXT_WARN, fontSize:17}}/>
                  <Text style={{color:GLOBALS.COLORS.TEXT_WARN}}>Eliminar domicilio</Text>
                </Button>
                </Col>
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
            <Button full rounded light onPress={this.nextPreprocess}>
              <Text>Siguiente</Text>
            </Button>
          </Col>
        </Row>
        </Grid>
        </ScrollView>
        
        <Modal isVisible={this.state.isModalVisible} avoidKeyboard={false}>
          <AgregarDomicilio agregarDomicilioChild={this.agregarDomicilio}/>
        </Modal>

        <View style={{position:'absolute', bottom:100, right:10, height: 80, }}>
          <Button danger onPress={this._toggleModal} style={{width: 60, height: 60, borderRadius: 30}}>
            <Text>add</Text>
          </Button>
        </View>

        </View>
    );
  }
}
