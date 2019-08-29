import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Button, Container, Content, Header, Icon, Title} from 'native-base';
import ViewComponent from "../common/ViewComponent";
import TypedTransition from "../../framework/routing/TypedTransition";
import Path from "../../framework/routing/Path";
import PrimaryColors from "../styles/PrimaryColors";
import Listing from '../common/Listing';
import Actions from '../../action';
import Standards from "../standards/Standards";
import SearchPage from "../search/SearchPage";
import Logger from "../../framework/Logger";
import GunakContainer from "../common/GunakContainer";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path("/areasOfConcern")
class AreasOfConcern extends ViewComponent {
    constructor(props, context) {
        super(props, context, 'areasOfConcern');
    }

    static styles = StyleSheet.create({});

    componentWillMount() {
        this.dispatchAction(Actions.ALL_AREAS_OF_CONCERN, {...this.props.params})
    }

    handleOnPress(aoc) {
        return () => TypedTransition
            .from(this)
            .with({
                areaOfConcern: aoc,
                ...this.props.params
            })
            .to(Standards);
    }

    render() {
        Logger.logDebug('AreasOfConcern', 'render');
        return (
            <GunakContainer title={this.props.params.checklist.name} onPressRightIcon={this.goSearch}
                            rightIconName="search">
                <View style={{flexDirection: 'column', width: deviceWidth, paddingHorizontal: deviceWidth * 0.04}}>
                    <Listing
                        labelColor={PrimaryColors.gray}
                        onPress={this.handleOnPress.bind(this)}
                        items={this.state.areasOfConcern}/>
                </View>
            </GunakContainer>
        );
    }

    goSearch = () =>{
        TypedTransition.from(this).with({...this.props.params}).to(SearchPage)
    }
}

export default AreasOfConcern;