import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import AbstractComponent from "../../common/AbstractComponent";
import {Picker} from 'native-base';
import Logger from "../../../framework/Logger";
const Item = Picker.Item;
import _ from 'lodash';
import PrimaryColors from "../../styles/PrimaryColors";

class AssessmentPicker extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        this.pickerValueChanged = this.pickerValueChanged.bind(this);
    }

    static styles = StyleSheet.create({
        pickerContainer: {
            flex: .5,
            borderBottomWidth: 1,
            borderBottomColor: PrimaryColors["dark_white"],
            borderStyle: "solid",
        },
        itemStyle: {
            color: "white"
        }
    });

    pickerValueChanged(action, stateKey, message, items) {
        return (value) => {
            if (!this.props.nullable && (value === message || value === 'key0')) return;
            let actionParams = {};
            actionParams[stateKey] = _.find(items, (item) => item.uuid === value);
            this.dispatchAction(action, actionParams);
        };
    }

    render() {
        const pickerItems = [<Item key={-1} label={this.props.message}
                                   value="key0"/>].concat(this.props.items.map((item, idx) => (
            <Item
                key={idx} label={item.name}
                value={item.uuid}/>)));

        return (
            <View style={[AssessmentPicker.styles.pickerContainer, this.props.optStyles]}>
                <Picker
                    iosHeader="Select one"
                    mode="dropdown"
                    selectedValue={this.props.selectedValue ? this.props.selectedValue.uuid : "key0"}
                    onValueChange={this.pickerValueChanged(this.props.action, this.props.stateKey, this.props.message, this.props.items)}
                    textStyle={this.props.selectedValue ? {color: 'white'} : {color: 'rgba(255, 255, 255, 0.7)'}}>
                    {pickerItems}
                </Picker>
            </View>
        );
    }
}

export default AssessmentPicker;