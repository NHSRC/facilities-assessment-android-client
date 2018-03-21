import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React, {Component} from 'react';
import AbstractComponent from '../common/AbstractComponent';
import Path, {PathRoot} from "../../framework/routing/Path";
import {Button, CheckBox, Col, Container, Content, Grid, Header, Icon, Input, InputGroup, List, ListItem, Radio, Row, Title} from "native-base";
import FlatUITheme from "../themes/flatUI";
import Typography from "../styles/Typography";
import TypedTransition from "../../framework/routing/TypedTransition";
import Actions from "../../action";
import Dashboard from "../dashboard/Dashboard";
import AssessmentTitle from "../assessment/AssessmentTitle";
import Indicators from "../assessment/Indicators";
import SubmitButton from "../common/SubmitButton";
import Logger from "../../framework/Logger";
import UUID from "../../utility/UUID";
import ValidationErrorMessage from "./ValidationErrorMessage";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path('/assessmentIndicators')
class AssessmentIndicators extends AbstractComponent {
    //assessmentTool, facility, assessmentType, facilityAssessment, state
    static propTypes = {
        params: React.PropTypes.object.isRequired
    };

    setDefaultPropValues() {
        // this.props = {
        //     params: {
        //         assessmentTool: {uuid: '10d44155-acdc-4d2f-8353-f90547c09c2c', name: 'Test-AssessmentTool'},
        //         facility: {name: 'TEST-Facility'},
        //         assessmentType: {name: 'TEST-AssessmentType'},
        //         facilityAssessment: {startDate: new Date(), uuid: UUID.generate()},
        //         state: {name: 'TEST-State'}
        //     }
        // };
    }

    static visibleScrollView;

    constructor(props, context) {
        super(props, context, 'assessmentIndicators');
    }

    componentWillMount() {
        this.setDefaultPropValues();
        this.dispatchAction(Actions.ALL_INDICATORS, {
            assessmentToolUUID: this.props.params.assessmentTool.uuid,
            assessmentUUID: this.props.params.facilityAssessment.uuid
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        AssessmentIndicators.visibleScrollView = undefined;
    }

    calculateIndicators() {
        this.dispatchAction(Actions.CALCULATE_INDICATORS, {facilityAssessment: this.props.params.facilityAssessment});
    }

    completeAssessment() {
        this.dispatchAction(Actions.COMPLETED_INDICATOR_ASSESSMENT, {facilityAssessment: this.props.params.facilityAssessment});
        this.dispatchAction(Actions.ALL_ASSESSMENTS, {mode: this.props.params.mode});
        TypedTransition.from(this).goBack();
    }

    render() {
        this.setDefaultPropValues();
        Logger.logDebug('AssessmentIndicators', 'render');
        let validationMessage = `FOLLOWING DATA ELEMENTS HAVE NOT BEEN FILLED\n`;
        validationMessage += this.state.indicatorDefinitionsInError.map(def => `${def.name}\n`);
        return (
            <Container theme={FlatUITheme}>
                <Header style={Dashboard.styles.header}>
                    <Button transparent onPress={() => TypedTransition.from(this).goBack()}>
                        <Icon style={{color: "white"}} name='arrow-back'/>
                    </Button>
                    <Title style={[Typography.paperFontHeadline,
                        {fontWeight: 'bold', color: "white"}]}>
                        Indicators
                    </Title>
                </Header>
                <Content keyboardShouldPersistTaps={'always'} ref={input => AssessmentIndicators.visibleScrollView = input}>
                    <View style={{margin: deviceWidth * 0.04, flexDirection: 'column'}}>
                        <View style={{flexDirection: 'row', marginBottom: deviceHeight * 0.02}}>
                            <AssessmentTitle facilityName={this.props.params.facility.name} assessmentStartDate={this.props.params.facilityAssessment.startDate}
                                             assessmentToolName={this.props.params.assessmentTool.name}/>
                        </View>
                        <Indicators indicatorDefinitions={this.state.indicatorDefinitions} indicators={this.state.indicators} indicatorDefinitionsInError={this.state.indicatorDefinitionsInError}/>
                        {_.isEmpty(this.state.outputIndicators) ?
                            <View>
                                {this.state.indicatorDefinitionsInError.length === 0 ? null : <ValidationErrorMessage validationResult={validationMessage}/>}
                                <SubmitButton buttonStyle={{marginTop: 30, backgroundColor: '#ffa000'}}
                                              onPress={() => this.calculateIndicators()}
                                              buttonText={"CALCULATE INDICATORS"}
                                              showButton={true}/></View> :
                            <View style={{marginTop: 40}}>
                                <Text style={[Typography.paperFontTitle, {color: 'white'}]}>INDICATORS</Text>
                                <Indicators indicatorDefinitions={this.state.outputIndicatorDefinitions} indicators={this.state.outputIndicators}/>
                                <SubmitButton buttonStyle={{marginTop: 30, backgroundColor: '#ffa000'}}
                                              onPress={() => this.completeAssessment()}
                                              buttonText={"COMPLETE ASSESSMENT"}
                                              showButton={true}
                                />
                            </View>}
                    </View>
                </Content>
            </Container>
        );
    }
}

export default AssessmentIndicators;