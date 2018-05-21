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
import CatDelegacionesData from '../Utils/Catalogos/Delegaciones.json';
import CatTiposDomicilioData from '../Utils/Catalogos/TiposDomicilio.json';

const { width, height } = Dimensions.get('window');


export default class Domicilios extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      isModalVisible: false,
      domicilios: [],
      DelegacionesCat: CatDelegacionesData,
      TiposDomicilioCat: CatTiposDomicilioData,
    };
  }

  _toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }
  
  agregarDomicilio = (stateDomicilio) => {
    this.state.domicilios.push(stateDomicilio)
    this._toggleModal();
  }

  domicilioToString = (domicilio) => {
    let domicilioStr =  domicilioStr = domicilio.SN_CALLE + " " + domicilio.SN_NUM_EXTERIOR + ", " +
                        domicilio.SN_COLONIA+", C.P. " + domicilio.SN_CODIGO_POSTAL + 
                        ", " + this.getDelegacionById(domicilio.ID_NU_MUNICIPIO) + ", Ciudad de México";
    return domicilioStr;
  }

  getDelegacionById = (idParam) => {
    function delegacion(delegacion) { 
      return delegacion.id === idParam;
    }
    let strDelegacion = this.state.DelegacionesCat.find(delegacion).nombre
    return strDelegacion.charAt(0).toUpperCase() + strDelegacion.slice(1);
  }

  render() {
    return (

      <View>
      <ScrollView keyboardShouldPersistTaps="always" keyboardDismissMode="interactive" overScrollMode="never">
      <Grid>

        <Row>
          <Col style={{ paddingHorizontal:15 }}>
            <Text style={{marginVertical:10, textAlign:'center', color: GLOBALS.COLORS.BACKGROUND_PRIMARY, fontWeight:'bold'}}>
              DOMICILIOS:
            </Text>
          </Col>
        </Row>
        
        <Row>
          <Col>
          {
            this.state.domicilios.map((domicilio) => {
              return (
                  <Card key={domicilio}>
                  <CardItem style={{marginBottom:-10}}>
                    <Icon active name="map-marker" style={{fontSize: 18, marginRight:8}} />
                    <Text>{this.domicilioToString(domicilio)}</Text>
                  </CardItem>
                  <CardItem style={{marginBottom:-10}}>
                    <Icon active name="tag" style={{fontSize: 18, marginRight:8}} />
                    <Text>Tipo domicilio: Actual</Text>
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
              );
            })
          }
            
          </Col>
        </Row>

        <Row>
          <Col style={{padding:5}}>
            <Button full rounded light>
              <Text>Confirmar</Text>
            </Button>
          </Col>
        </Row>
        </Grid>
        </ScrollView>
        
        <View style={{flexGrow: 1}}>
        <Modal style={{flexGrow: 1, minHeight: 50,}} isVisible={this.state.isModalVisible}>
          <AgregarDomicilio agregarDomicilioChild={this.agregarDomicilio} cerrarModal={this._toggleModal}/>
        </Modal>
        </View>

        <View style={{position:'absolute', bottom:0, right:-10, height: 80, }}>
          <Button danger onPress={this._toggleModal} style={{width: 60, height: 60, borderRadius: 30}}>
            <Text>add</Text>
          </Button>
        </View>

        </View>
    );
  }
}
