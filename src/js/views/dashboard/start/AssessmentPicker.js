import React from 'react';
import {StyleSheet, View} from 'react-native';
import AbstractComponent from "../../common/AbstractComponent";
import {Picker} from 'native-base';
import _ from 'lodash';
import PrimaryColors from "../../styles/PrimaryColors";

const Item = Picker.Item;

class AssessmentPicker extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        this.pickerValueChanged = this.pickerValueChanged.bind(this);
    }

    static styles = StyleSheet.create({
        pickerContainer: {
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
                                   value="key0" color={PrimaryColors.medium_white}/>].concat(this.props.items.map((item, idx) => (
            <Item
                key={idx} label={item.name} color={"white"}
                value={item.uuid}/>)));

        return (
            <View style={[AssessmentPicker.styles.pickerContainer, this.props.optStyles]}>
                <Picker
                    iosHeader="Select one"
                    mode="dropdown"
                    selectedValue={this.props.selectedValue ? this.props.selectedValue.uuid : "key0"}
                    onValueChange={this.pickerValueChanged(this.props.action, this.props.stateKey, this.props.message, this.props.items)}
                    textStyle={this.props.selectedValue ? {color: 'white'} : {color: PrimaryColors.medium_white}}>
                    {pickerItems}
                </Picker>
            </View>
        );
    }
}

export default AssessmentPicker;