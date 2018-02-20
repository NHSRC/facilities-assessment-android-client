import {View, StyleSheet, Text} from 'react-native';
import React, {Component} from 'react';
import AbstractComponent from '../../framework/view/AbstractComponent';
import Path from "../../framework/routing/Path";
import _ from "lodash";
import ReducerKeys from "../../reducer";
import themes from "../primitives/themes";
import AppHeader from "../common/AppHeader";
import {
    Button, Content, CheckBox, Grid, Col, Row, Container, Header, Title, Icon, InputGroup,
    Input, Radio, List, ListItem
} from "native-base";
import FlatUITheme from "../themes/flatUI";
import Typography from "../styles/Typography";
import SearchPage from "../search/SearchPage";
import TypedTransition from "../../framework/routing/TypedTransition";
import Actions from "../../action";
import Dashboard from "../dashboard/Dashboard";
import AssessmentTitle from "../assessment/AssessmentTitle";
import Indicators from "../assessment/Indicators";
import SubmitButton from "../common/SubmitButton";

@Path('/assessmentIndicators')
class AssessmentIndicators extends AbstractComponent {
    static propTypes = {};

    constructor(props, context) {
        super(props, context, 'assessmentIndicators');
    }

    componentWillMount() {
        this.dispatchAction(Actions.ALL_DEFINITIONS, {...this.props.params});
    }

    render() {
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
                <Content>
                    <View style={{margin: deviceWidth * 0.04, flexDirection: 'column'}}>
                        <View style={{flexDirection: 'row'}}>
                            <AssessmentTitle facilityName={this.props.params.facility.name} assessmentStartDate={this.props.params.facilityAssessment.startDate}
                                             assessmentToolName={this.props.params.assessmentTool.name}/>
                        </View>
                        <Indicators indicatorDefinitions={}/>
                        <SubmitButton buttonStyle={{marginTop: 30, backgroundColor: '#ffa000'}}
                                      onPress={() => TypedTransition.from(this).goBack()}
                                      buttonText={"OK"}
                                      showButton={true}
                        />
                    </View>
                </Content>
            </Container>
        );
    }
}

export default AssessmentIndicators;