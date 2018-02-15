import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import {Container, Content, Title, Button, Header, Icon} from 'native-base';
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from '../themes/flatUI';
import TypedTransition from "../../framework/routing/TypedTransition";
import Path from "../../framework/routing/Path";
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";
import Listing from '../common/Listing';
import Actions from '../../action';
import Standards from "../standards/Standards";
import Dashboard from '../dashboard/Dashboard';
import SearchPage from "../search/SearchPage";
import Logger from "../../framework/Logger";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path("/areasOfConcern")
class AreasOfConcern extends AbstractComponent {
    constructor(props, context) {
        super(props, context, 'areasOfConcern');
    }

    static styles = StyleSheet.create({});

    componentWillMount() {
        this.dispatchAction(Actions.ALL_AREAS_OF_CONCERN, {...this.props.params})
    }

    handleOnPress(aoc) {
        return () => TypedTransition
            .from(this)
            .with({
                areaOfConcern: aoc,
                ...this.props.params
            })
            .to(Standards);
    }

    render() {
        Logger.logDebug('AreasOfConcern', 'render');
        return (
            <Container theme={FlatUITheme}>
                <Header style={Dashboard.styles.header}>
                    <Button transparent onPress={() => TypedTransition.from(this).goBack()}>
                        <Icon style={{marginTop: 10, color: "white"}} name='arrow-back'/>
                    </Button>
                    <Title style={[Typography.paperFontHeadline,
                        {fontWeight: 'bold', color: "white"}]}>
                        {this.props.params.checklist.name}
                    </Title>
                    <Button transparent onPress={() => TypedTransition.from(this).with({...this.props.params}).to(SearchPage)}>
                        <Icon style={{paddingTop: 10, color: "white"}} name='search'/>
                    </Button>
                </Header>
                <Content>
                    <View style={{margin: deviceWidth * 0.04,}}>
                        <Listing
                            labelColor={PrimaryColors.gray}
                            onPress={this.handleOnPress.bind(this)}
                            items={this.state.areasOfConcern}/>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default AreasOfConcern;