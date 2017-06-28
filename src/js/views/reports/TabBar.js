import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions, TouchableWithoutFeedback} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from '../themes/flatUI';
import {Container, Header, Title, Content, Icon, Button} from 'native-base';
import Path from "../../framework/routing/Path";
import Typography from '../styles/Typography';
import PrimaryColors from '../styles/PrimaryColors';
import TypedTransition from "../../framework/routing/TypedTransition";
import Actions from '../../action';
import _ from 'lodash';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class TabBar extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }


    static styles = StyleSheet.create({
        container: {
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: PrimaryColors.medium_white,
            backgroundColor: PrimaryColors.blue,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center'
        },
        tab: {
            borderBottomWidth: 4,
            borderBottomColor: PrimaryColors.blue,
            paddingBottom: deviceHeight * .011
        },
        selectedTab: {
            borderBottomWidth: 4,
            paddingBottom: deviceHeight * .011,
            borderBottomColor: "#ffa000",
        },
        selectedTabText: {
            color: "white"
        },
        tabText: {
            color: PrimaryColors.medium_white
        },
        scoreText: {
            color: "#ffa000"
        }
    });

    isKayakalp() {
        return this.props.mode.toLowerCase() === "kayakalp";
    }

    render() {
        const tabMap = {"THEMES": "AREA OF CONCERN", "CRITERIA": "STANDARD"};
        const reverseTabMap = _.invert(tabMap);
        const tabs = this.isKayakalp() ? ["THEMES", "CRITERIA"] : this.props.tabs;
        const selectedTab = this.isKayakalp() ? reverseTabMap[this.props.selectedTab] : this.props.selectedTab;
        const Tabs = tabs.map((tab, idx) => (
            <View key={idx} style={tab === selectedTab ? TabBar.styles.selectedTab : TabBar.styles.tab}>
                <TouchableWithoutFeedback
                    onPress={() => this.dispatchAction(Actions.SELECT_TAB, {selectedTab: this.isKayakalp() ? tabMap[tab] : tab})}>
                    <View>
                        <Text
                            style={[Typography.paperFontBody2,
                                tab === selectedTab ? TabBar.styles.selectedTabText : TabBar.styles.tabText]}>
                            {tab}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        ));
        return (
            <View style={TabBar.styles.container}>
                {Tabs}
            </View>
        );
    }
}

export default TabBar;