import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Dimensions, Alert } from 'react-native';
import { Text, Item, Input, Label, Picker } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import Display from 'react-native-display';
import DatePicker from 'react-native-datepicker';
import preguntasDatosGeneralesData from '../Utils/Preguntas/DatosGenerales.json';
import CatSexoData from '../Utils/Catalogos/Sexo.json';
import CatNacionalidadesData from '../Utils/Catalogos/Nacionalidades.json';
import CatLugaresEntrevistaData from '../Utils/Catalogos/LugaresEntrevista.json';
import CatEstadosCivilesData from '../Utils/Catalogos/EstadosCiviles.json';
import CatTiposDocMigratorioData from '../Utils/Catalogos/TiposDocMigratorio.json';
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
      indSituacionCalle: null,
      municipioLn: null,
      idNuEntidadFederativa: null,
      preguntas: preguntasDatosGeneralesData,
      SexoCat: CatSexoData,
      NacionalidesCat: CatNacionalidadesData,
      LugaresEntrevistaCat: CatLugaresEntrevistaData,
      EstadosCivilesCat: CatEstadosCivilesData,
      TiposDocMigratorioCat: CatTiposDocMigratorioData,
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
    // Limpiar respuestas de cada pregunta
    this.state.preguntas.map((pregLocal, i) => {
        pregLocal.valueBD = null;
    })
    if(!this.state.loadedResponsesBD && this.props.generalesDB != null){
      
      this.setState({loadedResponsesBD: true}, () => {
        /*
        * Del screen de entrevista recibe props generalesDB que es la resp de petición a bd 
        * de la información de imputado, para hacer el set de las respuestas 
        * de bd a los componentes del form se ocupa el nodeDB (foreach)
        */
        let objGeneralesDB = this.props.generalesDB;
        for (let nodeGeneralesDB in objGeneralesDB) {
          if (objGeneralesDB.hasOwnProperty(nodeGeneralesDB)) {
            jsonRespDatosGenerales[nodeGeneralesDB] = objGeneralesDB[nodeGeneralesDB];
            this.state.preguntas.map((pregLocal, i) => {
              if (pregLocal.node == nodeGeneralesDB) {
                pregLocal.valueBD = objGeneralesDB[nodeGeneralesDB];
              }
            })
          }
        }
        this.saveJsonLocalGenerales(jsonRespDatosGenerales);
      });
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
        // Diferente de otro
        if (itemSelected != 10) {
          jsonRespDatosGenerales.snLugarEntrevistaOtro = null;
        }
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
      case "indSituacionCalle":
        this.setState({indSituacionCalle:itemSelected})
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

  focusNextInput = (nodeToFocus) => {
    console.log("Tipo de nodeFocus:",typeof nodeToFocus)
    console.log("Focus:", nodeToFocus)
    console.log("Size refs:", this.refs.length)
    //this.refs['TextInput'].focus()
    /*
    function pregunta(pregunta) { 
      return pregunta.node === nodeToFocus;
    }  
    this.state.preguntas.find(pregunta).focus = true;
    this.setState({preguntas: this.state.preguntas});
    console.log(JSON.stringify(this.state.preguntas.find(pregunta)));*/

    /*returnKeyType = { "next" }
    onSubmitEditing={() => {this.focusNextInput(this.state.preguntas[index+1].node)}}
    ref={this.state.preguntas[index+1].node}
    blurOnSubmit={false}*/
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
                    <Display enable={( (preg.node == 'snLugarEntrevistaOtro') ? false : true ) || this.state.lugarEntrevista == 10 || jsonRespDatosGenerales.lugarEntrevista == 10}
                      enterDuration={300}
                      enter="fadeInDown" exit="fadeOut">
                      <Item style={{marginVertical: 10}} stackedLabel>
                        <Label>{preg.pregunta}:</Label>
                        <Input
                          disabled={(this.props.imputadoProp.idEstatus == ESTATUS_SOLICITUD.CONCLUIDO)}
                          maxLength={preg.maxLongitud}
                          defaultValue={preg.valueBD}
                          style={{fontSize: 14}}
                          keyboardType={preg.tipoEntrada}
                          autoCapitalize="characters"
                          onChangeText={(valueData) => {
                            this.setValueAnswerText(valueData, preg.node, preg.tipoEntrada);
                          }}/>
                      </Item>
                    </Display> : null
                  }

                  {
                    (preg.tipoEntrada == "date" || preg.tipoEntrada == "time") ?
                    <Item style={{marginVertical: 10}} stackedLabel>
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
                    <Item style={{marginVertical: 10}} stackedLabel>
                      <Label>{preg.pregunta}:</Label>
                      <Picker
                        enabled={(this.props.imputadoProp.idEstatus != ESTATUS_SOLICITUD.CONCLUIDO)}
                        style={{width: screenWidth}}
                        iosHeader="Seleccionar una opción"
                        placeholder="Seleccionar una opción"
                        itemTextStyle={{fontSize: 14}}
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
                    <Item style={{marginVertical: 10}} stackedLabel>
                      <Label>{preg.pregunta}:</Label>
                      <Picker
                        enabled={(this.props.imputadoProp.idEstatus != ESTATUS_SOLICITUD.CONCLUIDO)}
                        style={{width: screenWidth}}
                        iosHeader="Seleccionar una opción"
                        placeholder="Seleccionar una opción"
                        itemTextStyle={{ fontSize: 14}}
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
                  {
                    (preg.tipoEntrada == "separador") ?
                    <Text style={{marginVertical:5, textAlign:'center', color:'#c93242', fontWeight:'bold'}}>
                      {preg.titulo}:
                    </Text> : null
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
