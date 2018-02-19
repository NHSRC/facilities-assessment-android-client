import {StyleSheet, Text, View} from 'react-native';
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
        formBodyText: {
            fontSize: 16,
            fontStyle: 'normal',
            color: '#000000'
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
                <TextInput style={[{flex: 1, marginVertical: 0, paddingVertical: 5}, NumericIndicator.styles.formBodyText]}
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