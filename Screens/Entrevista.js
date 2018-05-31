import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, KeyboardAvoidingView, Alert, Dimensions, StyleSheet } from 'react-native';
import { Root, Button, Text, Item, Input, H3, Separator, ListItem, Card, CardItem, Body } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from "react-native-easy-grid";
import axios from 'axios';
import GLOBALS from '../Utils/Globals';
import Storage from 'react-native-storage';
import StepIndicator from 'react-native-step-indicator';
import Carousel from 'react-native-looped-carousel';
import Modal from "react-native-modal";
import ModalProgreso from './ModalProgreso';
import DatosGenerales from './DatosGenerales';
import Domicilios from './Domicilios';
import RedFamiliar from './RedFamiliar';
import Estudios from './Estudios';
import Ocupacion from './Ocupacion';
import Sustancias from './Sustancias';


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
    }
  }

  componentDidMount(){
    this.props.navigation.setParams({ handleToggleModalProgress: this._toggleModalProgress });
    
    NetInfo.isConnected.addEventListener('connectionChange',this.verificarConexion);
    NetInfo.isConnected.fetch().done(
      (isConnected) => { this.setState({isConnected}); }
    );

    storage.save({
      key: 'jsonBaseEntrevistaStorage',
      data: jsonBaseEntrevista,
    });
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
    this.setState({currentPosition: stepNumber});
  }

  changeStepInProgress = (stepNumber) => {
    this.setState({ isModalVisible: false, currentPosition: stepNumber })
    this._carousel.animateToPage(stepNumber)
  }

  _onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout;
    this.setState({ size: { width: layout.width-12, height: layout.height } });
  }

  render() {
    return (
      <Grid>
        
        <Row style={{backgroundColor: '#607D8B', height:80}}>
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
          style={{marginTop:10}}
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
            isLooped={true}
            currentPage={0}
            onAnimateNextPage={(numberPage) => this.changeStep(numberPage)}>
            <View style={[{ borderWidth: 2, borderColor: COLORS.BACKGROUND_PRIMARY, borderRadius:5, paddingHorizontal: 15},this.state.size]}>
              <DatosGenerales/>
            </View>
            <View style={[{ borderWidth: 2, borderColor: COLORS.BACKGROUND_PRIMARY, borderRadius:5, paddingHorizontal: 15},this.state.size]}><Domicilios/></View>
            <View style={[{ borderWidth: 2, borderColor: COLORS.BACKGROUND_PRIMARY, borderRadius:5, paddingHorizontal: 15},this.state.size]}><RedFamiliar/></View>
            <View style={[{ borderWidth: 2, borderColor: COLORS.BACKGROUND_PRIMARY, borderRadius:5, paddingHorizontal: 15},this.state.size]}><Estudios/></View>
            <View style={[{ borderWidth: 2, borderColor: COLORS.BACKGROUND_PRIMARY, borderRadius:5, paddingHorizontal: 15},this.state.size]}><Ocupacion/></View>
            <View style={[{ borderWidth: 2, borderColor: COLORS.BACKGROUND_PRIMARY, borderRadius:5, paddingHorizontal: 15},this.state.size]}><Sustancias/></View>
          </Carousel>
        </View>

        <Modal onSwipe={() => this.setState({ isModalVisible: false })}
          swipeDirection="right" isVisible={this.state.isModalVisible}>
          <ModalProgreso changeStepChild={this.changeStepInProgress} imputado={this.state.imputado} carpetaJudicial={this.state.carpetaJudicial}/>
        </Modal>

      </Grid>
      
    );
  }
}
