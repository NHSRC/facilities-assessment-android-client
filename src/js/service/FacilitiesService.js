import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import seed from '../../config/seed.json';
import _ from 'lodash';
import State from "../models/State";
import District from "../models/District";

@Service("facilitiesService")
class FacilitiesService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.db.write(()=>seed.map((state)=>this.db.create(State.schema.name, state, true)));
    }

    getAllStates() {
        return this.db.objects(State.schema.name).map((state)=>state.name);
    }

    getAllDistrictsFor(stateName) {
        return this.db.objectForPrimaryKey(State.schema.name, stateName).districts.map((district)=>district.name);
    }

    getAllFacilityTypesFor(districtName) {
        return _.uniqBy(this.db.objectForPrimaryKey(District.schema.name, districtName).facilities, ['facilityType'])
            .map((facility)=>facility.facilityType.name);
    }

    getAllFacilitiesFor(districtName, facilityType) {
        return this.db.objectForPrimaryKey(District.schema.name, districtName).facilities
            .filtered("facilityType.name = $0", facilityType)
            .map((facility)=>facility.name);
    }
}

export default FacilitiesService;