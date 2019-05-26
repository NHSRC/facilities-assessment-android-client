import _ from "lodash";
import EnvironmentConfig from "../views/common/EnvironmentConfig";
import ExportService from "../service/ExportService";

class ShareUtil {
    static constructShareUrl(filePath) {
        return `${EnvironmentConfig.filePrefix}://${filePath}`;
    };

    static getExportTabOptions(context, action) {
        const exportService = context.getService(ExportService);
        let csvMetadata = exportService.exportTab(_.startCase(action.tab.title.toLowerCase()),
            action.tab.scores,
            action.tab.headers,
            action.facilityAssessment);
        return {
            url: ShareUtil.constructShareUrl(csvMetadata.exportPath),
                title: `${csvMetadata.facilityName}'s Assessment on ${csvMetadata.assessmentDate}`,
            message: `${csvMetadata.facilityName}'s ${csvMetadata.assessmentTool} Assessment on ${csvMetadata.assessmentDate} `,
            subject: `${csvMetadata.facilityName}'s Assessment on ${csvMetadata.assessmentDate}`,
            type: 'text/csv'
        };
    }

    static getShareAllOptions(context, facilityAssessment) {
        const exportService = context.getService(ExportService);
        let exportedCSVMetadata = exportService.exportAllRaw(facilityAssessment);
        return {
            url: ShareUtil.constructShareUrl(exportedCSVMetadata.exportPath),
            title: `${exportedCSVMetadata.facilityName}'s Assessment on ${exportedCSVMetadata.assessmentDate}`,
            message: `${exportedCSVMetadata.facilityName}'s ${exportedCSVMetadata.assessmentTool} Assessment on ${exportedCSVMetadata.assessmentDate} `,
            subject: `${exportedCSVMetadata.facilityName}'s Assessment on ${exportedCSVMetadata.assessmentDate}`,
            type: 'text/csv'
        };
    }

    static getCurrentViewOptions(context, facilityAssessment, selectedTab, uri) {
        const exportService = context.getService(ExportService);
        const newImageDest = exportService.copyOverImage(facilityAssessment, selectedTab, uri);
        return {
            url: `${ShareUtil.constructShareUrl(newImageDest)}`,
            type: 'image/jpeg'
        };
    }
}

export default ShareUtil;