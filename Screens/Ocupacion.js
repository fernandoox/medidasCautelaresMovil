import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Button, Text, Item, Label, Input, Picker, H3, Content, List, ListItem, Body } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from "react-native-easy-grid";
import axios from 'axios';
import Storage from 'react-native-storage';
import GLOBALS from '../Utils/Globals';
import CONSTANTS from '../Utils/ConstantsNG'
import Modal from "react-native-modal";
import AgregarOcupacion from './AgregarOcupacion';

export default class Ocupacion extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      isModalVisible: false,
      indTrabajaActualmente: undefined,
      ocupaciones: [],
      numeroOcupaciones: 0,
      loadedResponsesBD: false
    };
    jsonRespOcupaciones = {
      completo: false,
      indTrabajaActualmente: null,
      ocupaciones: []
    }
  }

  componentDidMount(){
    storage.save({
      key: 'datosOcupacionesStorage',
      data: jsonRespOcupaciones,
    });

    this.setValueAnswerFromBD();
  }

  setValueAnswerFromBD = () => {
    if(!this.state.loadedResponsesBD && this.props.ocupacionesDB != null){

      this.setState({
        loadedResponsesBD: true,
        ocupaciones: this.props.ocupacionesDB.ocupaciones,
        numeroOcupaciones: Object.keys(this.props.ocupacionesDB.ocupaciones).length,
        indTrabajaActualmente: this.props.ocupacionesDB.indTrabajaActualmente,
      }, () => {
        this.saveJsonLocalOcupaciones(this.props.ocupacionesDB.ocupaciones);  
      });

    }
  }

  
  setValueCatalogo =  (valueData, nodeQuestion) => {
    switch (nodeQuestion) {
      case "indTrabajaActualmente":
        this.setState({indTrabajaActualmente:valueData}, () => {
          this.saveJsonLocalOcupaciones(this.state.ocupaciones);
        })
        break;
      default:
        break;
    }
  }

  _toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  agregarOcupacion = (stateOcupacionFromChild) => {
    this.state.ocupaciones.push(stateOcupacionFromChild);
    this.saveJsonLocalOcupaciones(this.state.ocupaciones);
    this.setState({numeroOcupaciones: Object.keys(this.state.ocupaciones).length});
    this._toggleModal();
  }

  removeOcupacionByIndex = (indexJSON) => {
    let jsonAuxOcupaciones = this.state.ocupaciones;
    // Remove 1 element from index indexJSON
    jsonAuxOcupaciones.splice(indexJSON, 1);
    this.setState({ocupaciones: jsonAuxOcupaciones});
    this.saveJsonLocalOcupaciones(this.state.ocupaciones);
    this.setState({numeroOcupaciones: Object.keys(this.state.ocupaciones).length});
  }

  saveJsonLocalOcupaciones = (jsonFromAnswers) => {
    jsonRespOcupaciones.ocupaciones = jsonFromAnswers;
    jsonRespOcupaciones.indTrabajaActualmente = this.state.indTrabajaActualmente;
    jsonRespOcupaciones.completo = (Object.keys(jsonFromAnswers).length > 0) ? true : false;
    storage.save({
      key: 'datosOcupacionesStorage',
      data: jsonRespOcupaciones,
    });
  }

  render() {
    return (
    <View style={{flex:1}}>

    <ScrollView style={{flex:1}}>
    <Grid>
      
      <Row>
        <Col style={{ paddingHorizontal:15 }}>
          <Text style={{marginVertical:10, textAlign:'center', color:  COLORS.BACKGROUND_PRIMARY, fontWeight:'bold'}}>
            OCUPACIONES ({this.state.numeroOcupaciones})
          </Text>
        </Col>
      </Row>
      
      {/* Preguntas generales, fuera del arreglo de ocupaciones */}
      <Row>
        <Col>

          <Item style={{marginVertical: 5}} stackedLabel>
            <Label>Trabaja actualmente:</Label>
            <Picker
              enabled={(this.props.imputadoProp.idEstatus != ESTATUS_SOLICITUD.CONCLUIDO)}
              style={{width: 310}}
              iosHeader="Seleccionar una opción"
              placeholder="Seleccionar una opción"
              itemTextStyle={{ fontSize: 17}}
              mode="dropdown"
              supportedOrientations={['portrait','landscape']}
              selectedValue={this.state.indTrabajaActualmente}
              onValueChange={(itemSelected) => {
                this.setValueCatalogo(itemSelected, "indTrabajaActualmente")
              }}>
              <Item label="Seleccionar una opción" value={null} />
              <Item label="SI" value={1} />
              <Item label="NO" value={0} />
            </Picker>
          </Item>

        </Col>
      </Row>
      
      <Content>
        {
          this.state.ocupaciones.map((ocupacion, i) => {
            return (
              <Col key={i} style={{elevation: 2, backgroundColor:'white', marginVertical:5}}>
              <List accessible={true}>
                <ListItem style={{marginTop:-8, marginBottom:-8}}>
                  <Icon active name="building" style={{fontSize: 18, marginRight:8}} />
                  <Text>Nombre: {(ocupacion.snNombre != null) ? ocupacion.snNombre : ""}</Text>
                </ListItem>
                <ListItem style={{marginTop:-8, marginBottom:-8}}>
                  <Icon active name="map-marker" style={{fontSize: 18, marginRight:8}} />
                  <Text>Dirección: {(ocupacion.snDireccion != null) ? ocupacion.snDireccion : ""}</Text>
                </ListItem>
                <ListItem style={{marginTop:-8, marginBottom:-8}}>
                  <Icon active name="phone" style={{fontSize: 18, marginRight:8}} />
                  <Text>Teléfono: {(ocupacion.snTelefono != null) ? ocupacion.snTelefono : ""}</Text>
                </ListItem>
                <ListItem style={{marginTop:-12, marginBottom:-12}}>
                  <Col>
                    <Button transparent full onPress={() => { this.removeOcupacionByIndex(i) }} 
                      disabled={(this.props.imputadoProp.idEstatus == ESTATUS_SOLICITUD.CONCLUIDO)}>
                      <Icon active name="trash" style={{color: COLORS.TEXT_WARN, fontSize:17}}/>
                      <Text style={{color: COLORS.TEXT_WARN}}>Eliminar ocupación</Text>
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
      <AgregarOcupacion agregarOcupacionChild={this.agregarOcupacion} cerrarModal={this._toggleModal}/>
    </Modal>

    <View style={{position:'absolute', bottom:0, right:0, height: 80, }}>
      <Button danger onPress={this._toggleModal} style={{width: 60, height: 60, borderRadius: 30, justifyContent: 'center'}}
        disabled={(this.props.imputadoProp.idEstatus == ESTATUS_SOLICITUD.CONCLUIDO)}>
        <Icon active name="plus" style={{fontSize: 22, color: 'white'}} />
      </Button>
    </View>

    </View>
    );
  }
}
