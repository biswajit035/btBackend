const { mongoose } = require("mongoose");
const { Schema } = mongoose

const PlacementSchema = new Schema({
    year: {
        type: String,
        unique: true,
        required: true
    },
    records: [{
        company: {
            type: String,
            unique: true,
            required: true
        },
        count: {
            type: Number,
            required: true
        }
    }]
})

module.exports = PlacementSchema;