import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class PageMarker extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        container: {
            paddingLeft: deviceWidth * .02667,
            paddingRight: deviceWidth * .02667,
            paddingTop: deviceHeight * .008,
            paddingBottom: deviceHeight * .008,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: PrimaryColors.light_black,
        }
    });

    render() {
        const status = ['current', 'saved', 'normal'].find((item) => this.props[item] || item === 'normal');
        const style = {
            current: {
                container: {backgroundColor: PrimaryColors.blue},
                text: {color: 'white'}
            },
            saved: {
                container: {backgroundColor: PrimaryColors.complete},
                text: {color: 'white'}
            },
            normal: {
                container: {backgroundColor: 'white'},
                text: {color: PrimaryColors.subheader_black}
            }
        }[status];
        return (
            <TouchableWithoutFeedback onPress={this.props.handleOnPress}>
                <View style={[PageMarker.styles.container, style.container]}>
                    <Text style={[Typography.paperFontBody1, style.text]}>
                        {this.props.checkpoint.checkpoint.reference}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default PageMarker;