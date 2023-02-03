const express = require('express');
const router = express.Router();

// gridfs
const {  upload } = require('../gridFs')

// model
const { placement } = require('../model/Model')


// ------------------------------ ------    year       ---------------------------------------

// add year
router.post("/add/year", upload.array(), async (req, res) => {
    try {
        const fyear = await placement.findOne({ year: req.body.year })
        if (fyear)
            return res.status(400).json({ "msg": "This year already exists" })
        const year = await placement.create({
            year: req.body.year
        })
        res.json(year)
    } catch (error) {
        console.log(error);
        res.status(500).send({ "msg": "Some error occured" });
    }

});
// get all year
router.get("/year", async (req, res) => {
    try {
        const year = await placement.find().sort({ year: 1 })
        res.send(year)
    } catch (error) {
        console.log(error);
        res.status(500).send({ "msg": "Some error occured" });
    }

});
// get specified year
router.get("/year/:id", async (req, res) => {
    try {
        const year = await placement.findOne({ year: req.params.id })
        res.send(year)
    } catch (error) {
        console.log(error);
        res.status(500).send({ "msg": "Some error occured" });
    }

});
// delte year
router.delete("/delete/:year", async (req, res) => {
    let fyear = await placement.findOne({ year: req.params.year });
    if (!fyear)
        return res.status(400).json({ "msg": "This year does not exists" })
    fyear = await placement.findOneAndDelete({ year: req.params.year })
    res.json({ "msg": "year has been deleted" })
});

// ------------------------------------    company       ---------------------------------------

// add company
router.post("/add/company/:year", upload.array(), async (req, res) => {
    const data = req.body;
    let fyear = await placement.findOne({ year: req.params.year });
    if (!fyear)
        return res.status(400).json({ error: "This year does not exists" })
    fyear = await placement.findOneAndUpdate({ year: req.params.year }, { $push: { records: data } }, { new: true });
    res.json(fyear)
});
// delete company
router.post("/delete/company/:year/:id", upload.array(), async (req, res) => {
    // const data = req.body
    let fyear = await placement.findOne({ year: req.params.year }, { "records._id": req.params.id }, { "records.$": 1 });
    if (!fyear)
        return res.status(400).json({ error: "This year does not exists" })
    fyear = await placement.findOneAndUpdate({ year: req.params.year }, {
        $pull: {
            records: {
                _id: req.params.id
            }
        }
    }, { new: true });
    // res.json({ "msg": "year has been deleted" })
    res.send(fyear)
});

module.exports = router