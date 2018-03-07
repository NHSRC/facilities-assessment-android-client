import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import {Radio, Right, ListItem} from 'native-base';
import AbstractComponent from '../common/AbstractComponent';
import ValidationErrorMessage from "./ValidationErrorMessage";
import FieldLabel from "../common/FieldLabel";
import Actions from "../../action";
import Typography from "../styles/Typography";

class BoolIndicator extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        definition: React.PropTypes.object.isRequired,
        indicator: React.PropTypes.object
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

    toggle(assumedValue) {
        this.dispatchAction(Actions.BOOL_INDICATOR_TOGGLED, {indicatorDefinitionUUID: this.props.definition.uuid, assumedValue: assumedValue});
    }

    render() {
        let value = _.isNil(this.props.indicator) ? null : this.props.indicator.boolValue;
        return (
            <View style={{flexDirection: 'column'}}>
                <FieldLabel text={this.props.definition.name}/>
                <View style={{backgroundColor: '#ffffff'}}>
                    <ValidationErrorMessage validationResult={this.props.validationResult}/>
                </View>
                <View>
                    <TouchableOpacity style={BoolIndicator.styles.listItem} onPress={() => this.toggle(true)}>
                        <Radio selected={_.isNil(value) ? false : value} onPress={() => this.toggle(true)}/>
                        <Text style={[BoolIndicator.styles.radioText, Typography.paperFontCode1]}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={BoolIndicator.styles.listItem} onPress={() => this.toggle(false)}>
                        <Radio selected={_.isNil(value) ? false : !value} onPress={() => this.toggle(false)}/>
                        <Text style={[BoolIndicator.styles.radioText, Typography.paperFontCode1]}>No</Text>
                    </TouchableOpacity>
                </View>
            </View>);
    }
}

export default BoolIndicator;