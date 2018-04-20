import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Button, Text, Item, Input, H3 } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import axios from 'axios';
import GLOBALS from '../Utils/Globals';

export default class Test extends React.Component {
  // Header Screen
  static navigationOptions = {
    title: 'Imputado temporal',
  }

  constructor(props){
    super(props)
    this.state = {
      isConnected: null,
    };
  }

  componentDidMount(){
    NetInfo.isConnected.addEventListener('connectionChange',this.verificarConexion);
    NetInfo.isConnected.fetch().done(
      (isConnected) => { this.setState({isConnected}); }
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange',this.verificarConexion);
  }

  verificarConexion = (isConnected) => {
    this.setState({isConnected});
  };


  render() {
    return (
      <KeyboardAvoidingView behavior="padding">
        <ScrollView keyboardDismissMode="interactive" overScrollMode="never">
          <Grid>
            <Row>
              <Col style={{ paddingHorizontal:15 }}>
                <Text style={{color: 'teal'}}>IMPUTADO TEMPORAL SIN CONEXIÓN</Text>

                <Item style={{marginVertical: 10}}>
                  <Input
                    placeholder='Nombre'
                    placeholderTextColor='#2C4743'
                    autoCapitalize='none' autoCorrect={false}
                    style={{color:'#2C4743', fontSize: 20}}
                    onChangeText={(imputadoTemporalNombre) => this.setState({imputadoTemporalNombre}) }/>
                </Item>
              </Col>
            </Row>
          </Grid>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
