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
import AgregarOcupacion from './AgregarOcupacion';

export default class Ocupacion extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      isModalVisible: false,
      selectedTrabajaActualmente: undefined,
      ocupaciones: [],
      numeroOcupaciones: 0,
    };
    jsonRespOcupaciones = {
      completo: false,
      ocupaciones: []
    }
  }

  componentDidMount(){
    storage.save({
      key: 'datosOcupacionesStorage',
      data: jsonRespOcupaciones,
    });
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
    jsonRespOcupaciones.completo = (Object.keys(jsonFromAnswers).length > 0) ? true : false;
    storage.save({
      key: 'datosOcupacionStorage',
      data: jsonRespOcupaciones,
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
              style={{width: 310}}
              iosHeader="Seleccionar una opción"
              placeholder="Seleccionar una opción"
              itemTextStyle={{ fontSize: 17}}
              mode="dropdown"
              supportedOrientations={['portrait','landscape']}
              selectedValue={this.state.selectedTrabajaActualmente}
              onValueChange={(selectedTrabajaActualmente) => this.setState({selectedTrabajaActualmente})}>
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
              <Card key={i} accessible={true}>
                <CardItem style={{marginBottom:-10}}>
                  <Icon active name="building" style={{fontSize: 18, marginRight:8}} />
                  <Text>Nombre: {(ocupacion.snNombre != null) ? ocupacion.snNombre : ""}</Text>
                </CardItem>
                <CardItem style={{marginBottom:-10}}>
                  <Icon active name="map-marker" style={{fontSize: 18, marginRight:8}} />
                  <Text>Dirección: {(ocupacion.snDireccion != null) ? ocupacion.snDireccion : ""}</Text>
                </CardItem>
                <CardItem style={{marginBottom:-10}}>
                  <Icon active name="phone" style={{fontSize: 18, marginRight:8}} />
                  <Text>Teléfono: {(ocupacion.snTelefono != null) ? ocupacion.snTelefono : ""}</Text>
                </CardItem>
                <CardItem style={{marginBottom:-10}}>
                  <Col>
                    <Button transparent full onPress={() => { this.removeOcupacionByIndex(i) }}>
                      <Icon active name="trash" style={{color: COLORS.TEXT_WARN, fontSize:17}}/>
                      <Text style={{color: COLORS.TEXT_WARN}}>Eliminar ocupación</Text>
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
      <AgregarOcupacion agregarOcupacionChild={this.agregarOcupacion} cerrarModal={this._toggleModal}/>
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
