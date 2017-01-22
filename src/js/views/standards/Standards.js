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
            areaOfConcern: this.props.params.areaOfConcern
        })
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleOnPress(standard) {
        return () => {
        };
    }

    render() {
        return (
            <Container theme={FlatUITheme}>
                <Header>
                    <Button transparent onPress={() => TypedTransition.from(this).goBack()}>
                        <Icon style={{marginTop: 10}} name='arrow-back'/>
                    </Button>
                    <Title>{this.props.params.areaOfConcern.name}</Title>
                </Header>
                <Content>
                    <View style={{margin: deviceWidth * 0.04,}}>
                        <Listing
                            labelColor={PrimaryColors.yellow}
                            onPress={this.handleOnPress.bind(this)}
                            items={this.state.standards}/>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default Standards;