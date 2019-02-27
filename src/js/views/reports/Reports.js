import React from "react";
import {Dimensions, Modal, StyleSheet, View, BackAndroid} from "react-native";
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from "../themes/flatUI";
import {Button, Container, Content, Header, Icon, Title} from "native-base";
import Path from "../../framework/routing/Path";
import Typography from "../styles/Typography";
import TypedTransition from "../../framework/routing/TypedTransition";
import Actions from "../../action";
import OverallScore from "./OverallScore";
import ScoreTabs from "./ScoreTabs";
import Share from "react-native-share";
import _ from "lodash";
import {takeSnapshot} from "react-native-view-shot";
import ExportOptions from "./ExportOptions";
import Logger from "../../framework/Logger";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path("/reports")
class Reports extends AbstractComponent {
    constructor(props, context) {
        super(props, context, 'reports');
        this.exportOptions = this.exportOptions.bind(this);
    }

    static styles = StyleSheet.create({
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

    componentWillMount() {
        this.props.params.drilledDown ? _.noop() : this.dispatchAction(Actions.GET_ALL_SCORES, {...this.props.params});
        // this.props.backListeners.addListener(Reports.path(), this.back.bind(this));
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
            result: "file"
        }).then(uri =>
            this.dispatchAction(Actions.EXPORT_CURRENT_VIEW, {
                ...this.props.params,
                uri: uri,
                cb: this.share.bind(this)
            }));
    }

    exportOptions() {
        this.dispatchAction(Actions.EXPORT_OPTIONS, {...this.props.params});
    }

    exportTab(tab) {
        let action = {...this.props.params};
        action.tab = tab;
        action.cb = this.share.bind(this);
        this.dispatchAction(Actions.EXPORT_TAB, action);
    }

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', () => {
            this._onBack();
        });
    }

    back() {
        this._onBack();
        TypedTransition.from(this).goBack();
    }

    _onBack() {
        this.props.params.drilledDown ? this.dispatchAction(Actions.INIT_REPORTS, {...this.props.params}) : _.noop();
    }

    render() {
        Logger.logDebug('Reports', 'render');
        const exportOptions = this.state.tabs.map((tab) => {return {title: `Export ${_.startCase(tab.title.toLowerCase())} Scorecard`, cb: () => this.exportTab(tab)}});
        exportOptions.push({title: `Export All Checklists`, cb: this.exportAll.bind(this)});
        const title = this.props.params.drilledDown ? _.truncate(this.state.selectionName, {length: 25})
            : `${this.props.params.mode.toUpperCase()} Scorecard`;
        return (
            <Container theme={FlatUITheme}>
                <Header style={FlatUITheme.header}>
                    <Button
                        onPress={this.back.bind(this)}
                        transparent>
                        <Icon style={{color: 'white'}} name="arrow-back"/>
                    </Button>
                    <Title style={[Typography.paperFontTitle, {
                        fontWeight: 'bold',
                        color: 'white'
                    }]}>
                        {title}
                    </Title>
                    <Button
                        onPress={this.exportOptions}
                        transparent>
                        <Icon style={{color: 'white'}} name="get-app"/>
                    </Button>
                    <Button
                        onPress={this.snapshot.bind(this)}
                        transparent>
                        <Icon style={{color: 'white'}} name="share"/>
                    </Button>
                </Header>
                <Content ref="reports">
                    <OverallScore score={this.state.overallScore}
                                  scoreText={this.state.overallScoreText}
                                  checkpointStats={this.state.checkpointStats}
                                  checklistStats={this.state.checklistStats} {...this.props.params}/>
                    <ScoreTabs mode={this.props.params.mode}
                               params={this.props.params}
                               facilityAssessment={this.props.params.facilityAssessment}
                               data={this.state}/>
                    <Modal transparent={true} visible={this.state.showExportOptions}
                           onRequestClose={this.exportOptions}>
                        <ExportOptions onClose={this.exportOptions} options={exportOptions} title={`Export - ${title}`}/>
                    </Modal>
                    <View style={[this.state.showExportOptions ? Reports.styles.overlay : {}]}/>
                </Content>
            </Container>
        );
    }
}

export default Reports;