import {Platform, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {Component} from 'react';
import AbstractComponent from '../common/AbstractComponent';
import FieldLabel from "../common/FieldLabel";
import ValidationErrorMessage from "./ValidationErrorMessage";
import Actions from '../../action';
import _ from 'lodash';
import IndicatorDefinition from "../../models/IndicatorDefinition";
import FieldValue from "../common/FieldValue";

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
        indicator: React.PropTypes.object,
        validationError: React.PropTypes.string
    };

    onInputChange(text) {
        this.dispatchAction(Actions.NUMERIC_INDICATOR_CHANGED, {indicatorDefinitionUUID: this.props.definition.uuid, value: text});
    }

    render() {
        let indicatorValue = _.isNil(this.props.indicator) ? '' : _.toString(this.props.indicator.numericValue);
        return (
            <View>
                <FieldLabel text={this.props.definition.name}/>
                {IndicatorDefinition.isCalculated(this.props.definition) ? <FieldValue text={indicatorValue}/> :
                    <View>
                        <TextInput style={[{flex: 1, marginVertical: 0, paddingVertical: 5}, NumericIndicator.styles.input]}
                                   underlineColorAndroid='white'
                                   keyboardType='numeric'
                                   value={indicatorValue}
                                   onChangeText={(text) => this.onInputChange(text)}
                                   onEndEditing={(text) => this.onInputChange(text)}/>
                        <ValidationErrorMessage validationResult={this.props.validationError}/></View>}
            </View>
        );
    }
}

export default NumericIndicator;