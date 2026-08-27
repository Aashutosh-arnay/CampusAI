class APIFeatures {

    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {

        const queryObj = { ...this.queryString };

        const excludedFields = [
            "page",
            "sort",
            "limit",
            "fields",
            "search"
        ];

        excludedFields.forEach(field => {
            delete queryObj[field];
        });

        const allowedOperators = new Set([
            "gte",
            "gt",
            "lte",
            "lt",
            "in"
        ]);

        const sanitizeFilter = (value) => {

            if (Array.isArray(value)) {
                return value.map(sanitizeFilter);
            }

            if (value && typeof value === "object") {

                const sanitized = {};

                for (const [key, nestedValue] of Object.entries(value)) {

                    // Reject MongoDB operators and dangerous keys
                    if (
                        key.startsWith("$") ||
                        key.includes(".")
                    ) {
                        continue;
                    }

                    if (allowedOperators.has(key)) {

                        sanitized[`$${key}`] =
                            sanitizeFilter(nestedValue);

                    } else {

                        sanitized[key] =
                            sanitizeFilter(nestedValue);

                    }

                }

                return sanitized;
            }

            return value;
        };

        const safeFilters = sanitizeFilter(queryObj);

        this.query = this.query.find(safeFilters);

        return this;
    }
    search(fields) {

        if (this.queryString.search) {

            const keyword = this.queryString.search;

            const escapedKeyword = keyword.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            this.query = this.query.find({
                $or: fields.map(field => ({
                    [field]: {
                        $regex: escapedKeyword,
                        $options: "i"
                    }
                }))
            });

        }

        return this;
    }
    sort() {

        if (this.queryString.sort) {

            const sortFields = this.queryString.sort
                .split(",")
                .map(field => field.trim())
                .filter(Boolean);

            const validSortFields = sortFields.filter(field => {
                const fieldName = field.startsWith("-")
                    ? field.slice(1)
                    : field;

                return /^[a-zA-Z][a-zA-Z0-9_]*$/.test(fieldName);
            });

            if (validSortFields.length > 0) {

                const sortBy = validSortFields
                    .join(" ");

                this.query = this.query.sort(sortBy);

            } else {

                this.query = this.query.sort("-createdAt");

            }

        } else {

            this.query = this.query.sort("-createdAt");

        }

        return this;
    }
    paginate() {

        const page = Math.max(
            Number(this.queryString.page) || 1,
            1
        );

        const requestedLimit = Number(
            this.queryString.limit
        ) || 10;

        const limit = Math.min(
            Math.max(requestedLimit, 1),
            100
        );

        const skip = (page - 1) * limit;

        this.query = this.query
            .skip(skip)
            .limit(limit);

        return this;
    }
    limitFields() {

        if (this.queryString.fields) {

            const requestedFields = this.queryString.fields
                .split(",")
                .map(field => field.trim())
                .filter(Boolean);

            const blockedFields = [
                "password",
                "+password"
            ];

            const safeFields = requestedFields.filter(
                field => !blockedFields.includes(field)
            );

            if (safeFields.length > 0) {

                const fields = safeFields.join(" ");

                this.query = this.query.select(fields);

            } else {

                this.query = this.query.select("-__v");

            }

        } else {

            this.query = this.query.select("-__v");

        }

        return this;
    }

}

module.exports = APIFeatures;