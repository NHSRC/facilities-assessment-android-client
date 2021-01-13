import {ActivityIndicator, Platform, StyleSheet, TextInput, View, Modal, Alert} from 'react-native';
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
import Logger from "../../../framework/Logger";

class SubmitAssessment extends AbstractComponent {
    static propTypes = {
        facilityAssessment: PropTypes.object.isRequired,
        syncing: PropTypes.bool.isRequired
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
        super(props, context, "submitAssessment");
    }

    componentWillMount() {
        this.dispatchAction(Actions.START_SUBMIT_ASSESSMENT, {facilityAssessment: this.props.facilityAssessment});
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

    handleSubmit() {
        this.dispatchAction(Actions.SYNC_ASSESSMENT, {
            cb: () => this.dispatchAction(Actions.ASSESSMENT_SYNCED),
            errorHandler: (error) => {
                Logger.logError('OpenView', error);
                this.submissionError(this.state.submittingAssessment, error);
            }
        });
    }

    submissionError(facilityAssessment, error) {
        Alert.alert(
            'Submission Error',
            `An error occurred while submitting the assessment. ${error.message}`,
            [
                {
                    text: 'OK',
                    onPress: () => this.dispatchAction(Actions.ASSESSMENT_SYNCED)
                }
            ]
        )
    }

    render() {
        let facilityAssessment = this.state.submittingAssessment ? this.state.submittingAssessment : this.props.facilityAssessment;
        return (
            <Modal transparent={true} visible={true} onRequestClose={() => {
            }}>
                <GunakContainer title="Submit Assessment" hideBack={true}>
                    <View style={SubmitAssessment.styles.container}>
                        {this.state.assessmentToolType === AssessmentTool.INDICATOR ? null : <AssessmentSeries series={facilityAssessment.seriesName}/>}
                        <View style={{margin: 10, flexDirection: 'column'}}>
                            {this.state.assessmentMetaDataList.map((x) => {
                                return <View key={x.uuid} style={{marginBottom: 20}}>
                                    <Text style={[Typography.paperFontSubhead]}>{x.name}</Text>
                                    <TextInput style={SubmitAssessment.styles.input}
                                               value={FacilityAssessment.getCustomInfoValue(x, facilityAssessment)}
                                               underlineColorAndroid={PrimaryColors["grey"]}
                                               words="words"
                                               onChangeText={(text) => this.handleCustomInfoChange(x, text)}/>
                                </View>
                            })}
                            <View style={{flexDirection: 'row', marginBottom: 10, marginTop: 30}}>
                                <Button block
                                        style={{backgroundColor: this.props.syncing ? PrimaryColors.medium_black : PrimaryColors.blue, marginHorizontal: 10, flex: 0.5}}
                                        onPress={() => this.close()}
                                        disabled={this.props.syncing}><Text>CLOSE</Text></Button>
                                <Button block style={{
                                    backgroundColor: this.props.syncing ? PrimaryColors.medium_black : this.state.submissionDetailAvailable ? PrimaryColors.blue : PrimaryColors.medium_black,
                                    marginHorizontal: 10,
                                    flex: 0.5
                                }} onPress={() => this.handleSubmit()}
                                        disabled={!this.state.submissionDetailAvailable || this.props.syncing}>
                                    {this.props.syncing ? this.renderSpinner() : <Text>SUBMIT</Text>}
                                </Button>
                            </View>
                        </View>
                    </View>
                </GunakContainer>
            </Modal>
        );
    }
}

export default SubmitAssessment;