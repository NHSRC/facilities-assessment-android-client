import React from "react";
import {BackHandler, Dimensions, Modal, StyleSheet, View} from "react-native";
import ViewComponent from "../common/ViewComponent";
import {Button, Container, Right, Body, Content, Header, Icon, Title, StyleProvider, Left} from "native-base";
import Path from "../../framework/routing/Path";
import Typography from "../styles/Typography";
import TypedTransition from "../../framework/routing/TypedTransition";
import Actions from "../../action";
import OverallScore from "./OverallScore";
import ScoreTabs from "./ScoreTabs";
import Share from "react-native-share";
import _ from "lodash";
import {captureRef} from "react-native-view-shot";
import ExportOptions from "./ExportOptions";
import Logger from "../../framework/Logger";
import ShareUtil from "../../action/ShareUtil";
import getTheme from "../../native-base-theme/components";
import platformTheme from "../../native-base-theme/variables/platform";
import PrimaryColors from "../styles/PrimaryColors";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path("/reports")
class Reports extends ViewComponent {
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

    share(shareOpts, actionName) {
        Logger.logDebug('Reports', shareOpts);
        Share.open(shareOpts).then((res) => {
            this.dispatchAction(actionName);
        }).then((res) => {
            console.log(res)
        }).catch((err) => {
            Logger.logError('Reports', err);
        });
    }

    exportAll() {
        this.share(ShareUtil.getShareAllOptions(this.context, this.props.params.facilityAssessment), Actions.EXPORT_ASSESSMENT);
    }

    snapshot() {
        captureRef(this.refs["reports"], {
            format: "png",
            result: "base64"
        }).then(uri => {
            this.share(ShareUtil.getCurrentViewOptions(this.context, this.props.params.facilityAssessment, this.state.selectedTab, uri), Actions.EXPORT_CURRENT_VIEW);
        });
    }

    exportOptions() {
        this.dispatchAction(Actions.EXPORT_OPTIONS, {...this.props.params});
    }

    exportTab(tab) {
        let action = {...this.props.params};
        action.tab = tab;
        this.share(ShareUtil.getExportTabOptions(this.context, action), Actions.EXPORT_TAB);
    }

    componentDidMount() {
        super.componentDidMount();
        BackHandler.addEventListener('hardwareBackPress', () => {
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
        const exportOptions = this.state.tabs.map((tab) => {
            return {title: `Export ${_.startCase(tab.title.toLowerCase())} Scorecard`, cb: () => this.exportTab(tab)}
        });
        exportOptions.push({title: `Export All Checklists`, cb: this.exportAll.bind(this)});
        const title = this.props.params.drilledDown ? _.truncate(this.state.selectionName, {length: 25})
            : `${this.props.params.mode.toUpperCase()} Scorecard`;
        return (
            <StyleProvider style={getTheme(platformTheme)}>
                <Container>
                    <Header style={{backgroundColor: PrimaryColors.header}}>
                        <Left style={{flex: 0.2}}><Button
                            onPress={this.back.bind(this)}
                            transparent>
                            <Icon style={{color: 'white'}} name="arrow-back"/>
                        </Button></Left>
                        <Body style={{flex: 0.4}}><Title style={[Typography.paperFontTitle, {
                            fontWeight: 'bold',
                            color: 'white'
                        }]}>
                            {title}
                        </Title></Body>
                        <Right style={{flex: 0.4}}><Button
                            onPress={this.exportOptions}
                            transparent>
                            <Icon style={{color: 'white'}} name="download"/>
                        </Button>
                            <Button
                                onPress={this.snapshot.bind(this)}
                                transparent>
                                <Icon style={{color: 'white'}} name="share"/>
                            </Button></Right>
                    </Header>
                    <Content contentContainerStyle={{
                        flexDirection: 'column',
                        paddingHorizontal: 6,
                        backgroundColor: PrimaryColors.bodyBackground
                    }} ref="reports">
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
            </StyleProvider>
        );
    }
}

export default Reports;