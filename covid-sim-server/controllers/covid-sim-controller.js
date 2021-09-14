const covidSimRouter = require("express").Router();

const db = require("../models/covid-sim-db");

const DatabaseError = require("../utils/errors/DatabaseError");
const asyncHandler = require("../utils/helpers/asyncHandler");

module.exports = covidSimRouter;

// get covid simulation data
covidSimRouter.get("/", asyncHandler(async (req, res, next) => {

    let command = `SELECT * FROM \"${req.query.table_name}\" ORDER BY day ASC`;

    const results = await db.query(command, []).catch((err) => {
        throw new DatabaseError("Something Went Wrong", err);
    });

    if (results.rows.length <= 0) {
        throw new DatabaseError("Something Went Wrong");
    }

    // let column_wise_json = {};

    // for (const col in results.rows[0]) {
    //     column_wise_json[col] = [];
    // }
    // results.rows.forEach(row => {
    //     for (const col in row) {
    //         column_wise_json[col].push(row[col]);
    //     }
    // })

    //res.status(200).json(column_wise_json);
    res.status(200).json({
        data: results.rows
    })
}));