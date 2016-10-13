import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import {Picker, Card, CardItem} from 'native-base';
import PrimaryColors from "../styles/PrimaryColors";
const Item = Picker.Item;

class PickerList extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        this.pickerValueChanged = this.pickerValueChanged.bind(this);
        this.renderPicker = this.renderPicker.bind(this);
    }

    static styles = StyleSheet.create({
        cardItemColor: {
            color: PrimaryColors.textBold
        }
    });

    pickerValueChanged(action, stateKey, message) {
        return (value)=> {
            if (value === message) return;
            var actionParams = {};
            actionParams[stateKey] = value;
            this.dispatchAction(action, actionParams);
        };
    }

    renderPicker(picker, index) {
        const pickerItems = [<Item key={-1} label={picker.message}
                                   value={picker.message}/>].concat(picker.items.map((item, idx)=>(
            <Item key={idx} label={item} value={item}/>)));
        return (
            <Card key={index}>
                <CardItem header>
                    <Text style={[PickerList.styles.cardItemColor, {fontWeight: '900'}]}>{picker.label}</Text>
                </CardItem>
                <CardItem>
                    <Picker style={PickerList.styles.cardItemColor}
                            key={index}
                            mode="dropdown"
                            selectedValue={picker.selectedValue}
                            onValueChange={this.pickerValueChanged(picker.action, picker.stateKey, picker.message)}>
                        {pickerItems}
                    </Picker>
                </CardItem>
            </Card>
        );
    }

    render() {
        const pickers = this.props.pickers.map(this.renderPicker);
        return (
            <View>
                {pickers}
            </View>
        );
    }
}

export default PickerList;