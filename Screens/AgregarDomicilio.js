import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Button, Text, Item, Input, Label, H3, Picker, Toast } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import axios from 'axios';
import GLOBALS from '../Utils/Globals';
import preguntasAgregarMunicipio from '../Utils/Preguntas/AgregarDomicilio.json';
import CatDelegacionesData from '../Utils/Catalogos/Delegaciones.json';
import CatTiposDomicilioData from '../Utils/Catalogos/TiposDomicilio.json';

export default class AgregarDomicilio extends React.Component { 

  constructor(props){
    super(props)
    this.state = {
      codigoPoastal: null,
      calle: null,
      preguntas: preguntasAgregarMunicipio,
      DelegacionesCat: CatDelegacionesData,
      TiposDomicilioCat: CatTiposDomicilioData,
      ID_NU_TIPO_DOMICILIO:null,
      ID_NU_MUNICIPIO:null,
      domicilio: {}
    };
    jsonRespDomicilio = {}
  }

  componentDidMount(){
    // Se clona json de preguntas a respuestas con solo su nodo en nulo
    this.state.preguntas.map((preg, i) => {
      jsonRespDomicilio[preg.node] = null;
    })  
  }

  setValueAnswerText = (valueData, nodeQuestion) => {
    jsonRespDomicilio[nodeQuestion] = valueData;
  }

  setValueAnswerCatalogo = (itemSelected, nodeQuestion) => {
    switch (nodeQuestion) {
      case "ID_NU_TIPO_DOMICILIO":
        this.setState({ID_NU_TIPO_DOMICILIO:itemSelected})
        break;
      case "ID_NU_MUNICIPIO":
        this.setState({ID_NU_MUNICIPIO:itemSelected})
        break;
      default:
        break;
    }
    jsonRespDomicilio[nodeQuestion] = itemSelected;
  }

  agregarDomicilio = () => {
    console.log("JSON Domicilio: "+JSON.stringify(jsonRespDomicilio))
    this.props.agregarDomicilioChild(jsonRespDomicilio);
  }

  render() {
    return (
    <ScrollView keyboardShouldPersistTaps="always" style={{backgroundColor:'white', paddingBottom:20}}>
    <Grid style={{backgroundColor:'white'}} style={{paddingHorizontal:10, paddingBottom:15}}>
      <Row>
        <Col>
          <Text style={{marginVertical:10, textAlign:'center', color: GLOBALS.COLORS.BACKGROUND_PRIMARY, fontWeight:'bold'}}>
            AGREGAR DOMICILIO
          </Text>

          {/* Iterar el JSON de Preguntas */}
          {
            this.state.preguntas.map((preg, i) => {
              return (
                <Col key={i}>
                  <Row style={{flexDirection: "row", alignItems:'center'}}>
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

                    </Row>
                  </Col>
                )
              })
            }

          </Col>
        </Row>

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
