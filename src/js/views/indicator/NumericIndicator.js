import {Platform, StyleSheet, TextInput, View} from 'react-native';
import React from 'react';
import AbstractComponent from '../common/AbstractComponent';
import FieldLabel from "../common/FieldLabel";
import ValidationErrorMessage from "./ValidationErrorMessage";
import Actions from '../../action';
import _ from 'lodash';
import IndicatorDefinition from "../../models/IndicatorDefinition";
import FieldValue from "../common/FieldValue";
import Indicators from '../assessment/Indicators';
import PropTypes from 'prop-types';

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
        definition: PropTypes.object.isRequired,
        indicator: PropTypes.object,
        validationError: PropTypes.string,
        tabIndex: PropTypes.number,
        overallIndex: PropTypes.number,
        isLast: PropTypes.bool
    };

    onInputChange(text) {
        this.dispatchAction(Actions.NUMERIC_INDICATOR_CHANGED, {indicatorDefinitionUUID: this.props.definition.uuid, value: text});
    }

    render() {
        let indicatorValue = _.isNil(this.props.indicator) ? ' ' : _.toString(this.props.indicator.numericValue);
        return (
            <View>
                <FieldLabel text={this.props.definition.name} style={{color: 'white'}} isHelpText={false}/>
                <FieldLabel text={this.props.definition.description} style={{color: 'orange'}} isHelpText={true}/>
                {IndicatorDefinition.isCalculated(this.props.definition) ?
                    <View><FieldValue text={indicatorValue}/><ValidationErrorMessage validationResult={this.props.validationError}/></View> :
                    <View>
                        <TextInput style={[{flex: 1, marginVertical: 0, paddingVertical: 5}, NumericIndicator.styles.input]}
                                   blurOnSubmit={false}
                                   returnKeyType={this.props.isLast ? "done" : "next"}
                                   underlineColorAndroid='white'
                                   keyboardType='numeric'
                                   value={indicatorValue}
                                   onChangeText={(text) => this.onInputChange(text)}
                                   ref={input => Indicators.userNumericInputs[this.props.tabIndex] = {element: input, overallIndex: this.props.overallIndex}}
                                   onSubmitEditing={() => Indicators.focusOnNextInput(this.props.tabIndex)}
                                   selectTextOnFocus={true}
                        />
                        <ValidationErrorMessage validationResult={this.props.validationError}/></View>}
            </View>
        );
    }
}

export default NumericIndicator;