import React from 'react';
import { Font } from 'expo';
import { View, Alert } from 'react-native';
import { Button, Text, Item, Input, H3 } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import { NavigationActions } from 'react-navigation';
import GLOBALS from '../Utils/Globals';

export default class ImputadoTemporal extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      //Variables
      imputadoTmpNombre: null,
      imputadoTmpApellidoP: null,
      imputadoTmpApellidoM: null,
      imputado: {}
    };
    const nav = this.props.nav;
  }

  aplicarEntrevistaImputadoTemporal = () => {
      let jsonImputadoTmp = {}
      jsonImputadoTmp.nombre = this.state.imputadoTmpNombre;
      jsonImputadoTmp.primerApellido = this.state.imputadoTmpApellidoP;
      jsonImputadoTmp.segundoApellido = this.state.imputadoTmpApellidoM;
      this.setState({imputado:jsonImputadoTmp})
      this.props.nav.navigate('EntrevistaScreen',
        {
          imputadoParam: jsonImputadoTmp,
          carpetaJudicialParam: this.props.carpetaJudicial,
          tipoCapturaParam: "OFFLINE"
        }
      )
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col>
            <Text style={{marginVertical:10, textAlign:'center', color: '#D66F59', fontWeight:'bold'}}>
              Registro temporal
            </Text>

            <Item style={{marginVertical: 5}}>
              <Input
                placeholder='Nombre'
                style={{fontSize: 18}}
                autoCapitalize='characters'
                onChangeText={(imputadoTmpNombre) => this.setState({imputadoTmpNombre}) }/>
            </Item>

            <Item style={{marginVertical: 5}}>
              <Input
                placeholder='Apellido paterno'
                style={{fontSize: 18}}
                autoCapitalize='characters'
                onChangeText={(imputadoTmpApellidoP) => this.setState({imputadoTmpApellidoP}) }/>
            </Item>

            <Item style={{marginVertical: 5}}>
              <Input
                placeholder='Apellido materno'
                style={{fontSize: 18}}
                autoCapitalize='characters'
                onChangeText={(imputadoTmpApellidoM) => this.setState({imputadoTmpApellidoM}) }/>
            </Item>

            <Button full danger
              style={{marginVertical: 10, borderRadius:20}}
              disabled={this.state.imputadoTmpNombre == null
                || this.state.imputadoTmpApellidoP == null
                || this.state.imputadoTmpApellidoM == null
                || this.props.carpetaJudicial == null}
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
