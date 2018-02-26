import {StyleSheet, Text, View, TextInput, Platform} from 'react-native';
import React, {Component} from 'react';
import AbstractComponent from '../common/AbstractComponent';
import FieldLabel from "../common/FieldLabel";
import ValidationErrorMessage from "./ValidationErrorMessage";
import Actions from '../../action';

class NumericIndicator extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        input: {
            fontSize: 16,
            color: 'white',
            height: 40,
            paddingLeft: 8,
            borderColor: 'grey',
            borderWidth: Platform.OS === 'ios' ? 0.5 : 0
        }
    });

    static propTypes = {
        definition: React.PropTypes.object.isRequired,
        value: React.PropTypes.string
    };

    onInputChange(text) {
        this.dispatchAction(Actions.NUMERIC_INDICATOR_CHANGED, {definition: this.props.definition, value: text});
    }

    render() {
        return (
            <View>
                <FieldLabel text={this.props.definition.name}/>
                <TextInput style={[{flex: 1, marginVertical: 0, paddingVertical: 5}, NumericIndicator.styles.input]}
                           underlineColorAndroid={this.borderColor} keyboardType='numeric'
                           value={this.props.value}
                           onChangeText={(text) => this.onInputChange(text)}
                           onEndEditing={(text) => this.onInputChange(text)}/>
                <ValidationErrorMessage validationResult={this.props.validationResult}/>
            </View>
        );
    }
}

export default NumericIndicator;