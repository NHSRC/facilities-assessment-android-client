import React from "react";
import {StyleSheet, View} from "react-native";
import AbstractComponent from "../../common/AbstractComponent";
import {Container, Content, Header, List, ListItem, Title} from "native-base";
import Actions from "../../../action";
import AssessmentType from "./AssessmentType";
import AssessmentSeries from "./AssessmentSeries";
import Logger from "../../../framework/Logger";
import editAssessment from "../../../action/editAssessment";
import PropTypes from 'prop-types';
import GunakContainer from '../../common/GunakContainer'

class EditAssessment extends AbstractComponent {
    static propTypes = {
        assessmentUUID: PropTypes.string.isRequired
    };

    constructor(props, context) {
        super(props, context, 'editAssessment');
    }

    static styles = StyleSheet.create({
        formRow: {
            borderBottomWidth: 0,
            marginLeft: 0,
        },
        container: {
            justifyContent: 'center',
            marginTop: 30,
            marginHorizontal: 10,
            backgroundColor: '#212121'
        },
    });

    componentWillMount() {
        this.dispatchAction(Actions.GET_ASSESSMENT, {facilityAssessmentUUID: this.props.assessmentUUID});
    }

    render() {
        Logger.logDebug('EditAssessmentView', 'render');
        const FormComponents = [];
        FormComponents.push(AssessmentSeries);
        FormComponents.push(AssessmentType);
        const data = {
            series: this.state.facilityAssessment.series,
            selectedAssessmentType: this.state.facilityAssessment.assessmentType,
            assessmentTypes: this.state.assessmentTypes
        };

        return (
            <GunakContainer title="Change Assessment Attributes">
                <Content>
                    <View style={EditAssessment.styles.container}>
                        <List>
                            {FormComponents.map((FormComponent, idx) =>
                                <ListItem key={idx} style={EditAssessment.styles.formRow}>
                                    <FormComponent data={data} actionSuffix='_EDIT'/>
                                </ListItem>)}
                        </List>
                    </View>
                </Content>
            </GunakContainer>
        );
    }
}

export default EditAssessment;