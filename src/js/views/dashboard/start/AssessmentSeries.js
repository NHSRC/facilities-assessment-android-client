import React from "react";
import {Platform, StyleSheet, TextInput, View} from "react-native";
import AbstractComponent from "../../common/AbstractComponent";
import Actions from "../../../action";
import PrimaryColors from "../../styles/PrimaryColors";
import {Button, Icon, Text} from "native-base";
import EnvironmentConfig from "../../common/EnvironmentConfig";
import Typography from "../../styles/Typography";
import PropTypes from 'prop-types';
import _ from "lodash";

class AssessmentSeries extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        series: PropTypes.string
    };

    static styles = StyleSheet.create({
        input: {
            fontSize: 16,
            height: 40,
            paddingLeft: 8,
            borderColor: 'grey',
            borderWidth: Platform.OS === 'ios' ? 0.5 : 0,
            flex: 0.8
        }
    });

    handleTextChange(series) {
        this.dispatchAction(Actions.ENTER_ASSESSMENT_SERIES, {series: series});
    }

    generateAssessmentSeriesNumber() {
        this.dispatchAction(Actions.GENERATE_ASSESSMENT_SERIES, {});
    }

    render() {
        let displayGenerateButton = EnvironmentConfig.autoGenerateSeriesNumber && (_.isNil(this.props.series) || this.props.series.length === 0);
        return (
            <View style={{margin: 10, flexDirection: 'column'}}>
                <Text style={[Typography.paperFontSubhead]}>Assessment Number</Text>
                <View style={{flexDirection: 'row'}}>
                    <TextInput style={AssessmentSeries.styles.input}
                               value={this.props.series}
                               underlineColorAndroid={PrimaryColors["grey"]}
                               words="words"
                               keyboardType='numeric'
                               onChangeText={(text) => this.handleTextChange(text)}/>
                    {displayGenerateButton ?
                        <Button
                            style={{flex: 0.15}}
                            onPress={() => this.generateAssessmentSeriesNumber()}>
                            <Icon name="return-left"/>
                        </Button> : <View/>}
                </View>
            </View>
        );
    }
}

export default AssessmentSeries;