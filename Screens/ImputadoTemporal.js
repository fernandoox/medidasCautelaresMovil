import React from 'react';
import { Font, SQLite } from 'expo';
import { View, Alert, Keyboard } from 'react-native';
import { Button, Text, Item, Picker, Input, H3 } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import { NavigationActions } from 'react-navigation';
import GLOBALS from '../Utils/Globals';
const db = SQLite.openDatabase('db.db');

export default class ImputadoTemporal extends React.Component {

  constructor(props){
    super(props)
    const { params } = this.props.nav.state;
    this.state = {
      //Variables
      carpetaJudicial:null,
      imputados: [],
      numImputados: 0,
      selectedImputado: null,
      evaluador: (params.evaluador !=  undefined || params.evaluador !=  null) ? params.evaluador : null,
    };
    const nav = this.props.nav;
  }

  buscarCarpetasEnSQLite = () => {
    console.log("Buscando carpeta SQLite:",this.state.carpetaJudicial);
    db.transaction(
      tx => {
         tx.executeSql('select * from entrevistasOffline where carpeta_investigacion = ? or carpeta_judicial = ?', 
          [this.state.carpetaJudicial], (_, { rows: { _array }}) => {
            let arrayImputados = _array.map((evaluacion) => {
              evaluacion.data = JSON.parse(evaluacion.data);
              //console.log("Evaluaciones SQLite:", JSON.stringify(evaluacion.data))
              return {
                id: evaluacion.data.idImputado,
                nombre: evaluacion.data.nombre,
                primerApellido: evaluacion.data.primerApellido,
                segundoApellido: evaluacion.data.segundoApellido,
                idEstatus: 4,
                evaluacionMensual: evaluacion.data.evaluacionMensual,
              };
            })
            console.log("Array imputados size SQLite", arrayImputados.length)
            this.setState({imputados:arrayImputados, numImputados:arrayImputados.length});
            Keyboard.dismiss();
         });
      },
      (err) => { console.log("Select Failed Message", err) },
      this.update
   );
  }

  onSelectImputado(value) {
    this.setState({ selectedImputado: value })
  }

  aplicarEntrevistaImputadoTemporal = () => {
      this.props.nav.navigate('EntrevistaScreen',
        {
          imputadoParam: this.state.selectedImputado,
          carpetaJudicialParam: this.state.carpetaJudicial,
          tipoCapturaParam: "OFFLINE",
          evaluador: this.state.evaluador
        }
      )
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col>
            <Item style={{marginVertical: 10}}>
              <Input
                placeholder='Carpeta juidicial / investigación'
                defaultValue={this.state.carpetaJudicial}
                placeholderTextColor='#2C4743'
                autoCapitalize='characters' autoCorrect={false}
                style={{color:'#2C4743', fontSize: 17}}
                onChangeText={(carpetaJudicial) => this.setState({carpetaJudicial}) }/>
            </Item>

            <Button full light style={{marginVertical: 10, borderRadius:20}} 
              disabled={this.state.carpetaJudicial == null}
              onPress={this.buscarCarpetasEnSQLite}>
              <Text>Buscar por Carpeta</Text>
            </Button>

            <Text>Imputados:</Text>
            <Picker
              enabled={this.state.numImputados > 0}             
              iosHeader="Seleccionar un imputado"
              placeholder="Seleccionar un imputado"
              itemTextStyle={{ fontSize: 17}}
              supportedOrientations={['portrait','landscape']}
              selectedValue={this.state.selectedImputado}
              onValueChange={this.onSelectImputado.bind(this)}
              mode="dropdown">
              <Item label="Seleccionar un imputado" value={null} />
              {
                this.state.imputados.map((imputado) => {
                  return (
                    <Item
                      value={imputado} key={imputado.id}
                      label={( (imputado.idEstatus == ESTATUS_SOLICITUD.ASIGNADO) ? "✔️ (A) - " : "🚫 (C) - ") + 
                            imputado.nombre + " " + imputado.primerApellido + " " + imputado.segundoApellido +
                            ((imputado.evaluacionMensual) ? " 📅" : "")}/>
                  );
                })
              }
            </Picker>

            <Text>{this.state.numImputados} - {JSON.stringify(this.state.selectedImputado)}</Text>

            <Button full danger
              style={{marginVertical: 10, borderRadius:20}}
              disabled={this.state.selectedImputado == null}
              onPress={this.aplicarEntrevistaImputadoTemporal}>
                <Text>Aplicar entrevista temporal</Text>
            </Button>

            <Text style={{marginVertical:10, textAlign:'center', color:'#c93242', fontWeight:'bold'}}>
              Sin conexión!
            </Text>

          </Col>
        </Row>
      </Grid>
    );
  }
}
