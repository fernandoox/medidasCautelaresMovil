import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, ScrollView, KeyboardAvoidingView, Dimensions } from 'react-native';
import { Container, Content, Button, Text, Item, Input, Label, List, ListItem, Body } from 'native-base';
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
      loadedResponsesBD: false,
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
    this.setValueAnswerFromBD();
  }

  setValueAnswerFromBD = () => {
    if(!this.state.loadedResponsesBD &&  this.props.domiciliosDB != null){
      this.setState({
        loadedResponsesBD: true,
        domicilios: this.props.domiciliosDB.datosDomicilios,
        numeroDomicilios: Object.keys(this.props.domiciliosDB.datosDomicilios).length,
        motivoVariosDomicilios: this.props.domiciliosDB.snRazonMultiplesDomicilios
      });

      this.saveJsonLocalDomicilios(this.props.domiciliosDB.datosDomicilios);
    }
  }

  setValueAnswerText = (valueData, nodeQuestion) => {
    this.state[nodeQuestion] = valueData;
    this.saveJsonLocalDomicilios(this.state.domicilios);
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
    let jsonDomicilios = this.state.domicilios;
    // Remove 1 element from index indexJSON
    jsonDomicilios.splice(indexJSON, 1);
    this.setState({domicilios: jsonDomicilios});
    this.saveJsonLocalDomicilios(this.state.domicilios);
    this.setState({numeroDomicilios: Object.keys(this.state.domicilios).length});
  }

  saveJsonLocalDomicilios = (jsonFromAnswers) => {
    jsonRespDomicilios.datosDomicilios = jsonFromAnswers;
    jsonRespDomicilios.completo = (Object.keys(jsonFromAnswers).length > 0) ? true : false;
    jsonRespDomicilios.snRazonMultDomicilios = (Object.keys(jsonFromAnswers).length > 0) ? this.state.motivoVariosDomicilios : null;
    storage.save({
      key: 'datosDomiciliosStorage',
      data: jsonRespDomicilios,
    });
  }

  domicilioToString = (domicilio) => {
    let calle = (domicilio.snCalle != null) ? domicilio.snCalle : "";
    let numExt = (domicilio.snNumExterior != null) ? domicilio.snNumExterior : "";
    let colonia = (domicilio.snColonia != null) ? domicilio.snColonia : "";
    let cPostal = (domicilio.snCodigoPostal != null) ? domicilio.snCodigoPostal : "";
    let municipio = (domicilio.municipio != null) ? this.getDelegacionById(domicilio.municipio) : "";
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
      <View style={{flex:1}}  ref="refTestDomicilios">
      <ScrollView style={{flex:1}}>
      <Grid>

        <Row>
          <Col style={{ paddingHorizontal:15 }}>
            <Text style={{marginVertical:10, textAlign:'center', color:  COLORS.BACKGROUND_PRIMARY, fontWeight:'bold'}}>
              DOMICILIOS ({this.state.numeroDomicilios})
            </Text>
          </Col>
        </Row>

        {/* Pregunta general, fuera del arreglo de domicilios (se muestra cuando se agrega mas de 1 domicilio) */}
        <Display enable={this.state.numeroDomicilios > 1}
          enterDuration={500} enter="fadeInDown">
          <Row>
            <Col>
              <Item style={{marginVertical: 10}} stackedLabel>
                <Label>Razón de tener mas de un domicilio:</Label>
                <Input style={{fontSize: 16}} 
                  autoCapitalize='characters'
                  defaultValue={this.state.motivoVariosDomicilios}
                  onChangeText={(valueData) => {
                    this.setValueAnswerText(valueData, "motivoVariosDomicilios");
                  }}/>
              </Item>
            </Col>
          </Row>
        </Display>

        <Content>
          {
            this.state.domicilios.map((domicilio, i) => {
              return (
                <Col key={i} style={{elevation: 2, backgroundColor:'white', marginVertical:5}}>
                <List accessible={true}>
                  <ListItem style={{marginTop:-8, marginBottom:-8}}>
                    <Icon active name="map-marker" style={{fontSize: 18, marginRight:8}} />
                    <Text>{this.domicilioToString(domicilio)}</Text>
                  </ListItem>
                  <ListItem style={{marginTop:-8, marginBottom:-8}}>
                    <Icon active name="tag" style={{fontSize: 18, marginRight:8}} />
                    <Text>Tipo domicilio: {(domicilio.tipoDomicilio != null) ? this.getTipoDomicilioById(domicilio.tipoDomicilio) : ""}</Text>
                  </ListItem>
                  <ListItem style={{marginTop:-8, marginBottom:-8}}>
                    <Icon active name="calendar" style={{fontSize: 18, marginRight:8}} />
                    <Text>Horarios: {(domicilio.snTiempoVivir != null) ? domicilio.snTiempoVivir : ""}</Text>
                  </ListItem>
                  <ListItem style={{marginTop:-8, marginBottom:-8}}>
                    <Icon active name="phone" style={{fontSize: 18, marginRight:8}} />
                    <Text>Teléfono: {(domicilio.snTelefono != null) ? domicilio.snTelefono : ""}</Text>
                  </ListItem>
                  <ListItem style={{marginTop: -12, marginBottom:-12}}>
                    <Col>
                      <Button transparent full onPress={() => { this.removeDomicilioByIndex(i) }}>
                        <Icon active name="trash" style={{color: COLORS.TEXT_WARN, fontSize:17}}/>
                        <Text style={{color: COLORS.TEXT_WARN}}>Eliminar domicilio</Text>
                      </Button>
                    </Col>
                  </ListItem>
                </List>
                </Col>
              );
            })
          }
          </Content>
          <Row><Col style={{padding:5, marginTop:30}}></Col></Row>
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