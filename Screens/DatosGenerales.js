import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, AsyncStorage, Dimensions } from 'react-native';
import { Button, Text, Item, Input, Label, H3, Separator, ListItem, Picker, Toast } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import DatePicker from 'react-native-datepicker';
import axios from 'axios';
import Storage from 'react-native-storage';
import GLOBALS from '../Utils/Globals';
import CONSTANTS from '../Utils/ConstantsNG';
import preguntasDatosGeneralesData from '../Utils/Preguntas/DatosGenerales.json';
import CatSexoData from '../Utils/Catalogos/Sexo.json';
import CatNacionalidadesData from '../Utils/Catalogos/Nacionalidades.json';
import CatLugaresEntrevistaData from '../Utils/Catalogos/LugaresEntrevista.json';
import CatEstadosCivilesData from '../Utils/Catalogos/EstadosCiviles.json';
import CatTiposDocMigratorioData from '../Utils/Catalogos/TiposDocMigratorio.json';
import CatDelegacionesData from '../Utils/Catalogos/Delegaciones.json';
import CatEntidadesFederativasData from '../Utils/Catalogos/EntidadesFederativas.json';

const screenWidth = Dimensions.get('window').width - 30;

export default class DatosGenerales extends React.Component {

  constructor(props){
    super(props)
    
    this.state = {
      dtmFechaEntrevista: null,
      snHoraEntrevista: null,
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
    if(!this.state.loadedResponsesBD && this.props.generalesDB != null){
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

      this.setState({loadedResponsesBD: true});
      this.saveJsonLocalGenerales(jsonRespDatosGenerales);
    }
  }

  setValueAnswerText = (valueData, nodeQuestion, tipoEntrada) => {
    if(tipoEntrada == "default"){
      jsonRespDatosGenerales[nodeQuestion] = valueData.toUpperCase();
    }else{
      jsonRespDatosGenerales[nodeQuestion] = valueData;
    }
    this.saveJsonLocalGenerales(jsonRespDatosGenerales);
  }

  setValueAnswerDate = (dateData, nodeQuestion) => {
    switch (nodeQuestion) {
      case "dtmFechaEntrevista":
        this.setState({dtmFechaEntrevista:dateData})
        break;
      case "snHoraEntrevista":
        this.setState({snHoraEntrevista:dateData})
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
      <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={230}>
      <ScrollView keyboardShouldPersistTaps="always" keyboardDismissMode='none'>
      
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
          this.state.preguntas.map((preg, index) => {
            return (
              <Row style={{flexDirection: "row", alignItems:'center'}} key={index}>
              <Col>
                  {
                    (preg.tipoEntrada == "default" || preg.tipoEntrada == "numeric") ?
                    <Item stackedLabel>
                      <Label>{preg.pregunta}:</Label>
                      <Input
                        disabled={(this.props.imputadoProp.idEstatus == ESTATUS_SOLICITUD.CONCLUIDO)}
                        maxLength={preg.maxLongitud}
                        defaultValue={preg.valueBD}
                        style={{fontSize: 16}}
                        keyboardType={preg.tipoEntrada}
                        autoCapitalize="characters"
                        onChangeText={(valueData) => {
                          this.setValueAnswerText(valueData, preg.node, preg.tipoEntrada);
                        }}/>
                    </Item> : null
                  }

                  {
                    (preg.tipoEntrada == "date" || preg.tipoEntrada == "time") ?
                    <Item style={{marginVertical: 5}} stackedLabel>
                      <Label>{preg.pregunta}:</Label>
                      <DatePicker
                        disabled={(this.props.imputadoProp.idEstatus == ESTATUS_SOLICITUD.CONCLUIDO)}
                        style={{width: screenWidth}}
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
                        enabled={(this.props.imputadoProp.idEstatus != ESTATUS_SOLICITUD.CONCLUIDO)}
                        style={{width: screenWidth}}
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
                        enabled={(this.props.imputadoProp.idEstatus != ESTATUS_SOLICITUD.CONCLUIDO)}
                        style={{width: screenWidth}}
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
