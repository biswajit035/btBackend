const {conn} = require('../db')
const StudentSchema = require('../schema/StudentSchema')
const PlacementSchema = require('../schema/PlacementSchema')


const btechStudent = conn.model('BtechStudentModel', StudentSchema)
const mtechStudent = conn.model('MtechStudentModel', StudentSchema)
const phdStudent = conn.model('PhdStudentModel', StudentSchema)
const placement = conn.model('placementModel', PlacementSchema)

module.exports = { placement, phdStudent, btechStudent, mtechStudent }