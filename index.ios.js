import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    StatusBar
} from 'react-native';
import App from './src/js/App';

export default class FacilitiesAssessment extends Component {
    render() {
        return (
            <View style={FacilitiesAssessment.styles.container}>
                <StatusBar
                    backgroundColor={"#212121"}
                    barStyle="light-content"
                />
                <App />
            </View>
        );
    }

    static styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'stretch',
            backgroundColor: '#303030'
        }
    });
}
console.disableYellowBox = true;
AppRegistry.registerComponent('FacilitiesAssessment', () => FacilitiesAssessment);