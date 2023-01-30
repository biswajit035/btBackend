const { mongoose } = require("mongoose");
const { Schema } = mongoose

const BtechStudentSchema = new Schema({
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

module.exports = BtechStudentSchema;