import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import {Button, Icon} from 'native-base';
import PrimaryColors from '../styles/PrimaryColors';
import Typography from '../styles/Typography';
import MedIcon from '../styles/MedIcons';
import Actions from "../../action";
import iconMapping from '../styles/departmentIconMapping.json';


class AssessmentMode extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().departmentSelection;
        this.unsubscribe = store.subscribeTo('departmentSelection', this.handleChange.bind(this));
    }

    static styles = StyleSheet.create({
        tabContainer: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        },
        buttonsContainer: {
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
        },
        deptButton: {
            borderColor: PrimaryColors.textBold,
            borderWidth: 2,
            margin: 10,
            width: 260
        },
        innerButton: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
        },
        buttonText: {
            color: PrimaryColors.textBold,
            fontWeight: "400",
            fontSize: 19
        }
    });

    handleChange() {
        const newState = this.context.getStore().getState().departmentSelection;
        this.setState(newState);
    }

    componentDidMount() {
        this.dispatchAction(Actions.ALL_DEPARTMENTS, {facilityName: this.props.facilityName});
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const allDepts = this.state.allDepartments.map((department, idx)=>
            (<Button key={idx} style={AssessmentMode.styles.deptButton} bordered large info>
                <View style={AssessmentMode.styles.innerButton}>
                    <Text style={AssessmentMode.styles.buttonText}>
                        {department}
                    </Text>
                    <MedIcon style={AssessmentMode.styles.buttonText}
                             size={25} name={iconMapping[department]}/>
                </View>
            </Button>)
        );
        return (
            <View style={AssessmentMode.styles.tabContainer}>
                <Text style={[AssessmentMode.styles.buttonText, Typography.paperFontDisplay1]}>
                    Select a Department
                </Text>
                <View style={AssessmentMode.styles.buttonsContainer}>
                    {allDepts}
                </View>
            </View>
        );
    }
}

export default AssessmentMode;