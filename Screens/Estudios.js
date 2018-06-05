import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Button, Text, Item, Label, Input, Picker, H3, Content, Card, CardItem, Body } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from "react-native-easy-grid";
import axios from 'axios';
import Storage from 'react-native-storage';
import GLOBALS from '../Utils/Globals';
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
      selectedEstudiaActualmente: undefined,
      selectedUltimoGrado: undefined,
      razonDejarEstudiar: null,
      EscolaridadesCat: CatEscolaridadesData,
    };
    jsonRespEstudios = {
      estudiaActualmente: null,
      ultimoGrado: null,
      razonDejarEstudiar: null,
      completo: false,
      jsonEstudios: []
    }
  }

  componentDidMount(){
    storage.save({
      key: 'datosEstudiosStorage',
      data: jsonRespEstudios,
    });
  }

  _toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
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
    jsonRespEstudios.completo = (Object.keys(jsonFromAnswers).length > 0) ? true : false;
    jsonRespEstudios.estudiaActualmente = this.state.selectedEstudiaActualmente;
    jsonRespEstudios.ultimoGrado = this.state.selectedUltimoGrado;
    jsonRespEstudios.razonDejarEstudiar = this.state.razonDejarEstudiar;
    storage.save({
      key: 'datosEstudiosStorage',
      data: jsonRespEstudios,
    });
  }

  render() {
    return (
    <View>

    <ScrollView>
    <Grid>
      
      <Row>
        <Col style={{ paddingHorizontal:15 }}>
          <Text style={{marginVertical:10, textAlign:'center', color:  COLORS.BACKGROUND_PRIMARY, fontWeight:'bold'}}>
            ESTUDIOS ({this.state.numeroEstudios})
          </Text>
        </Col>
      </Row>
      
      {/* Preguntas generales, fuera del arreglo de estudios */}
      <Row>
        <Col>

          <Item style={{marginVertical: 5}} stackedLabel>
            <Label>Estudia actualmente:</Label>
            <Picker
              style={{width: 310}}
              iosHeader="Seleccionar una opción"
              placeholder="Seleccionar una opción"
              itemTextStyle={{ fontSize: 17}}
              mode="dropdown"
              supportedOrientations={['portrait','landscape']}
              selectedValue={this.state.selectedEstudiaActualmente}
              onValueChange={(selectedEstudiaActualmente) => this.setState({selectedEstudiaActualmente})}>
              <Item label="Seleccionar una opción" value={null} />
              <Item label="SI" value={1} />
              <Item label="NO" value={0} />
            </Picker>
          </Item>

          <Item style={{marginVertical: 5}} stackedLabel>
            <Label>Último grado:</Label>
            <Picker
              style={{width: 310}}
              iosHeader="Seleccionar una opción"
              placeholder="Seleccionar una opción"
              itemTextStyle={{ fontSize: 17}}
              mode="dropdown"
              supportedOrientations={['portrait','landscape']}
              selectedValue={this.state.selectedUltimoGrado}
              onValueChange={(selectedUltimoGrado) => this.setState({selectedUltimoGrado})}>
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
              onChangeText={(razonDejarEstudiar) => this.setState({razonDejarEstudiar})}
            />
          </Item>

        </Col>
      </Row>
      <Content>
        {
          this.state.estudios.map((estudio, i) => {
            return (
              <Card key={i} accessible={true}>
                <CardItem style={{marginBottom:-10}}>
                  <Icon active name="bookmark" style={{fontSize: 18, marginRight:8}} />
                  <Text>Nombre: {(estudio.snNombreEscuela != null) ? estudio.snNombreEscuela : ""}</Text>
                </CardItem>
                <CardItem style={{marginBottom:-10}}>
                  <Icon active name="map-marker" style={{fontSize: 18, marginRight:8}} />
                  <Text>Dirección: {(estudio.snDireccionEscuela != null) ? estudio.snDireccionEscuela : ""}</Text>
                </CardItem>
                <CardItem style={{marginBottom:-10}}>
                  <Icon active name="phone" style={{fontSize: 18, marginRight:8}} />
                  <Text>Teléfono: {(estudio.snTelefonoEscuela != null) ? estudio.snTelefonoEscuela : ""}</Text>
                </CardItem>
                <CardItem style={{marginBottom:-10}}>
                  <Col>
                    <Button transparent full onPress={() => { this.removeEstudioByIndex(i) }}>
                      <Icon active name="trash" style={{color: COLORS.TEXT_WARN, fontSize:17}}/>
                      <Text style={{color: COLORS.TEXT_WARN}}>Eliminar estudio</Text>
                    </Button>
                  </Col>
                </CardItem>
              </Card>
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
      <Button danger onPress={this._toggleModal} style={{width: 60, height: 60, borderRadius: 30, justifyContent: 'center'}}>
        <Icon active name="plus" style={{fontSize: 22, color: 'white'}} />
      </Button>
    </View>

    </View>
    );
  }
}
