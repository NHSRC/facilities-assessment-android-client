import {View, StyleSheet, Text} from 'react-native';
import React, {Component} from 'react';
import {Radio, Right, ListItem} from 'native-base';
import AbstractComponent from '../common/AbstractComponent';
import ValidationErrorMessage from "./ValidationErrorMessage";
import FieldLabel from "../common/FieldLabel";
import Actions from "../../action";

class BoolIndicator extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        definition: React.PropTypes.object.isRequired,
        value: React.PropTypes.bool
    };

    static styles = StyleSheet.create({
        radioText: {
            color: 'white'
        }
    });

    toggle(assumedValue) {
        this.dispatchAction(Actions.BOOL_INDICATOR_TOGGLED, {indicatorDefinitionUUID: this.props.definition.uuid, assumedValue: assumedValue});
    }

    render() {
        return (
            <View style={{flexDirection: 'column'}}>
                <FieldLabel text={this.props.definition.name}/>
                <View style={{backgroundColor: '#ffffff'}}>
                    <ValidationErrorMessage validationResult={this.props.validationResult}/>
                </View>
                <View>
                    <ListItem>
                        <Text style={BoolIndicator.styles.radioText}>Yes</Text>
                        <Radio selected={_.isNil(this.props.value) ? false : this.props.value} onPress={() => this.toggle(true)}/>
                    </ListItem>
                    <ListItem>
                        <Text style={BoolIndicator.styles.radioText}>No</Text>
                        <Radio selected={_.isNil(this.props.value) ? false : !this.props.value} onPress={() => this.toggle(false)}/>
                    </ListItem>
                </View>
            </View>);
    }
}

export default BoolIndicator;