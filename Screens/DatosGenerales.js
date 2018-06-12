import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import { Button, Text, Item, Input, Label, H3, Separator, ListItem, Picker, Toast } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import DatePicker from 'react-native-datepicker';
import axios from 'axios';
import Storage from 'react-native-storage';
import GLOBALS from '../Utils/Globals';
import preguntasDatosGeneralesData from '../Utils/Preguntas/DatosGenerales.json';
import CatSexoData from '../Utils/Catalogos/Sexo.json';
import CatNacionalidadesData from '../Utils/Catalogos/Nacionalidades.json';
import CatLugaresEntrevistaData from '../Utils/Catalogos/LugaresEntrevista.json';
import CatEstadosCivilesData from '../Utils/Catalogos/EstadosCiviles.json';
import CatTiposDocMigratorioData from '../Utils/Catalogos/TiposDocMigratorio.json';
import CatDelegacionesData from '../Utils/Catalogos/Delegaciones.json';
import CatEntidadesFederativasData from '../Utils/Catalogos/EntidadesFederativas.json';

export default class DatosGenerales extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      dtmFechaEntrevista: null,
      dtmFechaNacimiento: null,
      horaEntrevista: null,
      indSexo: null,
      snNacionalidad: null,
      lugarEntrevista: null,
      estadoCivil: null,
      indDocumentoMigratorio: null,
      tipoDocMigratorio: null,
      indSabeLeerEscribir: null,
      indSituacionCalle: null,
      municipioLn: null,
      idNuEntidadFederativa: null,
      preguntas: preguntasDatosGeneralesData,
      SexoCat: CatSexoData,
      NacionalidesCat: CatNacionalidadesData,
      LugaresEntrevistaCat: CatLugaresEntrevistaData,
      EstadosCivilesCat: CatEstadosCivilesData,
      TiposDocMigratorioCat: CatTiposDocMigratorioData,
      DelegacionesCat: CatDelegacionesData,
      EntidadesFederativasCat: CatEntidadesFederativasData
    };
    jsonRespDatosGenerales = {}
  }

  componentDidMount(){
    // Se clona json de preguntas a respuestas con solo su nodo en nulo
    this.state.preguntas.map((preg, i) => {
      jsonRespDatosGenerales[preg.node] = null;
    })

    jsonRespDatosGenerales.completo = false;
    storage.save({
      key: 'datosGeneralesStorage',
      data: jsonRespDatosGenerales,
    });
  }

  setValueAnswerText = (valueData, nodeQuestion) => {
    jsonRespDatosGenerales[nodeQuestion] = valueData;
    this.saveJsonLocalGenerales(jsonRespDatosGenerales);
  }

  setValueAnswerDate = (dateData, nodeQuestion) => {
    switch (nodeQuestion) {
      case "dtmFechaEntrevista":
        this.setState({dtmFechaEntrevista:dateData})
        break;
      case "dtmFechaNacimiento":
        this.setState({dtmFechaNacimiento:dateData})
        break;
      case "horaEntrevista":
        this.setState({horaEntrevista:dateData})
        break;
      default:
        break;
    }
    jsonRespDatosGenerales[nodeQuestion] = dateData;
    this.saveJsonLocalGenerales(jsonRespDatosGenerales);
  }

  setValueAnswerCatalogo = (itemSelected, nodeQuestion) => {
    switch (nodeQuestion) {
      case "lugarEntrevista":
        this.setState({lugarEntrevista:itemSelected})
        break;
      case "indSexo":
        this.setState({indSexo:itemSelected})
        break;
      case "estadoCivil":
        this.setState({estadoCivil:itemSelected})
        break;
      case "snNacionalidad":
        this.setState({snNacionalidad:itemSelected})
        break;
      case "indDocumentoMigratorio":
        this.setState({indDocumentoMigratorio:itemSelected})
        break;
      case "indSabeLeerEscribir":
        this.setState({indSabeLeerEscribir:itemSelected})
        break;
      case "indSituacionCalle":
        this.setState({indSituacionCalle:itemSelected})
        break;
      case "municipioLn":
        this.setState({municipioLn:itemSelected})
        break;
      case "tipoDocMigratorio":
        this.setState({tipoDocMigratorio:itemSelected})
        break;
      case "idNuEntidadFederativa":
        this.setState({idNuEntidadFederativa:itemSelected})
        break;
      default:
        break;
    }
    jsonRespDatosGenerales[nodeQuestion] = itemSelected;
    this.saveJsonLocalGenerales(jsonRespDatosGenerales);
  }
  
  saveJsonLocalGenerales = (jsonFromAnswers) => {
    jsonFromAnswers.completo = this.validateForm();
    storage.save({
      key: 'datosGeneralesStorage',
      data: jsonFromAnswers,
    });
  }

  validateForm = () => {
    let formCompleto = true;
    this.state.preguntas.map((preg, i) => {
      if(jsonRespDatosGenerales[preg.node] === null || jsonRespDatosGenerales[preg.node] === ""){
        formCompleto = false;
      }
    })
    return formCompleto;
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
              DATOS GENERALES
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
