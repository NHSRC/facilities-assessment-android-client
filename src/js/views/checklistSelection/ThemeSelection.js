import React from 'react';
import AbstractComponent from '../../views/common/AbstractComponent';
import PropTypes from 'prop-types';
import PrimaryColors from "../styles/PrimaryColors";
import {Button, Icon, Text} from 'native-base';
import Actions from "../../action";
import {Dimensions, StyleSheet, View} from 'react-native';
import _ from 'lodash';
import Typography from "../styles/Typography";

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class ThemeSelection extends AbstractComponent {
    static propTypes = {
        allThemes: PropTypes.array.isRequired,
        selectedThemes: PropTypes.array.isRequired
    };

    static styles = StyleSheet.create({
        subheader: {
            color: "white",
        },
        inactiveButton: {
            width: deviceWidth * 0.44,
            marginTop: deviceHeight * 0.02667,
            flexDirection: "row",
            justifyContent: 'flex-start',
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            elevation: 0,
            shadowOffset: {width: 0, height: 0},
        },
        activeButton: {
            width: deviceWidth * 0.42,
            marginTop: deviceHeight * 0.02667,
            backgroundColor: PrimaryColors.blue,
            flexDirection: "row",
            justifyContent: 'flex-start',
            elevation: 0,
            shadowOffset: {width: 0, height: 0},
        },
        buttonsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between'
        }
    });

    constructor(props, context) {
        super(props, context);
    }

    themeToggled(theme) {
        this.props.dispatch(Actions["THEME_TOGGLED"], {theme: theme});
    }

    isThemeSelected(theme) {
        return _.some(this.props.selectedThemes, (x) => x.uuid === theme.uuid);
    }

    render() {
        const {allThemes} = this.props;
        console.log("ThemeSelection", this.props.selectedThemes);

        return <View style={{flex: 1, marginBottom: 30, marginTop: 20}}>
            <Text
                style={[Typography.paperFontSubhead, ThemeSelection.styles.subheader]}>Select themes for assessment</Text>
            <View style={ThemeSelection.styles.buttonsContainer}>
                {allThemes.map((x, idx) => {
                    const selected = this.isThemeSelected(x);
                    return <Button
                        light={!selected}
                        dark={selected}
                        key={idx}
                        style={selected ? ThemeSelection.styles.activeButton : ThemeSelection.styles.inactiveButton}
                        iconLeft={true}
                        primary
                        onPress={() => this.themeToggled(x)}>
                        <Icon style={{color: selected ? "white" : PrimaryColors.subheader_black}}
                              name='list-box'/>
                        <Text>{x.name}</Text>
                    </Button>
                })}
            </View>
        </View>;
    }
}

export default ThemeSelection;
