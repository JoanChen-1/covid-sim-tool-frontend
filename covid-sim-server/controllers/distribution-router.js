/*
    Distribution Router
        Any incoming requests will be routed to this place then get distributed
*/
const distributionRouter = require('express').Router();
const DatabaseError = require('../utils/errors/DatabaseError');


module.exports = distributionRouter;

// home page
// distributionRouter.get('/', (req, res) => {
//     res.send('Home Page');
// })

// covid-sim-controller
distributionRouter.use('/', require('./covid-sim-controller'));

// error handlers
distributionRouter.use((err, req, res, next) => {
    if (err instanceof DatabaseError) {
        console.error(`${err.name}: ${err.message}`);
        if (err.inner) console.error(`${err.inner.name}: ${err.inner.message}`);
    }
    next(err);
});

distributionRouter.use((err, req, res, next) => {
    res.status(err.status || 500);
    console.log(err.message)
    res.json({
        error: {
            message: err.message
        }
    });
})