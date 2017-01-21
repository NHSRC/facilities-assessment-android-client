import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import {Container, Content, Title, Button, Header, Icon} from 'native-base';
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from '../themes/flatUI';
import TypedTransition from "../../framework/routing/TypedTransition";
import Path from "../../framework/routing/Path";
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";
import Actions from '../../action'

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

    static styles = StyleSheet.create({
        aocsContainer: {
            flexDirection: 'column',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            marginTop: deviceHeight * 0.02,
        },
        aocButton: {
            flexDirection: 'row',
            flexWrap: 'nowrap',
            margin: 0,
            marginTop: deviceHeight * .01667,
            height: deviceHeight * 0.06,
        },
        aocButtonText: {
            backgroundColor: PrimaryColors.light_black,
            width: deviceWidth * 0.72,
            paddingLeft: deviceHeight * .02,
            margin: 0,
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
            alignItems: 'center'
        },
        aocButtonLabel: {
            backgroundColor: PrimaryColors.blue,
            width: deviceWidth * 0.2,
            margin: 0,
            justifyContent: 'center',
            alignItems: 'center'
        },
    });

    handleChange() {
        const newState = this.context.getStore().getState().areasOfConcern;
        this.setState(newState);
    }

    componentWillMount() {
        this.dispatchAction(Actions.ALL_AREAS_OF_CONCERN, {checklist: this.props.params.selectedChecklist})
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const areasOfConcern = this.state.areasOfConcern.map((aoc, idx) =>
            <TouchableWithoutFeedback key={idx}>
                <View style={AreasOfConcern.styles.aocButton}>
                    <View style={AreasOfConcern.styles.aocButtonText}>
                        <Text style={[Typography.paperFontSubhead, {color: PrimaryColors.subheader_black}]}>
                            {aoc.name}
                        </Text>
                    </View>
                    <View style={AreasOfConcern.styles.aocButtonLabel}>
                        <Text style={[Typography.paperFontBody1, {color: "#FFF"}]}>
                            {aoc.reference}
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>);

        return (
            <Container theme={FlatUITheme}>
                <Header>
                    <Button transparent onPress={() => TypedTransition.from(this).goBack()}>
                        <Icon name='arrow-back'/>
                    </Button>
                    <Title>{this.props.params.selectedChecklist.name}</Title>
                </Header>
                <Content>
                    <View style={{margin: deviceWidth * 0.04,}}>
                        {areasOfConcern}
                    </View>
                </Content>
            </Container>
        );
    }
}

export default AreasOfConcern;