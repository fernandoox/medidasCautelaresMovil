import React from 'react';
import { Font } from 'expo';
import { StyleSheet, View, ActivityIndicator, YellowBox, Text} from 'react-native';

export default class Login extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={{color: 'blue'}}>Este el el login</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
