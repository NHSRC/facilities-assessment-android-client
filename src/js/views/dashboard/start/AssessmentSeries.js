import React from "react";
import {Platform, StyleSheet, TextInput, View} from "react-native";
import AbstractComponent from "../../common/AbstractComponent";
import Actions from "../../../action";
import PrimaryColors from "../../styles/PrimaryColors";
import {Button, Icon, Text, Radio} from "native-base";
import EnvironmentConfig from "../../common/EnvironmentConfig";
import Typography from "../../styles/Typography";
import PropTypes from 'prop-types';
import _ from "lodash";
import Logger from "../../../framework/Logger";

class AssessmentSeries extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        series: PropTypes.string,
        seriesOptions: PropTypes.array.isRequired
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

    seriesNumberChanged(series) {
        this.dispatchAction(Actions["ENTER_ASSESSMENT_SERIES"], {series: series});
    }

    generateAssessmentSeriesNumber() {
        this.dispatchAction(Actions.GENERATE_ASSESSMENT_SERIES, {});
    }

    renderAssessmentNumbers(series) {
        return this.props.seriesOptions.map((item, idx) => <View style={{marginTop: 20, flexDirection: 'row'}} key={item}>
                <Radio selected={item === series} onPress={() => this.seriesNumberChanged(item)}/>
                <Text style={{marginLeft: 10}}>{item}</Text>
            </View>);
    }

    render() {
        let hasSeriesOptions = this.props.seriesOptions.length !== 0;
        let displayGenerateButton = EnvironmentConfig.autoGenerateSeriesNumber && (_.isNil(this.props.series) || this.props.series.length === 0) && !hasSeriesOptions;
        return (
            <View style={{margin: 10, flexDirection: 'column'}}>
                <Text style={[Typography.paperFontSubhead]}>Assessment Number</Text>
                <Text style={[Typography.paperFontCaption]}>All assessments for a facility with the same number will be merged with each other
                    - creating a single assessment. This is to help perform an assessment from multiple devices. Use auto-generate button to get number or enter
                    manually.</Text>
                <View style={{flexDirection: 'row'}}>
                    {hasSeriesOptions ?
                        this.renderAssessmentNumbers(this.props.series)
                        :
                        <TextInput style={AssessmentSeries.styles.input}
                                   value={this.props.series}
                                   underlineColorAndroid={PrimaryColors["grey"]}
                                   words="words"
                                   keyboardType='numeric'
                                   onChangeText={(text) => this.seriesNumberChanged(text)}/>
                    }
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
