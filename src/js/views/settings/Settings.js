import React, {Component} from 'react';
import {
    Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet, Image, TextInput,
    ActivityIndicator, Alert, Navigator
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
import EnvironmentConfig from "../common/EnvironmentConfig";
import SubmitAssessment from "../dashboard/open/SubmitAssessment";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path("/settings")
class Settings extends AbstractComponent {
    constructor(props, context) {
        super(props, context, 'settings');
    }

    static styles = StyleSheet.create({
        container: {
            margin: deviceWidth * 0.04,
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        textBox: {
            alignSelf: 'stretch',
            marginTop: 8,
            marginBottom: 20
        },
    });

    componentWillMount() {
        this.dispatchAction(Actions.INITIAL_SETTINGS);
    }

    cleanData() {
        Alert.alert(
            'Do you want delete data',
            "This will remove the reference, configuration and transaction data.",
            [
                {
                    text: 'Yes', onPress: () => {
                        this.dispatchAction(Actions.CLEAN_DATA);
                    }
                },
                {
                    text: 'No', onPress: () => {
                    }
                }
            ]
        )
    }

    cleanTxData() {
        Alert.alert(
            'Do you want delete data',
            "This will remove the Tx data.",
            [
                {
                    text: 'Yes', onPress: () => {
                        this.dispatchAction(Actions.CLEAN_TXDATA);
                    }
                },
                {
                    text: 'No', onPress: () => {
                    }
                }
            ]
        )
    }

    _onBack() {
        this.dispatchAction(Actions.MODE_SELECTION);
    }

    render() {
        return (
            <Container theme={FlatUITheme}>
                <Header style={FlatUITheme.header}>
                    <Button
                        onPress={() => {
                            this._onBack();
                            TypedTransition.from(this).goBack();
                        }}
                        transparent>
                        <Icon style={{marginTop: 10, color: 'white'}} name="arrow-back"/>
                    </Button>
                    <Title style={[Typography.paperFontHeadline, {
                        fontWeight: 'bold',
                        color: 'white'
                    }]}>Settings</Title>
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
                                    value={this.state.serverURL}/>
                            </InputGroup>
                        </View>

                        {EnvironmentConfig.shouldAllowBulkDownload ?
                            <View style={{flexDirection: 'column', flex: 1, alignSelf: 'stretch'}}>
                                <SubmitButton
                                    buttonText={this.state.syncing ?
                                        (<ActivityIndicator animating={true} size={"large"} color="white"
                                                            style={{height: 80}}/>) :
                                        "DOWNLOAD - FACILITIES, CHECKLISTS and ASSESSMENTS"}
                                    onPress={() =>
                                        this.dispatchAction(Actions.SYNC_ALL_DATA,
                                            {
                                                cb: () => {
                                                    this.dispatchAction(Actions.SYNCED_DATA);
                                                    this.props.params.cb();
                                                }
                                            })
                                    }
                                    buttonStyle={{marginTop: 15}}/>
                                <SubmitButton
                                    buttonText={this.state.syncing ?
                                        (<ActivityIndicator animating={true} size={"large"} color="white"
                                                            style={{height: 80}}/>) :
                                        "DOWNLOAD - FACILITIES and CHECKLISTS"}
                                    onPress={() =>
                                        this.dispatchAction(Actions.SYNC_META_DATA,
                                            {
                                                cb: () => {
                                                    this.dispatchAction(Actions.SYNCED_DATA);
                                                    this.props.params.cb();
                                                }
                                            })
                                    }
                                    buttonStyle={{marginTop: 15}}/>
                            </View> : <View/>}

                        {EnvironmentConfig.shouldAllowDownloadMyData ?
                            <SubmitButton buttonText={this.state.syncing ?
                                (<ActivityIndicator animating={true} size={"large"} color="white"
                                                    style={{height: 80}}/>) : "Download My Assessments"}
                                          onPress={() =>
                                              this.dispatchAction(Actions.DOWNLOAD_MY_ASSESSMENTS,
                                                  {
                                                      cb: () => {
                                                          this.dispatchAction(Actions.SYNCED_DATA);
                                                          this.props.params.cb();
                                                      }
                                                  })
                                          }
                                          buttonStyle={{marginTop: 15}}/> : <View/>}

                        {EnvironmentConfig.shouldAllowCleanData ?
                            <View>
                                <View>
                                    <Text
                                        style={[Typography.paperFontSubheader, {marginLeft: 8, color: PrimaryColors.medium_white}]}>Assessment ID</Text>
                                    <TextInput value={this.state.assessmentId}
                                               underlineColorAndroid={PrimaryColors["white"]}
                                               words="words"
                                               onChangeText={(text) => this.dispatchAction(Actions.SET_ASSESSMENT_ID, {assessmentId: text})}/>
                                </View>
                                <SubmitButton buttonText={"DOWNLOAD ABOVE ASSESSMENT"}
                                              onPress={() => this.dispatchAction(Actions.DOWNLOAD_ASSESSMENT)}
                                              buttonStyle={{marginTop: 15}}/>
                                <SubmitButton buttonText={"CLEAN ALL DATA"}
                                              onPress={() => this.cleanData()}
                                              buttonStyle={{marginTop: 15}}/>
                                <SubmitButton buttonText={"CLEAN TX DATA"}
                                              onPress={() => this.cleanTxData()}
                                              buttonStyle={{marginTop: 15}}/>
                            </View> : null}
                    </View>
                </Content>
            </Container>
        );
    }
}

export default Settings;