import ReportService from '../service/ReportService';
import defaultTabs, {AOCTabTitle, ThemesTabTitle, ThemeTab} from './reportingTabs';
import _ from 'lodash';

const getSelectedTab = (tabs) => tabs.find((tab) => tab.isSelected);

const scoringMap = new Map([
    ['aoc', 'scoreByAreaOfConcern'],
    ['aoc-dep', 'departmentScoreForAreaOfConcern'],
    ['aoc-std', 'standardScoreForAreaOfConcern'],
    ['dep', 'scoreByDepartment'],
    ['dep-aoc', 'areasOfConcernScoreForDepartment'],
    ['dep-non-partial-compliance-checkpoints', 'nonAndPartiallyComplianceCheckpointsForDepartment'],
    ['std', 'scoreByStandard'],
    ['std-me', 'measurableElementScoreForStandard'],
    ['theme', 'getThemeWiseScores']
]);

const getAllScores = function (state, action, beans) {
    const {facilityAssessment} = action;
    const reportService = beans.get(ReportService);
    const overallScore = reportService.overallScore(facilityAssessment);

    if (!facilityAssessment.assessmentTool.themed) {
        _.remove(state.tabs, (x) => x.title === ThemesTabTitle);
    }
    const tabs = state.tabs.map((tab) => _.assignIn(tab, {
            scores: reportService[scoringMap.get(tab.slug)](facilityAssessment)
        })
    );
    if (facilityAssessment.assessmentTool.themed && !_.some(tabs, (x) => x.title === ThemesTabTitle)) {
        const themeTab = Object.assign({}, ThemeTab);
        themeTab.scores = reportService.getThemeWiseScores(facilityAssessment);
        tabs.push(themeTab);
    }

    if (!_.some(tabs, (x) => x.isSelected))
        tabs[0].isSelected = true;

    const selectedTabTitle = getSelectedTab(tabs).title;
    const assessedCheckpoints = reportService.assessedCheckpoints(facilityAssessment);
    const compliantCheckpoints = reportService.compliantCheckpoints(facilityAssessment);
    const partiallyCompliantCheckpoints = reportService.partiallyCompliantCheckpoints(facilityAssessment);
    const nonCompliantCheckpoints = reportService.nonCompliantCheckpoints(facilityAssessment);
    const totalChecklists = reportService.totalChecklists(facilityAssessment);
    const assessedChecklists = reportService.assessedChecklists(facilityAssessment);
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
        .map((tab) => _.assignIn(tab, {isSelected: false}))
        .map((tab) => _.assignIn(tab, {
            isSelected: tab.title === action.selectedTab
        }));
    return {...state, tabs: tabs, selectedTab: action.selectedTab};
};

const drillDown = function (state, action, beans) {
    let reportService = beans.get(ReportService);
    let prevSelectedTab = getSelectedTab(state.tabs);
    const drilledDownTabs = prevSelectedTab.drillDown;

    const tabs = drilledDownTabs.map((tab) => {
            return _.assignIn(tab, {
                scores: reportService[scoringMap.get(tab.slug)](action.selectionUUID, action.facilityAssessment)
            });
        }
    );
    const newSelectedTabTitle = getSelectedTab(tabs).title;
    return {
        ...state,
        tabs: tabs,
        selectedTab: newSelectedTabTitle,
        overallScore: action.overallScore,
        overallScoreText: prevSelectedTab.title,
        selectionName: action.selectionName,
        selectionUUID: action.selectionUUID
    };
};

const exportAllRaw = function (state, action, beans) {
    return _.assignIn(state, {showExportOptions: !state.showExportOptions});
};

const exportOptions = function (state, action, beans) {
    return _.assignIn(state, {showExportOptions: !state.showExportOptions});
};

const exportTab = function (state, action, beans) {
    return _.assignIn(state, {showExportOptions: !state.showExportOptions});
};

const exportCurrentView = function (state, action, beans) {
    return _.assignIn(state, {});
};

const initReports = function (state, action, beans) {
    return getAllScores(reportsInit, action, beans);
};

export default new Map([
    ["GET_ALL_SCORES", getAllScores],
    ["DRILL_DOWN", drillDown],
    ["SELECT_TAB", selectTab],
    ["EXPORT_ASSESSMENT", exportAllRaw],
    ["EXPORT_TAB", exportTab],
    ["EXPORT_OPTIONS", exportOptions],
    ["EXPORT_CURRENT_VIEW", exportCurrentView],
    ["INIT_REPORTS", initReports],
]);

export let reportsInit = {
    overallScore: 0.0,
    overallScoreText: "Overall",
    tabs: defaultTabs,
    showExportOptions: false,
    selectedTab: AOCTabTitle,
    selectionName: '',
    selectionUUID: '',
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
