'use strict';

import React from 'react';
import NativeBaseComponent from 'native-base/dist/Components/Base/NativeBaseComponent';
import {Text} from 'native-base';

import {
    Dimensions,
    StyleSheet,
    TouchableHighlight,
    View,
    Animated,
} from 'react-native';

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
                borderWidth: 1,
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                borderBottomColor: '#ccc',
            }
        }
    }

    static propTypes = {
        goToPage: React.PropTypes.func,
        activeTab: React.PropTypes.number,
        tabs: React.PropTypes.array
    }

    renderTabOption(name, page) {
        var isTabActive = this.props.activeTab === page;

        return (
            <TouchableHighlight underlayColor={this.getTheme().darkenHeader} style={[this.getInitialStyle().tab]}
                                key={name} onPress={() => this.props.goToPage(page)}>
                <View>
                    <Text style={{
                        fontFamily: 'Roboto-Medium',
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
            height: 2,
            backgroundColor: this.getTheme().tabUnderlineColor,
            bottom: 0,
        };

        const left = this.props.scrollValue.interpolate({
            inputRange: [0, 1], outputRange: [0, deviceWidth / numberOfTabs]
        });

        return (
            <View style={this.getInitialStyle().tabs}>
                {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
                <Animated.View style={[tabUnderlineStyle, {left}]}/>
            </View>
        );
    }
}
