import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import {Card, CardItem, Picker} from 'native-base';
import MedIcon from '../styles/MedIcons';
import {Col} from 'react-native-easy-grid';
import PrimaryColors from "../styles/PrimaryColors";
import iconMapping from '../styles/departmentIconMapping.json';
import Actions from "../../action";
const PickerItem = Picker.Item;

class PickerCard extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        pickerContainer: {
            backgroundColor: PrimaryColors.background
        },
        textColor: {
            color: PrimaryColors.background
        },
        picker: {
            color: PrimaryColors.textBold
        }
    });

    render() {
        const pickerItems = this.props.items.map((item, idx)=><PickerItem key={idx}
                                                                          value={item}
                                                                          label={item}/>);
        return (
            <Col>
                <Card style={{backgroundColor: PrimaryColors.textBold}}>
                    <CardItem>
                        <Text style={PickerCard.styles.textColor}>{this.props.text}</Text>
                    </CardItem>
                    <CardItem style={PickerCard.styles.pickerContainer}>
                        <Picker style={PickerCard.styles.picker}
                                mode="dropdown"
                                selectedValue={this.props.selectedValue}
                                onValueChange={this.props.onChange}>
                            {pickerItems}
                        </Picker>
                    </CardItem>
                    <CardItem>
                        <Text style={PickerCard.styles.textColor}>{`Score: ${this.props.score || 120}`}</Text>
                    </CardItem>
                    <CardItem>
                        <Text
                            style={PickerCard.styles.textColor}>{`Total Checkpoints: ${this.props.totalCheckpoints || 30}`}</Text>
                    </CardItem>
                    <CardItem>
                        <Text
                            style={PickerCard.styles.textColor}>{`Answered Checkpoints: ${this.props.answeredCheckpoints || 3}`}</Text>
                    </CardItem>
                </Card>
            </Col>
        );
    }
}

export default PickerCard;