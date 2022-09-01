import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import ViewComponent from "../common/ViewComponent";
import Actions from '../../action';
import TypedTransition from "../../framework/routing/TypedTransition";
import Path from "../../framework/routing/Path";
import Typography from "../styles/Typography";
import PrimaryColors from "../styles/PrimaryColors";
import {Button, Container, Content, Header, Icon, Title} from "native-base";
import Logger from "../../framework/Logger";
import certification from "../../action/certification";
import GunakContainer from "../common/GunakContainer"

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path("/certification")
class Certification extends ViewComponent {
    constructor(props, context) {
        super(props, context, 'certification');
    }

    static styles = StyleSheet.create({
        container: {
            padding: 10,
            backgroundColor: PrimaryColors.blue,
            height: deviceHeight * .2,
        },
        innerContainer: {
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'center',
            alignItems: 'center'
        },
        criteriaList: {
            justifyContent: 'center',
            alignItems: 'stretch',
        },
        criteriaListItem: {
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
            borderWidth: 1,
            borderColor: PrimaryColors.medium_white
        }
    });

    componentWillMount() {
        this.dispatchAction(Actions.RUN_CERTIFICATION_CRITERIA, {...this.props.params});
    }

    render() {
        Logger.logDebug('Certification', 'render');
        let Criteria = this.state.criteria.map((criteria, idx) =>
            <View key={idx} style={[Certification.styles.criteriaListItem,
                {backgroundColor: criteria.certified ? "#47A64A" : "#FF8880"}]}>
                <Text style={[Typography.paperFontTitle, {color: "white"}]}>
                    {criteria.name}
                </Text>
                <Icon name={criteria.certified ? "md-thumbs-up" : "md-thumbs-down"}
                      style={{color: "white",}}/>
            </View>);
        const iconName = this.state.certified ? "star" : "close-circle";
        const certificationText = this.state.certified ? "Certified" : "Not Certified";
        return (
            <GunakContainer title="Certification Criteria">
                <Content style={{width:deviceWidth}} ref="reports">
                    <View style={[Certification.styles.container,
                        {backgroundColor: this.state.certified ? "#3C8C3F" : "#8C2518"}]}>
                        <View style={{marginBottom: 10}}>
                            <Text style={[Typography.paperFontTitle, {color: "white", alignSelf: 'center'}]}>
                                {this.props.params.facility.name}
                            </Text>
                        </View>
                        <View style={Certification.styles.innerContainer}>
                            <Icon name={iconName} style={{fontSize: 40, color: "white", paddingRight:10}}/>
                            <Text style={[Typography.paperFontHeadline, {color: "white"}]}>
                                {certificationText}
                            </Text>
                        </View>
                    </View>
                    <View style={{
                        backgroundColor: PrimaryColors.dark_white,
                        padding: 5,
                        paddingTop: 10,
                        paddingBottom: 10
                    }}>
                        <Text style={[Typography.paperFontHeadline, {color: 'white'}]}>
                            Criterion List
                        </Text>
                    </View>
                    <View style={Certification.styles.criteriaList}>
                        {Criteria}
                    </View>
                </Content>
            </GunakContainer>
        );
    }
}

export default Certification;
