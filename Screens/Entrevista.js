import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, KeyboardAvoidingView, Alert, Dimensions } from 'react-native';
import { Root, Button, Text, Item, Input, H3, Separator, ListItem, Card, CardItem, Body, ActionSheet } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from "react-native-easy-grid";
import axios from 'axios';
import GLOBALS from '../Utils/Globals';
import StepIndicator from 'react-native-step-indicator';
import Carousel from 'react-native-looped-carousel';
import Modal from "react-native-modal";
import DatosGenerales from './DatosGenerales';
import Domicilios from './Domicilios';
import RedFamiliar from './RedFamiliar';
import Estudios from './Estudios';
import Ocupacion from './Ocupacion';
import Sustancias from './Sustancias';
import TestComponent from './TestComponent';

const { width, height } = Dimensions.get('window');

export default class Entrevista extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return{
      headerRight: (
        <Root>
          <Button style={{marginRight:10}} onPress={params.handleToggleModalProgress} transparent>
            <Icon active name="tasks" style={{color:'white', fontSize:22}}/>
          </Button>
        </Root>
      )
    }
  }

  constructor(props){
    super(props)
    // Props contienen los parametros de BuscarImputadoScreen e ImputadoTemporalScreen
    const { params } = this.props.navigation.state;
    this.state = {
      isConnected: null,
      isModalVisible: false,
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
    this.props.navigation.setParams({ handleToggleModalProgress: this._toggleModalProgress });
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

  _toggleModalProgress = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
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
      stepStrokeCurrentColor: GLOBALS.COLORS.BACKGROUND_PRIMARY,
      stepStrokeWidth: 2,
      stepStrokeFinishedColor: GLOBALS.COLORS.BACKGROUND_PRIMARY,
      stepStrokeUnFinishedColor: '#aaaaaa',
      separatorFinishedColor: GLOBALS.COLORS.BACKGROUND_PRIMARY,
      separatorUnFinishedColor: '#aaaaaa',
      stepIndicatorFinishedColor: GLOBALS.COLORS.BACKGROUND_PRIMARY,
      stepIndicatorUnFinishedColor: '#ffffff',
      stepIndicatorCurrentColor: '#ffffff',
      stepIndicatorLabelFontSize: 11,
      currentStepIndicatorLabelFontSize: 11,
      stepIndicatorLabelCurrentColor: GLOBALS.COLORS.BACKGROUND_PRIMARY,
      stepIndicatorLabelFinishedColor: '#ffffff',
      stepIndicatorLabelUnFinishedColor: '#aaaaaa',
      labelColor: '#999999',
      labelSize: 11,
      currentStepLabelColor: GLOBALS.COLORS.BACKGROUND_PRIMARY
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
            pageInfo={false}
            autoplay={false}
            isLooped={false}
            currentPage={this.state.currentPosition}
            onAnimateNextPage={(numberPage) => this.changeStep(numberPage)}>
            <View style={[{ borderWidth: 2, borderColor: GLOBALS.COLORS.BACKGROUND_PRIMARY, borderRadius:5, paddingHorizontal: 15},this.state.size]}>
              <DatosGenerales testProp={this.state.carpetaJudicial}/>
            </View>
            <View style={[{ borderWidth: 2, borderColor: GLOBALS.COLORS.BACKGROUND_PRIMARY, borderRadius:5, paddingHorizontal: 15},this.state.size]}><Domicilios/></View>
            <View style={[{ borderWidth: 2, borderColor: GLOBALS.COLORS.BACKGROUND_PRIMARY, borderRadius:5, paddingHorizontal: 15},this.state.size]}><RedFamiliar/></View>
            <View style={[{ borderWidth: 2, borderColor: GLOBALS.COLORS.BACKGROUND_PRIMARY, borderRadius:5, paddingHorizontal: 15},this.state.size]}><Estudios/></View>
            <View style={[{ borderWidth: 2, borderColor: GLOBALS.COLORS.BACKGROUND_PRIMARY, borderRadius:5, paddingHorizontal: 15},this.state.size]}><Ocupacion/></View>
            <View style={[{ borderWidth: 2, borderColor: GLOBALS.COLORS.BACKGROUND_PRIMARY, borderRadius:5, paddingHorizontal: 15},this.state.size]}><Sustancias/></View>
          </Carousel>
        </View>

        <Modal onSwipe={() => this.setState({ isModalVisible: false })}
          swipeDirection="right" isVisible={this.state.isModalVisible}>
          <TestComponent/>
        </Modal>

      </Grid>
      
    );
  }
}
