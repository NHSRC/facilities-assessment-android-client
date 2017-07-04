import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions, Modal} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from '../themes/flatUI';
import Typography from '../styles/Typography';
import PrimaryColors from '../styles/PrimaryColors';
import TypedTransition from "../../framework/routing/TypedTransition";
import Actions from '../../action';
import {Button, List, ListItem} from "native-base";


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class ExportOptions extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }


    static styles = StyleSheet.create({
        container: {
            backgroundColor: 'white',
            alignSelf: 'stretch',
            justifyContent: 'center',
        },
        item: {
            color: PrimaryColors.subheader_black
        }

    });

    render() {
        const Options = this.props.options.map((opt, idx) =>
            <ListItem key={idx} onPress={opt.cb}>
                <Text style={[Typography.paperFontSubhead, ExportOptions.styles.item]}>{opt.title}</Text>
            </ListItem>);
        return (
            <View style={ExportOptions.styles.container}>
                <Text style={[Typography.paperFontHeadline, ExportOptions.styles.item, {alignSelf: 'center'}]}>
                    Export Options
                </Text>
                <List>
                    {Options}
                </List>
                <Button style={{backgroundColor: PrimaryColors.blue, alignSelf: 'stretch'}} block
                        onPress={this.props.onClose}>
                    Close
                </Button>
            </View>
        );
    }
}

export default ExportOptions;