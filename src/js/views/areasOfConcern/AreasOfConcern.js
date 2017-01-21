import React, {Component} from 'react';
import {Dimensions, View, Text} from 'react-native';
import {Container, Content, Title, Button, Header} from 'native-base';
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from '../themes/flatUI';
import TypedTransition from "../../framework/routing/TypedTransition";
import Path from "../../framework/routing/Path";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path("/areasOfConcern")
class AreasOfConcern extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().areasOfConcern;
        this.unsubscribe = store.subscribeTo('areasOfConcern', this.handleChange.bind(this));
    }

    static styles = StyleSheet.create({});

    handleChange() {
        const newState = this.context.getStore().getState().areasOfConcern;
        this.setState(newState);
    }

    componentWillMount() {
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const areasOfConcern = this.state.areasOfConcern.map()
        return (
            <Container theme={FlatUITheme}>
                <Header>
                    <Button transparent onPress={() => TypedTransition.from(this).goBack()}>
                        <Icon name='arrow-back'/>
                    </Button>
                    <Title>{this.props.params.checklist.name}</Title>
                </Header>
                <Content>
                    <View style={{margin: deviceWidth * 0.04,}}>

                    </View>
                </Content>
            </Container>
        );
    }
}

export default AreasOfConcern;