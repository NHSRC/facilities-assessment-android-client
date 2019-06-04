'use strict';

import React from "react";
import NativeBaseComponent from "native-base/dist/Components/Base/NativeBaseComponent";
import {Text} from "native-base";

import {Animated, Dimensions, TouchableHighlight, View} from "react-native";
import Fonts from "../styles/Fonts";
import bugsnag from "../../utility/Bugsnag";

const deviceWidth = Dimensions.get('window').width;

export default class CustomTabBar extends NativeBaseComponent {
    getInitialStyle() {
        return {
            tab: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: this.getTheme().tabBgColor
            },
            tabs: {
                height: 45,
                flexDirection: 'row',
                justifyContent: 'space-around',
            }
        }
    }

    static propTypes = {
        goToPage: React.PropTypes.func,
        activeTab: React.PropTypes.number,
        tabs: React.PropTypes.array
    };

    renderTabOption(name, page) {
        let isTabActive = this.props.activeTab === page;

        return (
            <TouchableHighlight underlayColor={this.getTheme().darkenHeader} style={[this.getInitialStyle().tab]}
                                key={name} onPress={() => this.props.goToPage(page)}>
                <View>
                    <Text style={{
                        fontFamily: Fonts.HelveticaNeueOrRobotoMedium,
                        color: isTabActive ? this.getTheme().tabTextColor : this.getTheme().tabTextColor,
                        fontSize: this.getTheme().tabFontSize
                    }}>{name}</Text>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        const numberOfTabs = this.props.tabs.length;
        const tabUnderlineStyle = {
            position: 'absolute',
            width: deviceWidth / numberOfTabs,
            height: 4,
            backgroundColor: this.getTheme().tabUnderlineColor,
            bottom: 0,
        };

        const left = this.props.scrollValue.interpolate({
            inputRange: [0, 1], outputRange: [0, deviceWidth / numberOfTabs]
        });

        bugsnag.leaveBreadcrumb(`DASHBOARD_TAB: ${this.props.activeTab}`, {type: 'navigation'});

        return (
            <View style={this.getInitialStyle().tabs}>
                {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
                <Animated.View style={[tabUnderlineStyle, {left}]}/>
            </View>
        );
    }
}
