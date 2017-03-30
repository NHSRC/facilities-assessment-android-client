import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import {Container, Content, Title, Button, Header, Icon, InputGroup, Input, List, ListItem} from 'native-base';
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from '../themes/search';
import TypedTransition from "../../framework/routing/TypedTransition";
import Path from "../../framework/routing/Path";
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";
import Listing from '../common/Listing';
import Actions from '../../action';
import Standards from "../standards/Standards";
import Assessment from "../assessment/Assessment";
import Dashboard from '../dashboard/Dashboard';
import _ from 'lodash';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path("/searchPage")
class SearchPage extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().search;
        this.handleSearch = this.handleSearch.bind(this);
        this.goto = this.goto.bind(this);
        this.unsubscribe = store.subscribeTo('search', this.handleChange.bind(this));
    }

    static styles = StyleSheet.create({
        header: {
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
            alignItems: 'center',
            shadowOffset: {width: 0, height: 0},
            elevation: 0,
            backgroundColor: '#212121',
        },
        resultContainer: {
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            flexWrap: 'nowrap'
        }
    });

    handleChange() {
        const newState = this.context.getStore().getState().search;
        this.setState(newState);
    }

    componentWillMount() {

    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleSearch(searchText) {
        this.dispatchAction(Actions.SEARCH_FOR, {searchText: searchText, ...this.props.params});
    }

    gotoAreaOfConcern(aoc) {
        TypedTransition.from(this).with({...this.props.params, areaOfConcern: aoc}).to(Standards);
    }

    gotoStandard(standard) {
        TypedTransition.from(this).with({
            ...this.props.params,
            standard: standard,
            areaOfConcern: standard.areaOfConcern
        })
            .to(Assessment);
    }

    gotoMeasurableElement(me) {
    }

    goto(element) {
        return {
            "AreasOfConcern": this.gotoAreaOfConcern.bind(this),
            "Standards": this.gotoStandard.bind(this),
            "MeasurableElements": this.gotoMeasurableElement.bind(this)
        }[element];
    }

    renderSearchResultsFor([element, results], index) {
        const resultTexts = results.map((result, idx) =>
            <TouchableWithoutFeedback key={idx} onPress={() => this.goto(element)(result)}>
                <View>
                    <Text style={[Typography.paperFontTitle, {color: "white", marginBottom: 16}]}>
                        {`${result.reference} - ${result.name}`}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
        return (
            <View key={index} style={SearchPage.styles.resultContainer}>
                <Text style={[Typography.paperFontCaption, {color: PrimaryColors.medium_white}]}>
                    {element.replace(/([a-z](?=[A-Z]))/g, '$1 ')}
                </Text>
                {resultTexts}
            </View>)
    }

    renderSearchResults(searchResults) {
        return _.toPairs(searchResults)
            .filter(([k, v]) => !_.isEmpty(v))
            .map(this.renderSearchResultsFor.bind(this));

    }

    render() {
        return (
            <Container theme={FlatUITheme}>
                <View style={SearchPage.styles.header}>
                    <Button transparent onPress={() => TypedTransition.from(this).goBack()}>
                        <Icon style={{color: "white"}} name="arrow-back"/>
                    </Button>
                    <InputGroup >
                        <Input onChangeText={this.handleSearch} placeholder="Search"/>
                    </InputGroup>
                </View>
                <Content>
                    <View style={{margin: deviceWidth * 0.04,}}>
                        {this.renderSearchResults(this.state.results)}
                    </View>
                </Content>
            </Container>
        );
    }
}

export default SearchPage;