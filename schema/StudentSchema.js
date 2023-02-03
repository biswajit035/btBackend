const { mongoose } = require("mongoose");
const { Schema } = mongoose

const StudentSchema = new Schema({
    year: {
        type:String,
        required:true
    },
    filename: {
        type: String,
        required:true
    },
    fileid: {
        type: String,
        required:true
    }
})

module.exports = StudentSchema;