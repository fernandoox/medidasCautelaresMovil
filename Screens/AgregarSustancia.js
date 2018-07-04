import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { Button, Text, Item, Input, Label, H3, Picker, Toast } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import axios from 'axios';
import DatePicker from 'react-native-datepicker';
import GLOBALS from '../Utils/Globals';
import preguntasAgregarSustancias from '../Utils/Preguntas/AgregarSustancias.json';
import CatSustanciasData from '../Utils/Catalogos/Sustancias.json';

export default class AgregarSustancia extends React.Component { 

  constructor(props){
    super(props)
    this.state = {
      preguntas: preguntasAgregarSustancias,
      SustanciasCat: CatSustanciasData,
      dtmUltimoConsumo: null,
      sustancia: null,
    };
    jsonRespSustancia = {};
  }

  componentDidMount(){
    // Se clona json de preguntas a respuestas con solo su nodo en nulo
    this.state.preguntas.map((preg, i) => {
      jsonRespSustancia[preg.node] = null;
    })  
  }

  setValueAnswerText = (valueData, nodeQuestion, tipoEntrada) => {
    if(tipoEntrada == "default"){
      jsonRespSustancia[nodeQuestion] = valueData.toUpperCase();
    }else{
      jsonRespSustancia[nodeQuestion] = valueData;
    }
  }

  setValueAnswerCatalogo = (itemSelected, nodeQuestion) => {
    switch (nodeQuestion) {
      case "sustancia":
        this.setState({sustancia:itemSelected})
        break;
      default:
        break;
    }
    jsonRespSustancia[nodeQuestion] = itemSelected;
  }

  setValueAnswerDate = (dateData, nodeQuestion) => {
    switch (nodeQuestion) {
      case "dtmUltimoConsumo":
        this.setState({dtmUltimoConsumo:dateData})
        break;
      default:
        break;
    }
    jsonRespSustancia[nodeQuestion] = dateData;
  }

  agregarSustancia = () => {
    if(this.validateForm()){ 
      let sustanciaRepetida = false;
      // Para la primera vez no existen sustancias repetidas
      if (this.props.sustanciasChild.length == 0) {
        this.props.agregarSustanciaChild(jsonRespSustancia);
      }else{
        // Se iteran las sustancias y se compara con la sustancia que se agregará
        this.props.sustanciasChild.map((sustancia, i) => {
          if(sustancia.sustancia === jsonRespSustancia.sustancia){
            sustanciaRepetida = true;
            Alert.alert('Datos duplicados', 'Ya se agrego la sustancia, no se pueden repetir.', [{text: 'OK'}], { cancelable: false });
            return false; // Break
          }
        });
        if (!sustanciaRepetida) {
          this.props.agregarSustanciaChild(jsonRespSustancia);
        }
      }
    }
  }
  
  validateForm = () => {
    let countNull = 0;
    let numQuestions =  Object.keys(this.state.preguntas).length;
    let formValido = true;
    this.state.preguntas.map((preg, i) => {
      if(jsonRespSustancia[preg.node] === null || jsonRespSustancia[preg.node] === ""){
        countNull++;
      }
    })
    if(countNull == numQuestions){
      formValido = false;
      Alert.alert('Faltan datos', 'Debe llenar por lo menos un campo de la sustancia', [{text: 'OK'}], { cancelable: false });
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
            AGREGAR SUSTANCIA
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
                      autoCapitalize='characters'
                      maxLength={preg.maxLongitud}
                      keyboardType={preg.tipoEntrada}
                      autoCapitalize="characters"
                      onChangeText={(valueData) => {
                        this.setValueAnswerText(valueData, preg.node, preg.tipoEntrada);
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

                {
                    (preg.tipoEntrada == "date" || preg.tipoEntrada == "time") ?
                    <Item style={{marginVertical: 5}} stackedLabel>
                      <Label>{preg.pregunta}:</Label>
                      <DatePicker
                        style={{width: 310}}
                        customStyles={{dateInput:{borderWidth: 0}}}
                        date={this.state[preg.node]}
                        placeholder="Seleccionar"
                        mode={preg.tipoEntrada}
                        androidMode="spinner"
                        format={(preg.tipoEntrada == "date") ? "DD-MM-YYYY" : "HH:mm"}
                        onDateChange={(date) => {
                          this.setValueAnswerDate(date, preg.node)
                      }}/>
                    </Item> : null
                }

                {
                  (preg.tipoEntrada == "boolean") ?
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
                      <Item label="SI" value={1} />
                      <Item label="NO" value={0} />
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
            <Button danger rounded full onPress={this.agregarSustancia}>
              <Text>Agregar</Text>
            </Button>
          </Col>
        </Row>

    </Grid>
    </ScrollView>
    );
  }
}
