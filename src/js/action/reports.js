import _ from 'lodash';
import ReportService from '../service/ReportService';
import ExportService from "../service/ExportService";
import defaultTabs from './reportingTabs.json';


const getSelectedTab = (tabs) => tabs.find((tab) => tab.isSelected);

const scoringMap = new Map([
    ['aoc', 'scoreByAreaOfConcern'],
    ['aoc-dep', 'departmentScoreForAreaOfConcern'],
    ['aoc-std', 'standardScoreForAreaOfConcern'],
    ['dep', 'scoreByDepartment'],
    ['dep-aoc', 'areasOfConcernScoreForDepartment'],
    ['std', 'scoreByStandard'],
    ['std-me', 'standardScoreByMeasurableElement'],
    ['std-dep', 'standardScoreByDepartment'],
]);

const getAllScores = function (state, action, beans) {
    const reportService = beans.get(ReportService);
    const overallScore = reportService.overallScore(action.facilityAssessment);
    const tabs = state.tabs.map((tab) => Object.assign(tab, {
            scores: reportService[scoringMap.get(tab.slug)](action.facilityAssessment)
        })
    );
    const selectedTabTitle = getSelectedTab(tabs).title;
    const assessedCheckpoints = reportService.assessedCheckpoints(action.facilityAssessment);
    const compliantCheckpoints = reportService.compliantCheckpoints(action.facilityAssessment);
    const partiallyCompliantCheckpoints = reportService.partiallyCompliantCheckpoints(action.facilityAssessment);
    const nonCompliantCheckpoints = reportService.nonCompliantCheckpoints(action.facilityAssessment);
    const totalChecklists = reportService.totalChecklists(action.facilityAssessment);
    const assessedChecklists = reportService.assessedChecklists(action.facilityAssessment);
    return {
        ...state,
        overallScore: overallScore,
        tabs: tabs,
        selectedTab: selectedTabTitle,
        checkpointStats: {
            assessedCheckpoints: assessedCheckpoints,
            partiallyCompliantCheckpoints: partiallyCompliantCheckpoints,
            fullyCompliantCheckpoints: compliantCheckpoints,
            nonCompliantCheckpoints: nonCompliantCheckpoints
        },
        checklistStats: {
            total: totalChecklists,
            assessed: assessedChecklists
        }
    };
};

const selectTab = function (state, action, beans) {
    const tabs = state.tabs
        .map((tab) => Object.assign(tab, {isSelected: false}))
        .map((tab) => Object.assign(tab, {
            isSelected: tab.title === action.selectedTab
        }));
    return {...state, tabs: state.tabs, selectTab: action.selectedTab};
};

const drillDown = function (state, action, beans) {
    let reportService = beans.get(ReportService);
    const drilledDownTabs = state.tabs.find((tab) => tab.isSelected).drillDown;
    const tabs = drilledDownTabs.map((tab) => Object.assign(tab, {
            scores: reportService[scoringMap.get(tab.slug)](action.selectionName, action.facilityAssessment)
        })
    );
    const selectedTabTitle = getSelectedTab(tabs).title;
    return {...state, tabs: tabs, selectTab: selectedTabTitle};
};

const exportAllRaw = function (state, action, beans) {
    const exportService = beans.get(ExportService);
    let exportedCSVMetadata = exportService.exportAllRaw(action.facilityAssessment);
    action.cb({
        url: `file://${exportedCSVMetadata.exportPath}`,
        title: `${exportedCSVMetadata.facilityName}'s Assessment on ${exportedCSVMetadata.assessmentDate}`,
        message: `${exportedCSVMetadata.facilityName}'s ${exportedCSVMetadata.assessmentTool} Assessment on ${exportedCSVMetadata.assessmentDate} `,
        subject: `${exportedCSVMetadata.facilityName}'s Assessment on ${exportedCSVMetadata.assessmentDate}`,
        type: 'text/csv'
    });
    return Object.assign(state, {showExportOptions: !state.showExportOptions});
};

const exportOptions = function (state, action, beans) {
    return Object.assign(state, {showExportOptions: !state.showExportOptions});
};

const exportAOC = function (exportService, facilityAssessment) {
    return exportService.exportAOC(facilityAssessment);
};

const exportDepartments = function (exportService, facilityAssessment) {
    return exportService.exportDepartment(facilityAssessment);
};

const exportStandards = function (exportService, facilityAssessment) {
    return exportService.exportStandard(facilityAssessment);
};

const exportCurrentTab = function (state, action, beans) {
    const exportFN = {
        'AREA OF CONCERN': exportAOC,
        'DEPARTMENT': exportDepartments,
        'STANDARD': exportStandards
    }[state.selectedTab];
    let csvMetadata = exportFN(beans.get(ExportService), action.facilityAssessment);
    action.cb({
        url: `file://${csvMetadata.exportPath}`,
        title: `${csvMetadata.facilityName}'s Assessment on ${csvMetadata.assessmentDate}`,
        message: `${csvMetadata.facilityName}'s ${csvMetadata.assessmentTool} Assessment on ${csvMetadata.assessmentDate} `,
        subject: `${csvMetadata.facilityName}'s Assessment on ${csvMetadata.assessmentDate}`,
        type: 'text/csv'
    });
    return Object.assign(state, {showExportOptions: !state.showExportOptions});
};

const exportCurrentView = function (state, action, beans) {
    const exportService = beans.get(ExportService);
    const newImageDest = exportService.copyOverImage(action.facilityAssessment, state.selectedTab, action.uri);
    action.cb({
        url: `file://${newImageDest}`
    });
    return Object.assign(state, {});
};

const initReports = function (state, action, beans) {
    return getAllScores(reportsInit, action, beans);
};

export default new Map([
    ["GET_ALL_SCORES", getAllScores],
    ["DRILL_DOWN", drillDown],
    ["SELECT_TAB", selectTab],
    ["EXPORT_ASSESSMENT", exportAllRaw],
    ["EXPORT_CURRENT_TAB", exportCurrentTab],
    ["EXPORT_OPTIONS", exportOptions],
    ["EXPORT_CURRENT_VIEW", exportCurrentView],
    ["INIT_REPORTS", initReports],
]);

export let reportsInit = {
    overallScore: 0.0,
    overallScoreText: "Overall Score",
    tabs: defaultTabs,
    showExportOptions: false,
    selectedTab: "AREA OF CONCERN",
    checkpointStats: {
        assessedCheckpoints: 0,
        partiallyCompliantCheckpoints: 0,
        fullyCompliantCheckpoints: 0,
        nonCompliantCheckpoints: 0
    },
    checklistStats: {
        assessed: 0,
        total: 0
    },
};