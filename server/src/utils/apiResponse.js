class ApiResponse {
    constructor(statusCode, message, data = null, count = null) {
        this.success = statusCode < 400;
        this.statusCode = statusCode;
        this.message = message;

        if (count !== null) {
            this.count = count;
        }

        if (data !== null) {
            this.data = data;
        }
    }
}

module.exports = ApiResponse;