import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import Tag from "../models/Tag";
import AreaOfConcern from "../models/AreaOfConcern";
import Standard from "../models/Standard";
import MeasurableElement from "../models/MeasurableElement";

@Service("searchService")
class SearchService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    init() {
    }

    searchAreasOfConcern(searchText) {
        return this.db.objects(AreaOfConcern.schema.name)
            .filtered('tags.name BEGINSWITH[c] $0', searchText)
            .map(this.nameAndId);
    }

    searchStandards(searchText) {
        return this.db.objects(Standard.schema.name)
            .filtered('tags.name BEGINSWITH[c] $0', searchText)
            .map(this.nameAndId);
    }

    searchMeasurableElements(searchText) {
        return this.db.objects(MeasurableElement.schema.name)
            .filtered('tags.name BEGINSWITH[c] $0', searchText)
            .map(this.nameAndId);
    }
}

export default SearchService;