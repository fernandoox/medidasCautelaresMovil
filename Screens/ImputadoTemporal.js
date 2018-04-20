import React from 'react';
import { Font } from 'expo';
import { View, Alert } from 'react-native';
import { Button, Text, Item, Input, H3 } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import { NavigationActions } from 'react-navigation';
import axios from 'axios';
import GLOBALS from '../Utils/Globals';

export default class ImputadoTemporal extends React.Component {
  // Header Screen
  static navigationOptions = {
    title: 'Imputado temporal',
  }

  constructor(props){
    super(props)
    this.state = {
      //Variables
      //carpetaJudicialParam: this.props.carpetaJudicial,
      imputadoTmpNombre: null,
      imputadoTmpApellidoP: null,
      imputadoTmpApellidoM: null,
      imputado: {}
    };
  }

  aplicarEntrevistaImputadoTemporal = () => {
      let jsonImputadoTmp = {}
      jsonImputadoTmp.nombre = this.state.imputadoTmpNombre;
      jsonImputadoTmp.apellidoP = this.state.imputadoTmpApellidoP;
      jsonImputadoTmp.apellidoM = this.state.imputadoTmpApellidoM;
      this.setState({imputado:jsonImputadoTmp})
      Alert.alert('Nombre imputado tmp', JSON.stringify(this.state.imputado), [{text: 'OK'}], { cancelable: false });
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col>
            <Text style={{marginVertical:10, textAlign:'center', color: '#D66F59', fontWeight:'bold'}}>
              Nombre tmp child: {this.state.imputadoTmpNombre}
            </Text>

            <Item style={{marginVertical: 5}}>
              <Input
                placeholder='Nombre'
                placeholderTextColor='#2C4743'
                autoCapitalize='none' autoCorrect={false}
                style={{color:'#2C4743', fontSize: 18}}
                onChangeText={ (txtNombre) => this.setState({imputadoTmpNombre : txtNombre}) }/>
            </Item>

            <Item style={{marginVertical: 5}}>
              <Input
                placeholder='Apellido paterno'
                placeholderTextColor='#2C4743'
                autoCapitalize='none' autoCorrect={false}
                style={{color:'#2C4743', fontSize: 18}}
                onChangeText={(txtApellidoP) => this.setState({imputadoTmpApellidoP : txtApellidoP}) }/>
            </Item>

            <Item style={{marginVertical: 5}}>
              <Input
                placeholder='Apellido materno'
                placeholderTextColor='#2C4743'
                autoCapitalize='none' autoCorrect={false}
                style={{color:'#2C4743', fontSize: 18}}
                onChangeText={(txtApellidoM) => this.setState({imputadoTmpApellidoM : txtApellidoM}) }/>
            </Item>

            <Button full danger
              style={{marginVertical: 10, borderRadius:20}}
              disabled={this.state.imputadoTmpNombre == null
                || this.state.imputadoTmpApellidoP == null
                || this.state.imputadoTmpApellidoM == null}
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
