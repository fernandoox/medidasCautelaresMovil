import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, ScrollView, KeyboardAvoidingView, Dimensions } from 'react-native';
import { Container, Content, Button, Text, Item, Input, Label, Card, CardItem, Body } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from "react-native-easy-grid";
import axios from 'axios';
import Storage from 'react-native-storage';
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
    jsonRespDomicilios = {
      completo: false,
      snRazonMultDomicilios: null,
      datosDomicilios: []
    }
  }

  componentDidMount(){
    storage.save({
      key: 'datosDomiciliosStorage',
      data: jsonRespDomicilios,
    });
  }

  _toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }
  
  agregarDomicilio = (stateDomicilioFromChild) => {
    this.state.domicilios.push(stateDomicilioFromChild);
    this.saveJsonLocalDomicilios(this.state.domicilios);
    this.setState({numeroDomicilios: Object.keys(this.state.domicilios).length});
    this._toggleModal();
  }

  removeDomicilioByIndex = (indexJSON) => {
    console.log("Remove item index: " + indexJSON);
    let jsonDomicilios = this.state.domicilios;
    // Remove 1 element from index indexJSON
    jsonDomicilios.splice(indexJSON, 1);
    this.setState({domicilios: jsonDomicilios});
    this.saveJsonLocalDomicilios(this.state.domicilios);
    this.setState({numeroDomicilios: Object.keys(this.state.domicilios).length});
  }

  saveJsonLocalDomicilios = (jsonFromAnswers) => {
    console.log("New storage: "+JSON.stringify(jsonFromAnswers));
    jsonRespDomicilios.datosDomicilios = jsonFromAnswers;
    jsonRespDomicilios.completo = (Object.keys(jsonFromAnswers).length > 0) ? true : false;
    jsonRespDomicilios.snRazonMultDomicilios = (Object.keys(jsonFromAnswers).length > 0) ? this.state.motivoVariosDomicilios : null;
    storage.save({
      key: 'datosDomiciliosStorage',
      data: jsonRespDomicilios,
    });
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
    return this.state.DelegacionesCat.find(delegacion).nombre;
  }

  getTipoDomicilioById = (idParam) => {
    function tipoDomicilio(tipoDomicilio) { 
      return tipoDomicilio.id === idParam;
    }
    return this.state.TiposDomicilioCat.find(tipoDomicilio).nombre;
  }

  

  render() {
    return (
      <View accessible={true}>
      <ScrollView keyboardShouldPersistTaps="always">
      <Grid>

        <Row>
          <Col style={{ paddingHorizontal:15 }}>
            <Text style={{marginVertical:10, textAlign:'center', color:  COLORS.BACKGROUND_PRIMARY, fontWeight:'bold'}}>
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

        <Content>
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
                        <Icon active name="trash" style={{color: COLORS.TEXT_WARN, fontSize:17}}/>
                        <Text style={{color: COLORS.TEXT_WARN}}>Eliminar domicilio</Text>
                      </Button>
                    </Col>
                  </CardItem>
                </Card>
              );
            })
          }
          </Content>
          <Row>
            <Col style={{padding:5, marginTop:30}}>

            </Col>
          </Row>
        </Grid>
        </ScrollView>
        
        <Modal onSwipe={() => this.setState({ isModalVisible: false })} swipeDirection="right" 
          isVisible={this.state.isModalVisible} avoidKeyboard={true}>
          <AgregarDomicilio agregarDomicilioChild={this.agregarDomicilio} cerrarModal={this._toggleModal}/>
        </Modal>

        <View style={{position:'absolute', bottom:0, right:0, height: 80, }}>
          <Button danger onPress={this._toggleModal} style={{width: 60, height: 60, borderRadius: 30, justifyContent: 'center'}}>
            <Icon active name="plus" style={{fontSize: 22, color: 'white'}} />
          </Button>
        </View>

        </View>
    );
  }
}
