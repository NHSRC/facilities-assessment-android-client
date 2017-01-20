import React, {Component} from "react";
import {Text, StyleSheet, View, ScrollView, TouchableWithoutFeedback, Dimensions} from "react-native";
import AbstractComponent from "../common/AbstractComponent";
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";
import TypedTransition from "../../framework/routing/TypedTransition";
import Assessment from "../assessment/Assessment";

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class Checklists extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        checklistsHeader: {
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        checklistsText: {
            color: PrimaryColors.subheader_black,
        },
        checklistButton: {
            padding: deviceWidth * 0.04,
            alignSelf: 'stretch',
            elevation: 0,
            height: deviceHeight * 0.06,
            shadowOffset: {width: 0, height: 0},
            backgroundColor: PrimaryColors.blue,
        },
        checklists: {
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexWrap: 'nowrap',
            marginTop: 8
        }
    });


    render() {
        const checklists = this.props.allChecklists.map((checklist, idx) =>
            <TouchableWithoutFeedback onPress={this.props.handleOnPress(checklist)} key={idx}>
                <View style={[Checklists.styles.checklistsHeader, Checklists.styles.checklistButton]}>
                    <Text style={[Typography.paperFontSubhead, {color: "#FFF"}]}>{checklist.name}</Text>
                    <Text style={[Typography.paperFontCaption, {color: "#FFF"}]}>
                        {checklist.progress.completed}/{checklist.progress.total}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
        return (
            <View style={{marginTop: deviceHeight * 0.0167}}>
                <View style={Checklists.styles.checklistsHeader}>
                    <Text style={[Typography.paperFontSubhead, Checklists.styles.checklistsText]}>Checklists</Text>
                    <Text style={[Typography.paperFontBody1, Checklists.styles.checklistsText]}>
                        {this.props.completed}/{this.props.total}
                    </Text>
                </View>
                <View style={Checklists.styles.checklists}>
                    {checklists}
                </View>
            </View>
        );
    }
}

export default Checklists;