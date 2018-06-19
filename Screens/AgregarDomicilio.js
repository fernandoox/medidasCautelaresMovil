import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { Button, Text, Item, Input, Label, H3, Picker, Toast } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import axios from 'axios';
import GLOBALS from '../Utils/Globals';
import preguntasAgregarMunicipio from '../Utils/Preguntas/AgregarDomicilio.json';
import CatEntidadesFederativasData from '../Utils/Catalogos/EntidadesFederativas.json';
import CatDelegacionesData from '../Utils/Catalogos/Delegaciones.json';
import CatTiposDomicilioData from '../Utils/Catalogos/TiposDomicilio.json';
import CatTiposViviendaData from '../Utils/Catalogos/TiposVivienda.json';

export default class AgregarDomicilio extends React.Component { 

  constructor(props){
    super(props)
    this.state = {
      preguntas: preguntasAgregarMunicipio,
      EntidadesFederativasCat: CatEntidadesFederativasData,
      DelegacionesCat: CatDelegacionesData,
      TiposDomicilioCat: CatTiposDomicilioData,
      TiposViviendaCat: CatTiposViviendaData,
      idNuEntidadFederativa: null,
      municipio:null,
      tipoDomicilio:null,
      tipoVivienda:null,
    };
    jsonRespDomicilio = {}
  }

  componentDidMount(){
    // Se clona json de preguntas a respuestas con solo su nodo en nulo
    this.state.preguntas.map((preg, i) => {
      jsonRespDomicilio[preg.node] = null;
    })  
  }

  setValueAnswerText = (valueData, nodeQuestion) => {
    jsonRespDomicilio[nodeQuestion] = valueData;
  }

  setValueAnswerCatalogo = (itemSelected, nodeQuestion) => {
    switch (nodeQuestion) {
      case "idNuEntidadFederativa":
        this.setState({idNuEntidadFederativa:itemSelected})
        break;
      case "municipio":
        this.setState({municipio:itemSelected})
        break;
      case "tipoDomicilio":
        this.setState({tipoDomicilio:itemSelected})
        break;
      case "tipoVivienda":
        this.setState({tipoVivienda:itemSelected})
        break;
      default:
        break;
    }
    jsonRespDomicilio[nodeQuestion] = itemSelected;
  }

  agregarDomicilio = () => {
    if(this.validateForm()){
      console.log("JSON Domicilio: "+JSON.stringify(jsonRespDomicilio))
      this.props.agregarDomicilioChild(jsonRespDomicilio);
    }
  }

  validateForm = () => {
    let countNull = 0;
    let numQuestions =  Object.keys(this.state.preguntas).length;
    let formValido = true;
    this.state.preguntas.map((preg, i) => {
      if(jsonRespDomicilio[preg.node] === null || jsonRespDomicilio[preg.node] === ""){
        countNull++;
      }
    })
    if(countNull == numQuestions){
      formValido = false;
      Alert.alert('Error', 'Debe llenar por lo menos un campo del domicilio', [{text: 'OK'}], { cancelable: false });
    }
    return formValido;
  }

  render() {
    return (
    <ScrollView keyboardShouldPersistTaps="always" style={{backgroundColor:'white', paddingBottom:20}}>
    <Grid style={{backgroundColor:'white'}} style={{paddingHorizontal:10, paddingBottom:15}}>
      <Row>
        <Col>
          <Text style={{marginVertical:10, textAlign:'center', color: COLORS.BACKGROUND_PRIMARY, fontWeight:'bold'}}>
            AGREGAR DOMICILIO
          </Text>
        </Col>
      </Row>

      {/* Iterar el JSON de Preguntas */}
      {
        this.state.preguntas.map((preg, i) => {
          return (
            <Row style={{flexDirection: "row", alignItems:'center'}} key={i}>
              <Col>
                {
                  (preg.tipoEntrada == "default" || preg.tipoEntrada == "numeric") ?
                  <Item stackedLabel>
                    <Label>{preg.pregunta}:</Label>
                    <Input
                      maxLength={preg.maxLength}
                      style={{fontSize: 16}}
                      autoCapitalize='characters'
                      onChangeText={(valueData) => {
                        this.setValueAnswerText(valueData, preg.node);
                      }}/>
                   </Item> : null
                }

                {
                  (preg.tipoEntrada == "catalogo") ?
                  <Item style={{marginVertical: 5}} stackedLabel>
                    <Label>{preg.pregunta}:</Label>
                    <Picker
                      style={{width: 310}}
                      iosHeader="Seleccionar una opción"
                      placeholder="Seleccionar una opción"
                      itemTextStyle={{ fontSize: 17}}
                      mode="dropdown"
                      supportedOrientations={['portrait','landscape']}
                      selectedValue={this.state[preg.node]}
                      onValueChange={(itemSelected) => {
                        this.setValueAnswerCatalogo(itemSelected, preg.node)
                      }}>
                      <Item label="Seleccionar una opción" value={null} />
                      {
                        this.state[preg.catalogo].map((catalogo) => {
                          return (
                            <Item
                              label={catalogo.nombre}
                              value={catalogo.id} key={catalogo.id}/>
                          );
                        })
                      }
                    </Picker>
                  </Item> : null
                }
              </Col>
              </Row>
            )
          })
        }

        <Row>
          <Col style={{padding:5}}>
            <Button light rounded full onPress={this.props.cerrarModal}>
              <Text>Cancelar</Text>
            </Button>
          </Col>
          <Col style={{padding:5}}>
            <Button danger rounded full onPress={this.agregarDomicilio}>
              <Text>Agregar</Text>
            </Button>
          </Col>
        </Row>

    </Grid>
    </ScrollView>
    );
  }
}
