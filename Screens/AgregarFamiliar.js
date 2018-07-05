import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { Button, Text, Item, Input, Label, H3, Picker, Toast } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import GLOBALS from '../Utils/Globals';
import preguntasAgregarFamiliar from '../Utils/Preguntas/AgregarFamiliar.json';
import CatParentescosData from '../Utils/Catalogos/Parentescos.json';
import CatDelegacionesData from '../Utils/Catalogos/Delegaciones.json';
import CatEntidadesFederativasData from '../Utils/Catalogos/EntidadesFederativas.json';

export default class AgregarFamiliar extends React.Component { 

  constructor(props){
    super(props)
    this.state = {
      preguntas: preguntasAgregarFamiliar,
      ParentescosCat: CatParentescosData,
      DelegacionesCat: CatDelegacionesData,
      EntidadesFederativasCat: CatEntidadesFederativasData,
      parentesco: null,
      indApoyoEconomico:null,
      indDependienteEconomico: null,
      indMismaVivienda: null,
      municipio: null,
      idNuEnitidadFederativa: null,
    };
    jsonRespFamiliar = {}
  }

  componentDidMount(){
    // Se clona json de preguntas a respuestas con solo su nodo en nulo
    this.state.preguntas.map((preg, i) => {
      jsonRespFamiliar[preg.node] = null;
    })  
  }

  setValueAnswerText = (valueData, nodeQuestion, tipoEntrada) => {
    if(tipoEntrada == "default"){
      jsonRespFamiliar[nodeQuestion] = valueData.toUpperCase();
    }else{
      jsonRespFamiliar[nodeQuestion] = valueData;
    }
  }

  setValueAnswerCatalogo = (itemSelected, nodeQuestion) => {
    switch (nodeQuestion) {
      case "parentesco":
        this.setState({parentesco:itemSelected})
        break;
      case "indApoyoEconomico":
        this.setState({indApoyoEconomico:itemSelected})
        break;
      case "indDependienteEconomico":
        this.setState({indDependienteEconomico:itemSelected})
        break;
      case "indMismaVivienda":
        this.setState({indMismaVivienda:itemSelected})
        break;
      case "municipio":
        this.setState({municipio:itemSelected})
        break;
      case "idNuEnitidadFederativa":
        this.setState({idNuEnitidadFederativa:itemSelected})
        break;
      default:
        break;
    }
    jsonRespFamiliar[nodeQuestion] = itemSelected;
  }

  agregarFamiliar = () => {
    if(this.validateForm()){
      this.props.agregarFamiliarChild(jsonRespFamiliar);
    }
  }

  validateForm = () => {
    let countNull = 0;
    let numQuestions =  Object.keys(this.state.preguntas).length;
    let formValido = true;
    this.state.preguntas.map((preg, i) => {
      if(jsonRespFamiliar[preg.node] === null || jsonRespFamiliar[preg.node] === ""){
        countNull++;
      }
    })
    if(countNull == numQuestions){
      formValido = false;
      Alert.alert('Faltan datos', 'Debe llenar por lo menos un campo del familiar', [{text: 'OK'}], { cancelable: false });
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
            AGREGAR FAMILIAR
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
                      maxLength={preg.maxLongitud}
                      style={{fontSize: 16}}
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
            <Button danger rounded full onPress={this.agregarFamiliar}>
              <Text>Agregar</Text>
            </Button>
          </Col>
        </Row>

    </Grid>
    </ScrollView>
    );
  }
}
