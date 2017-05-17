import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from '../themes/flatUI';
import {Container, Header, Title, Content, Icon, Button} from 'native-base';
import Path from "../../framework/routing/Path";
import Typography from '../styles/Typography';
import PrimaryColors from '../styles/PrimaryColors';
import TypedTransition from "../../framework/routing/TypedTransition";
import Actions from '../../action';
import TabBar from "./TabBar";


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class ScoreTabs extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }


    static styles = StyleSheet.create({
        container: {},
        scorePercentage: {
            color: "#ffa000"
        },
        scoreText: {
            color: "#ffa000"
        }
    });

    render() {
        return (
            <View style={ScoreTabs.styles.container}>
                <TabBar tabs={this.props.data.tabs} selectedTab={this.props.data.selectedTab}/>
            </View>
        );
    }
}

export default ScoreTabs;