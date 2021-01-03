import {ActivityIndicator, Platform, StyleSheet, TextInput, View} from 'react-native';
import React from 'react';
import AbstractComponent from '../../common/AbstractComponent';
import {Button, Text} from "native-base";
import Typography from "../../styles/Typography";
import PrimaryColors from "../../styles/PrimaryColors";
import AssessmentSeries from "../start/AssessmentSeries";
import Actions from "../../../action";
import AssessmentTool from "../../../models/AssessmentTool";
import PropTypes from 'prop-types';
import GunakContainer from "../../common/GunakContainer";
import FacilityAssessment from '../../../models/FacilityAssessment';

class SubmitAssessment extends AbstractComponent {
    static propTypes = {
        facilityAssessment: PropTypes.object,
        onSubmit: PropTypes.func.isRequired,
        submissionDetailAvailable: PropTypes.bool,
        assessmentToolType: PropTypes.string,
        syncing: PropTypes.bool,
        assessmentMetaDataList: PropTypes.array
    };

    static styles = StyleSheet.create({
        container: {
            backgroundColor: 'white',
            alignSelf: 'stretch',
            marginHorizontal: 10,
            flexDirection: 'column'
        },
        input: {
            fontSize: 16,
            height: 40,
            paddingLeft: 8,
            borderColor: 'grey',
            borderWidth: Platform.OS === 'ios' ? 0.5 : 0
        }
    });

    constructor(props, context) {
        super(props, context);
    }

    handleCustomInfoChange(assessmentMetaData, text) {
        this.dispatchAction(Actions.ENTER_CUSTOM_INFO, {assessmentMetaData: assessmentMetaData, valueString: text});
    }

    close() {
        this.dispatchAction(Actions.SUBMISSION_CANCELLED);
    }

    renderSpinner() {
        return (<ActivityIndicator animating={true} size={"large"} color="white" style={{height: 80}}/>);
    }

    render() {
        console.log("Syncing: ", this.props.syncing);
        return (
            <GunakContainer title="Submit Assessment" hideBack={true}>
                <View style={SubmitAssessment.styles.container}>
                    {this.props.assessmentToolType === AssessmentTool.INDICATOR ? null : <AssessmentSeries series={this.props.facilityAssessment.seriesName}/>}
                    <View style={{margin: 10, flexDirection: 'column'}}>
                        {this.props.assessmentMetaDataList.map((x) => {
                            return <>
                                <Text style={[Typography.paperFontSubhead]}>{x.name}</Text>
                                <TextInput style={SubmitAssessment.styles.input}
                                           value={FacilityAssessment.getCustomInfoValue(x, this.props.facilityAssessment)}
                                           underlineColorAndroid={PrimaryColors["grey"]}
                                           words="words"
                                           onChangeText={(text) => this.handleCustomInfoChange(x, text)}/>
                            </>
                        })}
                        <View style={{flexDirection: 'row', marginBottom: 10, marginTop: 10}}>
                            <Button block style={{backgroundColor: this.props.syncing ? PrimaryColors.medium_black : PrimaryColors.blue, marginHorizontal: 10, flex: 0.5}}
                                    onPress={() => this.close()}
                                    disabled={this.props.syncing}><Text>CLOSE</Text></Button>
                            <Button block style={{
                                backgroundColor: this.props.syncing ? PrimaryColors.medium_black : this.props.submissionDetailAvailable ? PrimaryColors.blue : PrimaryColors.medium_black,
                                marginHorizontal: 10,
                                flex: 0.5
                            }} onPress={this.props.onSubmit}
                                    disabled={!this.props.submissionDetailAvailable || this.props.syncing}>
                                {this.props.syncing ? this.renderSpinner() : <Text>SUBMIT</Text>}
                            </Button>
                        </View>
                    </View>
                </View>
            </GunakContainer>
        );
    }
}

export default SubmitAssessment;