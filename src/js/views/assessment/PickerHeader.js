import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import {Row} from 'react-native-easy-grid';
import PrimaryColors from "../styles/PrimaryColors";
import Actions from "../../action";
import PickerCard from './PickerCard';

class PickerHeader extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        assessmentContainer: {
            backgroundColor: PrimaryColors.background
        },
        textColor: {
            color: PrimaryColors.textBold
        }
    });

    render() {
        return (
            <Row>
                <PickerCard text={"Department"} selectedValue={this.props.data.selectedDepartment}
                            items={this.props.data.departments}
                            onChange={(val)=>this.dispatchAction(Actions.SELECT_DEPARTMENT, {department: val})}/>
                <PickerCard text={"Area Of Concern"} selectedValue={this.props.data.selectedAreaOfConcern}
                            items={this.props.data.areasOfConcern.map((aoc)=>aoc.name)}
                            onChange={()=>this.dispatchAction(Actions.SELECT_AREA_OF_CONCERN)}/>
                <PickerCard text={"Standard"} selectedValue={this.props.data.selectedStandard}
                            items={this.props.data.standards.map((standard)=>standard.name)}
                            onChange={()=>this.dispatchAction(Actions.SELECT_STANDARD)}/>
            </Row>
        );
    }
}

export default PickerHeader;