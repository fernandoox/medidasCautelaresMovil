import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, ScrollView, KeyboardAvoidingView, Dimensions } from 'react-native';
import { Button, Text, Item, Input, Label, Card, CardItem, Body } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from "react-native-easy-grid";
import axios from 'axios';
import GLOBALS from '../Utils/Globals';
import Modal from "react-native-modal";
import Display from 'react-native-display';
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
      numeroDomicilios: 0,
      motivoVariosDomicilios: null,
      DelegacionesCat: CatDelegacionesData,
      TiposDomicilioCat: CatTiposDomicilioData,
    };
  }

  _toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }
  
  agregarDomicilio = (stateDomicilio) => {
    console.log("Domicilio parent: "+JSON.stringify(stateDomicilio));
    this.state.domicilios.push(stateDomicilio);
    this.setState({numeroDomicilios: Object.keys(this.state.domicilios).length});
    this._toggleModal();
  }

  domicilioToString = (domicilio) => {
    let calle = (domicilio.SN_CALLE != null) ? domicilio.SN_CALLE : "";
    let numExt = (domicilio.SN_NUM_EXTERIOR != null) ? domicilio.SN_NUM_EXTERIOR : "";
    let colonia = (domicilio.SN_COLONIA != null) ? domicilio.SN_COLONIA : "";
    let cPostal = (domicilio.SN_CODIGO_POSTAL != null) ? domicilio.SN_CODIGO_POSTAL : "";
    let municipio = (domicilio.ID_NU_MUNICIPIO != null) ? this.getDelegacionById(domicilio.ID_NU_MUNICIPIO) : "";
    
    let domicilioStr =  calle + " " + numExt + ", " + colonia + ", C.P. " + cPostal + ", " + municipio + ", Ciudad de México";
    return domicilioStr;
  }

  getDelegacionById = (idParam) => {
    function delegacion(delegacion) { 
      return delegacion.id === idParam;
    }
    let strDelegacion = this.state.DelegacionesCat.find(delegacion).nombre
    return strDelegacion.charAt(0).toUpperCase() + strDelegacion.slice(1);
  }

  getTipoDomicilioById = (idParam) => {
    function tipoDomicilio(tipoDomicilio) { 
      return tipoDomicilio.id === idParam;
    }
    return this.state.TiposDomicilioCat.find(tipoDomicilio).nombre;
  }

  removeDomicilioByIndex = (indexJSON) => {
    console.log("Remove item index: " + indexJSON);
    let jsonDomicilios = this.state.domicilios;
    // Remove 1 element from index
    jsonDomicilios.splice(indexJSON, 1);
    this.setState({domicilios: jsonDomicilios});
    this.setState({numeroDomicilios: Object.keys(this.state.domicilios).length});
  }

  render() {
    return (
      <View>
      <ScrollView keyboardShouldPersistTaps="always" keyboardDismissMode="interactive" overScrollMode="never">
      <Grid>

        <Row>
          <Col style={{ paddingHorizontal:15 }}>
            <Text style={{marginVertical:10, textAlign:'center', color: GLOBALS.COLORS.BACKGROUND_PRIMARY, fontWeight:'bold'}}>
              DOMICILIOS ({this.state.numeroDomicilios})
            </Text>
          </Col>
        </Row>

        <Display enable={this.state.numeroDomicilios > 1}
          enterDuration={500} enter="fadeInDown">
          <Row>
            <Col>
              <Item style={{marginVertical: 10}} stackedLabel>
                <Label>Razón de tener mas de un domicilio:</Label>
                <Input style={{fontSize: 16}} 
                  onChangeText={(motivoVariosDomicilios) => this.setState({motivoVariosDomicilios}) }/>
              </Item>
            </Col>
          </Row>
        </Display>

        <Row>
          <Col>
          {
            this.state.domicilios.map((domicilio, i) => {
              return (
                <Card key={i}>
                  <CardItem style={{marginBottom:-10}}>
                    <Icon active name="map-marker" style={{fontSize: 18, marginRight:8}} />
                    <Text>{this.domicilioToString(domicilio)}</Text>
                  </CardItem>
                  <CardItem style={{marginBottom:-10}}>
                    <Icon active name="tag" style={{fontSize: 18, marginRight:8}} />
                    <Text>Tipo domicilio: {(domicilio.ID_NU_TIPO_DOMICILIO != null) ? this.getTipoDomicilioById(domicilio.ID_NU_TIPO_DOMICILIO) : ""}</Text>
                  </CardItem>
                  <CardItem style={{marginBottom:-10}}>
                    <Icon active name="calendar" style={{fontSize: 18, marginRight:8}} />
                    <Text>Horarios: {(domicilio.SN_TIEMPO_VIVIR != null) ? domicilio.SN_TIEMPO_VIVIR : ""}</Text>
                  </CardItem>
                  <CardItem style={{marginBottom:-10}}>
                    <Icon active name="phone" style={{fontSize: 18, marginRight:8}} />
                    <Text>Teléfono: {(domicilio.TELEFONO != null) ? domicilio.TELEFONO : ""}</Text>
                  </CardItem>
                  <CardItem style={{marginBottom:-10}}>
                    <Col>
                      <Button transparent full onPress={() => { this.removeDomicilioByIndex(i) }}>
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
          <Col style={{padding:5, marginTop:30}}>
            <Button full rounded light>
              <Text>Confirmar</Text>
            </Button>
          </Col>
        </Row>
        </Grid>
        </ScrollView>
        
        <Modal onSwipe={() => this.setState({ isModalVisible: false })} swipeDirection="right" 
          isVisible={this.state.isModalVisible} avoidKeyboard={true}>
          <AgregarDomicilio agregarDomicilioChild={this.agregarDomicilio} cerrarModal={this._toggleModal}/>
        </Modal>

        <View style={{position:'absolute', bottom:15, right:-10, height: 80, }}>
          <Button danger onPress={this._toggleModal} style={{width: 60, height: 60, borderRadius: 30, justifyContent: 'center'}}>
            <Icon active name="plus" style={{fontSize: 22, color: 'white'}} />
          </Button>
        </View>

        </View>
    );
  }
}
