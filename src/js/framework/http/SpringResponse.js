import _ from "lodash";

class SpringResponse {
    static morePagesForThisResource(response) {
        let notAPagedResource = _.isNil(response["page"]);
        return notAPagedResource ? false : this.pageNumber(response) < (this.numberOfPages(response) - 1);
    }

    static numberOfPages(response) {
        return response["page"]["totalPages"];
    }

    static pageNumber(response) {
        return response["page"]["number"];
    }
}

export default SpringResponse;