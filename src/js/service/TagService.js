import BaseService from "./BaseService";
import Service from "../framework/bean/Service";

@Service("TagService")
class TagService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }
}

export default TagService;