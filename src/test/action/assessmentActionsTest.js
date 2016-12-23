import {expect} from 'chai';
import AssessmentActions from '../../js/action/assessment';
import Actions from '../../js/action';
import _ from 'lodash';


describe('ChecklistAssessment Actions Test', () => {
    describe('Select Compliance Tests', () => {

        it('Select Compliance should return new state object', ()=> {
            const savedCheckpoint = {
                uuid: '34d264a4-1c1d-4657-aa71-d8a9c91a944b',
                facility: '9b8c690d-12a6-46f4-8ea3-61e0a7a30985',
                checklist: '1c68d004-735b-42fb-953a-a6f2654c00c9',
                assessment: '46794f88-7c26-44cc-97e8-bae020e12935',
                checkpoint: 'c5570c16-f033-4f4a-ae6b-cee3af1abb43',
                score: 1,
                remarks: "No Remarks",
                dateUpdated: undefined
            };
            const state = {
                "assessment": {
                    "checkpoints": {
                        "c5570c16-f033-4f4a-ae6b-cee3af1abb43": savedCheckpoint
                    }
                },
                "progress": {"completed": 1, "total": 1}
            };
            const actionParams = {
                "checkpoint": {
                    name: "Sample Checkpoint",
                    uuid: "c5570c16-f033-4f4a-ae6b-cee3af1abb43",
                    meansOfVerification: "Sample MoV",
                    measurableElement: "7e4f6096-1fe5-4477-9a21-a7840f36a5e5",
                    checklist: "7056ef96-ff79-45eb-986d-da49d5e27990",
                    isDefault: true,
                    state: "94a945b0-dfaa-43b7-bb9d-9826d57d401e",
                    amObservation: false,
                    amStaffInterview: false,
                    amPatientInterview: false,
                    amRecordReview: true
                }
            };
            const beans = {
                "get": ()=> {
                    return {
                        "saveCheckpointScore": ()=> Object.assign({}, savedCheckpoint, {score: 2}),
                        "getAllCheckpointsForAssessment": ()=> {
                            return {"key1": "value1"};
                        }
                    };
                }
            };
            const selectComplianceFn = AssessmentActions.get(Actions.SELECT_COMPLIANCE);
            const outputState = selectComplianceFn(state, actionParams, beans);
            expect(_.isEqual(outputState, state)).to.be.false;
        });
    });
});