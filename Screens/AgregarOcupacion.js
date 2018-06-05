import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { Button, Text, Item, Input, Label, H3, Picker, Toast } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import axios from 'axios';
import DatePicker from 'react-native-datepicker';
import GLOBALS from '../Utils/Globals';
import preguntasAgregarOcupacion from '../Utils/Preguntas/AgregarOcupacion.json';

export default class AgregarOcupacion extends React.Component { 

  constructor(props){
    super(props)
    this.state = {
      preguntas: preguntasAgregarOcupacion,
      dtmFechaInicio: null,
      indEmpleoActual: null,
    };
    jsonRespOcupacion = {}
  }

  componentDidMount(){
    // Se clona json de preguntas a respuestas con solo su nodo en nulo
    this.state.preguntas.map((preg, i) => {
      jsonRespOcupacion[preg.node] = null;
    })  
  }

  setValueAnswerText = (valueData, nodeQuestion) => {
    jsonRespOcupacion[nodeQuestion] = valueData;
  }

  setValueAnswerCatalogo = (itemSelected, nodeQuestion) => {
    switch (nodeQuestion) {
      case "indEmpleoActual":
        this.setState({indEmpleoActual:itemSelected})
        break;
      default:
        break;
    }
    jsonRespOcupacion[nodeQuestion] = itemSelected;
  }

  setValueAnswerDate = (dateData, nodeQuestion) => {
    switch (nodeQuestion) {
      case "dtmFechaInicio":
        this.setState({dtmFechaInicio:dateData})
        break;
      default:
        break;
    }
    jsonRespOcupacion[nodeQuestion] = dateData;
  }

  agregarOcupacion = () => {
    if(this.validateForm()){
      this.props.agregarOcupacionChild(jsonRespOcupacion);
    }
  }

  validateForm = () => {
    let countNull = 0;
    let numQuestions =  Object.keys(this.state.preguntas).length;
    let formValido = true;
    this.state.preguntas.map((preg, i) => {
      if(jsonRespOcupacion[preg.node] === null || jsonRespOcupacion[preg.node] === ""){
        countNull++;
      }
    })
    if(countNull == numQuestions){
      formValido = false;
      Alert.alert('Error', 'Debe llenar por lo menos un campo de la ocupación', [{text: 'OK'}], { cancelable: false });
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
            AGREGAR OCUPACIÓN
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
                      keyboardType={preg.tipoEntrada}
                      maxLength={preg.maxLength}
                      style={{fontSize: 16}}
                      onChangeText={(valueData) => {
                        this.setValueAnswerText(valueData, preg.node);
                      }}/>
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
            <Button danger rounded full onPress={this.agregarOcupacion}>
              <Text>Agregar</Text>
            </Button>
          </Col>
        </Row>

    </Grid>
    </ScrollView>
    );
  }
}
