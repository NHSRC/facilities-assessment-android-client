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
import Logger from "../../framework/Logger";

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

    goto(checkpoint) {
        TypedTransition.from(this).with({...this.props.params, toCheckpoint: checkpoint, ...checkpoint}).to(Assessment)
    }


    renderSearchResults(results) {
        let resultsRender = results.map((result, idx) =>
            <TouchableWithoutFeedback key={idx} onPress={() => this.goto(result)}>
                <View style={{marginBottom: 16}}>
                    <Text style={[Typography.paperFontTitle, {color: "white",}]}>
                        {`${_.truncate(result.name, {length: 50})}`}
                    </Text>
                    <Text style={[Typography.paperFontSubhead, {color: "white",}]}>
                        {` ${result.checklist.name} - ${result.standard.reference}`}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
        return (
            <View style={SearchPage.styles.resultContainer}>
                <Text style={[Typography.paperFontCaption, {color: PrimaryColors.medium_white}]}>
                    {"Checkpoints"}
                </Text>
                {resultsRender}
            </View>);

    }

    render() {
        Logger.logDebug('SearchPage', 'render');
        return (
            <Container theme={FlatUITheme}>
                <View style={SearchPage.styles.header}>
                    <Button transparent onPress={() => TypedTransition.from(this).goBack()}>
                        <Icon style={{color: "white"}} name="arrow-back"/>
                    </Button>
                    <InputGroup>
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