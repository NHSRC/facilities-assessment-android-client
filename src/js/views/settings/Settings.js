import React, {Component} from 'react';
import {
    Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet, Image, TextInput,
    ActivityIndicator
} from 'react-native';
import {Container, Content, Title, Button, Header, Icon, InputGroup, Input} from 'native-base';
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from '../themes/flatUI';
import SubmitButton from '../common/SubmitButton';
import TypedTransition from "../../framework/routing/TypedTransition";
import Path from "../../framework/routing/Path";
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";
import Actions from '../../action';
import {formatDate} from '../../utility/DateUtils';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path("/settings")
class Settings extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().settings;
        this.unsubscribe = store.subscribeTo('settings', this.handleChange.bind(this));
    }

    static styles = StyleSheet.create({
        container: {
            margin: deviceWidth * 0.04,
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        header: {
            shadowOffset: {width: 0, height: 0},
            elevation: 0,
            backgroundColor: '#212121',
        },
        textBox: {
            alignSelf: 'stretch',
            marginTop: 8,
            marginBottom: 20
        },
    });

    handleChange() {
        const newState = this.context.getStore().getState().settings;
        this.setState(newState);
    }

    componentWillMount() {
        this.dispatchAction(Actions.INITIAL_SETTINGS);
    }

    render() {
        return (
            <Container theme={FlatUITheme}>
                <Header style={Settings.styles.header}>
                    <Button transparent>
                        <Icon style={{marginTop: 10, color: 'white'}} name="menu"/>
                    </Button>
                    <Title style={[Typography.paperFontHeadline, {
                        fontWeight: 'bold',
                        color: 'white'
                    }]}>Menu</Title>
                </Header>
                <Content>
                    <View style={Settings.styles.container}>
                        <View style={Settings.styles.textBox}>
                            <Text
                                style={[Typography.paperFontTitle, {marginLeft: 8, color: PrimaryColors.medium_white}]}>
                                Server URL</Text>
                            <InputGroup borderType='underline'>
                                <Input
                                    style={{color: "white"}}
                                    value={this.state.serverURL}
                                    onChangeText={(text) => this.dispatchAction(Actions.UPDATE_SETTINGS_VIEW, {serverURL: text})}
                                    placeholder='http://enter-your-server-url.com'/>
                            </InputGroup>
                        </View>

                        <SubmitButton
                            buttonText={this.state.syncing ?
                                (<ActivityIndicator animating={true} size={"large"} color="white"
                                                    style={{height: 80}}/>) :
                                "SYNC META-DATA"}
                            onPress={() =>
                                this.dispatchAction(Actions.SYNC_META_DATA,
                                    {cb: ()=>this.dispatchAction(Actions.SYNCED_META_DATA)})}
                            showButton={true}/>
                        <Text style={{color: "white", marginBottom: 30}}>
                            Last Synced Date - {formatDate(this.state.lastSyncedDate)}
                        </Text>


                        <SubmitButton buttonText={"UPDATE SETTINGS"}
                                      onPress={() => this.dispatchAction(Actions.UPDATE_SETTINGS)}
                                      showButton={true}/>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default Settings;