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
import AgregarSustancia from './AgregarSustancia';
import CatSustanciasData from '../Utils/Catalogos/Sustancias.json';

export default class Sustancias extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      isModalVisible: false,
      selectedIndConsumeSustancias: undefined,
      sustancias: [],
      numeroSustancias: 0,
      SustanciasCat: CatSustanciasData,
    };
    jsonRespSustancias = {
      completo: false,
      indConsumeSustancias: null,
      sustancias: []
    }
  }

  componentDidMount(){
    storage.save({
      key: 'datosSustanciasStorage',
      data: jsonRespSustancias,
    });
  }

  _toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  agregarSustancia = (stateSustanciaFromChild) => {
    this.state.sustancias.push(stateSustanciaFromChild);
    this.saveJsonLocalSustancia(this.state.sustancias);
    this.setState({numeroSustancias: Object.keys(this.state.sustancias).length});
    this._toggleModal();
  }

  removeSustanciaByIndex = (indexJSON) => {
    let jsonAuxSustancias = this.state.sustancias;
    // Remove 1 element from index indexJSON
    jsonAuxSustancias.splice(indexJSON, 1);
    this.setState({sustancias: jsonAuxSustancias});
    this.saveJsonLocalSustancia(this.state.sustancias);
    this.setState({numeroSustancias: Object.keys(this.state.sustancias).length});
  }

  saveJsonLocalSustancia = (jsonFromAnswers) => {
    jsonRespSustancias.sustancias = jsonFromAnswers;
    jsonRespSustancias.indConsumeSustancias = this.state.selectedIndConsumeSustancias;
    jsonRespSustancias.completo = (Object.keys(jsonFromAnswers).length > 0) ? true : false;
    storage.save({
      key: 'datosSustanciasStorage',
      data: jsonRespSustancias,
    });
  }
  
  getSustanciaById = (idParam) => {
    function sustancia(sustancia) { 
      return sustancia.id === idParam;
    }
    return this.state.SustanciasCat.find(sustancia).nombre;
  }
  render() {
    return (
    <View style={{flex:1}}>

    <ScrollView style={{flex:1}}>
    <Grid style={{flex:1}}>
      
      <Row>
        <Col style={{ paddingHorizontal:15 }}>
          <Text style={{marginVertical:10, textAlign:'center', color:  COLORS.BACKGROUND_PRIMARY, fontWeight:'bold'}}>
            SUSTANCIAS ({this.state.numeroSustancias})
          </Text>
        </Col>
      </Row>
      
      {/* Preguntas generales, fuera del arreglo de sustancias */}
      <Row>
        <Col>

          <Item style={{marginVertical: 5}} stackedLabel>
            <Label>Consume sustancias:</Label>
            <Picker
              style={{width: 310}}
              iosHeader="Seleccionar una opción"
              placeholder="Seleccionar una opción"
              itemTextStyle={{ fontSize: 17}}
              mode="dropdown"
              supportedOrientations={['portrait','landscape']}
              selectedValue={this.state.selectedIndConsumeSustancias}
              onValueChange={(selectedIndConsumeSustancias) => this.setState({selectedIndConsumeSustancias})}>
              <Item label="Seleccionar una opción" value={null} />
              <Item label="SI" value={1} />
              <Item label="NO" value={0} />
            </Picker>
          </Item>

        </Col>
      </Row>
      
      <Content style={{flex:1}}>
        {
          this.state.sustancias.map((sustancia, i) => {
            return (
              <Card key={i} accessible={true}>
                <CardItem style={{marginBottom:-10}}>
                  <Icon active name="tint" style={{fontSize: 18, marginRight:8}} />
                  <Text>Sustancia: {(sustancia.sustancia != null) ? this.getSustanciaById(sustancia.sustancia) : ""}</Text>
                </CardItem>
                <CardItem style={{marginBottom:-10}}>
                  <Icon active name="database" style={{fontSize: 18, marginRight:8}} />
                  <Text>Cantidad: {(sustancia.snCantidad != null) ? sustancia.snCantidad : ""}</Text>
                </CardItem>
                <CardItem style={{marginBottom:-10}}>
                  <Icon active name="history" style={{fontSize: 18, marginRight:8}} />
                  <Text>Periodicidad: {(sustancia.snFrecuenciaConsumo != null) ? sustancia.snFrecuenciaConsumo : ""}</Text>
                </CardItem>
                <CardItem style={{marginBottom:-10}}>
                  <Icon active name="calendar" style={{fontSize: 18, marginRight:8}} />
                  <Text>Último consumo: {(sustancia.dtmUltimoConsumo != null) ? sustancia.dtmUltimoConsumo : ""}</Text>
                </CardItem>
                <CardItem style={{marginBottom:-10}}>
                  <Col>
                    <Button transparent full onPress={() => { this.removeSustanciaByIndex(i) }}>
                      <Icon active name="trash" style={{color: COLORS.TEXT_WARN, fontSize:17}}/>
                      <Text style={{color: COLORS.TEXT_WARN}}>Eliminar sustancia</Text>
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
      <AgregarSustancia agregarSustanciaChild={this.agregarSustancia} sustanciasChild={this.state.sustancias} cerrarModal={this._toggleModal}/>
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
