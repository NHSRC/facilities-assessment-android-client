import _ from "lodash";

class SpringResponse {
    static morePagesForThisResource(response) {
        return this.pageNumber(response) < (this.numberOfPages(response) - 1);
    }

    static numberOfPages(response) {
        if (_.isNil(response["page"])) {
            return response["totalPages"];
        } else {
            return response["page"]["totalPages"];
        }
    }

    static pageNumber(response) {
        if (_.isNil(response["page"])) {
            return response["number"];
        } else {
            return response["page"]["number"];
        }
    }
}

export default SpringResponse;