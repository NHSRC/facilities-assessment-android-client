import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import {Container, Content, Title, Button, Header, Icon, InputGroup, Input} from 'native-base';
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from '../themes/search';
import TypedTransition from "../../framework/routing/TypedTransition";
import Path from "../../framework/routing/Path";
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";
import Listing from '../common/Listing';
import Actions from '../../action';
import Standards from "../standards/Standards";
import Dashboard from '../dashboard/Dashboard';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path("/searchPage")
class SearchPage extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().search;
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
        return (
            <Container theme={FlatUITheme}>
                <View style={SearchPage.styles.header}>
                    <Button transparent onPress={() => TypedTransition.from(this).goBack()}>
                        <Icon style={{color: "white"}} name="arrow-back"/>
                    </Button>
                    <InputGroup borderType='none' inputBorderColor="#212121" textColor="white"
                                inputColorPlaceholder="white" inputFontSize={20}>
                        <Input inputBorderColor="#212121" textColor="white"
                               inputColorPlaceholder="white" inputFontSize={20} placeholder="Search"/>
                    </InputGroup>
                </View>
                <Content>
                    <View style={{margin: deviceWidth * 0.04,}}>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default SearchPage;