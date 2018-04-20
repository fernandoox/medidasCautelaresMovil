import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Button, Text, Item, Input, H3 } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import DatePicker from 'react-native-datepicker'
import axios from 'axios';
import preguntasData from '../Utils/Preguntas.json';
import GLOBALS from '../Utils/Globals';

export default class Entrevista extends React.Component {
  // Header Screen
  static navigationOptions = {
    title: 'Entrevista',
  }

  constructor(props){
    super(props)
    // Props contienen los parametros de BuscarImputadoScreen e ImputadoTemporalScreen
    const { params } = this.props.navigation.state;

    this.state = {
      isConnected: null,
      preguntas: preguntasData,
      date:"2016-05-15",
      imputado: params.imputadoParam,
      carpetaJudicial: params.carpetaJudicialParam,
      tipoCaptura: params.tipoCapturaParam,
    };
  }

  componentDidMount(){
    this.fetchTest();
    NetInfo.isConnected.addEventListener('connectionChange',this.verificarConexion);
    NetInfo.isConnected.fetch().done(
      (isConnected) => { this.setState({isConnected}); }
    );
  }

  fetchTest = async () => {
    axios.get('respuestas')
    .then(function (response) {
      //console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      //console.log(JSON.stringify(error));
    });
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange',this.verificarConexion);
  }

  verificarConexion = (isConnected) => {
    this.setState({isConnected});
  };


  render() {
    return (
      <KeyboardAvoidingView behavior="position">
        <ScrollView keyboardDismissMode="interactive" overScrollMode="never">
          <Grid>
            <Row>
              <Col style={{ paddingHorizontal:15 }}>
                <Text style={{color: 'red'}}>ENTREVISTA TEST --
                  IMPUTADO: {JSON.stringify(this.state.imputado)} --
                  C JUDICIAL: {this.state.carpetaJudicial} --
                  TIPO CAPTURA: {this.state.tipoCaptura}
                </Text>
                {/* Iterar el JSON de Preguntas */}
                {
                  this.state.preguntas.map((preg, i) => {
                    return (
                      <Item style={{marginVertical: 10}} key={i}>
                        <Input
                          placeholder={preg.pregunta}
                          placeholderTextColor='#2C4743'
                          autoCapitalize='none' autoCorrect={false}
                          style={{color:'#2C4743', fontSize: 20}}/>
                      </Item>
                    )
                  })
                }
                <DatePicker
                  style={{width: 200}}
                  date={this.state.date}
                  mode="date"
                  placeholder="select date"
                  format="YYYY-MM-DD"
                  minDate="2016-05-01"
                  maxDate="2019-06-01"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: 36
                    }
                  }}
                  onDateChange={(date) => {this.setState({date: date})}}
                />
                <DatePicker
                  style={{width: 200}}
                  date={this.state.date}
                  mode="date"
                  placeholder="select date"
                  format="YYYY-MM-DD"
                  minDate="2016-05-01"
                  maxDate="2019-06-01"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  androidMode="spinner"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: 36
                    }
                  }}
                  onDateChange={(date) => {this.setState({date: date})}}
                />
              </Col>
            </Row>
          </Grid>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
