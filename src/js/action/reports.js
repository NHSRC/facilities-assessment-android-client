import _ from 'lodash';
import ReportService from '../service/ReportService';
import ExportService from "../service/ExportService";


const getAllScores = function (state, action, beans) {
    const reportService = beans.get(ReportService);
    const overallScore = reportService.overallScore(action.facilityAssessment);
    const scoreByDepartment = reportService.scoreByDepartment(action.facilityAssessment);
    const scoreByAreaOfConcern = reportService.scoreByAreaOfConcern(action.facilityAssessment);
    const scoreByStandard = reportService.scoreByStandard(action.facilityAssessment);
    const assessedCheckpoints = reportService.assessedCheckpoints(action.facilityAssessment);
    const compliantCheckpoints = reportService.compliantCheckpoints(action.facilityAssessment);
    const partiallyCompliantCheckpoints = reportService.partiallyCompliantCheckpoints(action.facilityAssessment);
    const nonCompliantCheckpoints = reportService.nonCompliantCheckpoints(action.facilityAssessment);
    const totalChecklists = reportService.totalChecklists(action.facilityAssessment);
    const assessedChecklists = reportService.assessedChecklists(action.facilityAssessment);
    return {
        ...state,
        overallScore: overallScore,
        scoreByDepartment: scoreByDepartment,
        scoresToShow: scoreByAreaOfConcern,
        scoreByStandard: scoreByStandard,
        scoreByAreaOfConcern: scoreByAreaOfConcern,
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
    const scoreMap = {
        "AREA OF CONCERN": state.scoreByAreaOfConcern,
        "DEPARTMENT": state.scoreByDepartment,
        "STANDARD": state.scoreByStandard
    };
    return Object.assign(state, {
        scoresToShow: scoreMap[action.selectedTab],
        selectedTab: action.selectedTab
    });
};

const aocByDept = function (areaOfConcern, cb, facilityAssessment, beans) {
    const reportService = beans.get(ReportService);
    let scores = reportService.departmentScoreForAreaOfConcern(areaOfConcern, facilityAssessment);
    cb(areaOfConcern, scores);
};

const deptByAoc = function (department, cb, facilityAssessment, beans) {
    const reportService = beans.get(ReportService);
    let scores = reportService.areasOfConcernScoreForDepartment(department, facilityAssessment);
    cb(department, scores);
};

const drillDown = function (state, action, beans) {
    const scoresToShow = {
        "AREA OF CONCERN": aocByDept,
        "DEPARTMENT": deptByAoc,
        "STANDARD": _.noop
    }[state.selectedTab](action.selectionName, action.cb, action.facilityAssessment, beans);
    return Object.assign(state);
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

export default new Map([
    ["GET_ALL_SCORES", getAllScores],
    ["DRILL_DOWN", drillDown],
    ["SELECT_TAB", selectTab],
    ["EXPORT_ASSESSMENT", exportAllRaw],
    ["EXPORT_CURRENT_TAB", exportCurrentTab],
    ["EXPORT_OPTIONS", exportOptions],
    ["EXPORT_CURRENT_VIEW", exportCurrentView],
]);

export let reportsInit = {
    overallScore: 0.0,
    scoresToShow: {},
    scoreByDepartment: {},
    scoreByAreaOfConcern: {},
    scoreByStandard: {},
    showExportOptions: false,
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
    selectedTab: 'AREA OF CONCERN',
    tabs: ['AREA OF CONCERN', 'DEPARTMENT', 'STANDARD'],
};