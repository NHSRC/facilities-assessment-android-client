import {StyleSheet, Text, View, Platform, TextInput} from 'react-native';
import React, {Component} from 'react';
import AbstractComponent from '../../common/AbstractComponent';
import {Container, Header, Title, Button} from "native-base";
import Typography from "../../styles/Typography";
import FlatUITheme from "../../themes/flatUI";
import PrimaryColors from "../../styles/PrimaryColors";
import AssessmentSeries from "../start/AssessmentSeries";
import Actions from "../../../action";
import FacilityAssessment from "../../../models/FacilityAssessment";

class SubmitAssessment extends AbstractComponent {
    static propTypes = {
        facilityAssessment: React.PropTypes.object,
        onSubmit: React.PropTypes.func.isRequired
    };

    static styles = StyleSheet.create({
        header: {
            shadowOffset: {width: 0, height: 0},
            elevation: 0,
            backgroundColor: '#212121',
        },
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
        let submissionDetailsAvailable = FacilityAssessment.submissionDetailsAvailable(this.props.facilityAssessment);
        return (
            <Container theme={FlatUITheme}>
                <Header style={SubmitAssessment.styles.header}>
                    <Title style={[Typography.paperFontTitle, {
                        fontWeight: 'bold',
                        color: 'white'
                    }]}>Submit Assessment</Title>
                </Header>
                <View style={SubmitAssessment.styles.container}>
                    <AssessmentSeries series={this.props.facilityAssessment.seriesName}/>
                    <View style={{margin: 10, flexDirection: 'column'}}>
                        <Text style={[Typography.paperFontSubhead]}>Assessor's Name</Text>
                        <TextInput style={SubmitAssessment.styles.input}
                                   value={this.props.facilityAssessment.assessorName}
                                   underlineColorAndroid={PrimaryColors["grey"]}
                                   words="words"
                                   keyboardType='numeric'
                                   onChangeText={(text) => this.handleAssessorNameChange(text)}/>
                        <View style={{flexDirection: 'row', marginBottom: 10}}>
                            <Button style={{backgroundColor: PrimaryColors.blue, alignSelf: 'stretch', marginHorizontal: 10, flex: 0.5}}
                                    onPress={() => this.close()}>CLOSE</Button>
                            <Button style={{backgroundColor: submissionDetailsAvailable ? PrimaryColors.blue : PrimaryColors.medium_black, alignSelf: 'stretch', marginHorizontal: 10, flex: 0.5}}
                                    onPress={this.props.onSubmit} disabled={!submissionDetailsAvailable}>SUBMIT</Button>
                        </View>
                    </View>
                </View>
            </Container>
        );
    }
}

export default SubmitAssessment;