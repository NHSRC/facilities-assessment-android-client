import React from "react";
import {Dimensions, Platform, StyleSheet, TextInput, TouchableWithoutFeedback, View} from "react-native";
import {Button, Text} from "native-base";
import ViewComponent from "../common/ViewComponent";
import TypedTransition from "../../framework/routing/TypedTransition";
import Path from "../../framework/routing/Path";
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";
import Actions from "../../action";
import Assessment from "../assessment/Assessment";
import _ from "lodash";
import Logger from "../../framework/Logger";
import GunakContainer from "../common/GunakContainer";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path("/searchPage")
class SearchPage extends ViewComponent {
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
            marginTop: 5,
            paddingHorizontal: 6
        },
        input: {
            fontSize: 16,
            color: 'white',
            height: 40,
            paddingLeft: 8,
            borderColor: 'grey',
            borderWidth: Platform.OS === 'ios' ? 0.5 : 0,
            width: deviceWidth,
            paddingHorizontal: 6
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
            <GunakContainer title="Search">
                <TextInput style={SearchPage.styles.input}
                           placeholder={"Search term"}
                           placeholderTextColor="rgba(255, 255, 255, 0.7)"
                           underlineColorAndroid={PrimaryColors["dark_white"]}
                           words="words"
                           onChangeText={this.handleSearch}/>
                {this.renderSearchResults(this.state.results)}
            </GunakContainer>
        );
    }
}

export default SearchPage;