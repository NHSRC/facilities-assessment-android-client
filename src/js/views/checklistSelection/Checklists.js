import React from "react";
import {Dimensions, Image, StyleSheet, Text, TouchableWithoutFeedback, View} from "react-native";
import AbstractComponent from "../common/AbstractComponent";
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";
import _ from 'lodash';

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
            color: "white",
        },
        checklistButton: {
            // padding: deviceWidth * 0.04,
            alignSelf: 'stretch',
            marginTop: deviceHeight * 0.02,
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

    getProgress(checklist) {
        return `${checklist.progress.completed}/${checklist.progress.total}`;
    }

    render() {
        const checklists = this.props.allChecklists.map((checklist, idx) =>
            <TouchableWithoutFeedback onPress={() => this.props.handleOnPress(checklist)} key={idx}>
                <View style={[Checklists.styles.checklistsHeader, Checklists.styles.checklistButton]}>
                    <Image style={{height: deviceHeight * 0.06, width: deviceHeight * 0.06}} resizeMode="contain"
                           source={{uri: _.snakeCase(checklist.name.toLowerCase())}}/>
                    <Text style={[Typography.paperFontSubhead, {color: "#FFF"}]}>{checklist.name}</Text>
                    <Text style={[Typography.paperFontCaption, {color: "#FFF"}]}>
                        {_.isNumber(checklist.progress.total) ? this.getProgress(checklist) : ""}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
        return (
            <View style={{marginTop: deviceHeight * 0.0167}}>
                <View style={Checklists.styles.checklistsHeader}>
                    <Text style={[Typography.paperFontSubhead, Checklists.styles.checklistsText]}>Checklists</Text>
                    <Text style={[Typography.paperFontBody1, Checklists.styles.checklistsText]}>
                        {this.props.assessmentProgress.completed}/{this.props.assessmentProgress.total}
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