import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import {Radio, Right, ListItem} from 'native-base';
import AbstractComponent from '../common/AbstractComponent';
import ValidationErrorMessage from "./ValidationErrorMessage";
import FieldLabel from "../common/FieldLabel";
import Actions from "../../action";
import Typography from "../styles/Typography";
import IndicatorDefinition from "../../models/IndicatorDefinition";
import PrimaryColors from "../styles/PrimaryColors";
import FieldValue from "../common/FieldValue";

class CodedValueIndicator extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        definition: React.PropTypes.object.isRequired,
        indicator: React.PropTypes.object,
        validationError: React.PropTypes.string
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
                <FieldLabel text={this.props.definition.name}/>
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