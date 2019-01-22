import React from 'react';
import { Alert, View, Keyboard, FlatList, ScrollView } from 'react-native';
import { Button, Text, Item, Picker, Input, List, ListItem, Body, Right } from 'native-base';
import Display from 'react-native-display';
import { Col, Row, Grid } from "react-native-easy-grid";
import Database from '../Utils/Database';
import faker from 'faker';
import moment from 'moment';

export default class ImputadoTemporal extends React.Component {

  constructor(props){ 
    super(props)
    const { params } = this.props.nav.state;
    this.state = {
      //Variables
      carpetaJudicial: null,
      imputados: [],
      numImputados: 0,
      selectedImputado: null,
      evaluador: (params.evaluador !=  undefined || params.evaluador !=  null) ? params.evaluador : null,
    };
    const nav = this.props.nav;
    // Para pruebas llenaba imputados con Faker
    /*arrFakeImputados = [];
    faker.locale = "es_MX";
    for (let index = 0; index < 30; index++) {
      itemFake = {
        "id": faker.random.number(),
        "nombre": faker.name.findName().toUpperCase() ,
        "primerApellido": faker.name.lastName().toUpperCase() ,
        "segundoApellido": faker.name.lastName().toUpperCase() ,
        "idEstatus": ( index%2 == 0 ) ? 4 : 7,
        "evaluacionMensual": ( index%2 == 0 ) ? false : true,
        "carpetaJudicial": ( index%2 == 0 ) ? faker.random.number() + "/" + faker.lorem.word().toUpperCase()  + "/" + faker.random.number()  : null,
        "carpetaInvestigacion":  ( index%2 == 1 ) ? faker.random.number() + "/" + faker.lorem.word().toUpperCase()  + "/" + faker.random.number()  : null,
        "fechaAsignacion": moment(faker.date.past()).format('DD-MM-YYYY')
      }
      arrFakeImputados.push(itemFake);
    }*/
  }

  buscarCarpetasEnSQLite = () => {
    Database.transaction(
      tx => {
        tx.executeSql('SELECT * FROM entrevistasOffline WHERE carpeta_investigacion LIKE ? OR carpeta_judicial LIKE ? OR nombre_imputado LIKE ? OR ap_pat_imputado LIKE ? OR ap_mat_imputado LIKE ? ORDER BY fecha_asignacion DESC', 
          ["%"+this.state.carpetaJudicial+"%", "%"+this.state.carpetaJudicial+"%", "%"+this.state.carpetaJudicial+"%", "%"+this.state.carpetaJudicial+"%", "%"+this.state.carpetaJudicial+"%"], (_, { rows: { _array }}) => {
          arrayImputados = _array.map((evaluacion) => {
            evaluacion.data = JSON.parse(evaluacion.data);
            return {
              idSQLite: evaluacion.id,
              id: evaluacion.data.imputado.id,
              nombre: evaluacion.nombre_imputado,
              primerApellido: evaluacion.ap_pat_imputado,
              segundoApellido: evaluacion.ap_mat_imputado,
              idEstatus: 4,
              evaluacionMensual: evaluacion.data.imputado.evaluacionMensual,
              carpetaJudicial: (evaluacion.carpeta_judicial != null || evaluacion.carpeta_judicial != '') ? evaluacion.carpeta_judicial : null,
              carpetaInvestigacion: (evaluacion.carpeta_investigacion != null || evaluacion.carpeta_investigacion != '') ? evaluacion.carpeta_investigacion : null,
              fechaAsignacion: evaluacion.fecha_asignacion
            };
          })
          //arrayImputados = arrayImputados.concat(arrFakeImputados);
          this.setState({imputados:arrayImputados, numImputados:arrayImputados.length});
          if (arrayImputados.length == 0) {
            Alert.alert('Sin resultados', 'No se han encontrado resultados.', [{text: 'OK'}], { cancelable: false });
          }else{
            Keyboard.dismiss();
          }
        });
      },
      (err) => { console.log("Select Failed Message", err); },
      this.update
   );
  }
  
  onSelectImputado(value) {
    this.setState({ selectedImputado: value })
  }

  aplicarEntrevistaTemporal = (imputadoSelected) => {
    this.props.nav.navigate('EntrevistaScreen',
      {
        imputadoParam: imputadoSelected,
        carpetaJudicialParam: (imputadoSelected.carpetaJudicial == null) ? imputadoSelected.carpetaInvestigacion : imputadoSelected.carpetaJudicial,
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
            <Item style={{marginVertical: 10}} regular>
              <Input
                placeholder='Buscar por carpetas'
                defaultValue={this.state.carpetaJudicial}
                placeholderTextColor='#2C4743'
                autoCapitalize='characters' autoCorrect={false}
                style={{color:'#2C4743', fontSize: 17, textAlign: 'center'}}
                onChangeText={(carpetaJudicial) => this.setState({carpetaJudicial}) }/>
            </Item>

            <Button full light style={{marginVertical: 10}} 
              disabled={this.state.carpetaJudicial == null}
              onPress={this.buscarCarpetasEnSQLite}>
              <Text>Buscar por Carpeta</Text>
            </Button>

            <Text style={{marginVertical:5, textAlign:'center', color:'#c93242', fontWeight:'bold'}}>
              ¡Sin conexión!
            </Text>
            
            <ScrollView> 
            <FlatList
              data={this.state.imputados}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) =>
              <ListItem button={true} onPress={() => this.aplicarEntrevistaTemporal(item)} style={{marginLeft: -15, paddingLeft:10, paddingBottom:10, paddingTop:10}}>
                <Body>
                  <Text style={{fontSize:15, fontWeight:'bold'}}>{item.nombre} {item.primerApellido} {item.segundoApellido}</Text>
                  <Text style={{fontSize:13}}>{(item.carpetaInvestigacion == null) ? item.carpetaJudicial : item.carpetaInvestigacion}</Text>
                </Body> 
                <Right style={{alignSelf: 'flex-start'}}>
                  <Text style={{fontSize:11}} note>{item.fechaAsignacion}</Text>
                  <Text>{(item.evaluacionMensual) ? "📅" : ""}</Text>
                  <Text>{(item.idEstatus == ESTATUS_SOLICITUD.ASIGNADO) ? "✔️" : "🚫"}</Text>
                </Right>
              </ListItem> 
              }
              keyExtractor = { (item, index) => index.toString() }
            />
            </ScrollView>

          </Col>
        </Row>
      </Grid>
    );
  }
}
