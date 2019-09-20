import {expect} from 'chai';
import Checkpoint from "../../js/models/Checkpoint";

let checkpointIsApplicable = function (inactive, stateUUID) {
    let checkpoint = new Checkpoint();
    checkpoint.excludedStates = [{name: "Bihar", uuid: "4f4b5e8d-aa38-4b1c-98fd-6fb02206496d", inactive: inactive}];
    checkpoint.state = stateUUID;
    return Checkpoint.isApplicable(checkpoint, "4f4b5e8d-aa38-4b1c-98fd-6fb02206496d");
};

describe('CheckpointTest', () => {
    it('checkpoint which is excluded is not applicable', () => {
        expect(checkpointIsApplicable(false)).is.equal(false);
    });

    it('checkpoint which is excluded for state, but exclusion is now inactive, is applicable', () => {
        expect(checkpointIsApplicable(true)).is.equal(true);
    });

    it('checkpoint which is excluded for a state, is assigned to another state, is not applicable', () => {
        expect(checkpointIsApplicable(true, "7e03f9d8-b65e-47af-868b-08e5eb335bf9")).is.equal(false);
    });
});