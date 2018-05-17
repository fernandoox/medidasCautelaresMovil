import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Button, Text, Item, Input, Label, H3, Separator, ListItem, Picker, Toast } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import DatePicker from 'react-native-datepicker'
import axios from 'axios';
import Storage from 'react-native-storage';
import GLOBALS from '../Utils/Globals';
import preguntasDatosGeneralesData from '../Utils/Preguntas/DatosGenerales.json';
import CatSexoData from '../Utils/Catalogos/Sexo.json';
import CatNacionalidadesData from '../Utils/Catalogos/Nacionalidades.json';

export default class DatosGenerales extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      FECHA_ENTREVISTA: null,
      FECHA_NACIMIENTO: null,
      HORA_ENTREVISTA: null,
      SEXO: null,
      ID_NACIONALIDAD: null,
      DOCUMENTO_MIGRATORIO: null,
      preguntas: preguntasDatosGeneralesData,
      SexoCat: CatSexoData,
      NacionalidesCat: CatNacionalidadesData
    };
    jsonRespDatosGenerales = {}
  }

  componentDidMount(){
    // Se clona json de preguntas a respuestas con solo su nodo en nulo
    this.state.preguntas.map((preg, i) => {
      jsonRespDatosGenerales[preg.node] = null;
    })  
  }

  setValueAnswerText = (valueData, nodeQuestion) => {
    jsonRespDatosGenerales[nodeQuestion] = valueData;
  }

  setValueAnswerDate = (dateData, nodeQuestion) => {
    switch (nodeQuestion) {
      case "FECHA_ENTREVISTA":
        this.setState({FECHA_ENTREVISTA:dateData})
        break;
      case "FECHA_NACIMIENTO":
        this.setState({FECHA_NACIMIENTO:dateData})
        break;
      case "HORA_ENTREVISTA":
        this.setState({HORA_ENTREVISTA:dateData})
        break;
      default:
        break;
    }
    jsonRespDatosGenerales[nodeQuestion] = dateData;
  }

  setValueAnswerCatalogo = (itemSelected, nodeQuestion) => {
    switch (nodeQuestion) {
      case "SEXO":
        this.setState({SEXO:itemSelected})
        break;
      case "ID_NACIONALIDAD":
        this.setState({ID_NACIONALIDAD:itemSelected})
        break;
      case "DOCUMENTO_MIGRATORIO":
        this.setState({DOCUMENTO_MIGRATORIO:itemSelected})
        break;
      default:
        break;
    }
    jsonRespDatosGenerales[nodeQuestion] = itemSelected;
  }

  confirmToNext = () => {
    Alert.alert(
      '¿Son correctos los datos?',
      'Si continua se limpiarán los campos',
      [
        {text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Continuar', onPress: () => this.nextPreprocess()},
      ],
      { cancelable: false }
    )
  }
  
  nextPreprocess = () => {
      jsonRespDatosGenerales.completo = this.validateForm();
      this.props.saveState(0,{datosGenerales:jsonRespDatosGenerales});
  }

  validateForm = () => {
    let formValido = true;
    this.state.preguntas.map((preg, i) => {
      if(jsonRespDatosGenerales[preg.node] === null || jsonRespDatosGenerales[preg.node] === ""){
        formValido = false;
        Toast.show({text: preg.pregunta+' es campo obligatorio.', buttonText: 'OK' , duration: 3500, textStyle: { color: GLOBALS.COLORS.TEXT_WARN }})
      }
    })
    return formValido;
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" enabled>
      <ScrollView keyboardShouldPersistTaps="always" keyboardDismissMode="interactive" overScrollMode="never">
      <Grid>
        <Row>
          <Col>
            <Text style={{marginVertical:10, textAlign:'center', color: GLOBALS.COLORS.BACKGROUND_PRIMARY, fontWeight:'bold'}}>
              DATOS GENERALES {/*- CP: {this.props.testProp}*/}
            </Text>

            {/* Iterar el JSON de Preguntas */}
            {
              this.state.preguntas.map((preg, i) => {
                return (
                  <Col key={i}>
                    <Row style={{flexDirection: "row", alignItems:'center'}}>

                      {
                        (preg.tipoEntrada == "text") ?
                        <Item stackedLabel>
                          <Label>{preg.pregunta}:</Label>
                          <Input
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
                    </Row>
                  </Col>
                )
              })
            }

          </Col>
        </Row>

        <Row>
          <Col style={{padding:5}}>
            <Button full rounded light onPress={this.confirmToNext}>
              <Text>Confirmar</Text>
            </Button>
          </Col>
        </Row>

      </Grid>
      </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
