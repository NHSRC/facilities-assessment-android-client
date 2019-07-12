import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Button, Container, Content, Header, Icon, Title} from 'native-base';
import ViewComponent from "../common/ViewComponent";
import TypedTransition from "../../framework/routing/TypedTransition";
import Path from "../../framework/routing/Path";
import Listing from '../common/Listing';
import Actions from '../../action';
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";
import Assessment from '../assessment/Assessment';
import SearchPage from "../search/SearchPage";
import Standard from "../../models/Standard";
import Logger from "../../framework/Logger";
import GunakContainer from "../common/GunakContainer";
import _ from 'lodash';

const deviceWidth = Dimensions.get('window').width;

@Path("/standards")
class Standards extends ViewComponent {
    constructor(props, context) {
        super(props, context, 'standards');
    }

    static styles = StyleSheet.create({});

    componentWillMount() {
        this.dispatchAction(Actions.ALL_STANDARDS, {
            checklist: this.props.params.checklist,
            areaOfConcern: this.props.params.areaOfConcern,
            facilityAssessment: this.props.params.facilityAssessment
        })
    }

    handleOnPress(standard) {
        return () => TypedTransition.from(this).with({
            standard: standard,
            ...this.props.params
        }).to(Assessment);
    }

    render() {
        Logger.logDebug('Standards', 'render');
        const standards = this.state.standards.map((standard) =>
            _.assignIn(standard,
                {name: Standard.getDisplayName(standard)}));
        return (
            <GunakContainer title={this.props.params.areaOfConcern.name} onPressRightIcon={() => TypedTransition.from(this).with({...this.props.params}).to(SearchPage)}
                            rightIconName="search">
                <View style={{flexDirection: 'column', width: deviceWidth, paddingHorizontal: deviceWidth * 0.04}}>
                    <Listing
                        labelColor={PrimaryColors.yellow}
                        onPress={this.handleOnPress.bind(this)}
                        items={standards}/>
                </View>
            </GunakContainer>
        );
    }
}

export default Standards;