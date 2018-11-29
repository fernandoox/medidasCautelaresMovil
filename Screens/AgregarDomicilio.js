import React from 'react';
import { ScrollView, Alert } from 'react-native';
import { Button, Text, Item, Input, Label, Picker } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import preguntasAgregarMunicipio from '../Utils/Preguntas/AgregarDomicilio.json';
import CatEntidadesFederativasData from '../Utils/Catalogos/EntidadesFederativas.json';
import CatTiposDomicilioData from '../Utils/Catalogos/TiposDomicilio.json';
import CatTiposViviendaData from '../Utils/Catalogos/TiposVivienda.json';

export default class AgregarDomicilio extends React.Component { 

  constructor(props){
    super(props)
    this.state = {
      preguntas: preguntasAgregarMunicipio,
      EntidadesFederativasCat: CatEntidadesFederativasData,
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

  setValueAnswerText = (valueData, nodeQuestion, tipoEntrada) => {
    if(tipoEntrada == "default"){
      jsonRespDomicilio[nodeQuestion] = valueData.toUpperCase();
    }else{
      jsonRespDomicilio[nodeQuestion] = valueData;
    }
  }

  setValueAnswerCatalogo = (itemSelected, nodeQuestion) => {
    switch (nodeQuestion) {
      case "idNuEntidadFederativa":
        this.setState({idNuEntidadFederativa:itemSelected})
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
      let domicilioActualRepetido = false;
      // Para la primera vez no existen sustancias repetidas
      if (this.props.domiciliosChild.length == 0) {
        this.props.agregarDomicilioChild(jsonRespDomicilio);
      }else{
        // Se iteran los domicilios y se compara con el domicilio que se agregará
        this.props.domiciliosChild.map((domicilio, i) => {
          if(domicilio.tipoDomicilio == 1 && jsonRespDomicilio.tipoDomicilio == 1){ // actual
            domicilioActualRepetido = true;
            Alert.alert('Datos duplicados', "Ya se ha dado de alta un domicilio 'Actual'.", [{text: 'OK'}], { cancelable: false });
            return false; // Break
          }
        });
        if (!domicilioActualRepetido) {
          this.props.agregarDomicilioChild(jsonRespDomicilio);
        }
      }
      
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
      Alert.alert('Faltan datos', 'Debe llenar por lo menos un campo del domicilio', [{text: 'OK'}], { cancelable: false });
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
                  <Item style={{marginVertical: 10}} stackedLabel>
                    <Label>{preg.pregunta}:</Label>
                    <Input
                      maxLength={preg.maxLongitud}
                      style={{fontSize: 14}}
                      keyboardType={preg.tipoEntrada}
                      autoCapitalize="characters"
                      onChangeText={(valueData) => {
                        this.setValueAnswerText(valueData, preg.node, preg.tipoEntrada);
                      }}/>
                   </Item> : null
                }

                {
                  (preg.tipoEntrada == "catalogo") ?
                  <Item style={{marginVertical: 10}} stackedLabel>
                    <Label>{preg.pregunta}:</Label>
                    <Picker
                      style={{width: 310}}
                      iosHeader="Seleccionar una opción"
                      placeholder="Seleccionar una opción"
                      itemTextStyle={{ fontSize: 14}}
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
