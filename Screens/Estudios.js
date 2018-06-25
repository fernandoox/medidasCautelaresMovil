import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Button, Text, Item, Label, Input, Picker, H3, Content, List, ListItem, Body } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from "react-native-easy-grid";
import axios from 'axios';
import Storage from 'react-native-storage';
import Display from 'react-native-display';
import GLOBALS from '../Utils/Globals';
import CONSTANTS from '../Utils/ConstantsNG';
import Modal from "react-native-modal";
import AgregarEstudio from './AgregarEstudio';
import CatEscolaridadesData from '../Utils/Catalogos/Escolaridades.json';

export default class Estudios extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      isModalVisible: false,
      estudios: [],
      numeroEstudios: 0,
      indEstudiaActualmente: undefined,
      ultimoGrado: undefined,
      snRazonDejarEstudiar: null,
      EscolaridadesCat: CatEscolaridadesData,
      loadedResponsesBD: false,
    };
    jsonRespEstudios = {
      indEstudiaActualmente: null,
      ultimoGrado: null,
      snRazonDejarEstudiar: null,
      completo: false,
      jsonEstudios: [],
      loadedResponsesBD: false
    }
  }

  componentDidMount(){
    storage.save({
      key: 'datosEstudiosStorage',
      data: jsonRespEstudios,
    });
    this.setValueAnswerFromBD();
  }

  setValueAnswerFromBD = () => {
    if(!this.state.loadedResponsesBD && this.props.estudiosDB != null){

      this.setState({
        loadedResponsesBD: true,
        estudios: this.props.estudiosDB.jsonEstudios,
        numeroEstudios: Object.keys(this.props.estudiosDB.jsonEstudios).length,
        indEstudiaActualmente: this.props.estudiosDB.indEstudiaActualmente,
        ultimoGrado: this.props.estudiosDB.ultimoGrado,
        snRazonDejarEstudiar: this.props.estudiosDB.snRazonDejarEstudiar,
      }, () => {
        this.saveJsonLocalEstudios(this.props.estudiosDB.jsonEstudios);  
      });

    }
  }

  setValueAnswerText = (valueData, nodeQuestion) => {
    this.state[nodeQuestion] = valueData;
    this.saveJsonLocalEstudios(this.state.estudios);
  }

  setValueCatalogo =  (valueData, nodeQuestion) => {
    switch (nodeQuestion) {
      case "indEstudiaActualmente":
        this.setState({indEstudiaActualmente:valueData}, () => {
          this.saveJsonLocalEstudios(this.state.estudios);
        })
        break;
      default:
        break;
    }
  }
  

  _toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  setValueUltimoGrado = (valueUltimoGrado) => {
    console.log("Value: " + valueUltimoGrado)
    this.setState({
      ultimoGrado: valueUltimoGrado
    }, () => {
      if (valueUltimoGrado == 23) {
        this.setState({estudios: []}, () => {
          this.saveJsonLocalEstudios(this.state.estudios);
          this.setState({numeroEstudios: 0});
        });
      }
    });
  }

  agregarEstudio = (stateEstudioFromChild) => {
    this.state.estudios.push(stateEstudioFromChild);
    this.saveJsonLocalEstudios(this.state.estudios);
    this.setState({numeroEstudios: Object.keys(this.state.estudios).length});
    this._toggleModal();
  }

  removeEstudioByIndex = (indexJSON) => {
    let jsonAuxEstudios = this.state.estudios;
    // Remove 1 element from index indexJSON
    jsonAuxEstudios.splice(indexJSON, 1);
    this.setState({estudios: jsonAuxEstudios});
    this.saveJsonLocalEstudios(this.state.estudios);
    this.setState({numeroEstudios: Object.keys(this.state.estudios).length});
  }

  saveJsonLocalEstudios = (jsonFromAnswers) => {
    jsonRespEstudios.jsonEstudios = jsonFromAnswers;
    jsonRespEstudios.indEstudiaActualmente = this.state.indEstudiaActualmente;
    jsonRespEstudios.ultimoGrado = this.state.ultimoGrado;
    jsonRespEstudios.snRazonDejarEstudiar = this.state.snRazonDejarEstudiar;

    if (Object.keys(jsonFromAnswers).length == 0 && this.state.ultimoGrado == 23) {
      jsonRespEstudios.completo = true;
    }else if(Object.keys(jsonFromAnswers).length > 0){
      jsonRespEstudios.completo = true;
    }
    else{
      jsonRespEstudios.completo = false;
    }

    storage.save({
      key: 'datosEstudiosStorage',
      data: jsonRespEstudios,
    });
  }

  render() {
    return (
    
    <View style={{flex:1}}>
    <ScrollView style={{flex:1}}>
    <Grid style={{flex:1}}>
      
      <Row>
        <Col style={{ paddingHorizontal:15 }}>
          <Text style={{marginVertical:10, textAlign:'center', color:  COLORS.BACKGROUND_PRIMARY, fontWeight:'bold'}}>
            ESTUDIOS ({this.state.numeroEstudios})
          </Text>
        </Col>
      </Row>
      
      {/* Preguntas generales, fuera del arreglo de estudios */}
      <KeyboardAvoidingView behavior="position">
      <Row>
        <Col>

          <Item style={{marginVertical: 5}} stackedLabel>
            <Label>Estudia actualmente:</Label>
            <Picker
              enabled={(this.props.imputadoProp.idEstatus != ESTATUS_SOLICITUD.CONCLUIDO)}
              style={{width: 310}}
              iosHeader="Seleccionar una opción"
              placeholder="Seleccionar una opción"
              itemTextStyle={{ fontSize: 17}}
              mode="dropdown"
              supportedOrientations={['portrait','landscape']}
              selectedValue={this.state.indEstudiaActualmente}
              onValueChange={(itemSelected) => {
                this.setValueCatalogo(itemSelected, "indEstudiaActualmente")
              }}>
              <Item label="Seleccionar una opción" value={null} />
              <Item label="SI" value={1} />
              <Item label="NO" value={0} />
            </Picker>
          </Item>

          <Item style={{marginVertical: 5}} stackedLabel>
            <Label>Último grado:</Label>
            <Picker
              enabled={(this.props.imputadoProp.idEstatus != ESTATUS_SOLICITUD.CONCLUIDO)}
              style={{width: 310}}
              iosHeader="Seleccionar una opción"
              placeholder="Seleccionar una opción"
              itemTextStyle={{ fontSize: 17}}
              mode="dropdown"
              supportedOrientations={['portrait','landscape']}
              selectedValue={this.state.ultimoGrado}
              onValueChange={(itemSelected) => {
                this.setValueUltimoGrado(itemSelected)
              }}>
              <Item label="Seleccionar una opción" value={null} />
              {
                this.state.EscolaridadesCat.map((catalogo) => {
                  return (
                    <Item
                      label={catalogo.nombre}
                      value={catalogo.id} key={catalogo.id}/>
                  );
                })
              }
            </Picker>
          </Item>
          
          <Item style={{marginVertical: 10}} stackedLabel>
            <Label>Razón para dejar de estudiar:</Label>
            <Input style={{fontSize: 16}}
              disabled={(this.props.imputadoProp.idEstatus == ESTATUS_SOLICITUD.CONCLUIDO)}  
              autoCapitalize='characters'
              defaultValue={this.state.snRazonDejarEstudiar}
              onChangeText={(valueData) => {
                this.setValueAnswerText(valueData, "snRazonDejarEstudiar");
              }}
            />
          </Item>

        </Col>
      </Row>
      </KeyboardAvoidingView>
      <Content>
        {
          this.state.estudios.map((estudio, i) => {
            return (
              <Col key={i} style={{elevation: 2, backgroundColor:'white', marginVertical:5}}>
              <List accessible={true}>
                <ListItem style={{marginTop:-8, marginBottom:-8}}>
                  <Icon active name="bookmark" style={{fontSize: 18, marginRight:8}} />
                  <Text>Nombre: {(estudio.snNombreEscuela != null) ? estudio.snNombreEscuela : ""}</Text>
                </ListItem>
                <ListItem style={{marginTop:-8, marginBottom:-8}}>
                  <Icon active name="map-marker" style={{fontSize: 18, marginRight:8}} />
                  <Text>Dirección: {(estudio.snDireccionEscuela != null) ? estudio.snDireccionEscuela : ""}</Text>
                </ListItem>
                <ListItem style={{marginTop:-8, marginBottom:-8}}>
                  <Icon active name="phone" style={{fontSize: 18, marginRight:8}} />
                  <Text>Teléfono: {(estudio.snTelefonoEscuela != null) ? estudio.snTelefonoEscuela : ""}</Text>
                </ListItem>
                <ListItem style={{marginTop:-12, marginBottom:-12}}>
                  <Col>
                    <Button transparent full onPress={() => { this.removeEstudioByIndex(i) }}
                      disabled={(this.props.imputadoProp.idEstatus == ESTATUS_SOLICITUD.CONCLUIDO)}>
                      <Icon active name="trash" style={{color: COLORS.TEXT_WARN, fontSize:17}}/>
                      <Text style={{color: COLORS.TEXT_WARN}}>Eliminar estudio</Text>
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
      <AgregarEstudio agregarEstudioChild={this.agregarEstudio} cerrarModal={this._toggleModal}/>
    </Modal>

    <View style={{position:'absolute', bottom:0, right:0, height: 80, }}>
      <Display enable={this.state.ultimoGrado != 23}
        enterDuration={500}
        exitDuration={500}
        enter="fadeInDown"
        exit="fadeOutDown">
        <Button danger onPress={this._toggleModal} style={{width: 60, height: 60, borderRadius: 30, justifyContent: 'center'}}
          disabled={(this.props.imputadoProp.idEstatus == ESTATUS_SOLICITUD.CONCLUIDO)}>
          <Icon active name="plus" style={{fontSize: 22, color: 'white'}} />
        </Button>
      </Display>
    </View>

    </View>    
    );
  }
}
