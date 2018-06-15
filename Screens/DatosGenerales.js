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
      EntidadesFederativasCat: CatEntidadesFederativasData,
      loadedResponsesBD: false
    };
    jsonRespDatosGenerales = {
      completo: false
    }
  }

  componentDidMount(){

    // Se clona json de preguntas a respuestas con solo su nodo en nulo
    this.state.preguntas.map((preg, i) => {
      jsonRespDatosGenerales[preg.node] = null;
    })

    storage.save({
      key: 'datosGeneralesStorage',
      data: jsonRespDatosGenerales,
    });

    this.setValueAnswerFromBD();
   
  }

  setValueAnswerFromBD = () => {
    if(!this.state.loadedResponsesBD && (this.props.generalesDB != undefined || this.props.generalesDB != null)){
      console.log("Set valores generales!!")
      let objGeneralesDB = this.props.generalesDB;
      for (let nodeDB in objGeneralesDB) {
        if (objGeneralesDB.hasOwnProperty(nodeDB)) {
          jsonRespDatosGenerales[nodeDB] = objGeneralesDB[nodeDB];
          this.state.preguntas.map((pregLocal, i) => {
            if (pregLocal.node == nodeDB) {
              pregLocal.valueBD = objGeneralesDB[nodeDB];
            }
          })
        }
      }
    }
    this.setState({loadedResponsesBD: true});
    this.saveJsonLocalGenerales(jsonRespDatosGenerales);
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
      <View ref="refTestGenerales">
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
                      <Label>{preg.pregunta}</Label>
                      <Input
                        defaultValue={preg.valueBD}
                        keyboardType={preg.tipoEntrada}
                        style={{fontSize: 16}}
                        autoCapitalize='characters'
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
                        placeholder="Seleccionar"
                        date={(preg.valueBD != null && this.state[preg.node] == null) ? preg.valueBD : this.state[preg.node]}
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
                        itemTextStyle={{fontSize: 17}}
                        mode="dropdown"
                        supportedOrientations={['portrait','landscape']}
                        selectedValue={(preg.valueBD != null && this.state[preg.node] == null) ? preg.valueBD : this.state[preg.node]}
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
                        selectedValue={(preg.valueBD != null && this.state[preg.node] == null) ? preg.valueBD : this.state[preg.node]}
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
