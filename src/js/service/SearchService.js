import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import AreaOfConcern from "../models/AreaOfConcern";
import Standard from "../models/Standard";
import MeasurableElement from "../models/MeasurableElement";
import Checkpoint from "../models/Checkpoint";

@Service("searchService")
class SearchService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    init() {
    }

    search(schema, searchText, limit = 10) {
        return _.isEmpty(searchText) ? [] :
            this.db.objects(schema.schema.name)
                .filtered('name CONTAINS[c] $0', searchText)
                .slice(0, limit)
                .map(this.pickKeys(["reference"]));
    }

    searchCheckpoints(searchText) {
        return this.search(Checkpoint, searchText);
    }

    searchMeasurableElements(searchText) {
        return this.search(MeasurableElement, searchText);
    }
}

export default SearchService;