import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions, Modal} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from '../themes/flatUI';
import {Container, Header, Title, Content, Icon, Button, Footer} from 'native-base';
import Path from "../../framework/routing/Path";
import Typography from '../styles/Typography';
import PrimaryColors from '../styles/PrimaryColors';
import TypedTransition from "../../framework/routing/TypedTransition";
import Actions from '../../action';
import OverallScore from "./OverallScore";
import ScoreTabs from "./ScoreTabs";
import Share from 'react-native-share';
import _ from 'lodash';
import {takeSnapshot} from "react-native-view-shot";
import ExportOptions from './ExportOptions';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path("/reports")
class Reports extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().reports;
        this.unsubscribe = this.unsubscribe = store.subscribeTo('reports', this.handleChange.bind(this));
        this.exportOptions = this.exportOptions.bind(this);
    }

    handleChange() {
        const newState = this.context.getStore().getState().reports;
        this.setState(newState);
    }

    static styles = StyleSheet.create({
        header: {
            shadowOffset: {width: 0, height: 0},
            elevation: 0,
            backgroundColor: '#212121',
        },
        container: {
            margin: deviceWidth * 0.04,
        },
        overlay: {
            flex: 1,
            position: 'absolute',
            left: 0,
            top: 0,
            opacity: 0.8,
            backgroundColor: 'black',
            width: deviceWidth,
            height: deviceHeight
        }
    });

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentWillMount() {
        this.dispatchAction(Actions.GET_ALL_SCORES, {...this.props.params})
    }

    share(shareOpts) {
        Share.open(shareOpts);
    }

    exportAll() {
        this.dispatchAction(Actions.EXPORT_ASSESSMENT, {...this.props.params, cb: this.share.bind(this)});
    }

    snapshot() {
        takeSnapshot(this.refs["reports"], {
            format: "jpeg",
            result: "data-uri"
        }).then(uri => this.share({url: uri}));
    }

    exportCurrentTab() {
        this.dispatchAction(Actions.EXPORT_CURRENT_TAB, {...this.props.params, cb: this.share.bind(this)})
    }

    exportOptions() {
        this.dispatchAction(Actions.EXPORT_OPTIONS, {...this.props.params});
    }

    render() {
        const exportOptions = [{title: `Export ${_.startCase(this.state.selectedTab.toLowerCase())} Scorecard`, cb: this.exportCurrentTab.bind(this)},
            {title: `Export All Checklists`, cb: this.exportAll.bind(this)}];
        return (
            <Container theme={FlatUITheme}>
                <Header style={Reports.styles.header}>
                    <Button
                        onPress={() => TypedTransition.from(this)
                            .goBack()}
                        transparent>
                        <Icon style={{marginTop: 10, color: 'white'}} name="arrow-back"/>
                    </Button>
                    <Title style={[Typography.paperFontHeadline, {
                        fontWeight: 'bold',
                        color: 'white'
                    }]}>{`${this.props.params.mode.toUpperCase()} Scorecard`}</Title>
                    <Button
                        onPress={this.exportOptions}
                        transparent>
                        <Icon style={{marginTop: 10, color: 'white'}} name="get-app"/>
                    </Button>
                    <Button
                        onPress={this.snapshot.bind(this)}
                        transparent>
                        <Icon style={{fontSize: 22, marginTop: 10, color: 'white'}} name="share"/>
                    </Button>
                </Header>
                <Content ref="reports">
                    <OverallScore score={this.state.overallScore} checkpointStats={this.state.checkpointStats}
                                  checklistStats={this.state.checklistStats}/>
                    <ScoreTabs mode={this.props.params.mode}
                               facilityAssessment={this.props.params.facilityAssessment}
                               data={this.state}/>
                    <Modal transparent={true} visible={this.state.showExportOptions}
                           onRequestClose={this.exportOptions}>
                        <ExportOptions onClose={this.exportOptions} options={exportOptions}/>
                    </Modal>
                    <View style={[this.state.showExportOptions ? Reports.styles.overlay : {}]}/>
                </Content>
            </Container>
        );
    }
}

export default Reports;