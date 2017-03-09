import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import PrimaryColors from "../styles/PrimaryColors";
import Typography from '../styles/Typography';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class ComplianceItem extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        complianceItem: {
            flexDirection: 'row',
            flexWrap: 'nowrap',
            width: deviceWidth * .273,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: PrimaryColors.light_black,
            alignSelf: 'stretch',
            marginTop: deviceHeight * .01667,
            paddingTop: deviceHeight * .01667,
            paddingBottom: deviceHeight * .01667,
            paddingLeft: deviceWidth * .04,
            paddingRight: deviceWidth * .04,
            marginRight: 8,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.2,
            shadowRadius: 2,
            borderRadius: 2
        },
        activeComplianceItem: {
            backgroundColor: PrimaryColors.blue
        },
    });

    render() {
        const style = new Map([[true, {
            button: ComplianceItem.styles.activeComplianceItem,
            score: {color: "white"},
        }], [false, {
            button: {},
            score: {color: PrimaryColors.subheader_black},
        }]]).get(this.props.active);

        return (
            <TouchableWithoutFeedback onPress={this.props.handleOnPress}>
                <View style={[ComplianceItem.styles.complianceItem, style.button]}>
                    <Text
                        style={[Typography.paperFontDisplay1, style.score]}>
                        {this.props.score}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default ComplianceItem;