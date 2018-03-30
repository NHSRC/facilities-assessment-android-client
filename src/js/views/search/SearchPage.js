import React from "react";
import {Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View, Platform, TextInput} from "react-native";
import {Button, Container, Content, Header, Icon, Input, InputGroup, Title} from "native-base";
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from "../themes/search";
import TypedTransition from "../../framework/routing/TypedTransition";
import Path from "../../framework/routing/Path";
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";
import Actions from "../../action";
import Assessment from "../assessment/Assessment";
import Dashboard from "../dashboard/Dashboard";
import _ from "lodash";
import Logger from "../../framework/Logger";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path("/searchPage")
class SearchPage extends AbstractComponent {
    constructor(props, context) {
        super(props, context, 'search');
        this.handleSearch = this.handleSearch.bind(this);
        this.goto = this.goto.bind(this);
    }

    static styles = StyleSheet.create({
        resultContainer: {
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            flexWrap: 'nowrap',
            marginTop: 5
        },
        input: {
            fontSize: 16,
            color: 'white',
            height: 40,
            paddingLeft: 8,
            borderColor: 'grey',
            borderWidth: Platform.OS === 'ios' ? 0.5 : 0
        }
    });

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
                <Header style={FlatUITheme.header}>
                    <Button transparent onPress={() => TypedTransition.from(this).goBack()}>
                        <Icon style={{color: "white"}} name="arrow-back"/>
                    </Button>
                    <Title style={[Typography.paperFontHeadline, {
                        fontWeight: 'bold',
                        color: "white"
                    }]}>Search</Title>
                </Header>
                <Content>
                    <View style={{margin: deviceWidth * 0.04}}>
                        <TextInput style={SearchPage.styles.input}
                                   placeholder={"Search term"}
                                   placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                   underlineColorAndroid={PrimaryColors["dark_white"]}
                                   words="words"
                                   onChangeText={this.handleSearch}/>
                        {this.renderSearchResults(this.state.results)}
                    </View>
                </Content>
            </Container>
        );
    }
}

export default SearchPage;