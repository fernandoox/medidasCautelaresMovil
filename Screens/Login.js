import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Button, Text, Item, Input, H3 } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import axios from 'axios';
import GLOBALS from '../Utils/Globals';

export default class Login extends React.Component {
  // Header Screen
  static navigationOptions = {
    title: 'Login',
  }

  constructor(props){
    super(props)
    this.state = {
    };
  }



  nextPreprocess = () => {
    console.log("Siguiente login...");
    // Save step state for use in other steps of the wizard
    this.props.saveState(2,{key2:'Chingon'});
    this.props.nextFn()
  }
  
  previousPreprocess = () => {
    console.log("Anterior login...");
    // Go to previous step
    this.props.prevFn();
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding">
        <ScrollView keyboardDismissMode="interactive" overScrollMode="never">
          <Grid>
            <Row>
              <Col style={{ paddingHorizontal:15 }}>
                <Text style={{color: 'pink'}}>LOGIN</Text>

                <Button full  onPress={this.nextPreprocess}>
                  <Text>Siguiente</Text>
                </Button>

                <Button full info onPress={this.previousPreprocess}>
                  <Text>Anterior</Text>
                </Button>

              </Col>
            </Row>
          </Grid>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
