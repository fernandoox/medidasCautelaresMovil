import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, KeyboardAvoidingView, Alert, Dimensions } from 'react-native';
import { Button, Text, Item, Input, H3, Separator, ListItem, Card, CardItem, Body } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import axios from 'axios';
import GLOBALS from '../Utils/Globals';
import MultiStep from 'react-native-multistep-wizard'
import StepIndicator from 'react-native-step-indicator';
import CarouselPager from 'react-native-carousel-pager';
import Carousel from 'react-native-looped-carousel';
import DatosGenerales from './DatosGenerales';
import Domicilios from './Domicilios';
import RedFamiliar from './RedFamiliar';
import Estudios from './Estudios';
import Ocupacion from './Ocupacion';
import Sustancias from './Sustancias';

const { width, height } = Dimensions.get('window');
export default class Entrevista extends React.Component {

  constructor(props){
    super(props)
    // Props contienen los parametros de BuscarImputadoScreen e ImputadoTemporalScreen
    const { params } = this.props.navigation.state;
    this.state = {
      isConnected: null,
      imputado: params.imputadoParam,
      carpetaJudicial: params.carpetaJudicialParam,
      tipoCaptura: params.tipoCapturaParam,
      currentPosition: 0,
      size: { width, height },
    };
    jsonBaseEntrevista = {
      "imputado": params.imputadoParam,
      "carpetaJudicial": params.carpetaJudicialParam,
      "tipoCaptura": params.tipoCapturaParam,
      "respuestas": [],
    }
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

  terminarEntrevista = (wizardState) => {
    jsonBaseEntrevista.respuestas = wizardState;
    console.log(JSON.stringify(jsonBaseEntrevista));
    Alert.alert('FINAL DE ENTREVISTA', "Puede aplicar la entrevista a otro imputado", [{text: 'OK'}], { cancelable: false });
    const {navigate} = this.props.navigation;
    navigate('BuscarImputadoScreen');
  }

  changeStep = (stepNumber) => {
    console.log("Step: "+stepNumber);
    this.setState({currentPosition:stepNumber});
  }

  _onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout;
    this.setState({ size: { width: layout.width-12, height: layout.height } });
  }

  render() {

    const labelsSteps = ["Generales","Domicilios","Familia","Estudios","Ocupación", "Sustancias"];

    const customStylesSteps = {
      stepIndicatorSize: 25,
      currentStepIndicatorSize:28,
      separatorStrokeWidth: 1,
      currentStepStrokeWidth: 2,
      stepStrokeCurrentColor: '#fe7013',
      stepStrokeWidth: 2,
      stepStrokeFinishedColor: '#fe7013',
      stepStrokeUnFinishedColor: '#aaaaaa',
      separatorFinishedColor: '#fe7013',
      separatorUnFinishedColor: '#aaaaaa',
      stepIndicatorFinishedColor: '#fe7013',
      stepIndicatorUnFinishedColor: '#ffffff',
      stepIndicatorCurrentColor: '#ffffff',
      stepIndicatorLabelFontSize: 11,
      currentStepIndicatorLabelFontSize: 11,
      stepIndicatorLabelCurrentColor: '#fe7013',
      stepIndicatorLabelFinishedColor: '#ffffff',
      stepIndicatorLabelUnFinishedColor: '#aaaaaa',
      labelColor: '#999999',
      labelSize: 11,
      currentStepLabelColor: '#fe7013'
    }

    return (
      <Grid>
        
        <Row style={{backgroundColor: '#607D8B', height:70}}>
          <Col>
            <Card>
              <CardItem>
                <Body>
                  <Text style={{ fontSize:14, fontWeight:'bold' }}>
                    CARPETA JUDICIAL: {this.state.carpetaJudicial}
                  </Text>
                </Body>
              </CardItem>
              <CardItem style={{ marginTop:-10, marginBottom:0, paddingTop:-20, paddingBottom:-10 }}>
                <Body>
                  <Text style={{ fontSize:14, fontWeight:'bold' }}>
                    IMPUTADO: {this.state.imputado.nombre + " " + this.state.imputado.primerApellido + " " + this.state.imputado.segundoApellido}
                  </Text>
                </Body>
              </CardItem>
            </Card>
          </Col>
        </Row>

        <StepIndicator
          stepCount={6}
          customStyles={customStylesSteps}
          labels={labelsSteps}
          currentPosition={this.state.currentPosition}
          onPress={(numberStep) => { this.changeStep(numberStep); this._carousel.animateToPage(numberStep)}}
        />

        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} onLayout={this._onLayoutDidChange}>
          <Carousel
            ref={ref => this._carousel = ref}
            delay={100}
            style={this.state.size}
            pageInfo
            autoplay={false}
            isLooped = {true}
            currentPage={this.state.currentPosition}
            onAnimateNextPage={(numberPage) => this.changeStep(numberPage)}
          >
            <View style={[{ borderWidth: 2, borderColor: '#fe7013', borderRadius:5, paddingHorizontal: 15},this.state.size]}>
              <DatosGenerales testProp={this.state.carpetaJudicial}/>
            </View>
            <View style={[{ borderWidth: 2, borderColor: '#fe7013', borderRadius:5, paddingHorizontal: 15},this.state.size]}><Domicilios/></View>
            <View style={[{ borderWidth: 2, borderColor: '#fe7013', borderRadius:5, paddingHorizontal: 15},this.state.size]}><RedFamiliar/></View>
            <View style={[{ borderWidth: 2, borderColor: '#fe7013', borderRadius:5, paddingHorizontal: 15},this.state.size]}><Estudios/></View>
            <View style={[{ borderWidth: 2, borderColor: '#fe7013', borderRadius:5, paddingHorizontal: 15},this.state.size]}><Ocupacion/></View>
            <View style={[{ borderWidth: 2, borderColor: '#fe7013', borderRadius:5, paddingHorizontal: 15},this.state.size]}><Sustancias/></View>
            <View style={[{ borderWidth: 2, borderColor: 'pink', borderRadius:5, paddingHorizontal: 15},this.state.size]}><Text>Dashboard cuadricula</Text></View>
          </Carousel>
        </View>

      </Grid>

    );
  }
}
