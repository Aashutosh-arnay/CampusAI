class APIFeatures {

    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {

        // Copy query object
        const queryObj = { ...this.queryString };

        // Fields to exclude
        const excludedFields = ["page", "sort", "limit", "fields", "search"];

        excludedFields.forEach(field => delete queryObj[field]);

        // Advanced filtering
        let queryStr = JSON.stringify(queryObj);

        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt|in)\b/g,
            match => `$${match}`
        );

        this.query = this.query.find(JSON.parse(queryStr));

        return this;

    }
    search(fields) {

        if (this.queryString.search) {

            const keyword = this.queryString.search;

            this.query = this.query.find({
                $or: fields.map(field => ({
                    [field]: {
                        $regex: keyword,
                        $options: "i"
                    }
                }))
            });

        }

        return this;

    }
    sort() {

        if (this.queryString.sort) {

            const sortBy = this.queryString.sort.split(",").join(" ");

            this.query = this.query.sort(sortBy);

        } else {

            this.query = this.query.sort("-createdAt");

        }

        return this;

    }
    paginate() {

        const page = Number(this.queryString.page) || 1;
        const limit = Number(this.queryString.limit) || 10;

        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;

    }
        limitFields() {

        if (this.queryString.fields) {

            const fields = this.queryString.fields
                .split(",")
                .join(" ");

            this.query = this.query.select(fields);

        } else {

            this.query = this.query.select("-__v");

        }

        return this;

    }

}

module.exports = APIFeatures;