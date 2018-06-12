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
import Modal from "react-native-modal";
import AgregarSustancia from './AgregarSustancia';
import CatSustanciasData from '../Utils/Catalogos/Sustancias.json';

export default class Sustancias extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      isModalVisible: false,
      selectedIndConsumeSustancias: null,
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

  setValueConsumeSustancias = (valueConsumeSustancias) => {
    /*
      Since setState works in an asynchronous way. 
      That means after calling setState the this.state is not immediately changed. 
      So if you want to perform an action immediately after setting state, 
      use 2nd argument as callback on setState
    */
    this.setState({
      selectedIndConsumeSustancias: valueConsumeSustancias
    }, () => {
      if (!valueConsumeSustancias) {
        this.setState({sustancias: []});
      }
      this.saveJsonLocalSustancia(this.state.sustancias);
      this.setState({numeroSustancias: Object.keys(this.state.sustancias).length});
    });
  }

  agregarSustancia = (stateSustanciaFromChild) => {
    stateSustanciaFromChild.nuEdadInicio = Number(stateSustanciaFromChild.nuEdadInicio);
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
    if (Object.keys(jsonFromAnswers).length == 0 && !this.state.selectedIndConsumeSustancias) {
      jsonRespSustancias.completo = true;
    }else if(Object.keys(jsonFromAnswers).length > 0){
      jsonRespSustancias.completo = true;
    }
    else{
      jsonRespSustancias.completo = false;
    }
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
    <Grid>
      
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
              onValueChange={(itemSelected) => {
                this.setValueConsumeSustancias(itemSelected)
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
          this.state.sustancias.map((sustancia, i) => {
            return (
              <Col key={i} style={{elevation: 2, backgroundColor:'white', marginVertical:5}}>
              <List accessible={true}>
                <ListItem style={{marginTop:-8, marginBottom:-8}}>
                  <Icon active name="tint" style={{fontSize: 18, marginRight:8}} />
                  <Text>Sustancia: {(sustancia.sustancia != null) ? this.getSustanciaById(sustancia.sustancia) : ""}</Text>
                </ListItem>
                <ListItem style={{marginTop:-8, marginBottom:-8}}>
                  <Icon active name="database" style={{fontSize: 18, marginRight:8}} />
                  <Text>Cantidad: {(sustancia.snCantidad != null) ? sustancia.snCantidad : ""}</Text>
                </ListItem>
                <ListItem style={{marginTop:-8, marginBottom:-8}}>
                  <Icon active name="history" style={{fontSize: 18, marginRight:8}} />
                  <Text>Periodicidad: {(sustancia.snFrecuenciaConsumo != null) ? sustancia.snFrecuenciaConsumo : ""}</Text>
                </ListItem>
                <ListItem style={{marginTop:-8, marginBottom:-8}}>
                  <Icon active name="calendar" style={{fontSize: 18, marginRight:8}} />
                  <Text>Último consumo: {(sustancia.dtmUltimoConsumo != null) ? sustancia.dtmUltimoConsumo : ""}</Text>
                </ListItem>
                <ListItem style={{marginTop:-12, marginBottom:-12}}>
                  <Col>
                    <Button transparent full onPress={() => { this.removeSustanciaByIndex(i) }}>
                      <Icon active name="trash" style={{color: COLORS.TEXT_WARN, fontSize:17}}/>
                      <Text style={{color: COLORS.TEXT_WARN}}>Eliminar sustancia</Text>
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
      <AgregarSustancia agregarSustanciaChild={this.agregarSustancia} sustanciasChild={this.state.sustancias} cerrarModal={this._toggleModal}/>
    </Modal>

    <View style={{position:'absolute', bottom:0, right:0, height: 80, }}>
    <Display enable={this.state.selectedIndConsumeSustancias}
      enterDuration={500}
      exitDuration={500}
      enter="fadeInDown"
      exit="fadeOutDown">
      <Button danger onPress={this._toggleModal} style={{width: 60, height: 60, borderRadius: 30, justifyContent: 'center'}}>
        <Icon active name="plus" style={{fontSize: 22, color: 'white'}} />
      </Button>
    </Display>
    </View>

    </View>
    );
  }
}
