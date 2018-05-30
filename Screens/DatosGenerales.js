import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import { Button, Text, Item, Input, Label, H3, Separator, ListItem, Picker, Toast } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import DatePicker from 'react-native-datepicker'
import axios from 'axios';
import Storage from 'react-native-storage';
import GLOBALS from '../Utils/Globals';
import preguntasDatosGeneralesData from '../Utils/Preguntas/DatosGenerales.json';
import CatSexoData from '../Utils/Catalogos/Sexo.json';
import CatNacionalidadesData from '../Utils/Catalogos/Nacionalidades.json';
import CatLugaresEntrevistaData from '../Utils/Catalogos/LugaresEntrevista.json';

export default class DatosGenerales extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      DTM_FECHA_ENTREVISTA: null,
      FECHA_NACIMIENTO: null,
      HORA_ENTREVISTA: null,
      SEXO: null,
      ID_NACIONALIDAD: null,
      ID_NU_LUGAR_ENTREVISTA: null,
      DOCUMENTO_MIGRATORIO: null,
      preguntas: preguntasDatosGeneralesData,
      SexoCat: CatSexoData,
      NacionalidesCat: CatNacionalidadesData,
      LugaresEntrevistaCat: CatLugaresEntrevistaData
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
    this.saveJsonLocalGenerales(jsonRespDatosGenerales);
  }

  setValueAnswerDate = (dateData, nodeQuestion) => {
    switch (nodeQuestion) {
      case "DTM_FECHA_ENTREVISTA":
        this.setState({DTM_FECHA_ENTREVISTA:dateData})
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
    this.saveJsonLocalGenerales(jsonRespDatosGenerales);
  }

  setValueAnswerCatalogo = (itemSelected, nodeQuestion) => {
    switch (nodeQuestion) {
      case "ID_NU_LUGAR_ENTREVISTA":
        this.setState({ID_NU_LUGAR_ENTREVISTA:itemSelected})
        break;
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
    this.saveJsonLocalGenerales(jsonRespDatosGenerales);
  }
  
  saveJsonLocalGenerales = (jsonFromAnswers) => {
    console.log(JSON.stringify(jsonFromAnswers));
    jsonFromAnswers.completo = this.validateForm();
    storage.save({
      key: 'datosGeneralesStorage',
      data: jsonFromAnswers,
    });
  }

  validateForm = () => {
    let formValido = true;
    this.state.preguntas.map((preg, i) => {
      if(jsonRespDatosGenerales[preg.node] === null || jsonRespDatosGenerales[preg.node] === ""){
        formValido = false;
        //Toast.show({text: preg.pregunta+' es campo obligatorio.', buttonText: 'OK' , duration: 3500, textStyle: { color: COLORS.TEXT_WARN }})
      }
    })
    return formValido;
  }

  render() {
    return (
      <View>
      <KeyboardAvoidingView behavior="position" enabled keyboardVerticalOffset={100}>
      <ScrollView keyboardShouldPersistTaps="always" keyboardDismissMode="interactive" overScrollMode="never">
      
      <Grid>
        <Row>
          <Col>
            <Text style={{marginVertical:10, textAlign:'center', color: COLORS.BACKGROUND_PRIMARY, fontWeight:'bold'}}>
              DATOS GENERALES {/*- CP: {this.props.testProp}*/}
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
              </Col>
              </Row>
            )
          })
        }

      </Grid>
      
      </ScrollView>
      </KeyboardAvoidingView>
      </View>
    );
  }
}
