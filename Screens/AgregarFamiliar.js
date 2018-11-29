import React from 'react';
import { ScrollView, Alert } from 'react-native';
import { Button, Text, Item, Input, Label, Picker } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import preguntasAgregarFamiliar from '../Utils/Preguntas/AgregarFamiliar.json';
import CatParentescosData from '../Utils/Catalogos/Parentescos.json';
import CatEntidadesFederativasData from '../Utils/Catalogos/EntidadesFederativas.json';

export default class AgregarFamiliar extends React.Component { 

  constructor(props){
    super(props)
    this.state = {
      preguntas: preguntasAgregarFamiliar,
      ParentescosCat: CatParentescosData,
      EntidadesFederativasCat: CatEntidadesFederativasData,
      parentesco: null,
      indApoyoEconomico:null,
      indDependienteEconomico: null,
      indMismaVivienda: null,
      municipio: null,
      idNuEntidadFederativa: null,
    };
    jsonRespFamiliar = {}
  }

  componentDidMount(){
    // Se clona json de preguntas a respuestas con solo su nodo en nulo
    this.state.preguntas.map((preg, i) => {
      jsonRespFamiliar[preg.node] = null;
    })  
  }

  componentWillMount(){
    // Reset valores domicilio
    this.state.preguntas.map((preg, i) => {
      preg.valueBD = null;
    })
    this.setState({preguntas: this.state.preguntas});
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
        this.setState({indMismaVivienda:itemSelected}, () => {
          if (this.state.indMismaVivienda == 1) {
            this.recuperarDomicilioActualImputado().then((domicilioActual) => {
              this.setDomicilioActual(domicilioActual);
            });
          }else{
            let fieldsDomicilioToReset = {
              snCodigoPostal: null,
              snCalle: null,
              snNumExterior: null,
              snMunicipio: null,
              snColonia: null,
              idNuEntidadFederativa: null
            }; 
            if (fieldsDomicilioToReset != null) {
              this.resetDomicilioActual(fieldsDomicilioToReset);
            }
          }
        })
        break;
      case "idNuEntidadFederativa":
        this.setState({idNuEntidadFederativa:itemSelected})
        break;
      default:
        break;
    }
    jsonRespFamiliar[nodeQuestion] = itemSelected;
  }

  recuperarDomicilioActualImputado = () => {
    return new Promise( (resolve, reject) => {
      storage.load({
        key: 'datosDomiciliosStorage',
      }).then((response) => {
        response.datosDomicilios.map( (domicilio) => {
          if (domicilio.tipoDomicilio == 1) {
            resolve(domicilio); // domicilio actual
          }
        })
      }).catch(err => {
        console.log("Error async domicilios: "+err.message);
        reject(null)
      })
    });
  }

  setDomicilioActual = (domicilioActual) => {
    this.state.preguntas.map((pregLocal, i) => {
      for (var propertyObjDomcilio in domicilioActual) {
        jsonRespFamiliar[propertyObjDomcilio] = domicilioActual[propertyObjDomcilio];
        if (domicilioActual.hasOwnProperty(propertyObjDomcilio)) {
          if (pregLocal.node == propertyObjDomcilio) {
            pregLocal.valueBD = domicilioActual[propertyObjDomcilio];
          }
        }
      }
    })
    this.setState({preguntas: this.state.preguntas});
  }

  resetDomicilioActual = (domicilioActual) => {
    this.state.preguntas.map((pregLocal, i) => {
      for (var propertyObjDomcilio in domicilioActual) {
        jsonRespFamiliar[propertyObjDomcilio] = domicilioActual[propertyObjDomcilio];
        if (domicilioActual.hasOwnProperty(propertyObjDomcilio)) {
          if (pregLocal.node == propertyObjDomcilio) {
            pregLocal.valueBD = null;
          }
        }
      }
    })
    this.setState({preguntas: this.state.preguntas});
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
                  <Item style={{marginVertical: 10}} stackedLabel>
                    <Label>{preg.pregunta}:</Label>
                    <Input
                      defaultValue={preg.valueBD}
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
                      style={{width: 310}}
                      iosHeader="Seleccionar una opción"
                      placeholder="Seleccionar una opción"
                      itemTextStyle={{fontSize: 14}}
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
