import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import seedReference from '../../config/seedReference.json';
import seed from '../../config/seed.json';
import _ from 'lodash';
import State from "../models/State";
import District from "../models/District";
import ReferenceAreaOfConcern from "../models/ReferenceAreaOfConcern";
import Facility from "../models/Facility";

@Service("facilitiesService")
class FacilitiesService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.db.write(()=>seedReference.map((refAOC)=>this.db.create(ReferenceAreaOfConcern.schema.name, refAOC, true)));
        this.db.write(()=>seed.map((state)=>this.db.create(State.schema.name, state, true)));
    }

    getAllStates() {
        return this.db.objects(State.schema.name).map((state)=>state.name);
    }

    getAllDistrictsFor(stateName) {
        return this.db.objectForPrimaryKey(State.schema.name, stateName).districts.map((district)=>district.name);
    }

    getAllFacilitiesFor(districtName) {
        return this.db.objectForPrimaryKey(District.schema.name, districtName).facilities
            .map((facility)=>facility.name);
    }

    getAllDepartmentsFor(facilityName) {
        return this.db.objectForPrimaryKey(Facility.schema.name, facilityName).departments.map((dept)=>dept.name);
    }
}

export default FacilitiesService;