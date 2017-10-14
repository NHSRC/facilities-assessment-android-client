import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import {Container, Content, Title, Button, Header, Icon} from 'native-base';
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from '../themes/flatUI';
import TypedTransition from "../../framework/routing/TypedTransition";
import Path from "../../framework/routing/Path";
import Listing from '../common/Listing';
import Actions from '../../action';
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";
import Assessment from '../assessment/Assessment';
import Dashboard from '../dashboard/Dashboard';
import SearchPage from "../search/SearchPage";
import _ from 'lodash';
import Standard from "../../models/Standard";
import Logger from "../../framework/Logger";

const deviceWidth = Dimensions.get('window').width;

@Path("/standards")
class Standards extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().standards;
        this.unsubscribe = store.subscribeTo('standards', this.handleChange.bind(this));
    }

    static styles = StyleSheet.create({});

    handleChange() {
        const newState = this.context.getStore().getState().standards;
        this.setState(newState);
    }

    componentWillMount() {
        this.dispatchAction(Actions.ALL_STANDARDS, {
            checklist: this.props.params.checklist,
            areaOfConcern: this.props.params.areaOfConcern,
            facilityAssessment: this.props.params.facilityAssessment
        })
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleOnPress(standard) {
        return () => TypedTransition.from(this).with({
            standard: standard,
            ...this.props.params
        }).to(Assessment);
    }

    render() {
        Logger.logDebug('Standards', 'render');
        const standards = this.state.standards.map((standard) =>
            Object.assign(standard,
                {name: Standard.getDisplayName(standard)}));
        return (
            <Container theme={FlatUITheme}>
                <Header style={Dashboard.styles.header}>
                    <Button transparent onPress={() => TypedTransition.from(this).goBack()}>
                        <Icon style={{marginTop: 10, color: "white"}} name='arrow-back'/>
                    </Button>
                    <Title style={[Typography.paperFontHeadline,
                        {fontWeight: 'bold', color: "white"}]}>
                        {this.props.params.areaOfConcern.name}
                    </Title>
                    <Button transparent
                            onPress={() => TypedTransition.from(this).with({...this.props.params}).to(SearchPage)}>
                        <Icon style={{paddingTop: 10, color: "white"}} name='search'/>
                    </Button>
                </Header>
                <Content>
                    <View style={{margin: deviceWidth * 0.04,}}>
                        <Listing
                            labelColor={PrimaryColors.yellow}
                            onPress={this.handleOnPress.bind(this)}
                            items={standards}/>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default Standards;