import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import {Button, Container, Content, Header, Icon, Title} from 'native-base';
import Path from "../../framework/routing/Path";
import Typography from '../styles/Typography';
import TypedTransition from "../../framework/routing/TypedTransition";
import _ from 'lodash';
import ScoreList from "../reports/ScoreList";
import {takeSnapshot} from "react-native-view-shot";
import Share from "react-native-share";
import Logger from "../../framework/Logger";
import bugsnag from '../../utility/Bugsnag';

const deviceWidth = Dimensions.get('window').width;

@Path("/drillDownView")
class DrillDownView extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        container: {
            margin: deviceWidth * 0.04,
        }
    });

    share(shareOpts) {
        Share.open(shareOpts);
    }

    snapshot() {
        takeSnapshot(this.refs["drilldown"], {
            format: "jpeg",
            result: "data-uri"
        }).then(uri => this.share({url: uri}));
    }

    componentDidMount() {
        bugsnag.leaveBreadcrumb("drillDown", {type: 'navigation'});
    }

    render() {
        Logger.logDebug('DrillDownView', 'render');
        return (
            <Container>
                <Header>
                    <Button
                        onPress={() => TypedTransition.from(this)
                            .goBack()}
                        transparent>
                        <Icon style={{marginTop: 10, color: 'white'}} name="arrow-back"/>
                    </Button>
                    <Title style={[Typography.paperFontHeadline, {
                        fontWeight: 'bold',
                        color: 'white'
                    }]}>{this.props.params.title}</Title>
                    <Button
                        onPress={this.snapshot.bind(this)}
                        transparent>
                        <Icon style={{fontSize: 22, marginTop: 10, color: 'white'}} name="share"/>
                    </Button>
                </Header>
                <Content ref="drilldown">
                    <ScoreList scores={this.props.params.data} handlePress={_.noop}/>
                </Content>
            </Container>
        );
    }
}

export default DrillDownView;