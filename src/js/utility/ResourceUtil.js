import _ from "lodash";

class ResourceUtil {
    static getUUIDFor(resource, property) {
        const prop = resource["_links"][`${property}`];
        if (_.isNil(prop)) return undefined;
        return prop["href"];
    }

    static getUUIDsFor(resource, property) {
        const props = resource["_links"][`${property}`];
        if (_.isNil(props)) return [];
        // https://github.com/spring-projects/spring-hateoas/issues/288
        return Array.isArray(props) ? props.map((prop) => prop.href) : [props.href];
    }
}

export default ResourceUtil;