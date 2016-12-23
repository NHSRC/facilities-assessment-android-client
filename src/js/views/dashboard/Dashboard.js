import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import {Container, Header, Title, Content, Icon, Button} from 'native-base';
import PrimaryColors from '../styles/PrimaryColors';
import Typography from '../styles/Typography';
import MedIcon from '../styles/MedIcons';
import Actions from "../../action";
import TypedTransition from "../../framework/routing/TypedTransition";
import DashboardItem from './DashboardItem';
import Assessment from '../assessment/Assessment';
import FlatUITheme from '../themes/flatUI';
import Path, {PathRoot} from "../../framework/routing/Path";
import FacilitySelection from "../facilitySelection/FacilitySelection";

@Path("/modeSelection")
class Dashboard extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().dashboard;
        this.unsubscribe = store.subscribeTo('dashboard', this.handleChange.bind(this));
        this.handleOnPress = this.handleOnPress.bind(this);
        this.dashboardItems = [
            {name: "New Assessment", onPress: ()=>TypedTransition.from(this).to(FacilitySelection)},
            {name: "Continue Assessment", onPress: ()=>TypedTransition.from(this).to(AssessmentList)},
            {name: "Edit Assessment"},
            {name: "Submit Assessment"},
            {name: "View Scores"},
            {name: "Settings"}
        ];
    }

    static styles = StyleSheet.create({
            container: {
                backgroundColor: PrimaryColors.background,
            },
            viewContainer: {
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            },
            itemsContainer: {
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center'
            },
        }
    );

    handleChange() {
        const newState = this.context.getStore().getState().dashboard;
        this.setState(newState);
    }

    componentDidMount() {
        // this.dispatchAction(Actions.ALL_CHECKLISTS, {assessmentTool: this.props.params.selectedAssessmentTool});
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleOnPress(checklist) {
        return ()=>TypedTransition.from(this).with({
            selectedChecklist: checklist,
            facility: this.props.params.selectedFacility,
            assessmentType: this.props.params.selectedAssessmentType
        }).to(Assessment);
    }


    render() {
        const dashboardItems = ["Facility Assessment", "Assessment History", "Assessment Submission", "Settings"].map((item, idx)=> {
            return (<DashboardItem key={idx} name={item}/>)
        });
        return (
            <Container theme={FlatUITheme} style={Dashboard.styles.container}>
                <Header>
                    <Title>Facilities Assessment Dashboard</Title>
                </Header>
                <Content>
                    <View style={Dashboard.styles.viewContainer}>
                        <View style={Dashboard.styles.itemsContainer}>
                            {dashboardItems}
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default Dashboard;