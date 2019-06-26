import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {Radio} from 'native-base';
import AbstractComponent from '../common/AbstractComponent';
import ValidationErrorMessage from "./ValidationErrorMessage";
import FieldLabel from "../common/FieldLabel";
import Actions from "../../action";
import Typography from "../styles/Typography";
import IndicatorDefinition from "../../models/IndicatorDefinition";
import FieldValue from "../common/FieldValue";
import PropTypes from 'prop-types';
import _ from "lodash";

class CodedValueIndicator extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        definition: PropTypes.object.isRequired,
        indicator: PropTypes.object,
        validationError: PropTypes.string
    };

    static styles = StyleSheet.create({
        radioText: {
            color: 'white',
            marginLeft: 10,
            marginTop: 2
        },
        listItem: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginLeft: 15
        }
    });

    codedIndicatorUpdated(assumedValue) {
        this.dispatchAction(Actions.CODED_INDICATOR_UPDATED, {indicatorDefinitionUUID: this.props.definition.uuid, assumedValue: assumedValue});
    }

    render() {
        let indicatorValue = _.isNil(this.props.indicator) ? null : this.props.indicator.codedValue;
        return (
            <View style={{flexDirection: 'column'}}>
                <FieldLabel text={this.props.definition.name} style={{color: 'white'}}/>
                {IndicatorDefinition.isCalculated(this.props.definition) ? <FieldValue text={indicatorValue}/> :
                    <View>
                        {IndicatorDefinition.getCodedValues(this.props.definition.codedValues).map((codedValue) => {
                            return <TouchableOpacity style={CodedValueIndicator.styles.listItem} onPress={() => this.codedIndicatorUpdated(codedValue)} key={codedValue}>
                                <Radio selected={_.isNil(indicatorValue) ? false : indicatorValue === codedValue} onPress={() => this.codedIndicatorUpdated(codedValue)}/>
                                <Text style={[CodedValueIndicator.styles.radioText, Typography.paperFontCode1]}>{codedValue}</Text>
                            </TouchableOpacity>
                        })}
                    </View>}
                <ValidationErrorMessage validationResult={this.props.validationError}/>
            </View>);
    }
}

export default CodedValueIndicator;