import {Platform, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {Component} from 'react';
import AbstractComponent from '../common/AbstractComponent';
import FieldLabel from "../common/FieldLabel";
import ValidationErrorMessage from "./ValidationErrorMessage";
import Actions from '../../action';
import _ from 'lodash';
import IndicatorDefinition from "../../models/IndicatorDefinition";

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
        indicator: React.PropTypes.object
    };

    onInputChange(text) {
        this.dispatchAction(Actions.NUMERIC_INDICATOR_CHANGED, {indicatorDefinitionUUID: this.props.definition.uuid, value: text});
    }

    render() {
        return (
            <View>
                <FieldLabel text={this.props.definition.name}/>
                {IndicatorDefinition.isCalculatedInput(this.props.definition) ? <FieldLabel text={this.props.indicator.numericValue}/> :
                    <View>
                        <TextInput style={[{flex: 1, marginVertical: 0, paddingVertical: 5}, NumericIndicator.styles.input]}
                                   underlineColorAndroid='white'
                                   keyboardType='numeric'
                                   value={_.isNil(this.props.indicator) ? '' : _.toString(this.props.indicator.numericValue)}
                                   onChangeText={(text) => this.onInputChange(text)}
                                   onEndEditing={(text) => this.onInputChange(text)}/>
                        <ValidationErrorMessage validationResult={this.props.validationResult}/></View>}
            </View>
        );
    }
}

export default NumericIndicator;