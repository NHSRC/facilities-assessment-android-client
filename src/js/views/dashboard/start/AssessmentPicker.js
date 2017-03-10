import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import AbstractComponent from "../../common/AbstractComponent";
import {Picker} from 'native-base';
import PrimaryColors from "../../styles/PrimaryColors";
const Item = Picker.Item;

class AssessmentPicker extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        this.pickerValueChanged = this.pickerValueChanged.bind(this);
    }

    static styles = StyleSheet.create({
        pickerContainer: {
            flex: .5,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(255, 255, 255, 0.12)",
            borderStyle: "solid",
        },
    });

    pickerValueChanged(action, stateKey, message, items) {
        return (value, valueIdx) => {
            if (value === message) return;
            let actionParams = {};
            actionParams[stateKey] = items[valueIdx - 1];
            this.dispatchAction(action, actionParams);
        };
    }

    render() {
        const pickerItems = [<Item key={-1} label={this.props.message}
                                   value={this.props.message}
                                   color="rgba(255, 255, 255, 0.7)"/>].concat(this.props.items.map((item, idx) => (
            <Item
                color={"white"}
                key={idx} label={item.name}
                value={item.uuid}/>)));

        return (
            <View style={[AssessmentPicker.styles.pickerContainer, this.props.optStyles]}>
                <Picker
                    mode="dropdown"
                    selectedValue={this.props.selectedValue ? this.props.selectedValue.uuid : this.props.selectedValue}
                    onValueChange={this.pickerValueChanged(this.props.action, this.props.stateKey, this.props.message, this.props.items)}>
                    {pickerItems}
                </Picker>
            </View>
        );
    }
}

export default AssessmentPicker;