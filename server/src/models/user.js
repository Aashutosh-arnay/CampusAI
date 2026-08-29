const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        index: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role:{
    type:String,
    enum:["student","faculty","admin"],
    default:"student"
}
});

module.exports = mongoose.model("User", userSchema);