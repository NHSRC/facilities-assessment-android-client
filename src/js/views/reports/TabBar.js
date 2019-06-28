import React from "react";
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import Typography from "../styles/Typography";
import PrimaryColors from "../styles/PrimaryColors";
import Actions from "../../action";


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

    render() {
        const Tabs = this.props.tabs.map((tab, idx) => (
            <View key={idx} style={tab.isSelected ? TabBar.styles.selectedTab : TabBar.styles.tab}>
                <TouchableOpacity
                    onPress={() => this.dispatchAction(Actions.SELECT_TAB, {selectedTab: tab.title})}>
                    <View>
                        <Text
                            style={[Typography.paperFontBody2,
                                tab.isSelected ? TabBar.styles.selectedTabText : TabBar.styles.tabText]}>
                            {tab.title}
                        </Text>
                    </View>
                </TouchableOpacity>
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