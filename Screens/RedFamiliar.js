import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Button, Text, Item, H3, Content, List, ListItem, Body } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from "react-native-easy-grid";
import axios from 'axios';
import Storage from 'react-native-storage';
import GLOBALS from '../Utils/Globals';
import Modal from "react-native-modal";
import AgregarFamiliar from './AgregarFamiliar';
import CatParentescosData from '../Utils/Catalogos/Parentescos.json';

export default class RedFamiliar extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      isModalVisible: false,
      familiares: [],
      numeroFamiliares: 0,
      ParentescosCat: CatParentescosData,
      loadedResponsesBD: false,
    };
    jsonRespFamiliares = {
      completo: false,
      jsonRedFamiliar: []
    }
  }

  componentDidMount(){
    storage.save({
      key: 'datosFamiliaresStorage',
      data: jsonRespFamiliares,
    });
    this.setValueAnswerFromBD();
  }

  setValueAnswerFromBD = () => {
    if(!this.state.loadedResponsesBD && this.props.familiaDB != null){
      this.setState({
        loadedResponsesBD: true,
        familiares: this.props.familiaDB.jsonRedFamiliar,
        numeroFamiliares: Object.keys(this.props.familiaDB.jsonRedFamiliar).length,
      });

      this.saveJsonLocalFamiliares(this.props.familiaDB.jsonRedFamiliar);
    }
  }

  _toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  agregarFamiliar = (stateFamiliarFromChild) => {
    this.state.familiares.push(stateFamiliarFromChild);
    this.saveJsonLocalFamiliares(this.state.familiares);
    this.setState({numeroFamiliares: Object.keys(this.state.familiares).length});
    this._toggleModal();
  }

  removeFamiliarByIndex = (indexJSON) => {
    let jsonFamiliares = this.state.familiares;
    // Remove 1 element from index indexJSON
    jsonFamiliares.splice(indexJSON, 1);
    this.setState({familiares: jsonFamiliares});
    this.saveJsonLocalFamiliares(this.state.familiares);
    this.setState({numeroFamiliares: Object.keys(this.state.familiares).length});
  }

  saveJsonLocalFamiliares = (jsonFromAnswers) => {
    jsonRespFamiliares.jsonRedFamiliar = jsonFromAnswers;
    jsonRespFamiliares.completo = (Object.keys(jsonFromAnswers).length > 0) ? true : false;
    storage.save({
      key: 'datosFamiliaresStorage',
      data: jsonRespFamiliares,
    });
  }

  nombreFamiliarToString = (familiar) => {
    let nombre = (familiar.snNombre != null) ? familiar.snNombre : "";
    let apellidoPaterno = (familiar.snApellidoPaterno != null) ? familiar.snApellidoPaterno : "";
    let apllidoMaterno = (familiar.snApellidoMaterno != null) ? familiar.snApellidoMaterno : "";
    let nombreFamiliarStr =  nombre + " " + apellidoPaterno + " " + apllidoMaterno;
    return nombreFamiliarStr;
  }

  getParentescoById = (idParam) => {
    function parentesco(parentesco) { 
      return parentesco.id === idParam;
    }
    return this.state.ParentescosCat.find(parentesco).nombre;
  }

  getResponseIndex = (index) => {
    let response = "";
    switch (index) {
      case 1:
        response = "SI";
        break;
      case 0:
        response = "NO";
        break;
      default:
        response = "";
        break;
    }
    return response;
  }

  render() {
    return (
    <View style={{flex:1}}>

    <ScrollView style={{flex:1}}>
    <Grid>
      
      <Row>
        <Col style={{ paddingHorizontal:15 }}>
          <Text style={{marginVertical:10, textAlign:'center', color:  COLORS.BACKGROUND_PRIMARY, fontWeight:'bold'}}>
            RED FAMILIAR ({this.state.numeroFamiliares})
          </Text>
        </Col>
      </Row>

      <Content>
        {
          this.state.familiares.map((familiar, i) => {
            return (
              <Col key={i} style={{elevation: 2, backgroundColor:'white', marginVertical:5}}>
              <List accessible={true}>
                <ListItem style={{marginTop:-8, marginBottom:-8}}>
                  <Icon active name="user" style={{fontSize: 18, marginRight:8}} />
                  <Text>Nombre: {this.nombreFamiliarToString(familiar)}</Text>
                </ListItem>
                <ListItem style={{marginTop:-8, marginBottom:-8}}>
                  <Icon active name="tag" style={{fontSize: 18, marginRight:8}} />
                  <Text>Parentesco: {(familiar.parentesco != null) ? this.getParentescoById(familiar.parentesco) : ""}</Text>
                </ListItem>
                <ListItem style={{marginTop:-8, marginBottom:-8}}>
                  <Icon active name="dollar" style={{fontSize: 18, marginRight:8}} />
                  <Text>Dependiente económico: {(familiar.indDependienteEconomico != null) ? this.getResponseIndex(familiar.indDependienteEconomico) : ""}</Text>
                </ListItem>
                <ListItem style={{marginTop:-8, marginBottom:-8}}>
                  <Icon active name="home" style={{fontSize: 18, marginRight:8}} />
                  <Text>Vive con usted: {(familiar.indMismaVivienda != null) ? this.getResponseIndex(familiar.indMismaVivienda) : ""}</Text>
                </ListItem>
                <ListItem style={{marginTop:-12, marginBottom:-12}}>
                  <Col>
                    <Button transparent full onPress={() => { this.removeFamiliarByIndex(i) }}>
                      <Icon active name="trash" style={{color: COLORS.TEXT_WARN, fontSize:17}}/>
                      <Text style={{color: COLORS.TEXT_WARN}}>Eliminar familiar</Text>
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
      <AgregarFamiliar agregarFamiliarChild={this.agregarFamiliar} cerrarModal={this._toggleModal}/>
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
