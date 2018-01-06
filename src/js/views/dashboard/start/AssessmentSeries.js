import React from "react";
import {Platform, StyleSheet, TextInput, View} from "react-native";
import AbstractComponent from "../../common/AbstractComponent";
import Actions from "../../../action";
import PrimaryColors from "../../styles/PrimaryColors";
import {Button, Icon} from "native-base";
import EnvironmentConfig from "../../common/EnvironmentConfig";


class AssessmentSeries extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        input: {
            fontSize: 16,
            color: 'white',
            height: 40,
            paddingLeft: 8,
            borderColor: 'grey',
            borderWidth: Platform.OS === 'ios' ? 0.5 : 0,
            flex: 0.8
        }
    });

    handleChange(series) {
        this.dispatchAction(Actions.ENTER_ASSESSMENT_SERIES, {series: series});
    }

    generateAssessmentSeriesNumber() {
        this.dispatchAction(Actions.GENERATE_ASSESSMENT_SERIES, {});
    }

    render() {
        let displayGenerateButton = EnvironmentConfig.autoGenerateSeriesNumber && (_.isNil(this.props.data.series) || this.props.data.series.length === 0);
        return (
            <View style={{flex: 1, flexDirection: 'row'}}>
                <TextInput style={AssessmentSeries.styles.input}
                           placeholder={"Assessment Number"}
                           placeholderTextColor="rgba(255, 255, 255, 0.7)"
                           value={this.props.data.series}
                           underlineColorAndroid={PrimaryColors["dark_white"]}
                           words="words"
                           keyboardType='numeric'
                           onChangeText={this.handleChange.bind(this)}/>
                {displayGenerateButton ?
                    <Button
                        style={{flex: 0.2}}
                        iconLeft={true}
                        onPress={() => this.generateAssessmentSeriesNumber()}>
                        <Icon style={{color: "white"}} name="control-point"/>
                    </Button> : <View/>}
            </View>
        );
    }
}

export default AssessmentSeries;