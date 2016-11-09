import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import Region from "../models/Region";

@Service("regionService")
class RegionService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.saveRegion = this.saveRegion.bind(this);
    }

    init() {
    }

    saveRegion(region) {
        this.db.write(()=>this.db.create(Region.schema.name, region, true));
        return this.db.objectForPrimaryKey(Region.schema.name, region.uuid);
    }
}

export default RegionService;