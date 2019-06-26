import {StyleSheet, Text, View, Platform, TextInput} from 'react-native';
import React from 'react';
import AbstractComponent from '../../common/AbstractComponent';
import {Container, Header, Title, Button} from "native-base";
import Typography from "../../styles/Typography";
import FlatUITheme from "../../themes/flatUI";
import PrimaryColors from "../../styles/PrimaryColors";
import AssessmentSeries from "../start/AssessmentSeries";
import Actions from "../../../action";
import AssessmentTool from "../../../models/AssessmentTool";
import PropTypes from 'prop-types';

class SubmitAssessment extends AbstractComponent {
    static propTypes = {
        facilityAssessment: PropTypes.object,
        onSubmit: PropTypes.func.isRequired,
        submissionDetailAvailable: PropTypes.bool,
        assessmentToolType: PropTypes.string
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

    handleAssessorNameChange(text) {
        this.dispatchAction(Actions.ENTER_ASSESSOR_NAME, {assessorName: text});
    }

    close() {
        this.dispatchAction(Actions.SUBMISSION_CANCELLED);
    }

    render() {
        return (
            <Container theme={FlatUITheme}>
                <Header style={FlatUITheme.header}>
                    <Title style={[Typography.paperFontTitle, {
                        fontWeight: 'bold',
                        color: 'white'
                    }]}>Submit Assessment</Title>
                </Header>
                <View style={SubmitAssessment.styles.container}>
                    {this.props.assessmentToolType === AssessmentTool.INDICATOR ? null : <AssessmentSeries series={this.props.facilityAssessment.seriesName}/>}
                    <View style={{margin: 10, flexDirection: 'column'}}>
                        <Text style={[Typography.paperFontSubhead]}>Assessor's Name</Text>
                        <TextInput style={SubmitAssessment.styles.input}
                                   value={this.props.facilityAssessment.assessorName}
                                   underlineColorAndroid={PrimaryColors["grey"]}
                                   words="words"
                                   onChangeText={(text) => this.handleAssessorNameChange(text)}/>
                        <View style={{flexDirection: 'row', marginBottom: 10, marginTop: 10}}>
                            <Button style={{backgroundColor: PrimaryColors.blue, alignSelf: 'stretch', marginHorizontal: 10, flex: 0.5}}
                                    onPress={() => this.close()}><Text>CLOSE</Text></Button>
                            <Button style={{
                                backgroundColor: this.props.submissionDetailAvailable ? PrimaryColors.blue : PrimaryColors.medium_black,
                                alignSelf: 'stretch',
                                marginHorizontal: 10,
                                flex: 0.5
                            }} onPress={this.props.onSubmit} disabled={!this.props.submissionDetailAvailable}><Text>SUBMIT</Text></Button>
                        </View>
                    </View>
                </View>
            </Container>
        );
    }
}

export default SubmitAssessment;