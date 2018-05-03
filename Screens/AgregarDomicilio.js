import React from 'react';
import { Font } from 'expo';
import { View, ActivityIndicator, NetInfo, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Button, Text, Item, Input, Label, H3 } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import axios from 'axios';
import GLOBALS from '../Utils/Globals';

export default class AgregarDomicilio extends React.Component { 

  constructor(props){
    super(props)
    this.state = {
    };
  }

  render() {
    return (
    <KeyboardAvoidingView behavior="padding">
    <ScrollView keyboardShouldPersistTaps="always" style={{backgroundColor:'white', paddingBottom:20}}>
    <Grid style={{backgroundColor:'white'}} style={{paddingHorizontal:10}}>
       <Row>
          <Col style={{ paddingHorizontal:15 }}>
            <Text style={{marginVertical:10, textAlign:'center', color: GLOBALS.COLORS.BACKGROUND_PRIMARY, fontWeight:'bold'}}>
              AGREGAR DOMICILIO
            </Text>
          </Col>
        </Row>

       <Row style={{backgroundColor:'white'}}>
           <Col>
           <Item stackedLabel>
                <Label>CP:</Label>
                <Input style={{fontSize: 16}} keyboardType='numeric' maxLength={5}/>
			</Item>

		    <Item stackedLabel>
				<Label>Calle:</Label>
				<Input style={{fontSize: 16}}/>
			</Item>

            <Item stackedLabel>
				<Label>Número:</Label>
				<Input style={{fontSize: 16}}/>
			</Item>

			<Item stackedLabel>
				<Label>Colonia:</Label>
				<Input style={{fontSize: 16}}/>
			</Item>    

            <Item stackedLabel>
				<Label>Cómo llegar:</Label>
				<Input style={{fontSize: 16}}/>
			</Item>      

            <Item stackedLabel>
				<Label>Teimpo de vivir en el domicilio:</Label>
				<Input style={{fontSize: 16}}/>
			</Item> 

            <Text style={{marginVertical:15, textAlign:'center'}}>(Más campos ... )</Text>     
           </Col>
				
		</Row>
    </Grid>
    </ScrollView>
    </KeyboardAvoidingView>
    );
  }
}
