/* @flow */
import {AppRegistry, StyleSheet, View, StatusBar} from 'react-native';
import React, {Component} from 'react';
import App from './src/js/App';
import PrimaryColors from './src/js/views/styles/PrimaryColors';

class FacilitiesAssessment extends Component {

    static styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'stretch',
            backgroundColor: '#303030'
        }
    });

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
}
console.ignoredYellowBox = ['Warning: You are manually calling', 'Warning: setState'];
AppRegistry.registerComponent('FacilitiesAssessment', () => FacilitiesAssessment);
