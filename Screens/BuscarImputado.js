import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, Alert, NetInfo, Keyboard, Image, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Button, Text, Item, Input, Picker } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import Display from 'react-native-display';
import axios from 'axios';
import GLOBALS from '../Utils/Globals';
import ImputadoTemporal from './ImputadoTemporal'
export default class BuscarImputado extends React.Component {
  // Header Screen
  static navigationOptions = {
    title: 'Buscar imputado',
  }

  constructor(props){
    super(props)
    this.state = {
      isLoading: false,
      isConnected: null,
      carpetaJudicial: null,
      imputados: [],
      numImputados: 0,
      selectedImputado: null,
    };
  }

  componentDidMount(){
    NetInfo.isConnected.addEventListener('connectionChange',this._handleConnectivityChange);
    NetInfo.isConnected.fetch().done(
      (isConnected) => { this.setState({isConnected}); }
    );
  }

 componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange',this._handleConnectivityChange);
  }

  _handleConnectivityChange = (isConnected) => {
    this.setState({isConnected});
  };

  buscarImputadosByCarpeta = async () => {
    console.log("Buscando imputados con carpeta: "+this.state.carpetaJudicial);
    console.log("Online: "+this.state.isConnected);
    this.setState({isLoading: true});
    Keyboard.dismiss();
    axios.get('imputados', {
      params: {
        carpetaJudicial: this.state.carpetaJudicial
      }
    })
    .then((res) => {
      console.log("-- Status: "+res.data.status);
      if (res.data.status == "ok") {
        this.setState({
          imputados: res.data.data,
          numImputados: Object.keys(res.data.data).length,
          isLoading: false,
        })
      }
      if (res.data.status == "error") {
        Alert.alert('Error', res.data.message, [{text: 'OK'}], { cancelable: false });
        this.setState({
          imputados: [],
          numImputados: 0,
          isLoading: false,
        })
      }
    })
    .catch(async (error) => {
      console.log("CATCH ERROR: "+error);
      Alert.alert('External error', error, [{text: 'OK'}],{ cancelable: false });
      this.setState({isLoading: false});
    });
  }

  onSelectImputado(value) {
    this.setState({ selectedImputado: value })
    console.log("Imputado: " + JSON.stringify(this.state.selectedImputado));
  }

  aplicarEntrevistaImputado = () => {
      const {navigate} = this.props.navigation;
      navigate('EntrevistaScreen',
        {
          imputadoParam: this.state.selectedImputado,
          carpetaJudicialParam: this.state.carpetaJudicial,
          tipoCapturaParam: "ONLINE"
        }
      )
  }


  render() {
    const {navigate} = this.props.navigation;
    if (this.state.loading) {
      return (
        <View style={{flex: 1, alignItems:'center', justifyContent:'center'}}>
          <ActivityIndicator size="large"/>
        </View>
      );
    }

    return (
      <KeyboardAvoidingView behavior="position">
        <ScrollView keyboardDismissMode="interactive" overScrollMode="never">
          <Grid>
            <Row>
              <Col style={{ paddingHorizontal:15 }}>

                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Image source={require('../assets/img/medidasCautelares.png')} resizeMode="contain"
                  style={{width:250, marginTop:-25}}></Image>
                </View>

                <Text style={{textAlign:'center', color: '#D66F59', fontWeight:'bold', marginTop:-30}}>
                  Buscar imputados por Carpeta Judicial:
                </Text>

                <Item style={{marginVertical: 10}}>
                  <Input
                    placeholder='Carpeta juidicial'
                    placeholderTextColor='#2C4743'
                    autoCapitalize='none' autoCorrect={false}
                    style={{color:'#2C4743', fontSize: 17}}
                    onChangeText={(carpetaJudicial) => this.setState({carpetaJudicial}) }/>
                </Item>

                {/* Buscar imputados por carpeta solo cuando hay conexión a internet */}
                <Display enable={this.state.isConnected}
                  enterDuration={500}
                  enter="fadeInDown">
                  <Button full light
                    style={{marginVertical: 10, borderRadius:20}}
                    disabled={!this.state.isConnected || this.state.carpetaJudicial == null}
                    onPress={this.buscarImputadosByCarpeta}>
                     <Text>Buscar por Carpeta</Text>
                  </Button>
                </Display>

                {/* Imputado en BD cuando hay imputados en la carpeta y hay conexión a internet */}
                <Display enable={this.state.numImputados > 0 && this.state.isConnected}
                  enterDuration={500}
                  enter="fadeInDown">
                  {/* Picker: Imputados */}
                  <Text>Imputados:</Text>
                  <Picker
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
                            label={imputado.nombre + " " + imputado.apellidoP + " " + imputado.apellidoM}
                            value={imputado}  key={imputado.id}/>
                        );
                      })
                    }
                  </Picker>
                  <Button full danger
                    style={{marginVertical: 10, borderRadius:20}}
                    disabled={this.state.selectedImputado == null}
                    onPress={this.aplicarEntrevistaImputado}>
                      <Text>Aplicar entrevista</Text>
                  </Button>
                </Display>

                {/* Imputado temporal cuando no hay conexión a internet */}
                <Display enable={!this.state.isConnected}
                  enterDuration={500}
                  enter="fadeInDown">
                  <ImputadoTemporal carpetaJudicial={this.state.carpetaJudicial} nav={this.props.navigation}/>
                </Display>

              </Col>
            </Row>
          </Grid>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
